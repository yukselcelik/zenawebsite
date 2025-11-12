using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Sinks.Grafana.Loki;
using Zenabackend.Common;
using Zenabackend.Data;
using Zenabackend.Services;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .WriteTo.GrafanaLoki(
                builder.Configuration["Grafana:LokiEndpoint"] ?? "http://localhost:3100",
                [new LokiLabel { Key = "service_name", Value = "ZenaBackend" }],
                credentials: null)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .Enrich.WithProperty("Application", "ZenaBackend")
    .Enrich.WithProperty("Environment", Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production")
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer not configured");
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience not configured");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Log.Warning("Authentication failed: {Error}", context.Exception?.Message);
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                var userId = context.Principal?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                var email = context.Principal?.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
                Log.Information("Token validated successfully for user: {UserId}, Email: {Email}", userId, email);
                return Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                Log.Warning("Challenge: {Error}, {ErrorDescription}", context.Error, context.ErrorDescription);
                context.HandleResponse();
                context.Response.StatusCode = 200;
                context.Response.ContentType = "application/json";
                var result = ApiResult<object>.Unauthorized("Unauthorized");
                return context.Response.WriteAsync(JsonSerializer.Serialize(result, new 
                JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<LeaveService>();
builder.Services.AddScoped<InternshipService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:5133"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("MyPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Zena Backend API",
        Version = "v1",
        Description = "Zena Backend API with JWT Authentication"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter only the token (without 'Bearer' prefix).",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

try
{
    var lokiUrl = builder.Configuration["Loki:Url"];
    if (!string.IsNullOrWhiteSpace(lokiUrl))
    {
        Log.Information("Loki logging configured: {LokiUrl}", lokiUrl);
    }
}
catch (Exception ex)
{
    Log.Warning(ex, "Loki configuration check failed");
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    var maxRetries = 10;
    var retryDelay = TimeSpan.FromSeconds(3);
    var migrationSuccess = false;
    
    for (int i = 0; i < maxRetries; i++)
    {
        try
        {
            Log.Information("Veritabanı bağlantısı test ediliyor... (Deneme {Attempt}/{MaxRetries})", i + 1, maxRetries);
            
            if (await db.Database.CanConnectAsync())
            {
                Log.Information("Veritabanı bağlantısı başarılı!");
                
                Log.Information("Veritabanı migration'ları uygulanıyor...");
                await db.Database.MigrateAsync();
                Log.Information("Veritabanı migration'ları başarıyla uygulandı!");
                
                migrationSuccess = true;
                break;
            }
            else
            {
                Log.Warning("Veritabanı bağlantısı başarısız. {Delay} saniye sonra tekrar denenecek...", retryDelay.TotalSeconds);
            }
        }
        catch (Exception ex)
        {
            Log.Warning(ex, "Veritabanı bağlantı hatası (Deneme {Attempt}/{MaxRetries}): {Error}", i + 1, maxRetries, ex.Message);
            
            if (i == maxRetries - 1)
            {
                Log.Fatal(ex, "Veritabanı bağlantısı {MaxRetries} denemede başarısız oldu. Uygulama başlatılamıyor.", maxRetries);
                throw new InvalidOperationException($"Veritabanı bağlantısı kurulamadı: {ex.Message}", ex);
            }
        }
        
        if (i < maxRetries - 1)
        {
            await Task.Delay(retryDelay);
        }
    }
    
    if (!migrationSuccess)
    {
        Log.Fatal("Veritabanı migration işlemi başarısız oldu. Uygulama başlatılamıyor.");
        throw new InvalidOperationException("Veritabanı migration işlemi başarısız oldu.");
    }
    
    try
    {
        Log.Information("Veritabanı seed işlemi başlatılıyor...");
        await DatabaseSeeder.SeedAsync(db, logger);
        Log.Information("Veritabanı seed işlemi tamamlandı!");
    }
    catch (Exception ex)
    {
        Log.Error(ex, "Veritabanı seed işlemi sırasında hata oluştu: {Error}", ex.Message);
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Zena Backend API v1");
        c.RoutePrefix = "/swagger";
    });
}

app.Use(async (context, next) =>
{
    var correlationIdHeader = "X-Correlation-Id";
    var correlationId = context.Request.Headers[correlationIdHeader].FirstOrDefault()
                        ?? Guid.NewGuid().ToString("N");
    context.Response.Headers[correlationIdHeader] = correlationId;
    using (Serilog.Context.LogContext.PushProperty("CorrelationId", correlationId))
    using (Serilog.Context.LogContext.PushProperty("RequestPath", context.Request.Path))
    using (Serilog.Context.LogContext.PushProperty("UserId", context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "anonymous"))
    using (Serilog.Context.LogContext.PushProperty("ClientIP", context.Connection.RemoteIpAddress?.ToString() ?? "unknown"))
    {
        await next();
    }
});

app.UseSerilogRequestLogging();

app.UseCors("MyPolicy");

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

try
{
    Log.Information("Starting Zena Backend");
    Log.Information("Environment: {Environment}", app.Environment.EnvironmentName);
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

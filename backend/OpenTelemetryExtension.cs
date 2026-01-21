using System.ComponentModel;
using System.Reflection;
using Microsoft.Extensions.Http.Logging;
using OpenTelemetry.Exporter;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.Grafana.Loki;
using Serilog.Sinks.OpenTelemetry;


namespace Zenabackend;
public static class OpenTelemetryExtension
{
    public static IServiceCollection AddAppObservability(
    this IServiceCollection services,
    IConfiguration configuration,
    IWebHostEnvironment environment,
    string applicationName)
    {
        var otlpEndpoint = configuration["OpenTelemetry:OtlpEndpoint"] ?? "http://localhost:4317";
        var serilogOtlpEndpoint = configuration["Serilog:OtlpEndpoint"] ?? "http://localhost:4318/v1/logs";

        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Information()
            .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            .WriteTo.Console()
            .WriteTo.OpenTelemetry(o =>
            {
                o.Endpoint = serilogOtlpEndpoint;
            o.Protocol = OtlpProtocol.HttpProtobuf;
                o.ResourceAttributes = new Dictionary<string, object>
                {
                    ["service.name"] = applicationName,
                    ["deployment.environment"] = environment.EnvironmentName
                };
            })
            .CreateLogger();

        var resourceBuilder = ResourceBuilder.CreateDefault()
            .AddService(applicationName, serviceVersion: Assembly.GetExecutingAssembly().GetName().Version?.ToString())
            .AddAttributes(new Dictionary<string, object>
            {
                ["environment.name"] = environment.EnvironmentName,
                ["app.group"] = "zena"
            });

        services.AddOpenTelemetry()
            .ConfigureResource(resource => resource.AddService(applicationName))
            .WithMetrics(metrics =>
            {
                metrics
                    .AddMeter(Instrumentor.ServiceName)
                    .AddRuntimeInstrumentation()
                    .AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddOtlpExporter();
            })
            .WithTracing(tracing =>
            {
                tracing
                    .AddSource(Instrumentor.ServiceName)
                    .AddAspNetCoreInstrumentation(opts =>
                    {
                        opts.RecordException = true;
                        opts.Filter = (httpContext) => httpContext.Request.Path != "/health";
                    })
                    // .AddConsoleExporter()
                    .AddHttpClientInstrumentation()
                    .AddEntityFrameworkCoreInstrumentation()
                    .AddOtlpExporter();
            });

        return services;
    }
}
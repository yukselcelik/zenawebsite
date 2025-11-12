using System.Reflection;
using OpenTelemetry.Exporter;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Serilog;
using Serilog.Sinks.Grafana.Loki;
using Zenabackend.Enrichers;

namespace Zenabackend;

public static class OpenTelemetryExtensions
{
    public static IServiceCollection AddAppObservability(
        this IServiceCollection services,
        IConfiguration configuration,
        IHostBuilder hostBuilder,
        IHostEnvironment environment,
        string applicationName = "zena-backend")
    {
        var otlpEndpoint = "http://localhost:4317";
        var now = DateTime.UtcNow.AddHours(3);
        var logDirectory = Path.Combine("logs", now.ToString("yyyy"), now.ToString("MM"));
        var logFilePath = Path.Combine(logDirectory, "log-.txt");

        Log.Logger = new LoggerConfiguration()
            .WriteTo.GrafanaLoki(
                configuration["Loki:Url"] ?? "http://localhost:3100",
                [
                    new LokiLabel { Key = "service_name", Value = applicationName },
                    new LokiLabel { Key = "app", Value = configuration["Loki:Labels:app"] ?? "zena-backend" },
                    new LokiLabel { Key = "env", Value = configuration["Loki:Labels:env"] ?? environment.EnvironmentName.ToLower() }
                ],
                credentials: null)
            .Enrich.FromLogContext()
            .Enrich.With(new TraceIdEnricher())
            .WriteTo.Console()
            .Enrich.WithProperty("Application", applicationName)
            .Enrich.WithProperty("Environment", environment.EnvironmentName)
            .CreateLogger();

        services.AddOpenTelemetry()
            .ConfigureResource(ConfigureResource)
            .WithTracing(tracerProviderBuilder =>
                tracerProviderBuilder
                    .AddSource(Instrumentor.ServiceName)
                    .AddAspNetCoreInstrumentation(opts =>
                    {
                        opts.Filter = context =>
                        {
                            var ignore = new[] { "/swagger" };
                            return !ignore.Any(s =>
                                context.Request.Path.ToString().Contains(s, StringComparison.OrdinalIgnoreCase));
                        };
                    })
                    .AddHttpClientInstrumentation()
                    .AddOtlpExporter(otlpOptions =>
                    {
                        otlpOptions.Endpoint = new Uri(otlpEndpoint);
                        otlpOptions.Protocol = OtlpExportProtocol.Grpc;
                    }))
            .WithMetrics(metricsProviderBuilder =>
                metricsProviderBuilder
                    .AddMeter(Instrumentor.ServiceName)
                    .AddRuntimeInstrumentation()
                    .AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddOtlpExporter(otlpOptions =>
                    {
                        otlpOptions.Endpoint = new Uri(otlpEndpoint);
                        otlpOptions.Protocol = OtlpExportProtocol.Grpc;
                    }));

        // Serilog'u .NET logging pipeline'ına ekle
        hostBuilder.UseSerilog();

        return services;

        // 2. Define a common resource configuration for Tracing and Metrics
        // This adds service-specific attributes to all telemetry data.
        void ConfigureResource(ResourceBuilder resource)
        {
            var assembly = Assembly.GetExecutingAssembly().GetName();
            var assemblyVersion = assembly.Version?.ToString() ?? "1.0.0";
            resource.AddService(applicationName, serviceVersion: assemblyVersion)
                .AddTelemetrySdk() // Adds information about the OpenTelemetry SDK itself
                .AddAttributes(new Dictionary<string, object>
                {
                    ["environment.name"] = environment.EnvironmentName, // Add environment name
                });
        }
    }
}

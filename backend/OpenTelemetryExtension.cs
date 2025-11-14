using System.Reflection;
using OpenTelemetry.Exporter;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Serilog;
using Serilog.Sinks.OpenTelemetry;


namespace Zenabackend;

public static class OpenTelemetryExtensions
{
    /// <summary>
    /// Adds and configures OpenTelemetry for logging, tracing, and metrics to the service collection.
    /// </summary>
    /// <param name="services">The <see cref="IServiceCollection"/> to add services to.</param>
    /// <param name="configuration">The application's configuration.</param>
    /// <param name="environment">The hosting environment information.</param>
    /// <param name="applicationName">The name of the application service.</param>
    /// <returns>The <see cref="IServiceCollection"/> for chaining.</returns>
    public static IServiceCollection AddAppObservability(
        this IServiceCollection services,
        IConfiguration configuration,
        IWebHostEnvironment environment,
        string applicationName)
    {

        var otlpEndpoint = configuration["OpenTelemetry:OtlpEndpoint"] ?? "http://localhost:4317";

        // 1️⃣ Serilog ile OTLP log export
        Log.Logger = new LoggerConfiguration()
            .WriteTo.OpenTelemetry(options =>
            {
                options.Endpoint = otlpEndpoint;
                options.Protocol = OtlpProtocol.Grpc;
                options.ResourceAttributes = new Dictionary<string, object>
                {
                    ["service.name"] = applicationName,
                    ["environment.name"] = environment.EnvironmentName
                };
            })
            .CreateLogger();

        // 1. Configure Logging to use OpenTelemetry
        // This sets up the standard .NET Core logging to export logs via OTLP.
        services.AddLogging(logging =>
        {
            logging.AddOpenTelemetry(otlpOptions =>
            {
                otlpOptions.IncludeFormattedMessage = true; // Include the formatted log message
                otlpOptions.IncludeScopes = true;           // Include log scopes
                otlpOptions.AddOtlpExporter(exporterOptions =>
                {
                    // Set the OTLP endpoint for logging. Adjust as needed.
                    exporterOptions.Endpoint = new Uri(otlpEndpoint);
                    exporterOptions.Protocol = OtlpExportProtocol.Grpc;
                });
            });
        });

        // 2. Define a common resource configuration for Tracing and Metrics
        // This adds service-specific attributes to all telemetry data.
        void ConfigureResource(ResourceBuilder resource)
        {
            var assembly = Assembly.GetExecutingAssembly().GetName();
            var assemblyVersion = assembly.Version?.ToString() ?? "1.0.0"; // Default version if not found
            resource.AddService(applicationName, serviceVersion: assemblyVersion) // Use the provided application name
                .AddTelemetrySdk() // Adds information about the OpenTelemetry SDK itself
                .AddAttributes(new Dictionary<string, object>
                {
                    ["environment.name"] = environment.EnvironmentName, // Add environment name
                    ["app.group"] = "finans" // Custom application group attribute
                });
        }

        // 3. Configure OpenTelemetry for Tracing and Metrics
        services.AddOpenTelemetry()
            .ConfigureResource(ConfigureResource) // Apply the common resource configuration
            .WithTracing(tracerProviderBuilder =>
                tracerProviderBuilder
                    .AddSource(Instrumentor.ServiceName) // Add source for custom traces
                    .AddAspNetCoreInstrumentation(opts =>
                    {
                        // Filter out specific paths from tracing, e.g., Swagger UI paths.
                        opts.Filter = context =>
                        {
                            var ignore = new[] { "/swagger" , "/metrics","/hangfire" };
                            return !ignore.Any(s => context.Request.Path.ToString().Contains(s, StringComparison.OrdinalIgnoreCase));
                        };
                        opts.RecordException = true; // Record exceptions in traces
                    })
                    .AddHttpClientInstrumentation() // Instrument HTTP client calls
                    .AddOtlpExporter(otlpOptions =>
                    {
                        // Set the OTLP endpoint for tracing. Adjust as needed.
                        otlpOptions.Endpoint = new Uri(otlpEndpoint);
                        otlpOptions.Protocol = OtlpExportProtocol.Grpc;
                    }))
            .WithMetrics(metricsProviderBuilder =>
                metricsProviderBuilder
                    .AddMeter(Instrumentor.ServiceName) // Add meter for custom metrics
                    .AddRuntimeInstrumentation() // Instrument .NET runtime metrics (e.g., CPU, memory)
                    .AddAspNetCoreInstrumentation() // Instrument ASP.NET Core metrics (e.g., request duration)
                    .AddHttpClientInstrumentation() // Instrument HTTP client metrics
                    .AddOtlpExporter(otlpOptions =>
                    {
                        // Set the OTLP endpoint for metrics. Adjust as needed.
                        otlpOptions.Endpoint = new Uri(otlpEndpoint);
                        otlpOptions.Protocol = OtlpExportProtocol.Grpc;
                    }));

        return services;
    }
}

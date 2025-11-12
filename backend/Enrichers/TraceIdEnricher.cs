using System.Diagnostics;
using Serilog.Core;
using Serilog.Events;

namespace Zenabackend.Enrichers;

public class TraceIdEnricher : ILogEventEnricher
{
    public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
    {
        var activity = Activity.Current;
        if (activity != null)
        {
            // W3C Trace Context format: trace-id
            var traceId = activity.TraceId.ToString();
            var spanId = activity.SpanId.ToString();
            
            logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty("TraceId", traceId));
            logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty("SpanId", spanId));
            
            // Parent span ID varsa ekle
            if (activity.ParentSpanId != default)
            {
                logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty("ParentSpanId", activity.ParentSpanId.ToString()));
            }
            
            // Trace flags (sampling decision)
            logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty("TraceFlags", activity.ActivityTraceFlags.ToString()));
        }
    }
}


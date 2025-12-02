using System.Collections.Concurrent;
using System.Net;

namespace Zenabackend.Middleware;

public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RateLimitingMiddleware> _logger;
    
    // Basit in-memory rate limiting (production'da Redis kullanılabilir)
    private static readonly ConcurrentDictionary<string, List<DateTime>> _requestHistory = new();
    
    // Rate limit ayarları
    private const int MaxRequests = 100; // 1 dakikada maksimum istek sayısı
    private const int TimeWindowSeconds = 60; // 1 dakika

    public RateLimitingMiddleware(RequestDelegate next, ILogger<RateLimitingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Rate limiting'i sadece API endpoint'leri için uygula
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            var clientIp = GetClientIp(context);
            var key = $"{clientIp}:{context.Request.Path}";
            
            var now = DateTime.UtcNow;
            var cutoff = now.AddSeconds(-TimeWindowSeconds);
            
            // Eski kayıtları temizle
            if (_requestHistory.TryGetValue(key, out var requests))
            {
                requests.RemoveAll(r => r < cutoff);
                
                // Rate limit kontrolü
                if (requests.Count >= MaxRequests)
                {
                    _logger.LogWarning("Rate limit exceeded for {ClientIp} on {Path}", 
                        clientIp, context.Request.Path);
                    
                    context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
                    context.Response.ContentType = "application/json";
                    
                    await context.Response.WriteAsync(
                        System.Text.Json.JsonSerializer.Serialize(new
                        {
                            success = false,
                            message = "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.",
                            statusCode = 429
                        })
                    );
                    return;
                }
                
                requests.Add(now);
            }
            else
            {
                _requestHistory.TryAdd(key, new List<DateTime> { now });
            }
        }
        
        await _next(context);
    }
    
    private string GetClientIp(HttpContext context)
    {
        // X-Forwarded-For header'ını kontrol et (reverse proxy arkasındaysa)
        var forwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrEmpty(forwardedFor))
        {
            return forwardedFor.Split(',')[0].Trim();
        }
        
        return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }
}


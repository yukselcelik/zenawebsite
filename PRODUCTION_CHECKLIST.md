# 🚀 Production Deployment Checklist - Zena Website

## ⚠️ KRİTİK GÜVENLİK ÖNLEMLERİ

### 1. **Environment Variables & Secrets Management** 🔐
- [ ] **JWT Key**: `appsettings.json` içindeki JWT key'i **GÜÇLÜ ve RANDOM** bir değerle değiştir
  - Şu anki: `e12126f62167195ccc74cb7309da6c03!` → **DEĞİŞTİRİLMELİ**
  - En az 32 karakter, rastgele oluşturulmuş olmalı
  - Production'da environment variable olarak saklanmalı

- [ ] **Database Connection String**: 
  - Şifreler hardcoded → Environment variable'a taşınmalı
  - Production database şifresi güçlü olmalı (min 16 karakter, özel karakterler)

- [ ] **CORS Origins**: 
  - Production domain'leri eklenmeli
  - `localhost` origin'leri kaldırılmalı (sadece production domain'ler kalmalı)

### 2. **HTTPS/SSL Configuration** 🔒
- [ ] SSL sertifikası kurulmalı (Let's Encrypt veya ücretli sertifika)
- [ ] Tüm HTTP trafiği HTTPS'e yönlendirilmeli (zaten var: `UseHttpsRedirection`)
- [ ] HSTS (HTTP Strict Transport Security) header'ı eklenmeli
- [ ] Frontend'de API URL'leri HTTPS olmalı

### 3. **Backend Güvenlik İyileştirmeleri** 🛡️

#### Rate Limiting (Eksik!)
- [ ] **Rate Limiting middleware eklenmeli**
  - Login endpoint'leri için özel rate limiting (brute force koruması)
  - Genel API rate limiting
  - Önerilen: `AspNetCoreRateLimit` paketi

#### Input Validation
- [ ] Tüm input'lar validate edilmeli (zaten DTO'larda var, kontrol edilmeli)
- [ ] SQL Injection koruması (Entity Framework kullanılıyor, güvenli)
- [ ] XSS koruması (ASP.NET Core otomatik sağlıyor)

#### Security Headers
- [ ] Security headers middleware eklenmeli:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Content-Security-Policy`
  - `Referrer-Policy: strict-origin-when-cross-origin`

#### Swagger/API Documentation
- [ ] **Production'da Swagger KAPALI olmalı** (şu an sadece Development'ta açık - ✅ İyi)
- [ ] Production'da API endpoint'leri gizlenmeli

### 4. **Database Güvenliği** 💾
- [ ] Production database backup stratejisi
- [ ] Database şifreleri güçlü ve unique
- [ ] Database erişimi sadece backend'den olmalı (firewall rules)
- [ ] Connection pooling ayarları optimize edilmeli
- [ ] Database migration'lar production'da otomatik çalışmamalı (manuel kontrol)

### 5. **File Upload Güvenliği** 📁
- [ ] Upload edilen dosyaların:
  - Dosya tipi kontrolü (sadece izin verilen formatlar)
  - Dosya boyutu limiti
  - Dosya adı sanitization (güvenli karakterler)
  - Virus scanning (opsiyonel ama önerilir)
  - Upload klasörü web root dışında olmalı

### 6. **Logging & Monitoring** 📊
- [ ] Production'da hassas bilgiler loglanmamalı (şifreler, token'lar)
- [ ] Log rotation ve retention policy
- [ ] Error tracking (Sentry, Application Insights, vb.)
- [ ] Performance monitoring

### 7. **Frontend Güvenlik** 🌐
- [ ] API URL'leri environment variable'dan alınmalı (✅ zaten var)
- [ ] Sensitive bilgiler frontend'de hardcoded olmamalı
- [ ] XSS koruması (React otomatik escape ediyor)
- [ ] CSP (Content Security Policy) header'ı

### 8. **Authentication & Authorization** 🔑
- [ ] JWT token expiration süreleri uygun mu? (kontrol edilmeli)
- [ ] Refresh token mekanizması var mı? (yoksa eklenmeli)
- [ ] Password policy güçlü mü? (kontrol edilmeli)
- [ ] Account lockout mekanizması (brute force koruması)

### 9. **Docker & Container Güvenliği** 🐳
- [ ] Docker image'lerde root user kullanılmamalı
- [ ] Multi-stage build kullanılmalı (image boyutu küçültme)
- [ ] Secrets Docker secrets veya environment variables ile yönetilmeli
- [ ] Container'lar read-only filesystem ile çalışmalı (mümkünse)

### 10. **Infrastructure** 🏗️
- [ ] Firewall rules (sadece gerekli portlar açık)
- [ ] DDoS koruması (Cloudflare veya benzeri)
- [ ] Load balancer (yüksek trafik için)
- [ ] Auto-scaling (opsiyonel)
- [ ] Backup stratejisi

## 📝 YAPILMASI GEREKENLER

### Acil (Production'a çıkmadan önce):
1. ✅ JWT Key değiştir
2. ✅ Database şifreleri güçlü ve environment variable
3. ✅ CORS origins production domain'leri
4. ✅ Rate limiting ekle
5. ✅ Security headers ekle
6. ✅ Swagger production'da kapalı (✅ zaten var)
7. ✅ HTTPS/SSL kurulumu
8. ✅ File upload güvenlik kontrolleri

### Önemli (Kısa vadede):
1. Error tracking (Sentry)
2. Logging stratejisi
3. Backup otomasyonu
4. Monitoring dashboard

### İyileştirme (Orta vadede):
1. Refresh token mekanizması
2. Account lockout
3. DDoS koruması
4. Load balancer

## 🔧 ÖNERİLEN AYARLAR

### appsettings.Production.json oluştur:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=PROD_DB_HOST;Database=zena_db;Username=PROD_USER;Password=STRONG_PASSWORD;TrustServerCertificate=True"
  },
  "Jwt": {
    "Key": "ENVIRONMENT_VARIABLE_OR_SECRET_MANAGER",
    "Issuer": "ZenaBackend",
    "Audience": "ZenaBackend"
  },
  "Cors": {
    "AllowedOrigins": [
      "https://yourdomain.com",
      "https://www.yourdomain.com"
    ]
  },
  "FileStorage": {
    "BaseUrl": "https://yourdomain.com"
  },
  "AllowedHosts": "yourdomain.com;www.yourdomain.com",
  "Serilog": {
    "MinimumLevel": {
      "Default": "Warning",
      "Override": {
        "Microsoft": "Error",
        "Microsoft.AspNetCore": "Error"
      }
    }
  }
}
```

### Environment Variables (Production):
```bash
ASPNETCORE_ENVIRONMENT=Production
JWT__KEY=<güçlü-random-key>
ConnectionStrings__DefaultConnection=<production-connection-string>
Cors__AllowedOrigins__0=https://yourdomain.com
```

## 🚨 ÖNEMLİ NOTLAR

1. **Şu anki JWT key ve database şifreleri GÜVENLİ DEĞİL** - mutlaka değiştirilmeli
2. **Rate limiting yok** - brute force saldırılarına açık
3. **Security headers eksik** - eklenmeli
4. **File upload güvenlik kontrolleri** - detaylı kontrol edilmeli
5. **Production'da Swagger kapalı** - ✅ İyi, devam etsin

## 📚 KAYNAKLAR

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [ASP.NET Core Security Best Practices](https://learn.microsoft.com/en-us/aspnet/core/security/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)


# 🚀 Zena Website - Production Deployment Guide

## 📋 Ön Hazırlık

### 1. Environment Variables Hazırlama

Production sunucusunda şu environment variable'ları ayarlayın:

```bash
# Backend
ASPNETCORE_ENVIRONMENT=Production
JWT__KEY=<güçlü-rastgele-32-karakter-veya-daha-uzun>
ConnectionStrings__DefaultConnection=Host=DB_HOST;Port=5432;Database=zena_db;Username=DB_USER;Password=GÜÇLÜ_ŞİFRE;TrustServerCertificate=True
Cors__AllowedOrigins__0=https://yourdomain.com
Cors__AllowedOrigins__1=https://www.yourdomain.com

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NODE_ENV=production
```

### 2. Güçlü JWT Key Oluşturma

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

## 🔧 Backend Kurulumu

### 1. Security Middleware'leri Aktif Etme

`Program.cs` dosyasına şu değişiklikleri yapın:

```csharp
// Security Headers Middleware ekle (UseRouting'den ÖNCE)
app.UseMiddleware<SecurityHeadersMiddleware>();

// Rate Limiting Middleware ekle (UseCors'tan ÖNCE)
app.UseMiddleware<RateLimitingMiddleware>();

// Mevcut middleware sırası:
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseMiddleware<SecurityHeadersMiddleware>(); // ✅ EKLE
app.UseCors("MyPolicy");
app.UseMiddleware<RateLimitingMiddleware>(); // ✅ EKLE
app.UseAuthentication();
app.UseAuthorization();
```

### 2. appsettings.Production.json Oluşturma

`backend/appsettings.Production.json.example` dosyasını kopyalayıp `appsettings.Production.json` olarak kaydedin ve değerleri doldurun.

### 3. Database Migration

```bash
cd backend
dotnet ef database update
```

## 🌐 Frontend Kurulumu

### 1. Environment Variables

`.env.production` dosyası oluşturun:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NODE_ENV=production
```

### 2. Production Build

```bash
cd frontend
npm install
npm run build
```

### 3. Standalone Output (Docker için)

Next.js zaten `standalone` output kullanıyor (`next.config.mjs`'de tanımlı).

## 🐳 Docker Deployment

### 1. Production Docker Compose

`docker-compose.production.yml` oluşturun:

```yaml
version: "3.8"
services:
  db:
    image: postgres:15
    container_name: zena_db_prod
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: zena_db
    volumes:
      - pgdata_prod:/var/lib/postgresql/data
    networks:
      - zena_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d zena_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: zena_backend_prod
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ASPNETCORE_URLS=http://+:5133
      - ConnectionStrings__DefaultConnection=Host=db;Port=5432;Database=zena_db;Username=${DB_USER};Password=${DB_PASSWORD};TrustServerCertificate=True
      - Jwt__Key=${JWT_KEY}
      - Jwt__Issuer=ZenaBackend
      - Jwt__Audience=ZenaBackend
      - Cors__AllowedOrigins__0=${FRONTEND_URL}
      - Cors__AllowedOrigins__1=${FRONTEND_URL_WWW}
    volumes:
      - ./backend/wwwroot:/app/wwwroot
      - ./backend/logs:/app/logs
    depends_on:
      db:
        condition: service_healthy
    networks:
      - zena_network
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - NEXT_PUBLIC_API_URL=${BACKEND_API_URL}
    container_name: zena_frontend_prod
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=${BACKEND_API_URL}
    depends_on:
      - backend
    networks:
      - zena_network
    restart: unless-stopped

networks:
  zena_network:
    driver: bridge

volumes:
  pgdata_prod:
```

### 2. .env Dosyası (Docker için)

`.env.production` dosyası oluşturun:

```env
DB_USER=your_db_user
DB_PASSWORD=your_strong_password
JWT_KEY=your_jwt_key_here
FRONTEND_URL=https://yourdomain.com
FRONTEND_URL_WWW=https://www.yourdomain.com
BACKEND_API_URL=https://api.yourdomain.com
```

### 3. Docker Compose ile Çalıştırma

```bash
docker-compose -f docker-compose.production.yml --env-file .env.production up -d
```

## 🔒 SSL/HTTPS Kurulumu

### Nginx Reverse Proxy Örneği

```nginx
# /etc/nginx/sites-available/zena
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL ayarları
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5133;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Let's Encrypt SSL

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 🔐 Güvenlik Kontrol Listesi

- [ ] JWT key değiştirildi ve güçlü
- [ ] Database şifreleri güçlü ve environment variable
- [ ] CORS sadece production domain'leri
- [ ] Security headers middleware aktif
- [ ] Rate limiting middleware aktif
- [ ] Swagger production'da kapalı
- [ ] HTTPS/SSL kurulu
- [ ] Firewall kuralları ayarlandı
- [ ] Database backup stratejisi hazır
- [ ] Log rotation ayarlandı
- [ ] Error tracking (Sentry) kuruldu (opsiyonel)

## 📊 Monitoring

### Health Check Endpoint

Backend'e health check endpoint'i ekleyebilirsiniz:

```csharp
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));
```

### Log Monitoring

- Serilog dosyaları: `backend/logs/`
- Loki entegrasyonu (opsiyonel)
- Application Insights (opsiyonel)

## 🔄 Backup Stratejisi

### Database Backup

```bash
# Otomatik backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec zena_db_prod pg_dump -U your_user zena_db > backup_$DATE.sql
```

### Cron Job (Günlük Backup)

```bash
0 2 * * * /path/to/backup-script.sh
```

## 🚨 Sorun Giderme

### Backend Başlamıyor
- Database bağlantısını kontrol edin
- Environment variable'ları kontrol edin
- Log dosyalarını inceleyin: `backend/logs/`

### Frontend API'ye Bağlanamıyor
- CORS ayarlarını kontrol edin
- `NEXT_PUBLIC_API_URL` doğru mu?
- Network firewall kurallarını kontrol edin

### SSL Sertifika Sorunları
- Certbot yenileme: `sudo certbot renew`
- Nginx config test: `sudo nginx -t`

## 📞 Destek

Production'a çıkmadan önce tüm checklist'i tamamladığınızdan emin olun:
- `PRODUCTION_CHECKLIST.md` dosyasını kontrol edin


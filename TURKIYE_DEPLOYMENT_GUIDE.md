# 🇹🇷 Türkiye İçin Deployment Rehberi - Zena Website

## 🎯 HIZLI BAŞLANGIÇ (Adım Adım)

### ADIM 1: Domain Satın Alma (1-2 gün)

**Önerilen Domain Sağlayıcıları:**
- **Turhost** - Türk şirket, Türkçe destek
- **Natro** - Uygun fiyatlı, Türkçe panel
- **Namecheap** - Uluslararası, uygun fiyat
- **GoDaddy** - Yaygın kullanılan

**Yapılacaklar:**
1. Domain satın al (örn: `zenaenerji.com.tr` veya `.com`)
2. Domain panelinden DNS ayarlarına eriş
3. Henüz DNS ayarlarını değiştirme (server IP'yi alınca yapılacak)

**Maliyet:** ~50-200 TL/yıl

---

### ADIM 2: Server/Hosting Seçimi (1 gün)

**Türkiye'deki Seçenekler:**

#### Seçenek A: Türk Hosting Firmaları (Kolay başlangıç)
- **Turhost VPS** - 150-300 TL/ay
- **Natro VPS** - 100-250 TL/ay
- **Hosting.com.tr** - 100-200 TL/ay
- **Avantaj:** Türkçe destek, Türk Lirası ödeme
- **Dezavantaj:** Genelde daha pahalı, sınırlı kaynak

#### Seçenek B: Uluslararası VPS (Önerilen)
- **DigitalOcean** - $6-12/ay (~200-400 TL/ay)
- **Linode** - $5-12/ay (~170-400 TL/ay)
- **Vultr** - $6-12/ay (~200-400 TL/ay)
- **Avantaj:** Daha uygun, daha iyi performans
- **Dezavantaj:** İngilizce destek, dolar bazlı

**Önerilen Konfigürasyon:**
- **CPU:** 2 core
- **RAM:** 4GB (8GB önerilir)
- **Disk:** 50GB SSD
- **Bandwidth:** Sınırsız veya yeterli
- **Lokasyon:** İstanbul (Türkiye) veya Frankfurt (Almanya) - Türkiye'ye yakın

**Maliyet:** ~200-500 TL/ay

---

### ADIM 3: Server Kurulumu (2-3 saat)

**Gerekli Bilgiler:**
- Server IP adresi
- Root/Admin kullanıcı adı ve şifresi
- SSH erişim bilgileri

**Kurulum Adımları:**

1. **SSH ile Bağlan:**
   ```bash
   ssh root@SERVER_IP
   ```

2. **Sistem Güncellemesi:**
   ```bash
   apt update && apt upgrade -y
   ```

3. **Gerekli Yazılımları Kur:**
   ```bash
   # .NET 9.0 Runtime
   wget https://dot.net/v1/dotnet-install.sh
   chmod +x dotnet-install.sh
   ./dotnet-install.sh --version 9.0.0
   
   # Node.js 20 LTS
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt install -y nodejs
   
   # PostgreSQL
   apt install -y postgresql postgresql-contrib
   
   # Nginx
   apt install -y nginx
   
   # Docker (Opsiyonel)
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

4. **Firewall Ayarları:**
   ```bash
   ufw allow 22/tcp    # SSH
   ufw allow 80/tcp    # HTTP
   ufw allow 443/tcp   # HTTPS
   ufw enable
   ```

---

### ADIM 4: Database Kurulumu (30 dakika)

```bash
# PostgreSQL'e bağlan
sudo -u postgres psql

# Database oluştur
CREATE DATABASE zena_db;

# Kullanıcı oluştur
CREATE USER zena_user WITH PASSWORD 'GÜÇLÜ_ŞİFRE_BURAYA';

# Yetkilendirme
GRANT ALL PRIVILEGES ON DATABASE zena_db TO zena_user;
\q
```

---

### ADIM 5: DNS Ayarları (15 dakika)

**Domain panelinde yapılacaklar:**

1. DNS ayarlarına git
2. A Record ekle:
   - **Host:** @ (veya boş)
   - **Type:** A
   - **Value:** Server IP adresi
   - **TTL:** 3600

3. www için A Record:
   - **Host:** www
   - **Type:** A
   - **Value:** Server IP adresi
   - **TTL:** 3600

**DNS Propagation:** 2-24 saat sürebilir
- Kontrol: `nslookup yourdomain.com` veya `dig yourdomain.com`

---

### ADIM 6: SSL Sertifikası (Let's Encrypt - Ücretsiz) (15 dakika)

```bash
# Certbot kurulumu
apt install -y certbot python3-certbot-nginx

# SSL sertifikası al
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Otomatik yenileme test
certbot renew --dry-run
```

**Otomatik Yenileme:** Certbot otomatik olarak yeniler (90 günde bir)

---

### ADIM 7: Nginx Yapılandırması (30 dakika)

`/etc/nginx/sites-available/zena` dosyası oluştur:

```nginx
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

```bash
# Nginx config test
nginx -t

# Nginx'i yeniden başlat
systemctl restart nginx
```

---

### ADIM 8: Kod Deployment (1 saat)

```bash
# Proje klasörüne git
cd /var/www
git clone YOUR_REPOSITORY_URL zena-website
cd zena-website

# Environment variables ayarla
nano backend/.env  # veya appsettings.Production.json
nano frontend/.env.production
```

**Backend Environment Variables:**
```bash
ASPNETCORE_ENVIRONMENT=Production
JWT__KEY=GÜÇLÜ_JWT_KEY_BURAYA
ConnectionStrings__DefaultConnection=Host=localhost;Database=zena_db;Username=zena_user;Password=ŞİFRE
Cors__AllowedOrigins__0=https://yourdomain.com
```

**Frontend Environment Variables:**
```bash
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NODE_ENV=production
```

---

### ADIM 9: Servisleri Başlatma (30 dakika)

**Backend Service (Systemd):**

`/etc/systemd/system/zena-backend.service` oluştur:

```ini
[Unit]
Description=Zena Backend API
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/var/www/zena-website/backend
ExecStart=/usr/bin/dotnet /var/www/zena-website/backend/publish/Zenabackend.dll
Restart=always
RestartSec=10
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://localhost:5133

[Install]
WantedBy=multi-user.target
```

```bash
# Servisi başlat
systemctl daemon-reload
systemctl enable zena-backend
systemctl start zena-backend
systemctl status zena-backend
```

**Frontend Service (PM2):**

```bash
# PM2 kurulumu
npm install -g pm2

# Frontend build
cd /var/www/zena-website/frontend
npm install
npm run build

# PM2 ile başlat
pm2 start npm --name "zena-frontend" -- start
pm2 save
pm2 startup
```

---

### ADIM 10: Database Migration (15 dakika)

```bash
cd /var/www/zena-website/backend
dotnet ef database update
```

---

### ADIM 11: Backup Sistemi (30 dakika)

**Otomatik Backup Script:**

`/usr/local/bin/zena-backup.sh` oluştur:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/zena"
mkdir -p $BACKUP_DIR

# Database backup
pg_dump -U zena_user zena_db > $BACKUP_DIR/db_backup_$DATE.sql

# Dosya backup
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz /var/www/zena-website/backend/wwwroot

# Eski backup'ları sil (30 günden eski)
find $BACKUP_DIR -type f -mtime +30 -delete
```

```bash
# Script'i çalıştırılabilir yap
chmod +x /usr/local/bin/zena-backup.sh

# Cron job ekle (her gün saat 02:00'de)
crontab -e
# Şunu ekle:
0 2 * * * /usr/local/bin/zena-backup.sh
```

---

## 💰 MALİYET ÖZETİ (Türkiye)

### İlk Kurulum (Tek Seferlik)
- Domain: **50-200 TL/yıl**
- SSL: **0 TL** (Let's Encrypt ücretsiz)
- **Toplam:** ~50-200 TL

### Aylık Maliyetler
- VPS/Hosting: **200-500 TL/ay**
- Domain: **~5-15 TL/ay** (yıllık ücretin aylık karşılığı)
- E-posta servisi: **0-50 TL/ay** (ücretsiz tier kullanılırsa 0)
- Monitoring: **0 TL** (ücretsiz servisler)
- **Toplam:** ~200-550 TL/ay

### Yıllık Toplam
- **İlk Yıl:** ~2,500-6,800 TL
- **Sonraki Yıllar:** ~2,400-6,600 TL/yıl

---

## ✅ KONTROL LİSTESİ

### Go-Live Öncesi
- [ ] Domain satın alındı
- [ ] Server/hosting alındı
- [ ] Server kurulumu tamamlandı
- [ ] DNS ayarları yapıldı (propagation bekleniyor)
- [ ] SSL sertifikası kuruldu
- [ ] Database kuruldu
- [ ] Kod deploy edildi
- [ ] Environment variables ayarlandı
- [ ] Servisler çalışıyor
- [ ] Backup sistemi kuruldu
- [ ] Monitoring aktif

### Go-Live Sonrası (İlk 24 Saat)
- [ ] Site erişilebilir
- [ ] HTTPS çalışıyor
- [ ] API endpoint'leri çalışıyor
- [ ] Database bağlantısı çalışıyor
- [ ] Log dosyaları kontrol edildi
- [ ] Hata yok
- [ ] Performance normal

---

## 🆘 SORUN GİDERME

### Site Açılmıyor
```bash
# Nginx durumu
systemctl status nginx

# Backend durumu
systemctl status zena-backend

# Frontend durumu
pm2 status

# Log kontrolü
tail -f /var/log/nginx/error.log
journalctl -u zena-backend -f
```

### SSL Sertifikası Sorunu
```bash
# Sertifika yenileme
certbot renew

# Nginx restart
systemctl restart nginx
```

### Database Bağlantı Sorunu
```bash
# PostgreSQL durumu
systemctl status postgresql

# Bağlantı testi
psql -U zena_user -d zena_db -h localhost
```

---

## 📞 DESTEK KAYNAKLARI

- **Türkçe Dokümantasyon:** Bu rehber
- **Operasyonel Checklist:** `OPERATIONAL_CHECKLIST.md`
- **Güvenlik Checklist:** `PRODUCTION_CHECKLIST.md`
- **Deployment Guide:** `DEPLOYMENT_GUIDE.md`

---

## ⚠️ ÖNEMLİ NOTLAR

1. **DNS Propagation:** Türkiye'de genelde 2-6 saat sürer, bazen 24 saate kadar çıkabilir
2. **SSL Sertifikası:** Let's Encrypt ücretsiz ve güvenilir, otomatik yenilenir
3. **Backup:** İlk günden itibaren aktif olmalı, test edilmeli
4. **Monitoring:** UptimeRobot gibi ücretsiz servisler kullanılabilir
5. **Ödeme:** Türk hosting firmaları TL ile ödeme alır, uluslararası firmalar genelde kredi kartı ile dolar bazlı

---

## 🎯 ÖNERİLEN YOL HARİTASI

1. **Hafta 1:** Domain + Server seçimi ve kurulumu
2. **Hafta 2:** Kod deployment ve test
3. **Hafta 3:** Güvenlik kontrolleri ve optimizasyon
4. **Hafta 4:** Go-live ve monitoring

**Toplam Süre:** ~1 ay (hazırlık ve test dahil)


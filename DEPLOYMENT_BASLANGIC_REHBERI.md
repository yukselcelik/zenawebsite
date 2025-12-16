# 🚀 Zena Website - Deployment Başlangıç Rehberi

## 📌 Genel Bakış

Bu rehber, projenizi internet ortamında yayınlamak için gereken tüm adımları içerir. Frontend (Next.js) ve Backend (.NET 9.0) hazır olduğunu varsayarak devam ediyoruz.

---

## 🎯 HIZLI BAŞLANGIÇ (3 Seçenek)

### Seçenek 1: En Kolay - Türk Hosting Firmaları (Önerilen Başlangıç)
- **Süre:** 1-2 gün
- **Maliyet:** ~300-500 TL/ay
- **Zorluk:** ⭐⭐☆☆☆ (Kolay)
- **Avantajlar:** Türkçe destek, kolay kurulum, Türk Lirası ödeme

### Seçenek 2: VPS ile Manuel Kurulum (Orta Seviye)
- **Süre:** 2-3 gün
- **Maliyet:** ~200-400 TL/ay
- **Zorluk:** ⭐⭐⭐☆☆ (Orta)
- **Avantajlar:** Daha uygun fiyat, tam kontrol

### Seçenek 3: Docker ile Otomatik (İleri Seviye)
- **Süre:** 1 gün
- **Maliyet:** ~200-500 TL/ay
- **Zorluk:** ⭐⭐⭐⭐☆ (Zor)
- **Avantajlar:** Kolay güncelleme, ölçeklenebilir

---

## 📋 ADIM ADIM DEPLOYMENT

### ADIM 1: Domain Satın Alma (1-2 saat)

**Önerilen Firmalar:**
- **Turhost** - turhost.com.tr (Türkçe, kolay)
- **Natro** - natro.com (Uygun fiyat)
- **Namecheap** - namecheap.com (Uluslararası)

**Yapılacaklar:**
1. Domain satın al (örn: `zenaenerji.com.tr` veya `.com`)
2. Domain panelinden DNS ayarlarına eriş
3. **ÖNEMLİ:** Henüz DNS ayarlarını değiştirme! (Server IP'yi alınca yapılacak)

**Maliyet:** 50-200 TL/yıl

---

### ADIM 2: Server/Hosting Seçimi (1 gün)

#### A) Türk Hosting Firmaları (Kolay Başlangıç)

**Önerilenler:**
- **Turhost VPS** - turhost.com.tr
  - Paket: 2 CPU, 4GB RAM, 50GB SSD
  - Fiyat: ~300 TL/ay
  - Avantaj: Türkçe destek, kolay kurulum

- **Natro VPS** - natro.com
  - Paket: 2 CPU, 4GB RAM, 50GB SSD
  - Fiyat: ~250 TL/ay
  - Avantaj: Uygun fiyat, Türkçe panel

**Yapılacaklar:**
1. VPS paketi satın al
2. Server IP adresini not al
3. Root/Admin şifresini güvenli bir yerde sakla

#### B) Uluslararası VPS (Daha Uygun)

**Önerilenler:**
- **DigitalOcean** - digitalocean.com
  - Droplet: 2 CPU, 4GB RAM, 50GB SSD
  - Fiyat: $12/ay (~400 TL/ay)
  - Lokasyon: Frankfurt (Türkiye'ye yakın)

- **Vultr** - vultr.com
  - Instance: 2 CPU, 4GB RAM, 50GB SSD
  - Fiyat: $12/ay (~400 TL/ay)
  - Lokasyon: İstanbul (varsa) veya Frankfurt

**Yapılacaklar:**
1. Hesap oluştur
2. VPS oluştur (Ubuntu 22.04 LTS seç)
3. IP adresini ve root şifresini not al

---

### ADIM 3: Server'a Bağlanma ve Temel Kurulum (1-2 saat)

#### 3.1 SSH ile Bağlanma

**Windows için:**
- **PuTTY** kullan (putty.org)
- Veya Windows Terminal:
  ```bash
  ssh root@SERVER_IP_ADRESI
  ```

**Mac/Linux için:**
```bash
ssh root@SERVER_IP_ADRESI
```

#### 3.2 Sistem Güncellemesi

```bash
# Ubuntu/Debian için
apt update && apt upgrade -y

# Güvenlik için yeni kullanıcı oluştur (opsiyonel ama önerilir)
adduser zenaadmin
usermod -aG sudo zenaadmin
```

#### 3.3 Gerekli Yazılımları Kurma

```bash
# .NET 9.0 Runtime kurulumu
wget https://dot.net/v1/dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --version 9.0.0 --runtime aspnetcore

# PATH'e ekle
export PATH=$PATH:$HOME/.dotnet
echo 'export PATH=$PATH:$HOME/.dotnet' >> ~/.bashrc

# Node.js 20 LTS kurulumu
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# PostgreSQL kurulumu
apt install -y postgresql postgresql-contrib

# Nginx kurulumu
apt install -y nginx

# Git kurulumu
apt install -y git

# Firewall ayarları
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

#### 3.4 Kurulum Kontrolü

```bash
# Kontroller
dotnet --version    # 9.0.x görünmeli
node --version      # v20.x.x görünmeli
npm --version       # 10.x.x görünmeli
psql --version      # PostgreSQL versiyonu görünmeli
nginx -v            # Nginx versiyonu görünmeli
```

---

### ADIM 4: Database Kurulumu (30 dakika)

```bash
# PostgreSQL'e bağlan
sudo -u postgres psql

# Database ve kullanıcı oluştur
CREATE DATABASE zena_db;
CREATE USER zena_user WITH PASSWORD 'GÜÇLÜ_ŞİFRE_BURAYA';
GRANT ALL PRIVILEGES ON DATABASE zena_db TO zena_user;
ALTER USER zena_user CREATEDB;
\q

# Bağlantı testi
psql -U zena_user -d zena_db -h localhost
# Şifre sorduğunda yukarıda oluşturduğunuz şifreyi girin
# Başarılı olursa: zena_db=> çıkacak
# Çıkmak için: \q
```

**ÖNEMLİ:** Şifreyi güvenli bir yerde saklayın!

---

### ADIM 5: Proje Kodlarını Server'a Yükleme (1 saat)

#### 5.1 Proje Klasörü Oluşturma

```bash
# Proje klasörü oluştur
mkdir -p /var/www/zena-website
cd /var/www/zena-website
```

#### 5.2 Kodları Yükleme (3 Yöntem)

**Yöntem 1: Git ile (Önerilen)**
```bash
# Eğer kodlarınız Git'te ise
git clone YOUR_REPOSITORY_URL .

# Veya manuel olarak
git init
git remote add origin YOUR_REPOSITORY_URL
git pull origin main
```

**Yöntem 2: FTP/SFTP ile**
- FileZilla veya WinSCP kullanarak dosyaları yükleyin
- `/var/www/zena-website` klasörüne yükleyin

**Yöntem 3: SCP ile (Komut satırı)**
```bash
# Yerel bilgisayarınızdan (Windows PowerShell veya Mac/Linux terminal)
scp -r ./zenawebsite/* root@SERVER_IP:/var/www/zena-website/
```

---

### ADIM 6: Environment Variables Ayarlama (30 dakika)

#### 6.1 Backend Environment Variables

```bash
cd /var/www/zena-website/backend

# appsettings.Production.json oluştur
nano appsettings.Production.json
```

**İçeriği:**
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=zena_db;Username=zena_user;Password=GÜÇLÜ_ŞİFRE_BURAYA;TrustServerCertificate=True"
  },
  "Jwt": {
    "Key": "GÜÇLÜ_JWT_KEY_BURAYA_32_KARAKTER_VEYA_DAHA_UZUN",
    "Issuer": "ZenaBackend",
    "Audience": "ZenaBackend"
  },
  "Cors": {
    "AllowedOrigins": [
      "https://yourdomain.com",
      "https://www.yourdomain.com"
    ]
  }
}
```

**Güçlü JWT Key Oluşturma:**
```bash
# Linux'ta
openssl rand -base64 32

# Veya
cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1
```

#### 6.2 Frontend Environment Variables

```bash
cd /var/www/zena-website/frontend

# .env.production oluştur
nano .env.production
```

**İçeriği:**
```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NODE_ENV=production
```

**ÖNEMLİ:** `yourdomain.com` yerine kendi domain'inizi yazın!

---

### ADIM 7: Backend Build ve Çalıştırma (1 saat)

#### 7.1 Backend Build

```bash
cd /var/www/zena-website/backend

# .NET restore ve build
dotnet restore
dotnet build

# Publish (production için optimize edilmiş)
dotnet publish -c Release -o ./publish
```

#### 7.2 Database Migration

```bash
# Migration çalıştır
dotnet ef database update
```

#### 7.3 Backend Servis Oluşturma (Systemd)

```bash
# Servis dosyası oluştur
nano /etc/systemd/system/zena-backend.service
```

**İçeriği:**
```ini
[Unit]
Description=Zena Backend API
After=network.target postgresql.service

[Service]
Type=notify
User=www-data
WorkingDirectory=/var/www/zena-website/backend
ExecStart=/root/.dotnet/dotnet /var/www/zena-website/backend/publish/Zenabackend.dll
Restart=always
RestartSec=10
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://localhost:5133

[Install]
WantedBy=multi-user.target
```

**Servisi Başlatma:**
```bash
# Servisi aktif et
systemctl daemon-reload
systemctl enable zena-backend
systemctl start zena-backend

# Durum kontrolü
systemctl status zena-backend

# Log kontrolü
journalctl -u zena-backend -f
```

---

### ADIM 8: Frontend Build ve Çalıştırma (1 saat)

#### 8.1 Frontend Build

```bash
cd /var/www/zena-website/frontend

# Dependencies kur
npm install

# Production build
npm run build
```

#### 8.2 PM2 ile Frontend Çalıştırma

```bash
# PM2 kurulumu
npm install -g pm2

# Frontend'i PM2 ile başlat
cd /var/www/zena-website/frontend
pm2 start npm --name "zena-frontend" -- start

# PM2'yi kaydet (server restart'ta otomatik başlasın)
pm2 save
pm2 startup
# Çıkan komutu çalıştırın (systemd için)

# Durum kontrolü
pm2 status
pm2 logs zena-frontend
```

---

### ADIM 9: DNS Ayarları (15 dakika)

**Domain panelinde yapılacaklar:**

1. DNS ayarlarına git
2. **A Record** ekle:
   - **Host:** @ (veya boş)
   - **Type:** A
   - **Value:** Server IP adresi
   - **TTL:** 3600

3. **www için A Record** ekle:
   - **Host:** www
   - **Type:** A
   - **Value:** Server IP adresi
   - **TTL:** 3600

**DNS Propagation:** 2-24 saat sürebilir
- Kontrol: `nslookup yourdomain.com` veya online: whatsmydns.net

---

### ADIM 10: SSL Sertifikası (Let's Encrypt - Ücretsiz) (15 dakika)

```bash
# Certbot kurulumu
apt install -y certbot python3-certbot-nginx

# SSL sertifikası al (DNS ayarları yapıldıktan sonra!)
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Otomatik yenileme test
certbot renew --dry-run
```

**ÖNEMLİ:** DNS ayarları tamamlanmadan SSL sertifikası alamazsınız!

---

### ADIM 11: Nginx Yapılandırması (30 dakika)

```bash
# Nginx config dosyası oluştur
nano /etc/nginx/sites-available/zena
```

**İçeriği:**
```nginx
# HTTP'den HTTPS'e yönlendirme
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS konfigürasyonu
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL sertifikaları
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL ayarları
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Frontend (Next.js)
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

**Nginx'i Aktif Etme:**
```bash
# Symbolic link oluştur
ln -s /etc/nginx/sites-available/zena /etc/nginx/sites-enabled/

# Default config'i kaldır (opsiyonel)
rm /etc/nginx/sites-enabled/default

# Config test
nginx -t

# Nginx'i yeniden başlat
systemctl restart nginx

# Durum kontrolü
systemctl status nginx
```

**ÖNEMLİ:** `yourdomain.com` yerine kendi domain'inizi yazın!

---

### ADIM 12: Backup Sistemi Kurulumu (30 dakika)

```bash
# Backup klasörü oluştur
mkdir -p /var/backups/zena

# Backup script oluştur
nano /usr/local/bin/zena-backup.sh
```

**Script İçeriği:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/zena"
mkdir -p $BACKUP_DIR

# Database backup
PGPASSWORD='GÜÇLÜ_ŞİFRE_BURAYA' pg_dump -U zena_user -h localhost zena_db > $BACKUP_DIR/db_backup_$DATE.sql

# Dosya backup (uploads)
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz /var/www/zena-website/backend/wwwroot/uploads

# Eski backup'ları sil (30 günden eski)
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup tamamlandı: $DATE"
```

**Script'i Çalıştırılabilir Yapma:**
```bash
chmod +x /usr/local/bin/zena-backup.sh

# Test çalıştırma
/usr/local/bin/zena-backup.sh
```

**Otomatik Backup (Cron):**
```bash
# Cron job ekle
crontab -e

# Şunu ekle (her gün saat 02:00'de)
0 2 * * * /usr/local/bin/zena-backup.sh >> /var/log/zena-backup.log 2>&1
```

---

## ✅ GO-LIVE KONTROL LİSTESİ

### Deployment Öncesi
- [ ] Domain satın alındı
- [ ] Server/hosting alındı
- [ ] Server kurulumu tamamlandı
- [ ] Database kuruldu ve test edildi
- [ ] Kodlar server'a yüklendi
- [ ] Environment variables ayarlandı
- [ ] Backend build edildi ve çalışıyor
- [ ] Frontend build edildi ve çalışıyor
- [ ] DNS ayarları yapıldı (propagation bekleniyor)
- [ ] SSL sertifikası kuruldu
- [ ] Nginx yapılandırıldı
- [ ] Backup sistemi kuruldu

### Go-Live Sonrası (İlk 24 Saat)
- [ ] Site erişilebilir (https://yourdomain.com)
- [ ] HTTPS çalışıyor (kilit ikonu görünüyor)
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
pm2 logs zena-frontend
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

### Port Çakışması

```bash
# Hangi portlar kullanılıyor kontrol et
netstat -tulpn | grep LISTEN

# 3000 ve 5133 portlarının açık olduğundan emin ol
```

---

## 📊 MONİTORİNG (İsteğe Bağlı)

### Ücretsiz Monitoring Servisleri

1. **UptimeRobot** - uptimerobot.com
   - Site uptime kontrolü
   - Ücretsiz tier: 50 monitor

2. **Google Analytics** - analytics.google.com
   - Ziyaretçi istatistikleri

3. **Sentry** - sentry.io (Opsiyonel)
   - Hata takibi
   - Ücretsiz tier mevcut

---

## 💰 MALİYET ÖZETİ

### İlk Kurulum (Tek Seferlik)
- Domain: **50-200 TL/yıl**
- SSL: **0 TL** (Let's Encrypt ücretsiz)
- **Toplam:** ~50-200 TL

### Aylık Maliyetler
- VPS/Hosting: **200-500 TL/ay**
- Domain: **~5-15 TL/ay** (yıllık ücretin aylık karşılığı)
- **Toplam:** ~200-550 TL/ay

### Yıllık Toplam
- **İlk Yıl:** ~2,500-6,800 TL
- **Sonraki Yıllar:** ~2,400-6,600 TL/yıl

---

## 🔄 GÜNCELLEME SÜRECİ

### Kod Güncellemesi

```bash
# Server'a bağlan
ssh root@SERVER_IP

# Proje klasörüne git
cd /var/www/zena-website

# Git'ten çek (eğer Git kullanıyorsanız)
git pull origin main

# Backend güncelleme
cd backend
dotnet publish -c Release -o ./publish
systemctl restart zena-backend

# Frontend güncelleme
cd ../frontend
npm install
npm run build
pm2 restart zena-frontend
```

---

## 📞 DESTEK

### Yardımcı Dosyalar
- `DEPLOYMENT_GUIDE.md` - Detaylı deployment rehberi
- `TURKIYE_DEPLOYMENT_GUIDE.md` - Türkiye özel rehberi
- `PRODUCTION_CHECKLIST.md` - Production checklist
- `OPERATIONAL_CHECKLIST.md` - Operasyonel checklist

### Önemli Notlar
1. **DNS Propagation:** Türkiye'de genelde 2-6 saat sürer
2. **SSL Sertifikası:** Let's Encrypt otomatik yenilenir (90 günde bir)
3. **Backup:** İlk günden itibaren aktif olmalı
4. **Güvenlik:** Firewall kurallarını kontrol edin
5. **Monitoring:** UptimeRobot gibi servisler kullanın

---

## 🎯 ÖNERİLEN YOL HARİTASI

1. **Hafta 1:** Domain + Server seçimi ve kurulumu
2. **Hafta 2:** Kod deployment ve test
3. **Hafta 3:** Güvenlik kontrolleri ve optimizasyon
4. **Hafta 4:** Go-live ve monitoring

**Toplam Süre:** ~1 ay (hazırlık ve test dahil)

---

## ⚠️ ÖNEMLİ GÜVENLİK NOTLARI

1. **Şifreler:** Tüm şifreler güçlü olmalı (en az 16 karakter)
2. **JWT Key:** Güçlü ve rastgele olmalı
3. **Firewall:** Sadece gerekli portlar açık olmalı
4. **Backup:** Düzenli backup alınmalı
5. **Updates:** Sistem güncellemeleri düzenli yapılmalı
6. **SSL:** HTTPS zorunlu olmalı
7. **CORS:** Sadece gerekli domain'ler izin verilmeli

---

**Başarılar! 🚀**








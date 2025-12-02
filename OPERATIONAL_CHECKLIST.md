# 🚀 Operasyonel Checklist - Zena Website Production

## 📋 1. ALTYAPI VE HOSTING

### 1.1 Server/Hosting Seçimi
- [ ] **Hosting türü seçimi:**
  - [ ] VPS (Virtual Private Server) - Önerilen
  - [ ] Cloud Server (AWS, Azure, DigitalOcean, vb.)
  - [ ] Dedicated Server (yüksek trafik için)
  - [ ] Shared Hosting (önerilmez - yeterli kontrol yok)

- [ ] **Minimum Server Özellikleri:**
  - [ ] CPU: 2+ core
  - [ ] RAM: 4GB+ (8GB önerilir)
  - [ ] Disk: 50GB+ SSD
  - [ ] Bandwidth: Sınırsız veya yeterli
  - [ ] İşletim Sistemi: Ubuntu 22.04 LTS veya Debian 12 (önerilen)

### 1.2 Domain (Alan Adı)
- [ ] Domain satın alımı
  - [ ] Ana domain: `zenaenerji.com` veya benzeri
  - [ ] www subdomain'i dahil
  - [ ] Domain uzatma süresi (en az 1 yıl)
  
- [ ] DNS Ayarları
  - [ ] A Record: Ana domain → Server IP
  - [ ] A Record: www → Server IP
  - [ ] CNAME: api → Server IP (opsiyonel)
  - [ ] MX Records (e-posta için, gerekirse)

### 1.3 SSL Sertifikası
- [ ] SSL sertifikası kurulumu
  - [ ] Let's Encrypt (ücretsiz, önerilen)
  - [ ] Ücretli SSL (opsiyonel, daha fazla güven)
  - [ ] Wildcard SSL (subdomain'ler için)
  - [ ] Otomatik yenileme ayarı

## 🖥️ 2. SERVER KURULUMU VE YAPILANDIRMA

### 2.1 İşletim Sistemi Kurulumu
- [ ] Server'a erişim (SSH)
- [ ] Root kullanıcı şifresi değiştirme
- [ ] Yeni kullanıcı oluşturma (root yerine)
- [ ] SSH key authentication kurulumu
- [ ] Firewall kurulumu (UFW)
  - [ ] Port 22 (SSH) açık
  - [ ] Port 80 (HTTP) açık
  - [ ] Port 443 (HTTPS) açık
  - [ ] Diğer portlar kapalı

### 2.2 Gerekli Yazılımların Kurulumu
- [ ] **.NET Runtime (Backend için)**
  ```bash
  # .NET 9.0 Runtime kurulumu
  ```
  
- [ ] **Node.js (Frontend için)**
  ```bash
  # Node.js 20+ LTS kurulumu
  ```
  
- [ ] **PostgreSQL (Database)**
  ```bash
  # PostgreSQL 15+ kurulumu
  # Database oluşturma
  # Kullanıcı ve şifre ayarlama
  ```
  
- [ ] **Nginx (Reverse Proxy)**
  ```bash
  # Nginx kurulumu
  # Reverse proxy yapılandırması
  ```
  
- [ ] **Docker & Docker Compose (Opsiyonel ama önerilen)**
  ```bash
  # Docker kurulumu
  # Docker Compose kurulumu
  ```

### 2.3 Database Kurulumu
- [ ] PostgreSQL kurulumu
- [ ] Database oluşturma
- [ ] Kullanıcı ve yetkilendirme
- [ ] Backup klasörü oluşturma
- [ ] Otomatik backup script'i

## 📦 3. DEPLOYMENT (YAYINLAMA)

### 3.1 Kod Deployment
- [ ] **Git Repository**
  - [ ] Production branch oluşturma (main/master)
  - [ ] .gitignore kontrolü (sensitive dosyalar hariç)
  - [ ] Repository private mi? (önerilen)

- [ ] **Server'a Kod Aktarımı**
  - [ ] Git clone veya pull
  - [ ] Environment variable'ları ayarlama
  - [ ] Production config dosyalarını hazırlama

### 3.2 Build İşlemleri
- [ ] **Backend Build**
  ```bash
  cd backend
  dotnet restore
  dotnet build --configuration Release
  dotnet publish -c Release -o ./publish
  ```
  
- [ ] **Frontend Build**
  ```bash
  cd frontend
  npm install
  npm run build
  ```

### 3.3 Database Migration
- [ ] Production database oluşturma
- [ ] Migration'ları çalıştırma
  ```bash
  dotnet ef database update
  ```
- [ ] Seed data kontrolü (gerekirse)

### 3.4 Servisleri Başlatma
- [ ] **Backend Service**
  - [ ] Systemd service oluşturma
  - [ ] Otomatik başlatma ayarı
  - [ ] Log dosyaları yolu
  
- [ ] **Frontend Service**
  - [ ] PM2 veya systemd ile çalıştırma
  - [ ] Otomatik başlatma ayarı
  
- [ ] **Nginx Yapılandırması**
  - [ ] Reverse proxy ayarları
  - [ ] SSL yapılandırması
  - [ ] Static file serving

## 🌐 4. DNS VE NETWORK AYARLARI

### 4.1 DNS Yapılandırması
- [ ] Domain provider'da DNS ayarları
  - [ ] A Record: @ → Server IP
  - [ ] A Record: www → Server IP
  - [ ] TTL değeri ayarı (3600 önerilir)
  
- [ ] DNS propagation kontrolü
  - [ ] DNS propagation tool ile kontrol
  - [ ] Tüm DNS sunucularında güncellenmesini bekle (24-48 saat)

### 4.2 Network Ayarları
- [ ] Server firewall kuralları
- [ ] Port yönlendirme (80 → 3000, 443 → 3000)
- [ ] Load balancer (yüksek trafik için, opsiyonel)

## 📧 5. E-POSTA YAPILANDIRMASI

### 5.1 E-posta Servisi
- [ ] E-posta servisi seçimi
  - [ ] SMTP servisi (SendGrid, Mailgun, vb.)
  - [ ] Veya server'da mail server kurulumu
  
- [ ] E-posta yapılandırması
  - [ ] SMTP ayarları
  - [ ] E-posta gönderme testi
  - [ ] Spam kontrolü

### 5.2 İletişim E-postaları
- [ ] info@yourdomain.com
- [ ] support@yourdomain.com
- [ ] noreply@yourdomain.com (sistem e-postaları için)

## 🔄 6. BACKUP VE YEDEKLEME

### 6.1 Database Backup
- [ ] Otomatik backup script'i
- [ ] Günlük backup ayarı
- [ ] Backup saklama süresi (30 gün önerilir)
- [ ] Backup testi (restore işlemi)

### 6.2 Dosya Backup
- [ ] Upload edilen dosyaların yedeği
- [ ] Log dosyalarının yedeği
- [ ] Config dosyalarının yedeği

### 6.3 Backup Stratejisi
- [ ] Yerel backup (server'da)
- [ ] Uzak backup (cloud storage: AWS S3, Google Cloud, vb.)
- [ ] Backup şifreleme

## 📊 7. MONİTORİNG VE LOGGİNG

### 7.1 Uptime Monitoring
- [ ] Uptime monitoring servisi
  - [ ] UptimeRobot (ücretsiz)
  - [ ] Pingdom
  - [ ] StatusCake
  - [ ] Alert ayarları (e-posta/SMS)

### 7.2 Log Management
- [ ] Log dosyaları yolu
- [ ] Log rotation ayarları
- [ ] Log analiz aracı (opsiyonel)
- [ ] Error tracking (Sentry, vb.)

### 7.3 Performance Monitoring
- [ ] Server kaynak kullanımı (CPU, RAM, Disk)
- [ ] Application performance monitoring
- [ ] Database performance monitoring

## 🔧 8. MAINTENANCE VE BAKIM

### 8.1 Güncelleme Stratejisi
- [ ] Kod güncelleme prosedürü
- [ ] Database migration prosedürü
- [ ] Rollback planı (geri alma)

### 8.2 Düzenli Bakım
- [ ] Sistem güncellemeleri
- [ ] Güvenlik yamaları
- [ ] Dependency güncellemeleri
- [ ] Database optimizasyonu

### 8.3 Maintenance Window
- [ ] Bakım zamanı belirleme
- [ ] Kullanıcılara bildirim
- [ ] Maintenance mode sayfası

## 💰 9. MALİYET PLANLAMASI

### 9.1 Aylık Maliyetler
- [ ] **Hosting/Server:** ~$20-100/ay (VPS için)
- [ ] **Domain:** ~$10-20/yıl
- [ ] **SSL:** $0 (Let's Encrypt) veya ~$50-200/yıl
- [ ] **E-posta Servisi:** $0-20/ay (SendGrid free tier var)
- [ ] **Monitoring:** $0-10/ay (ücretsiz seçenekler var)
- [ ] **Backup Storage:** $0-10/ay (cloud storage)
- [ ] **CDN (Opsiyonel):** $0-20/ay

### 9.2 Toplam Tahmini
- **Minimum:** ~$25-50/ay
- **Orta Seviye:** ~$50-100/ay
- **Yüksek Trafik:** ~$100-200+/ay

## 📱 10. GO-LIVE (YAYINA ALMA)

### 10.1 Ön Kontroller
- [ ] Tüm testler tamamlandı
- [ ] Production environment hazır
- [ ] DNS propagation tamamlandı
- [ ] SSL sertifikası aktif
- [ ] Backup sistemi çalışıyor

### 10.2 Yayına Alma
- [ ] Maintenance mode aç
- [ ] Son kontrolleri yap
- [ ] Kod deploy et
- [ ] Database migration çalıştır
- [ ] Servisleri başlat
- [ ] Test et
- [ ] Maintenance mode kapat

### 10.3 Sonrası
- [ ] İlk 24 saat monitoring
- [ ] Kullanıcı geri bildirimleri
- [ ] Hata loglarını kontrol et
- [ ] Performance metrikleri

## 🎯 ÖNCELİK SIRASI

### 🔴 Acil (İlk Hafta)
1. Server/hosting seçimi ve kurulumu
2. Domain satın alma ve DNS ayarları
3. SSL sertifikası kurulumu
4. Kod deployment
5. Database kurulumu ve migration

### 🟡 Önemli (İlk Ay)
1. Backup sistemi kurulumu
2. Monitoring kurulumu
3. E-posta yapılandırması
4. Log management

### 🟢 İyileştirme (Sonrası)
1. CDN kurulumu (performans için)
2. Load balancer (yüksek trafik için)
3. Auto-scaling (cloud için)
4. Advanced monitoring

## 📚 ÖNERİLEN SERVİSLER

### Hosting/VPS
- **DigitalOcean** - $6-12/ay başlangıç
- **Linode** - $5-12/ay başlangıç
- **Vultr** - $6-12/ay başlangıç
- **AWS Lightsail** - $3.50-10/ay başlangıç
- **Hetzner** - €4-10/ay (Avrupa)

### Domain
- **Namecheap** - Uygun fiyatlı
- **GoDaddy** - Yaygın
- **Cloudflare** - DNS + güvenlik

### SSL
- **Let's Encrypt** - Ücretsiz (önerilen)
- **Cloudflare** - Ücretsiz SSL + CDN

### E-posta
- **SendGrid** - 100 e-posta/gün ücretsiz
- **Mailgun** - 5,000 e-posta/ay ücretsiz
- **Amazon SES** - Çok uygun fiyatlı

### Monitoring
- **UptimeRobot** - 50 monitor ücretsiz
- **Pingdom** - Ücretsiz tier var
- **Sentry** - Error tracking (ücretsiz tier)

## ⚠️ ÖNEMLİ NOTLAR

1. **DNS Propagation:** 24-48 saat sürebilir, sabırlı olun
2. **SSL Sertifikası:** Let's Encrypt otomatik yenilenmeli
3. **Backup:** İlk günden itibaren aktif olmalı
4. **Monitoring:** Go-live'dan önce kurulmalı
5. **Test:** Production'da test yapmadan canlıya almayın

## 🔗 İLGİLİ DÖKÜMANLAR

- **Güvenlik:** `PRODUCTION_CHECKLIST.md`
- **Deployment:** `DEPLOYMENT_GUIDE.md`
- **Güvenlik Özeti:** `SECURITY_SUMMARY.md`


# Zena Enerji Web Sitesi

Zena Enerji şirketi için Next.js tabanlı modern web sitesi ve yıllık izin yönetim sistemi.

## Özellikler

### 🌐 Web Sitesi
- Modern ve responsive tasarım
- Framer Motion animasyonları
- Tailwind CSS ile styling
- SEO optimizasyonu
- Hızlı sayfa yükleme

### 👥 Kullanıcı Yönetimi
- JWT tabanlı kimlik doğrulama
- Rol tabanlı erişim kontrolü (Çalışan/Yönetici)
- Güvenli şifre hashleme
- Oturum yönetimi

### 📝 İzin Yönetim Sistemi
- **Çalışan Paneli:**
  - İzin talebi oluşturma
  - Kendi izin taleplerini görüntüleme
  - İzin istatistikleri
  - Bekleyen talepleri silme

- **Yönetici Paneli:**
  - Tüm izin taleplerini görüntüleme
  - İzin taleplerini onaylama/reddetme
  - Filtreleme (Tümü, Bekleyen, Onaylanan, Reddedilen)
  - İstatistikler

## Teknoloji Stack

### Frontend
- **Next.js 15** - React framework
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **Framer Motion** - Animasyonlar
- **JavaScript** - Programlama dili

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Veritabanı
- **Prisma** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- PostgreSQL (v12 veya üzeri)
- npm veya yarn

### Adımlar

1. **Frontend'i başlatın:**
   ```bash
   cd Zenaweb
   npm install
   npm run dev
   ```

2. **Backend'i başlatın:**
   ```bash
   cd Zenabackend
   npm install
   npm run dev
   ```

3. **Veritabanını yapılandırın:**
   - PostgreSQL'de `zenadev` adında veritabanı oluşturun
   - Backend otomatik olarak tabloları oluşturacak ve test verilerini yükleyecek

## Kullanım

### Test Kullanıcıları

#### Yönetici
- **Kullanıcı adı:** admin
- **Şifre:** admin123
- **Erişim:** Tüm izin taleplerini yönetebilir

#### Çalışanlar
- **Kullanıcı adı:** calisan1
- **Şifre:** employee123
- **Erişim:** Sadece kendi izin taleplerini yönetebilir

- **Kullanıcı adı:** calisan2
- **Şifre:** employee123
- **Erişim:** Sadece kendi izin taleplerini yönetebilir

### Sayfa Yapısı

- `/` - Ana sayfa
- `/calisan-girisi` - Giriş sayfası
- `/calisan-paneli` - Çalışan paneli
- `/yonetici-paneli` - Yönetici paneli
- `/hakkimizda` - Hakkımızda
- `/hizmetler` - Hizmetler
- `/projelerimiz` - Projelerimiz
- `/haberler` - Haberler
- `/blog` - Blog
- `/kariyer` - Kariyer
- `/iletisim` - İletişim

## API Endpoints

### Authentication
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/register` - Kullanıcı kaydı
- `GET /api/auth/profile` - Kullanıcı profili

### Leave Management
- `POST /api/leave/request` - İzin talebi oluştur
- `GET /api/leave/my-requests` - Kendi izin taleplerini getir
- `GET /api/leave/all-requests` - Tüm izin taleplerini getir (admin)
- `PUT /api/leave/:id/approve` - İzin talebini onayla (admin)
- `PUT /api/leave/:id/reject` - İzin talebini reddet (admin)
- `DELETE /api/leave/:id` - İzin talebini sil

## Geliştirme

### Frontend Geliştirme
```bash
cd Zenaweb
npm run dev
```

### Backend Geliştirme
```bash
cd Zenabackend
npm run dev
```

### Veritabanı İşlemleri
```bash
cd Zenabackend
npm run db:migrate  # Migrasyonları çalıştır
npm run db:seed     # Test verilerini yükle
npm run db:generate # Prisma client'ı oluştur
```

## Proje Yapısı

```
ZenaWebsitesi/
├── Zenaweb/                 # Frontend (Next.js)
│   ├── app/
│   │   ├── components/      # React bileşenleri
│   │   ├── calisan-girisi/  # Giriş sayfası
│   │   ├── calisan-paneli/  # Çalışan paneli
│   │   ├── yonetici-paneli/ # Yönetici paneli
│   │   └── ...
│   ├── lib/
│   │   └── api.js          # API servis fonksiyonları
│   └── ...
└── Zenabackend/            # Backend (Node.js)
    ├── src/
    │   ├── controllers/    # API controllers
    │   ├── services/       # Business logic
    │   ├── routes/         # API routes
    │   ├── middleware/     # Middleware functions
    │   └── prisma/         # Database schema & seed
    └── ...
```

## Lisans

ISC License
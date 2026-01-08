# 📚 Zena Website Projesi - Kullanılan Diller ve Teknolojiler

## 🎯 Genel Bakış

Bu dokümantasyon, Zena Website projesinde baştan sona kullanılan tüm programlama dilleri, işaretleme dilleri, konfigürasyon dilleri ve teknolojileri detaylı olarak açıklar.

---

## 📊 KULLANILAN DİLLER VE AŞAMALARI

### 1. 🔵 C# (C-Sharp) - Backend Geliştirme

**Kullanım Aşaması:** Backend API Geliştirme (Ana Backend Dili)

**Kullanıldığı Yerler:**
- **Backend API:** Tüm backend mantığı
- **Controllers:** API endpoint'leri (`AuthController.cs`, `UserController.cs`, vb.)
- **Services:** İş mantığı (`AuthService.cs`, `UserService.cs`, vb.)
- **Models:** Veritabanı modelleri (`User.cs`, `LeaveRequest.cs`, vb.)
- **DTOs:** Veri transfer nesneleri (`LoginDto.cs`, `UserResponseDto.cs`, vb.)
- **Middleware:** Özel middleware'ler (`GlobalExceptionHandler.cs`, `RateLimitingMiddleware.cs`)
- **Data:** Veritabanı context (`ApplicationDbContext.cs`)
- **Migrations:** Entity Framework migrations

**Framework:** .NET 9.0 (ASP.NET Core)

**Dosya Sayısı:** ~65+ C# dosyası

**Örnek Dosyalar:**
```
backend/
├── Controllers/
│   ├── AuthController.cs
│   ├── UserController.cs
│   ├── LeaveController.cs
│   └── InternshipController.cs
├── Services/
│   ├── AuthService.cs
│   ├── UserService.cs
│   └── LeaveService.cs
├── Models/
│   ├── User.cs
│   └── LeaveRequest.cs
└── Program.cs (Ana giriş noktası)
```

**Kullanılan Kütüphaneler:**
- Entity Framework Core (ORM)
- JWT Authentication
- BCrypt (Şifre hashleme)
- Serilog (Logging)
- OpenTelemetry (Monitoring)
- Swagger (API dokümantasyonu)

---

### 2. 🟡 JavaScript (JS) - Frontend Geliştirme

**Kullanım Aşaması:** Frontend Web Uygulaması (Ana Frontend Dili)

**Kullanıldığı Yerler:**
- **React Components:** Tüm UI bileşenleri
- **Next.js Pages:** Sayfa yapıları
- **API Routes:** Next.js API route'ları
- **Utilities:** Yardımcı fonksiyonlar

**Framework:** Next.js 15.5.5 (React 19.1.0 tabanlı)

**Dosya Sayısı:** ~53+ JavaScript dosyası

**Örnek Dosyalar:**
```
frontend/app/
├── page.js (Ana sayfa)
├── layout.js (Layout)
├── components/
│   ├── Header.js
│   └── Footer.js
├── panel/
│   ├── page.js
│   └── components/
│       ├── Dashboard.js
│       └── Sidebar.js
└── api/
    ├── auth/login/route.js
    └── contact/submit/route.js
```

**Kullanılan Kütüphaneler:**
- React 19.1.0
- Next.js 15.5.5
- Framer Motion (Animasyonlar)
- jsonwebtoken (JWT işlemleri)

**JavaScript Özellikleri:**
- ES6+ syntax
- Async/Await
- React Hooks
- Server Components (Next.js)

---

### 3. 🟢 SQL (Structured Query Language) - Veritabanı

**Kullanım Aşaması:** Veritabanı Yönetimi ve Sorgulama

**Kullanıldığı Yerler:**
- **Entity Framework Migrations:** Otomatik SQL üretimi
- **Database Seeder:** İlk veri yükleme
- **Manuel Sorgular:** Gerekli durumlarda

**Veritabanı:** PostgreSQL 15

**Kullanım Şekli:**
- Entity Framework Core ile Code-First yaklaşımı
- Migration dosyaları otomatik SQL üretir
- `DatabaseSeeder.cs` içinde SQL komutları

**Örnek Kullanım:**
```csharp
// Entity Framework ile SQL otomatik üretilir
context.Users.Add(new User { ... });
context.SaveChanges(); // SQL'e çevrilir
```

**Migration Dosyaları:**
```
backend/Migrations/
├── 20251108071515_Initial.cs (İlk migration)
├── 20251118143809_Documents.cs
└── ApplicationDbContextModelSnapshot.cs
```

---

### 4. 🎨 CSS (Cascading Style Sheets) - Stil Tanımlama

**Kullanım Aşaması:** UI Stil Tanımlamaları

**Kullanıldığı Yerler:**
- **Global Styles:** `globals.css`
- **Tailwind CSS:** Utility-first CSS framework
- **Component Styles:** Inline styles ve Tailwind classes

**Framework:** Tailwind CSS 4.0

**Dosyalar:**
```
frontend/app/
└── globals.css (Ana CSS dosyası)
```

**CSS Özellikleri:**
- Tailwind CSS utility classes
- CSS Variables (Custom properties)
- Responsive design
- Dark mode desteği

**Kullanım Şekli:**
```jsx
// Tailwind CSS classes ile
<div className="bg-white text-gray-900 p-4 rounded-lg">
  {/* Component */}
</div>
```

---

### 5. 📄 JSON (JavaScript Object Notation) - Konfigürasyon

**Kullanım Aşaması:** Konfigürasyon ve Veri Formatı

**Kullanıldığı Yerler:**
- **Package Management:** `package.json`, `package-lock.json`
- **Backend Config:** `appsettings.json`, `appsettings.Development.json`
- **Data Files:** `cities.json`
- **Project Config:** `jsconfig.json`, `launchSettings.json`

**Dosyalar:**
```
frontend/
├── package.json (NPM dependencies)
└── data/cities.json (Şehir verileri)

backend/
├── appsettings.json (Ana config)
├── appsettings.Development.json (Dev config)
└── Properties/launchSettings.json (Launch ayarları)
```

**Kullanım Amaçları:**
- Dependency yönetimi
- Environment variables
- Uygulama ayarları
- Veri depolama

---

### 6. 📋 YAML (YAML Ain't Markup Language) - Konfigürasyon

**Kullanım Aşaması:** Docker ve Monitoring Konfigürasyonu

**Kullanıldığı Yerler:**
- **Docker Compose:** Container orchestration
- **Monitoring Config:** Prometheus, Grafana, OpenTelemetry

**Dosyalar:**
```
docker-compose.yml (Ana Docker config)
docker-compose-observer.yml (Monitoring için)
config/
├── prometheus.yml (Metrics config)
├── tempo.yml (Tracing config)
├── otel-collector.yml (OpenTelemetry config)
└── dataSource.yml (Grafana data source)
```

**Kullanım Amaçları:**
- Docker container tanımlamaları
- Monitoring sistem konfigürasyonları
- Service discovery

---

### 7. 🐳 Dockerfile - Container Tanımlama

**Kullanım Aşaması:** Containerization ve Deployment

**Kullanıldığı Yerler:**
- **Backend Container:** .NET uygulaması için
- **Frontend Container:** Next.js uygulaması için

**Dosyalar:**
```
backend/Dockerfile (Backend container)
frontend/Dockerfile (Frontend container)
```

**Dil:** Dockerfile syntax (özel syntax)

**Kullanım:**
- Multi-stage builds
- Production optimizasyonu
- Dependency yönetimi

---

### 8. 📝 Markdown (MD) - Dokümantasyon

**Kullanım Aşaması:** Proje Dokümantasyonu

**Kullanıldığı Yerler:**
- **Deployment Guides:** Deployment rehberleri
- **Checklists:** Production ve operational checklist'ler
- **README Files:** Proje açıklamaları

**Dosyalar:**
```
DEPLOYMENT_BASLANGIC_REHBERI.md
DEPLOYMENT_GUIDE.md
TURKIYE_DEPLOYMENT_GUIDE.md
PRODUCTION_CHECKLIST.md
OPERATIONAL_CHECKLIST.md
SECURITY_SUMMARY.md
frontend/README.md
backend/wwwroot/readme.md
```

**Kullanım Amaçları:**
- Proje dokümantasyonu
- Deployment rehberleri
- Checklist'ler
- Notlar

---

### 9. 🔧 XML (eXtensible Markup Language) - Proje Konfigürasyonu

**Kullanım Aşaması:** .NET Proje Konfigürasyonu

**Kullanıldığı Yerler:**
- **Project Files:** `.csproj` dosyaları
- **Solution Files:** `.sln` dosyaları

**Dosyalar:**
```
backend/Zenabackend.csproj (Proje dosyası)
backend/Zenabackend.sln (Solution dosyası)
```

**Kullanım:**
- NuGet package referansları
- Build ayarları
- Target framework tanımlamaları

---

### 10. ⚙️ MJS (ES Modules) - JavaScript Modül Konfigürasyonu

**Kullanım Aşaması:** Next.js ve PostCSS Konfigürasyonu

**Kullanıldığı Yerler:**
- **Next.js Config:** `next.config.mjs`
- **PostCSS Config:** `postcss.config.mjs`

**Dosyalar:**
```
frontend/next.config.mjs (Next.js ayarları)
frontend/postcss.config.mjs (PostCSS ayarları)
```

**Kullanım:**
- ES6 module syntax
- Next.js yapılandırması
- PostCSS plugin ayarları

---

## 🏗️ PROJE MİMARİSİ VE DİL KULLANIMI

### Backend Katmanı (C#)
```
┌─────────────────────────────────┐
│   Controllers (C#)              │  ← API Endpoints
├─────────────────────────────────┤
│   Services (C#)                 │  ← İş Mantığı
├─────────────────────────────────┤
│   Models (C#)                   │  ← Veri Modelleri
├─────────────────────────────────┤
│   DTOs (C#)                     │  ← Veri Transfer
├─────────────────────────────────┤
│   Data/Context (C#)             │  ← EF Core
├─────────────────────────────────┤
│   Middleware (C#)               │  ← Custom Middleware
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│   PostgreSQL (SQL)             │  ← Veritabanı
└─────────────────────────────────┘
```

### Frontend Katmanı (JavaScript/React)
```
┌─────────────────────────────────┐
│   Pages (JS/React)              │  ← Sayfalar
├─────────────────────────────────┤
│   Components (JS/React)         │  ← UI Bileşenleri
├─────────────────────────────────┤
│   API Routes (JS)               │  ← Next.js API
├─────────────────────────────────┤
│   Styles (CSS/Tailwind)         │  ← Stil Tanımları
└─────────────────────────────────┘
```

---

## 📈 DİL KULLANIM ORANLARI (Tahmini)

| Dil/Format | Kullanım Oranı | Dosya Sayısı | Aşama |
|------------|----------------|--------------|-------|
| **C#** | ~35% | 65+ | Backend |
| **JavaScript** | ~30% | 53+ | Frontend |
| **CSS** | ~10% | 1+ | Styling |
| **JSON** | ~8% | 7+ | Config |
| **YAML** | ~5% | 6+ | Docker/Monitoring |
| **Markdown** | ~7% | 8+ | Dokümantasyon |
| **SQL** | ~3% | Migration'lar | Database |
| **XML** | ~1% | 2+ | .NET Config |
| **Dockerfile** | ~1% | 2+ | Containerization |

---

## 🔄 GELİŞTİRME AŞAMALARI VE DİL KULLANIMI

### 1. **Planlama Aşaması**
- **Markdown:** Proje planı, dokümantasyon
- **YAML:** Docker planlaması

### 2. **Backend Geliştirme**
- **C#:** API geliştirme
- **SQL:** Veritabanı tasarımı (EF Core ile)
- **JSON:** Backend konfigürasyonu

### 3. **Frontend Geliştirme**
- **JavaScript/React:** UI geliştirme
- **CSS/Tailwind:** Stil tanımlamaları
- **JSON:** Frontend konfigürasyonu

### 4. **Entegrasyon**
- **JavaScript:** API entegrasyonu
- **C#:** CORS ve güvenlik ayarları

### 5. **Deployment Hazırlığı**
- **Dockerfile:** Container tanımlamaları
- **YAML:** Docker Compose konfigürasyonu
- **Markdown:** Deployment rehberleri

### 6. **Monitoring ve Logging**
- **YAML:** Monitoring konfigürasyonları
- **C#:** Serilog ve OpenTelemetry entegrasyonu

---

## 🛠️ TEKNOLOJİ STACK ÖZETİ

### Backend Stack
- **Dil:** C# (.NET 9.0)
- **Framework:** ASP.NET Core
- **ORM:** Entity Framework Core
- **Database:** PostgreSQL
- **Authentication:** JWT Bearer
- **Logging:** Serilog
- **Monitoring:** OpenTelemetry, Prometheus

### Frontend Stack
- **Dil:** JavaScript (ES6+)
- **Framework:** React 19.1.0
- **Meta Framework:** Next.js 15.5.5
- **Styling:** Tailwind CSS 4.0
- **Animations:** Framer Motion
- **Build Tool:** Turbopack

### DevOps Stack
- **Containerization:** Docker
- **Orchestration:** Docker Compose
- **Monitoring:** Prometheus, Grafana, Loki
- **Tracing:** Tempo, OpenTelemetry

### Development Tools
- **Version Control:** Git
- **Package Managers:** NuGet (C#), NPM (JavaScript)
- **Build Tools:** .NET CLI, NPM Scripts

---

## 📚 ÖĞRENME KAYNAKLARI

### C# ve .NET
- Microsoft Docs: https://docs.microsoft.com/dotnet
- ASP.NET Core Docs: https://docs.microsoft.com/aspnet/core

### JavaScript ve React
- React Docs: https://react.dev
- Next.js Docs: https://nextjs.org/docs

### PostgreSQL
- PostgreSQL Docs: https://www.postgresql.org/docs

### Docker
- Docker Docs: https://docs.docker.com

---

## ✅ SONUÇ

Bu proje, modern full-stack web geliştirme için gerekli tüm teknolojileri içeren kapsamlı bir yapıya sahiptir:

- **Backend:** C# ile güçlü ve ölçeklenebilir API
- **Frontend:** JavaScript/React ile modern ve responsive UI
- **Database:** PostgreSQL ile güvenilir veri yönetimi
- **DevOps:** Docker ile kolay deployment
- **Monitoring:** Kapsamlı gözlemleme ve loglama

Tüm bu teknolojiler bir araya gelerek, production-ready bir web uygulaması oluşturulmuştur.

---

**Son Güncelleme:** 2024
**Proje Versiyonu:** 1.0.0



















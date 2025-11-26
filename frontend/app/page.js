
// Ana sayfa bileşeni - Zena Enerji web sitesinin giriş sayfası
// Bu sayfa hero section, hizmetler, istatistikler ve diğer ana bölümleri içerir

'use client'; // Client-side bileşen - Framer Motion animasyonları için gerekli

import Header from './components/Header'; // Header bileşenini import ediyoruz
import Footer from './components/Footer'; // Footer bileşenini import ediyoruz
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Framer Motion - animasyonlar için

const sliderItems = [
  {
    id: 1,
    title: 'Güneş Enerjisinden Elektrik Üretin!',
    description:
      'Güneş enerjisi ile yüksek elektrik maliyetinden kurtulabilirsiniz. Zena Enerji profesyonel proje ve teknik ekibi ile bu sorunlara çözüm kaynağı olmaktadır.',
    buttonLabel: 'Daha fazla bilgi için',
    href: '/iletisim',
    image: '/slider/solar-banner.jpg',
  },
  {
    id: 2,
    title: 'Veriminizi Maksimuma Çıkarın!',
    description:
      "Güneş enerjisi paneli ve santralinizin verimini ölçmek ve raporlamalarını yapmak amacıyla insansız hava aracı ile termal testlerini gerçekleştiriyoruz. Bu verileri Singapur'lu iş ve çözüm ortağımız AVA Asia ile paylaşarak görüntü işleme ve yapay zekayla birlikte kısa sürede raporluyoruz.",
    buttonLabel: 'Daha fazla bilgi için',
    href: '/hizmetler',
    image: '/slider/2.png?v=2',
  },
  {
    id: 3,
    title: 'Proje Geliştirme',
    description:
      'Zena Enerji; güneş enerji sektöründe proje geliştirme, imar uygulamaları, saha kurulumu, geçici kabul işlemleri konusunda uluslararası saygın firmalar ile çalışarak Lisanslı, Lisanssız birçok büyük ve ses getiren projelerin mimarı olmuştur.',
    buttonLabel: 'Daha fazla bilgi için',
    href: '/projelerimiz',
    image: '/slider/1.jpg',
  },
  {
    id: 4,
    title: 'Fizibilite ve Teknik Raporlama',
    description:
      'Fizibilite uygulama ve teknik raporlama süreçleri, konusunda uzman mühendis ve deneyimli tekniker ekibimiz ile birlikte tamamlanarak, tarafınıza sunulmaktadır.',
    buttonLabel: 'Daha fazla bilgi için',
    href: '/hizmetler',
    image: '/slider/Fizibilite.jpg',
  },
  {
    id: 5,
    title: 'Danışmanlık Hizmetleri',
    description:
      'Ön fizibilite çalışmalarını yaparak güneş enerjisi kaynaklarının belirlenmesini, teknik ve çevresel faktörlerin tespit edilmesini ve santralın maliyetinin hesaplanmasını yapan şirketimiz ardından fizibilite çalışmalarını yaparak güneş enerjisi santrali sektörüne girmek isteyen yatırımcılara kapsamlı bir danışmanlık hizmeti vermektedir.',
    buttonLabel: 'Daha fazla bilgi için',
    href: '/hakkimizda',
    image: '/slider/4.jpg',
  },
];

const serviceCards = [
  {
    title: 'Proje Geliştirme',
    iconBg: 'bg-[#f9a826]',
    icon: (
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <path d="M13.5 13.5h7v7h-7z" />
        <path d="M13.5 13.5l7 7" />
      </svg>
    ),
  },
  {
    title: 'İmar Uygulamaları',
    iconBg: 'bg-[#2fafa2]',
    icon: (
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s5-5.2 5-9.2a5 5 0 10-10 0c0 4 5 9.2 5 9.2z" />
        <path d="M9.5 11.5h5" />
        <path d="M12 9v5" />
      </svg>
    ),
  },
  {
    title: 'Saha Kurulumları',
    iconBg: 'bg-[#1f68a5]',
    icon: (
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11h18l-2 7H5z" />
        <path d="M7 11l2-5h6l2 5" />
        <path d="M8 15h8" />
      </svg>
    ),
  },
  {
    title: 'İHA ile Termal Test',
    iconBg: 'bg-[#f9a826]',
    icon: (
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2.2" />
        <path d="M4 9h5l1.5-3h3L15 9h5" />
        <path d="M4 15h5l1.5 3h3l1.5-3h5" />
        <path d="M6 9l-2-2M6 15l-2 2M18 9l2-2M18 15l2 2" />
      </svg>
    ),
  },
  {
    title: 'İşletme ve Bakım',
    iconBg: 'bg-[#f06b5b]',
    icon: (
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 3h4l-1 4h-2z" />
        <path d="M8 8h8l1 5v5H7v-5z" />
        <path d="M7 18l-1.5 3M17 18l1.5 3" />
        <path d="M9 12h6" />
      </svg>
    ),
  },
  {
    title: 'Danışmanlık ve Teknik İnceleme',
    iconBg: 'bg-[#14395b]',
    icon: (
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 9a3 3 0 116 0v1.5" />
        <path d="M5 13l4 4c.8.8 2.2.8 3 0l2-2" />
        <path d="M19 11l-4 4" />
        <path d="M4 9l-1 3 4 4" />
        <path d="M13 5h4l4 4v4" />
      </svg>
    ),
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dragStartX, setDragStartX] = useState(null);

  const goToSlide = (index) => {
    const total = sliderItems.length;
    setCurrentSlide((index + total) % total);
  };

  const handlePrev = () => goToSlide(currentSlide - 1);
  const handleNext = () => goToSlide(currentSlide + 1);

  const startDrag = (x) => setDragStartX(x);
  const endDrag = (x) => {
    if (dragStartX === null) return;
    const distance = x - dragStartX;
    if (distance > 60) {
      handlePrev();
    } else if (distance < -60) {
      handleNext();
    }
    setDragStartX(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Header bileşeni - tüm sayfalarda ortak */}
      <Header />
      
      {/* Hero Slider Section */}
      <section className="relative h-screen overflow-hidden -mt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${sliderItems[currentSlide].image})` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div
          className="relative z-10 flex h-full items-center justify-center px-6"
          onMouseDown={(e) => startDrag(e.clientX)}
          onMouseUp={(e) => endDrag(e.clientX)}
          onMouseLeave={() => setDragStartX(null)}
          onTouchStart={(e) => startDrag(e.touches[0].clientX)}
          onTouchEnd={(e) => endDrag(e.changedTouches[0].clientX)}
        >
          <button
            onClick={handlePrev}
            aria-label="Önceki slayt"
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 transition"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={sliderItems[currentSlide].id}
              className="text-center text-white max-w-3xl px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.35 }}
            >
              <motion.h1
                className="text-3xl md:text-4xl font-bold mb-5"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
              >
                {sliderItems[currentSlide].title}
              </motion.h1>
              <motion.p
                className="text-base md:text-lg mb-7 leading-relaxed text-white/85"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.12 }}
              >
                {sliderItems[currentSlide].description}
              </motion.p>
              <motion.a
                href={sliderItems[currentSlide].href}
                className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-7 rounded-full text-sm md:text-base transition"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.18 }}
              >
                {sliderItems[currentSlide].buttonLabel}
              </motion.a>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={handleNext}
            aria-label="Sonraki slayt"
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 transition"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="absolute bottom-12 inset-x-0 flex justify-center flex-wrap gap-3 z-10">
          {sliderItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => goToSlide(index)}
              className={`h-1.5 w-8 rounded-full transition-all ${index === currentSlide ? 'bg-white' : 'bg-white/40'}`}
              aria-label={`${item.title} slaytı`}
            />
          ))}
        </div>
      </section>
      {/* Zena Enerji ile Tam Hizmet + Drone görselli bölüm (drone görseli kalsın) */}
      <section className="py-16 bg-[#f9f6f0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center text-center lg:items-center lg:text-center w-full">
            <div className="max-w-2xl">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-5">Zena Enerji ile Tam Hizmet</h2>
              <p className="text-xs md:text-sm text-gray-700 mb-8 leading-relaxed">
              Zena Enerji olarak, güneş enerjisi sektöründe proje geliştirme, proje uygulama, imar uygulamaları, saha kurulumu,
              geçici kabul işlemleri, danışmanlık ve müşterilerimizin portföy verimliliğini en üst düzeye çıkarmak için
              kapsamlı hizmet sunuyoruz. Güneş PV tesislerindeki sorunları anlamaya yardımcı olmak amacıyla İHA’lar ile
              inceleme ve İHA’larda bulunan termal kamera ile havadan denetim yapılmaktadır.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-2xl mx-auto justify-items-center mt-2">
              {serviceCards.map((card) => (
                <div key={card.title} className="flex flex-col items-center text-center gap-3">
                  <div className={`w-16 h-16 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.06)] ${card.iconBg}`}>
                    {card.icon}
                  </div>
                  <p className="text-gray-900 font-semibold text-[10px] sm:text-[11px] tracking-wide">{card.title}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-full h-72 md:h-[380px] rounded-xl overflow-hidden shadow-lg lg:ml-10 xl:ml-16">
            <img src="/dron-operator.jpg" alt="Drone ile denetim" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Türkiye'de Güneş Enerjisi İstatistikleri Bölümü */}
      <StatsScrollReveal />

      {/* Solar Güç Hesaplama CTA (görselli banner) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden">
            <img src="/solar-hesabi.jpg" alt="Solar güç hesabı" className="w-full h-[360px] object-cover" />
            <div className="absolute inset-0 bg-black/45"></div>
            <div className="absolute inset-0 flex items-center">
              <div className="px-8 md:px-14 max-w-xl">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Solar Güç Simulasyonu Hesabı</h3>
                <p className="text-white/90 mb-6">Kurulu gücünüzü, panel sayınızı, kurtarılan ağaç sayınızı hesaplayabilirsiniz...</p>
                <a href="/simulasyon" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg">Şimdi Hesapla</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Radyasyon haritası bölümü KALDIRILDI */}

      {/* Footer bileşeni - tüm sayfalarda ortak */}
      <Footer />
    </div>
  );
}

function StatsScrollReveal() {
  const stats = [
    { value: '108861', suffix: 'MW', label: "Türkiye'nin Kurulu Gücü" },
    { value: '13602', suffix: 'MW', label: 'Güneş Enerji Santralleri Kurulu Gücü' },
    { value: '11933', suffix: 'Adet', label: 'Güneş Enerjisi Santralleri Sayısı' },
    { value: '18000', suffix: 'MW', label: '2025 Minimum Kurulu Güç Hedefi' },
  ];

  return (
    <section id="istatistikler" className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[28px] shadow-xl border border-gray-100 px-6 py-9 md:px-10 md:py-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Türkiye'de Güneş Enerjisi</h2>
            <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
              Enerji Bakanlığı'nın güneş enerjisi potansiyel atlasına göre Türkiye'de yıllık toplam güneşlenme süresi 2.737 saat,
              yıllık toplam gelen güneş enerjisi 1.527 kWh/m²·yıl olarak hesaplanıyor. Bu potansiyeli en verimli şekilde değerlendirmek için çalışıyoruz.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shadow-md">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {new Intl.NumberFormat('tr-TR').format(Number(stat.value))}
                  <span className="text-orange-500 text-sm font-semibold ml-1">{stat.suffix}</span>
                </div>
                <p className="text-[11px] md:text-xs text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

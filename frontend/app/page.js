
// Ana sayfa bileşeni - Zena Enerji web sitesinin giriş sayfası
// Bu sayfa hero section, hizmetler, istatistikler ve diğer ana bölümleri içerir

'use client'; // Client-side bileşen - Framer Motion animasyonları için gerekli

import Header from './components/Header'; // Header bileşenini import ediyoruz
import Footer from './components/Footer'; // Footer bileşenini import ediyoruz
import { motion } from 'framer-motion'; // Framer Motion - animasyonlar için

const serviceCards = [
  {
    title: 'Proje Geliştirme',
    icon: (
      <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6m12-7H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2z" />
      </svg>
    ),
  },
  {
    title: 'İmar Uygulamaları',
    icon: (
      <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V12m0 0l8-5-8-5-8 5 8 5zm0 0v10m0-10l8-5M12 12L4 7" />
      </svg>
    ),
  },
  {
    title: 'Saha Kurulumları',
    icon: (
      <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 15h16M10 11h4m-9 8h14l-2 3H7l-2-3z" />
      </svg>
    ),
  },
  {
    title: 'İHA ile Termal Test',
    icon: (
      <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12L3 9m2 3l-2 3m14-3l2-3m-2 3l2 3M9 5l3-2 3 2M9 19l3 2 3-2" />
      </svg>
    ),
  },
  {
    title: 'İşletme ve Bakım',
    icon: (
      <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 2v4m2 0V2m7 9h-4m0 2h4m-4 2h2.5a1.5 1.5 0 010 3H19m-8 4v-4m-2 4H7a3 3 0 01-3-3v-1m0 0H2m2 0h4m1-4H6m0 0V8a4 4 0 014-4h4a4 4 0 014 4v4" />
      </svg>
    ),
  },
  {
    title: 'Danışmanlık ve Teknik İnceleme',
    icon: (
      <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2 4 4m-6-2l-4-4-4 4m8-10l4 4-4 4-4-4 4-4zm0 0V2m0 6v6" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Header bileşeni - tüm sayfalarda ortak */}
      <Header />
      
      {/* Hero Section - Ana görsel ve başlık alanı (solar-banner burada) */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/solar-banner.jpg")' }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        {/* Hero içeriği - görselin üzerine yerleştirilmiş */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }} // Başlangıç durumu - görünmez ve aşağıda
            animate={{ opacity: 1, y: 0 }} // Animasyon sonrası - görünür ve normal pozisyonda
            transition={{ duration: 1, delay: 0.2 }} // 1 saniye süre, 0.2 saniye gecikme
          >
            Güneş Enerjisinden Elektrik Üretin!
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Güneş enerjisi ile yüksek elektrik maliyetinden kurtulabilirsiniz. Zena Enerji profesyonel proje ve teknik ekibi ile bu sorunlara çözüm kaynağı olmaktadır.
          </motion.p>
          
          {/* Call-to-action butonu */}
          <motion.button 
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ scale: 1.05 }} // Hover animasyonu - büyütme
            whileTap={{ scale: 0.95 }} // Tıklama animasyonu - küçültme
          >
            Daha Fazla Bilgi
          </motion.button>
        </div>
      </section>

      {/* Zena Enerji ile Tam Hizmet + Drone görselli bölüm (drone görseli kalsın) */}
      <section className="py-20 bg-gradient-to-b from-white via-gray-50/80 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center text-center lg:items-center lg:text-center w-full">
            <div className="max-w-3xl">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Zena Enerji ile Tam Hizmet</h2>
              <p className="text-sm md:text-base text-gray-700 mb-8">
              Zena Enerji olarak, güneş enerjisi sektöründe proje geliştirme, proje uygulama, imar uygulamaları, saha kurulumu,
              geçici kabul işlemleri, danışmanlık ve müşterilerimizin portföy verimliliğini en üst düzeye çıkarmak için
              kapsamlı hizmet sunuyoruz. Güneş PV tesislerindeki sorunları anlamaya yardımcı olmak amacıyla İHA’lar ile
              inceleme ve İHA’larda bulunan termal kamera ile havadan denetim yapılmaktadır.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-3xl mx-auto justify-items-center">
              {serviceCards.map((card) => (
                <div key={card.title} className="flex flex-col items-center text-center space-y-3">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border border-orange-200 flex items-center justify-center bg-orange-50/40 shadow-sm">
                    {card.icon}
                  </div>
                  <p className="text-gray-800 font-semibold text-[11px] sm:text-xs tracking-wide">{card.title}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-full h-80 md:h-[420px] rounded-xl overflow-hidden shadow-lg">
            <img src="/drone-operator.jpg" alt="Drone ile denetim" className="absolute inset-0 w-full h-full object-cover" />
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
    <section id="istatistikler" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 px-6 py-10 md:px-12 md:py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Türkiye'de Güneş Enerjisi</h2>
            <p className="text-gray-600 text-sm md:text-base">
              Enerji Bakanlığı'nın güneş enerjisi potansiyel atlasına göre Türkiye'de yıllık toplam güneşlenme süresi 2.737 saat,
              yıllık toplam gelen güneş enerjisi 1.527 kWh/m²·yıl olarak hesaplanıyor. Bu potansiyeli en verimli şekilde değerlendirmek için çalışıyoruz.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shadow-md">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('tr-TR').format(Number(stat.value))}
                  <span className="text-orange-500 text-base font-semibold ml-1">{stat.suffix}</span>
                </div>
                <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

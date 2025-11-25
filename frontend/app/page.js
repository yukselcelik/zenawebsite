
// Ana sayfa bileşeni - Zena Enerji web sitesinin giriş sayfası
// Bu sayfa hero section, hizmetler, istatistikler ve diğer ana bölümleri içerir

'use client'; // Client-side bileşen - Framer Motion animasyonları için gerekli

import Header from './components/Header'; // Header bileşenini import ediyoruz
import Footer from './components/Footer'; // Footer bileşenini import ediyoruz
import { motion, useScroll, useTransform } from 'framer-motion'; // Framer Motion - animasyonlar için
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [countsStarted, setCountsStarted] = useState(false);
  useEffect(() => {
    // İstatistikler bölümü görünür olduğunda sayım animasyonlarını başlatmak için IntersectionObserver
    const section = document.getElementById('istatistikler');
    if (!section) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setCountsStarted(true);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(section);
    return () => obs.disconnect();
  }, []);
  return (
    <div className="min-h-screen bg-white">
      {/* Header bileşeni - tüm sayfalarda ortak */}
      <Header />
      
      {/* Hero Section - Ana görsel ve başlık alanı (solar-banner burada) */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden z-0 -mt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Zena Enerji ile Tam Hizmet</h2>
            <p className="text-lg text-gray-700 mb-10">
              Zena Enerji olarak, güneş enerjisi sektöründe proje geliştirme, proje uygulama, imar uygulamaları, saha kurulumu,
              geçici kabul işlemleri, danışmanlık ve müşterilerimizin portföy verimliliğini en üst düzeye çıkarmak için
              kapsamlı hizmet sunuyoruz. Güneş PV tesislerindeki sorunları anlamaya yardımcı olmak amacıyla İHA’lar ile
              inceleme ve İHA’larda bulunan termal kamera ile havadan denetim yapılmaktadır.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="border border-orange-200 rounded-lg p-4 text-center">
                <div className="text-orange-500 font-semibold mb-2">Proje Geliştirme</div>
              </div>
              <div className="border border-orange-200 rounded-lg p-4 text-center">
                <div className="text-orange-500 font-semibold mb-2">İmar Uygulamaları</div>
              </div>
              <div className="border border-orange-200 rounded-lg p-4 text-center">
                <div className="text-orange-500 font-semibold mb-2">Saha Kurulumları</div>
              </div>
              <div className="border border-orange-200 rounded-lg p-4 text-center">
                <div className="text-orange-500 font-semibold mb-2">İHA ile Termal Test</div>
              </div>
              <div className="border border-orange-200 rounded-lg p-4 text-center">
                <div className="text-orange-500 font-semibold mb-2">İşletme ve Bakım</div>
              </div>
              <div className="border border-orange-200 rounded-lg p-4 text-center">
                <div className="text-orange-500 font-semibold mb-2">Danışmanlık</div>
              </div>
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
      <section className="py-16">
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

// Basit sayı saydırma bileşeni
function Counter({ end }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const durationMs = 1200; // 1.2s
    const stepMs = 16;
    const steps = Math.ceil(durationMs / stepMs);
    const increment = end / steps;
    const id = setInterval(() => {
      start += increment;
      if (start >= end) {
        setValue(end);
        clearInterval(id);
      } else {
        setValue(Math.round(start));
      }
    }, stepMs);
    return () => clearInterval(id);
  }, [end]);

  return new Intl.NumberFormat('tr-TR').format(value);
}

// Kaydırdıkça yanlara açılan 4 sekmeli istatistik tasarımı
function StatsScrollReveal() {
  const containerRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  return (
    <section id="istatistikler" className="py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={containerRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative mx-auto h-72 md:h-80 flex items-center justify-center"
        >
          {/* Merkez güneş */}
          <motion.div 
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            className="w-24 h-24 md:w-28 md:h-28 bg-orange-100 rounded-full flex items-center justify-center shadow-xl"
          >
            <svg className="w-12 h-12 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          </motion.div>

          {/* Işınlar + etiketler */}
          {/* Üst */}
          <motion.div 
            className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? -40 : 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.div className="bg-orange-400 h-8 w-0.5 rounded-full" initial={{ scaleY: 0 }} animate={{ scaleY: hovered ? 1 : 0 }} transition={{ duration: 0.35 }} />
            <div className="mt-3 text-center">
              <div className="text-2xl font-bold text-gray-900">{new Intl.NumberFormat('tr-TR').format(108861)}</div>
              <div className="text-orange-500 font-semibold text-sm">MW</div>
              <div className="text-gray-600 text-sm">Türkiye'nin Kurulu Gücü</div>
            </div>
          </motion.div>

          {/* Sağ */}
          <motion.div 
            className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center"
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 40 : 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.div className="bg-orange-400 h-0.5 w-10 md:w-16 rounded-full" initial={{ scaleX: 0 }} animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.35 }} />
            <div className="ml-3 text-left">
              <div className="text-2xl font-bold text-gray-900">{new Intl.NumberFormat('tr-TR').format(11933)}</div>
              <div className="text-gray-600 text-sm">GES Sayısı</div>
            </div>
          </motion.div>

          {/* Alt */}
          <motion.div 
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 40 : 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.div className="bg-orange-400 h-8 w-0.5 rounded-full" initial={{ scaleY: 0 }} animate={{ scaleY: hovered ? 1 : 0 }} transition={{ duration: 0.35 }} />
            <div className="mt-3 text-center">
              <div className="text-2xl font-bold text-gray-900">{new Intl.NumberFormat('tr-TR').format(18000)}</div>
              <div className="text-orange-500 font-semibold text-sm">MW</div>
              <div className="text-gray-600 text-sm">2025 Hedefi</div>
            </div>
          </motion.div>

          {/* Sol */}
          <motion.div 
            className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center"
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? -40 : 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="mr-3 text-right">
              <div className="text-2xl font-bold text-gray-900">{new Intl.NumberFormat('tr-TR').format(13602)}</div>
              <div className="text-orange-500 font-semibold text-sm">MW</div>
              <div className="text-gray-600 text-sm">GES Kurulu Gücü</div>
            </div>
            <motion.div className="bg-orange-400 h-0.5 w-10 md:w-16 rounded-full" initial={{ scaleX: 0 }} animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.35 }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

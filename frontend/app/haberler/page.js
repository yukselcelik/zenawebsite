// Haberler sayfası - Zena Enerji haberleri ve güneş enerjisi haberleri
// Bu sayfa şirket haberlerini ve sektör haberlerini listeler

'use client'; // Client-side bileşen - Framer Motion animasyonları için gerekli

import Header from '../components/Header'; // Header bileşenini import ediyoruz
import Footer from '../components/Footer'; // Footer bileşenini import ediyoruz
import { motion } from 'framer-motion'; // Framer Motion - animasyonlar için

export default function Haberler() {
  // Haber verileri
  const news = [
    {
      id: 1,
      title: "Galatasaray Zena Su Topu Takımımız, Play-off müsabakalarına katılmaya hak kazandı.",
      hoverTitle: "Su Topu 1. Liginde normal sezonu namağlup tamamlayarak Play-off müsabakalarına katılmaya hak kazandı. Takımımıza Play-Off müsabakalarında başarılar dileriz.",
      date: "22.11.2024",
      category: "Spor",
      image: "/haberler/gs.jfif",
      hasVideo: false,
      slug: "galatasaray-zena-su-topu-play-off",
      externalUrl: "https://www.galatasaray.org/anasayfa"
    },
    {
      id: 2,
      title: "Toyotetsu'ya ait 12 MW GES projemizin geçici kabulü yapılmıştır.",
      date: "12.10.2024",
      category: "Proje",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      hasVideo: true,
      slug: "toyotetsu-12mw-ges-gecici-kabul"
    },
    {
      id: 3,
      title: "Galatasaray Kadın Sutopu Takımı ile 3 yıllık sponsorluk anlaşması yaptık.",
      hoverTitle: "2023/2024, 2024/2025, 2025/2026 sezonlarını kapsayan anlaşmamızda hedefimiz Galatasaray'ımızın Avrupa Şampiyonluğu'nu kazanmasıdır. Hepimize hayırlı olsun.",
      date: "10.10.2024",
      category: "Spor",
      image: "/haberler/gs1.jfif",
      hasVideo: false,
      externalUrl: "https://www.galatasaray.org/sl/sutopu-ana-sayfa/9"
    },
    {
      id: 4,
      title: "19.500 kWp kurulu gücündeki Güneş Enerji Santralinin kabul işlemleri tamamlanarak üretime başlamıştır.",
      date: "08.10.2024",
      category: "Proje",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      hasVideo: true,
      slug: "19500-kwp-ges-kabul"
    },
    {
      id: 5,
      title: "Toyotetsu Otomotiv'e ait 3.6 MW'lık güneş enerji santralini anahtar teslim olarak tamamlamış bulunmaktayız.",
      date: "05.10.2024",
      category: "Proje",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      hasVideo: true,
      slug: "toyotetsu-36mw-ges"
    },
    {
      id: 6,
      title: "1200 kW'lık güneş enerjisi santralimizin geçici kabulü tamamlanıp üretime başlamıştır.",
      date: "03.10.2024",
      category: "Proje",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      hasVideo: true,
      slug: "1200-kw-ges-gecici-kabul"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header bileşeni */}
      <Header />
      
      {/* Hero Section - Header arkasında küçük banner */}
      <section className="relative h-[300px] overflow-hidden -mt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&q=80)` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-orange-500">
              Zena Enerji Haberler
            </h1>
            <p className="text-sm md:text-base text-white/90 leading-relaxed">
              Zena Enerji ve Güneş Enerjisindeki önemli gelişme ve haberleri buradan takip edebilirsiniz
            </p>
          </div>
        </div>
      </section>


      {/* Haberler grid - 2 sütunlu büyük kartlar */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Haber kartları */}
            {news.map((item, index) => (
              <motion.article 
                key={item.id} 
                className="relative h-[320px] md:h-[360px] rounded-xl overflow-hidden cursor-pointer group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Arka plan görseli */}
                <div className="absolute inset-0">
                  <motion.img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  {/* Koyu overlay - normal durum */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40 transition-opacity duration-300 group-hover:opacity-0" />
                  {/* Yeşil overlay - hover durumunda (saydam) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-700/90 via-green-600/80 to-green-500/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                
                {/* İçerik */}
                <div className="relative z-10 h-full flex flex-col justify-between p-5 md:p-6 text-white">
                  {/* Üst kısım - Tarih */}
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white text-xs md:text-sm font-medium">{item.date}</span>
                  </div>
                  
                  {/* Alt kısım - Başlık ve Buton */}
                  <div className="space-y-4">
                    {/* Başlık - hoverTitle varsa değişir, yoksa aynı kalır */}
                    {item.hoverTitle ? (
                      <>
                        <h3 className="text-lg md:text-xl font-bold leading-tight group-hover:hidden">
                          {item.title}
                        </h3>
                        <h3 className="text-lg md:text-xl font-bold leading-tight hidden group-hover:block">
                          {item.hoverTitle}
                        </h3>
                      </>
                    ) : (
                      <h3 className="text-lg md:text-xl font-bold leading-tight">
                        {item.title}
                      </h3>
                    )}
                    
                    <motion.a 
                      href={item.externalUrl || `/haberler/${item.slug || `haber-${item.id}`}`}
                      target={item.externalUrl ? "_blank" : undefined}
                      rel={item.externalUrl ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-white text-white font-semibold text-xs md:text-sm hover:bg-white hover:text-gray-900 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      DEVAMINI OKU
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </motion.a>
                  </div>
                </div>
                
                {/* Video ikonu - varsa */}
                {item.hasVideo && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 5v10l8-5-8-5z"/>
                      </svg>
                    </div>
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer bileşeni */}
      <Footer />
    </div>
  );
}

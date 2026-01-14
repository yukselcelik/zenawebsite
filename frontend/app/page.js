
// Ana sayfa bileşeni - Zena Enerji web sitesinin giriş sayfası
// Bu sayfa hero section, hizmetler, istatistikler ve diğer ana bölümleri içerir

'use client'; // Client-side bileşen - Framer Motion animasyonları için gerekli

import Header from './components/Header'; // Header bileşenini import ediyoruz
import Footer from './components/Footer'; // Footer bileşenini import ediyoruz
import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion'; // Framer Motion - animasyonlar için

const sliderItems = [
  {
    id: 1,
    title: 'Güneş Enerjisinden Elektrik Üretin',
    description:
      'Güneş enerjisi ile yüksek elektrik maliyetinden kurtulabilirsiniz. Zena Enerji profesyonel proje ve teknik ekibi ile bu sorunlara çözüm kaynağı olmaktadır.',
    buttonLabel: 'Daha fazla bilgi için',
    href: '/iletisim',
    image: '/slider/solar-banner.jpg',
  },
  {
    id: 2,
    title: 'Veriminizi Maksimuma Çıkarın',
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
      <svg className="w-[1.995rem] h-[1.995rem] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg className="w-[1.995rem] h-[1.995rem] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg className="w-[1.995rem] h-[1.995rem] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg className="w-[1.995rem] h-[1.995rem] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg className="w-[1.995rem] h-[1.995rem] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg className="w-[1.995rem] h-[1.995rem] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
            className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full p-3 transition hover:cursor-pointer"
          >
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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
            className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full p-3 transition hover:cursor-pointer"
          >
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="absolute bottom-12 inset-x-0 flex justify-center flex-wrap gap-3 z-10">
          {sliderItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all hover:cursor-pointer ${index === currentSlide ? 'bg-white w-8' : 'bg-white/40 w-5'}`}
              aria-label={`${item.title} slaytı`}
            />
          ))}
        </div>
      </section>
      {/* Zena Enerji ile Tam Hizmet + Drone görselli bölüm */}
      <section className="py-4 bg-white relative overflow-hidden">
          <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
            {/* Sol taraf - Metin (beyaz arka plan üzerinde siyah yazı) */}
            <motion.div 
              className="relative flex flex-col justify-between pt-3 md:pt-4 lg:pt-5 px-3 md:px-4 lg:px-5 pb-3 md:pb-4 lg:pb-5 bg-white"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* İçerik - Üst kısım */}
              <div className="relative z-10">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-8 text-center">
                  Zena Enerji ile Tam Hizmet
                </h2>
                
                <div className="space-y-1.5 text-gray-900 mb-8">
                  <p className="text-sm md:text-base leading-relaxed">
                    Zena Enerji, güneş enerjisi sektöründe proje geliştirme, imar uygulamaları, saha kurulumu, geçici kabul işlemleri konusunda uluslararası saygın firmalar ile çalışarak Lisanslı, Lisanssız birçok büyük ve ses getiren projelerin mimarı olmuştur. İHA'lar ile termal kamera kullanarak havadan inceleme ve izleme yaparak güneş PV tesislerindeki sorunları tespit edebilir ve portföy verimliliğini artırabiliriz.
                  </p>
                </div>
                
                {/* Hizmet kartları - Yazıya yakın */}
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {serviceCards.map((card, index) => (
                    <motion.div 
                      key={card.title} 
                      className="flex flex-col items-center text-center gap-2"
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                    >
                      <div className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center shadow-md bg-slate-800 hover:bg-slate-700 transition-colors [&_svg]:w-6 [&_svg]:h-6 md:[&_svg]:w-7 md:[&_svg]:h-7">
                        {card.icon}
                      </div>
                      <p className="text-gray-900 font-semibold text-[11px] md:text-xs tracking-wide leading-tight">{card.title}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Sağ taraf - Resim */}
            <motion.div 
              className="relative w-full h-[90%] self-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <img 
                src="/dron-operator.jpg" 
                alt="Zena Enerji Ekibi" 
                className="w-full h-full object-cover rounded-lg" 
                style={{ objectPosition: 'left center' }}
              />
            </motion.div>
          </div>
        </section>

      {/* Türkiye'de Güneş Enerjisi İstatistikleri Bölümü */}
      <StatsScrollReveal />

      {/* Zena Enerji Hakkında */}
      <section className="py-16 bg-white text-center">
          <div className="max-w-6xl mx-auto px-6">
            {/* <p className="text-xs font-semibold tracking-[0.6em] text-orange-500 mb-4">HAKKIMIZDA</p> */}
            <motion.div 
              className="inline-flex items-center justify-center gap-4 mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="w-12 h-px bg-gray-300" />
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase">Hakkında</h3>
              <span className="w-12 h-px bg-gray-300" />
            </motion.div>
            <motion.div 
              className="space-y-5 text-sm md:text-base text-gray-700 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <p>
                2015 yılından itibaren güneş enerjisi sektöründe faaliyet gösteren firmamız, sahip olduğumuz bilgi birikimini uzman iş gücüyle birleştirerek
                Türkiye'de güneş enerjisi santrali yatırımları konusunda birçok projeyi başarıyla hayata geçirmiştir.
              </p>
              <p>
                Proje çizimi, proje geliştirme ve uygulama süreçlerinde sektörün önde gelen firmalarından olan Zena Enerji, Türkiye'de ki ilk ve en büyük Endüstriyel Çatı Güneş Elektrik Santralini ve Türkiye'nin ilk ve tek kurulum için tüm özellikleri yansıtan Test Güneş Elektrik Santralini kurmuştur.
                Dünyaca ünlü firmaların projelerini tamamlayan firmamız, her bir projede farklı bir deneyim sürecinden geçmiş, edindiği profesyonellik ve disiplini çalışma prensipleri haline getirmiştir.
              </p>
              <p>
                Bununla birlikte müşteri bağlılığına verdiği değerle alınan işleri zamanında tamamlayarak güven ve dürüstlük ilkelerine sahip çıkmış ve aynı ilkelerle yoluna devam eden bir şirket olmuştur.
              </p>
              <p>
                Türkiye'de güneş enerjisi santralleri kurulması ile ilgili olarak ilk projeleri gerçekleştiren Zena Enerji'nin bünyesinde sektörün en tecrübeli mühendis ve teknikerleri görev almaktadır.
                Zena Enerji olarak edindiğimiz tecrübelere, birlikte çalıştığımız uzman iş gücüne ve sektördeki saygın bilinirliliğimize dayanarak ülkemiz ve dünyamız adına daha yeşil bir gelecek için çalışmalarımıza devam etmekteyiz.
              </p>
            </motion.div>
            <motion.a
              href="/hakkimizda"
              className="inline-flex items-center gap-2 px-5 py-2.5 mt-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Daha Fazla Bilgi
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </motion.a>
          </div>
        </section>

      {/* Solar Güç Hesaplama CTA (görselli banner) */}
      <section className="py-[3.4rem] bg-gray-50 px-0">
          <div className="w-full">
            <motion.div 
              className="relative rounded-none lg:rounded-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <img src="/solar-hesabi.jpg" alt="Solar güç hesabı" className="w-full h-[340px] object-cover" />
              <div className="absolute inset-0 bg-black/45"></div>
              
              {/* Rüzgar Efekti */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    style={{
                      top: `${20 + i * 15}%`,
                      left: '-100%',
                    }}
                    animate={{
                      left: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: 'linear',
                    }}
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-start">
                <motion.div 
                  className="px-8 md:px-14 max-w-xl ml-[3%] md:ml-[5%]"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-[0.85rem]">Solar Güç Simulasyonu Hesabı</h3>
                  <p className="text-white/90 mb-[1.275rem]">Kurulu gücünüzü, panel sayınızı, kurtarılan ağaç sayınızı hesaplayabilirsiniz...</p>
                  <motion.a 
                    href="/simulasyon" 
                    className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-[0.6375rem] px-6 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Şimdi Hesapla
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

      {/* İletişim CTA */}
      <section className="pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="relative rounded-[20.16px] overflow-hidden shadow-xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <img
                src="https://images.unsplash.com/photo-1500536311302-3756c5a7b4b3?auto=format&fit=crop&w=1600&q=80"
                alt="Güneş batımı"
                className="w-full h-48 md:h-[211px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
              <div className="absolute inset-0 flex items-center px-[1.44rem] md:px-[2.16rem]">
                <motion.div 
                  className="text-white max-w-lg space-y-[0.72rem]"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                  <p className="text-[0.54rem] md:text-[0.63rem] font-semibold tracking-[0.252em] text-orange-300">İLETİŞİME GEÇİN</p>
                  <h4 className="text-[1.08rem] md:text-[1.35rem] font-bold leading-snug">
                    Hemen bize ulaşın ve size özel <span className="text-orange-300">hizmetleri keşfedin</span>
                  </h4>
                  <p className="text-[0.63rem] md:text-[0.72rem] text-white/90">
                    Projelerinizi hızla hayata geçirmek için mühendislik, saha kurulumu ve danışmanlık ekibimiz hazır.
                  </p>
                  <motion.a
                    href="/iletisim"
                    className="inline-flex items-center gap-[0.36rem] px-[0.9rem] py-[0.45rem] rounded-full bg-orange-500 hover:bg-orange-600 text-white text-[0.63rem] font-semibold transition shadow-lg shadow-orange-500/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Bize Ulaşın
                    <svg className="w-[0.72rem] h-[0.72rem]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>
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

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="istatistikler" className="py-16 bg-white relative overflow-hidden" ref={ref}>
      <div className="absolute -left-[60px] md:-left-[90px] top-1/2 -translate-y-1/2 w-[162px] h-[162px] md:w-[234px] md:h-[234px] opacity-40 pointer-events-none select-none">
        {/* Güneş merkezi - dolu, güneş tonlarında */}
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full absolute inset-0">
          <defs>
            <radialGradient id="sunGradient" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#FFE135" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#FFD700" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFA500" stopOpacity="0.9" />
            </radialGradient>
          </defs>
          {/* Ana güneş dairesi - dolu */}
          <circle cx="100" cy="100" r="38" fill="url(#sunGradient)" stroke="#FF8C00" strokeWidth="2" />
          {/* İç highlight */}
          <circle cx="100" cy="100" r="28" fill="#FFE135" opacity="0.4" />
        </svg>
        
        {/* Işınlar - animasyonlu */}
        <motion.svg 
          viewBox="0 0 200 200" 
          fill="none" 
          stroke="#FFA500"
          className="w-full h-full absolute inset-0"
          style={{ transformOrigin: '50% 50%' }}
          animate={isInView ? {
            rotate: [0, 10, -10, 10, -10, 0]
          } : { rotate: 0 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse"
          }}
        >
          <g strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" stroke="#FFA500" opacity="0.8">
            {/* Tüm ışınlar çemberden 20px uzakta başlar ve tam 60px uzunluğundadır */}
            {/* Merkez: (100, 100), Çember yarıçapı: 38, Başlangıç yarıçapı: 58, Işın uzunluğu: 60 */}
            {/* Üst (90 derece) - tam 60px uzunluk */}
            <line x1="100" y1="42" x2="100" y2="-18" />
            {/* Alt (270 derece) - tam 60px uzunluk */}
            <line x1="100" y1="158" x2="100" y2="218" />
            {/* Sağ (0 derece) - tam 60px uzunluk */}
            <line x1="158" y1="100" x2="218" y2="100" />
            {/* Sol (180 derece) - tam 60px uzunluk */}
            <line x1="42" y1="100" x2="-18" y2="100" />
            {/* Sağ üst çapraz (45 derece) - tam 60px uzunluk */}
            <line x1="141.01" y1="58.99" x2="183.44" y2="16.56" />
            {/* Sol alt çapraz (225 derece) - tam 60px uzunluk */}
            <line x1="58.99" y1="141.01" x2="16.56" y2="183.44" />
            {/* Sol üst çapraz (135 derece) - tam 60px uzunluk */}
            <line x1="58.99" y1="58.99" x2="16.56" y2="16.56" />
            {/* Sağ alt çapraz (315 derece) - tam 60px uzunluk */}
            <line x1="141.01" y1="141.01" x2="183.44" y2="183.44" />
          </g>
        </motion.svg>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Türkiye'de Güneş Enerjisi</h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Enerji Bakanlığı'nın güneş enerjisi potansiyel atlasına göre Türkiye'de yıllık toplam güneşlenme süresi 2.737 saat,
            yıllık toplam gelen güneş enerjisi 1.527 kWh/m²·yıl olarak hesaplanıyor. Bu potansiyeli en verimli şekilde değerlendirmek için çalışıyoruz.
          </p>
        </motion.div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.label} 
              className="flex flex-col items-center text-center space-y-2.5"
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.8 }}
              transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
            >
              <motion.div 
                className="w-[3.6rem] h-[3.6rem] rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shadow-md"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <svg className="w-[2.1rem] h-[2.1rem] text-orange-500" viewBox="0 0 32 32" aria-hidden="true">
                  <circle cx="16" cy="16" r="6.5" fill="currentColor" />
                  <circle cx="16" cy="16" r="4.6" fill="#fff6eb" />
                  <circle cx="16" cy="16" r="3.4" fill="#f28c1a" />
                  <g stroke="#f7a138" strokeWidth="1.7" strokeLinecap="round">
                    <line x1="16" y1="3" x2="16" y2="7" />
                    <line x1="16" y1="25" x2="16" y2="29" />
                    <line x1="3" y1="16" x2="7" y2="16" />
                    <line x1="25" y1="16" x2="29" y2="16" />
                    <line x1="6.2" y1="6.2" x2="9.2" y2="9.2" />
                    <line x1="22.8" y1="22.8" x2="25.8" y2="25.8" />
                    <line x1="6.2" y1="25.8" x2="9.2" y2="22.8" />
                    <line x1="22.8" y1="9.2" x2="25.8" y2="6.2" />
                  </g>
                </svg>
              </motion.div>
              <div className="text-[0.8775rem] font-semibold text-gray-900">
                {new Intl.NumberFormat('tr-TR').format(Number(stat.value))}
                <span className="text-orange-500 text-[0.585rem] font-semibold ml-1">{stat.suffix}</span>
              </div>
              <p className="text-[13.2px] md:text-[0.9rem] text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


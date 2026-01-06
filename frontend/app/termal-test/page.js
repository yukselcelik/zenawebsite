// Termal Test ve Yapay Zeka sayfası - Detaylı hizmet bilgileri

'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TermalTest() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "İHA İncelemesi ve Yapay Zeka Analizi",
      description: "Güneş enerji sistemlerinde tespit edilemeyen panel kusurları için havadan termal kameralarla inceleme ve yapay zeka (AI) analizleri yapıyoruz. 10MW kapasiteli bir GES için bile 70-80 sayfalık panel hasar raporunu 1 saat içinde hazır edebiliyoruz!"
    },
    {
      title: "Termal İncelemede Yapay Zeka!",
      description: "Toplamda 4 GW'lık Güneş enerji santrali ölçümlerinden elde edilen veriler ile hazırlanmış Yapay zeka programımız sayesinde Termal kameralarla aldığımız verileri işleyerek çok hızlı ve kesin doğruluk payına sahip bir rapor hazırlıyoruz."
    },
    {
      title: "Sıcak Noktaları Görüntü Analizi ile Raporluyoruz!",
      description: "Güneş enerji panellerinin Hot spot olarak bilinen sıcak noktaları termal kameralı İHA'lar tarafından incelenir. Sıcak noktaları ve İnsan gözü ile görülemeyecek daha birçok kusurları Yapay zeka yazılımımız kullanılarak çok hızlı bir şekilde hatalar tespit edilip detaylı bir rapor haline getirilir."
    },
    {
      title: "PV Panel Hatalarını Onarıyoruz!",
      description: "Zena Enerji'nin profesyonel mühendisleri ve teknikerleri ile tespit ettiğimiz pv panel kusurlarının tamirini, onarımını veya yenileme işlemlerini gerçekleştiriyoruz."
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[800px] md:min-h-[900px] lg:min-h-[1000px] overflow-hidden bg-gray-900">
        {/* Arka plan görseli */}
        <img 
          src="/termal.jpg"
          alt="Termal test drone görseli"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        
        {/* Kararma overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Sol Ok */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 md:p-4 transition-all duration-300 group"
          aria-label="Önceki slide"
        >
          <svg 
            className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Sağ Ok */}
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 md:p-4 transition-all duration-300 group"
          aria-label="Sonraki slide"
        >
          <svg 
            className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* İçerik */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[800px] md:min-h-[900px] lg:min-h-[1000px] flex items-center">
          <div className="w-full text-center max-w-4xl mx-auto text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-base md:text-lg text-white/90 mb-8 leading-relaxed">
                  {slides[currentSlide].description}
                </p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg text-base transition-colors duration-300 shadow-lg">
                  Daha Fazla Bilgi
                </button>
                <div className="mt-4 w-24 h-0.5 bg-orange-500 mx-auto"></div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slide Göstergeleri */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-orange-500' 
                  : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}


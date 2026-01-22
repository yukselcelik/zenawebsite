// Referanslar sayfası - 4 sütunlu, animasyonlu tasarım

'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const referansLogolar = [
  'Akfen Holding.png',
  'Alkataş.avif',
  'Alter.webp',
  'Arta Tekstil.svg',
  'Berg.png',
  'Big Chefs.png',
  'BİM.png',
  'Birinci.png',
  'Bisem Paradise.svg',
  'Cemer kent.png',
  'Danış Grup.png',
  'Diler Holding.jpg',
  'Ege Orman.png',
  'Elektroaktif.png',
  'Erfa Yapı.jpg',
  'Espe Enerji.png',
  'Farah Enerji.png',
  'Futurapet.png',
  'Gelişim Yapı.jpg',
  'GEN İlaç.png',
  'Hanwha Qcells.svg',
  'Has Beton.jpg',
  'Hasçelik.svg',
  'İstanbul Aydın Üniversitesi.png',
  'ITC.svg',
  'Kar grup.png',
  'Medicalpark.svg',
  'Metroport AVM.jpg',
  'Mön.png',
  'Namet.svg',
  'OBH Construction.jpg',
  'olgun çelik.webp',
  'Özseç Beton.svg',
  'Pak Tavuk.png',
  'Pimsa Otomotiv.png',
  'Rofa Solar.png',
  'Şıkmakas.png',
  'Tekfen Holding.jpg',
  'Tosyalı Holding.svg',
  'Toyotetsu.webp',
  'Ulus Metal.avif',
  'Utest.JPG',
  'Werde Hotels.svg',
  'reysas.png'
];

const cozumOrtaklariLogolar = [
  'Altungrup.avif',
  'Astor.png',
  'ERL Solar.png',
  'Hasçelik.svg',
  'HİS.JPG',
  'HT Solar.JPG',
  'huawei.png',
  'İsotec.JPG',
  'Kolay Enerji.png',
  'Kontek.JPG',
  'Neva Solar.svg',
  'Öznur Kablo.png',
  'Schneider Elektrik.JPG',
  'Siemens.png',
  'Smart Solar.png',
  'Solaris Kablo.webp',
  'Sungrow.png',
  'Toplam Enerji Merkezi.png',
  'Yeo.png',
  'Yingli Solar.png'
];

export default function ReferanslarPage() {
  const referansContainerRef = useRef(null);
  const cozumOrtaklariContainerRef = useRef(null);
  const isReferansInView = useInView(referansContainerRef, { once: true, amount: 0.1 });
  const isCozumOrtaklariInView = useInView(cozumOrtaklariContainerRef, { once: true, amount: 0.1 });

  // 4 sütunlu grid için referans logoları grupla
  const columns = 4;
  const referansLogosPerColumn = Math.ceil(referansLogolar.length / columns);
  const referansLogoColumns = [];
  
  for (let i = 0; i < columns; i++) {
    referansLogoColumns.push(
      referansLogolar.slice(i * referansLogosPerColumn, (i + 1) * referansLogosPerColumn)
    );
  }

  // 4 sütunlu grid için çözüm ortakları logoları grupla
  const cozumOrtaklariLogosPerColumn = Math.ceil(cozumOrtaklariLogolar.length / columns);
  const cozumOrtaklariLogoColumns = [];
  
  for (let i = 0; i < columns; i++) {
    cozumOrtaklariLogoColumns.push(
      cozumOrtaklariLogolar.slice(i * cozumOrtaklariLogosPerColumn, (i + 1) * cozumOrtaklariLogosPerColumn)
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Arkaplan görseli için hazır alan - isteğe bağlı */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          {/* Arkaplan görseli buraya eklenebilir */}
          {/* <img 
            src="/background-image.jpg" 
            alt="" 
            className="w-full h-full object-cover opacity-10"
          /> */}
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 whitespace-nowrap"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              REFERANSLARIMIZ & ÇÖZÜM ORTAKLARIMIZ
            </motion.h1>
            <motion.div
              className="flex items-center justify-center gap-2 mb-6"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="w-12 h-px bg-gray-300" />
              <span className="w-20 h-px bg-green-500" />
              <span className="w-12 h-px bg-gray-300" />
            </motion.div>
            <motion.p
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Güvenilir iş ortaklıklarımız, çözüm ortaklarımız ve başarıyla tamamladığımız projeler
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Referanslar Grid - 4 Sütun */}
      <section ref={referansContainerRef} className="py-12 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">REFERANSLARIMIZ</h2>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-12 h-px bg-gray-300" />
              <span className="w-20 h-px bg-green-500" />
              <span className="w-12 h-px bg-gray-300" />
            </div>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {referansLogoColumns.map((column, columnIndex) => (
              <motion.div
                key={columnIndex}
                className="flex flex-col gap-6 md:gap-8"
                initial={{ opacity: 0, y: 50 }}
                animate={isReferansInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ 
                  duration: 0.6, 
                  delay: columnIndex * 0.15,
                  ease: "easeOut" 
                }}
              >
                {column.map((logo, logoIndex) => {
                  const encodedLogo = encodeURIComponent(logo);
                  const globalIndex = columnIndex * referansLogosPerColumn + logoIndex;
                  
                  // Özel durumlar için stil belirleme
                  const getLogoStyle = () => {
                    // ITC.svg sarı kalmalı, filter uygulanmamalı
                    if (logo === 'ITC.svg') {
                      return {};
                    }
                    
                    // Namet.svg için özel işlem - kırmızı renkleri korumak için
                    if (logo === 'Namet.svg') {
                      return {
                        filter: 'invert(0.1) brightness(0.8) saturate(1.5)',
                        mixBlendMode: 'multiply'
                      };
                    }
                    
                    // Utest.JPG için özel işlem - siyah arka plan üzerinde koyu yazılar var
                    if (logo === 'Utest.JPG') {
                      return {
                        filter: 'brightness(1.2) contrast(1.1)',
                        mixBlendMode: 'normal'
                      };
                    }
                    
                    // PNG/JPG dosyaları için beyaz yazı sorunu olanlar - gri yap
                    const whiteTextLogos = [
                      'GEN İlaç.png',
                      'Pimsa Otomotiv.png',
                      'Şıkmakas.png',
                      'İstanbul Aydın Üniversitesi.png'
                    ];
                    
                    if (whiteTextLogos.includes(logo)) {
                      return {
                        filter: 'invert(1) brightness(0.4) contrast(1.2) saturate(100%)',
                        mixBlendMode: 'multiply'
                      };
                    }
                    
                    // SVG dosyaları için - beyaz yazıları gri yap
                    if (logo.endsWith('.svg')) {
                      return {
                        filter: 'brightness(0) saturate(100%) invert(0.3)',
                        mixBlendMode: 'multiply'
                      };
                    }
                    
                    // Tüm PNG/JPG logolar için beyaz yazıları gri yapmak için genel filter
                    // Beyaz renkleri griye çevir
                    return {
                      filter: 'brightness(0.8) contrast(1.1)',
                      mixBlendMode: 'multiply'
                    };
                  };
                  
                  return (
                    <motion.div
                      key={globalIndex}
                      className="group relative"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isReferansInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: columnIndex * 0.15 + logoIndex * 0.05,
                        ease: "easeOut" 
                      }}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -8,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <div className="relative bg-white rounded-xl transition-all duration-300 border border-gray-200 overflow-hidden p-6 h-32 flex items-center justify-center">
                        {/* Hover efekti için arkaplan */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Logo */}
                        <img
                          src={`/logolar/${encodedLogo}`}
                          alt={logo.replace(/\.[^/.]+$/, '')}
                          className="relative z-10 h-full w-full object-contain transition-all duration-300 group-hover:scale-110"
                          style={getLogoStyle()}
                          loading="lazy"
                          onError={(e) => {
                            console.error('Logo yüklenemedi:', logo);
                            e.target.style.display = 'none';
                            e.target.parentElement.parentElement.style.display = 'none';
                          }}
                        />
                        
                        {/* Hover border efekti */}
                        <div className="absolute inset-0 border-2 border-green-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Çözüm Ortaklarımız Grid - 4 Sütun */}
      <section ref={cozumOrtaklariContainerRef} className="py-12 pb-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">ÇÖZÜM ORTAKLARIMIZ</h2>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-12 h-px bg-gray-300" />
              <span className="w-20 h-px bg-green-500" />
              <span className="w-12 h-px bg-gray-300" />
            </div>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {cozumOrtaklariLogoColumns.map((column, columnIndex) => (
              <motion.div
                key={columnIndex}
                className="flex flex-col gap-6 md:gap-8"
                initial={{ opacity: 0, y: 50 }}
                animate={isCozumOrtaklariInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ 
                  duration: 0.6, 
                  delay: columnIndex * 0.15,
                  ease: "easeOut" 
                }}
              >
                {column.map((logo, logoIndex) => {
                  const encodedLogo = encodeURIComponent(logo);
                  const globalIndex = columnIndex * cozumOrtaklariLogosPerColumn + logoIndex;
                  
                  return (
                    <motion.div
                      key={globalIndex}
                      className="group relative"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isCozumOrtaklariInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: columnIndex * 0.15 + logoIndex * 0.05,
                        ease: "easeOut" 
                      }}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -8,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <div className="relative bg-white rounded-xl transition-all duration-300 border border-gray-200 overflow-hidden p-6 h-32 flex items-center justify-center">
                        {/* Hover efekti için arkaplan */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Logo */}
                        <img
                          src={`/logolar2/${encodedLogo}`}
                          alt={logo.replace(/\.[^/.]+$/, '')}
                          className="relative z-10 h-full w-full object-contain transition-all duration-300 group-hover:scale-110"
                          style={
                            logo.endsWith('.svg')
                              ? {
                                  filter: 'brightness(0) saturate(100%) invert(0.3)',
                                  mixBlendMode: 'multiply'
                                }
                              : {
                                  filter: 'brightness(0.8) contrast(1.1)',
                                  mixBlendMode: 'multiply'
                                }
                          }
                          loading="lazy"
                          onError={(e) => {
                            console.error('Logo yüklenemedi:', logo);
                            e.target.style.display = 'none';
                            e.target.parentElement.parentElement.style.display = 'none';
                          }}
                        />
                        
                        {/* Hover border efekti */}
                        <div className="absolute inset-0 border-2 border-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* İstatistik Bölümü */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">
                {referansLogolar.length}+
              </div>
              <div className="text-gray-700 font-semibold">Referans Firma</div>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">
                {cozumOrtaklariLogolar.length}+
              </div>
              <div className="text-gray-700 font-semibold">Çözüm Ortağı</div>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">
                2015
              </div>
              <div className="text-gray-700 font-semibold">Kuruluş Yılı</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Bölümü */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bizimle Çalışmak İster misiniz?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Güneş enerjisi projeleriniz için profesyonel ekibimizle iletişime geçin
            </p>
            <motion.a
              href="/iletisim"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg transition shadow-lg shadow-orange-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              İletişime Geçin
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


// Danışmanlık Ve Teknik İnceleme sayfası

'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';

export default function DanismanlikVeTeknikInceleme() {
  const sections = [
    {
      title: "Kapsamlı Teknik Analiz",
      content: "İnceleme sürecinde santralin saha koşulları, kurulu gücü, ekipman seçimi, yerleşim planı ve işletme verileri çok sayıda teknik parametre üzerinden analiz edilir. Panellerin yönlenmesi ve eğim açıları, gölgeleme etkileri, DC–AC oranları, inverter çalışma aralıkları ve kablolama kayıpları gibi performansı doğrudan etkileyen unsurlar ayrı ayrı ele alınır.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "Mevcut Santral Değerlendirmesi",
      content: "Mevcut santrallerde üretim verileri, SCADA kayıtları ve geçmiş dönem enerji çıktıları incelenerek beklenen ve gerçekleşen üretim değerleri karşılaştırılır. Bu analiz sayesinde verim kayıplarının kaynağı tespit edilir ve iyileştirme potansiyelleri net olarak ortaya konur. Gerekli durumlarda saha gözlemleri ve ölçümlerle veriler doğrulanır.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Yeni Proje İncelemeleri",
      content: "Yeni projeler için yapılan teknik incelemelerde ise üretim tahminleri, yatırım maliyetleri ve işletme giderleri birlikte değerlendirilir. Elde edilen teknik bulgular, finansal fizibilite çalışmalarına doğrudan girdi sağlar ve yatırım kararlarının sağlıklı şekilde alınmasına katkı sunar.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Kapsamlı Raporlama",
      content: "Tüm değerlendirmeler sonucunda yatırımcıya; mevcut durum, riskler, iyileştirme önerileri ve performans beklentilerini içeren kapsamlı ve anlaşılır raporlar sunulur. Bu sayede yatırımcılar, kararlarını varsayımlara değil, ölçülebilir ve doğrulanabilir teknik verilere dayandırabilir.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[300px] overflow-hidden -mt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/2.jpg)` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-orange-500">
              Danışmanlık Ve Teknik İnceleme
            </h1>
            <p className="text-sm md:text-base text-white/90 leading-relaxed">
              Mevcut veya yeni güneş santralleri için 300'e yakın kriteri inceleyerek verim, raporlama ve fizibilite analizleri sunuyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Danışmanlık ve teknik inceleme hizmetleri, bir güneş enerji santralinin gerçek performansının ve yatırım değerinin objektif verilerle ortaya konulmasını amaçlar. Bu kapsamda hem mevcut santraller hem de planlama aşamasındaki projeler detaylı şekilde değerlendirilir.
            </p>
          </motion.div>

          {/* Main Sections */}
          <div className="space-y-8" style={{ perspective: '1000px' }}>
            {sections.map((section, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 md:p-8 border-l-4 border-orange-500 cursor-pointer relative"
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -15,
                  rotateX: -5,
                  rotateY: 2,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)"
                }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  hover: {
                    duration: 0.3,
                    ease: "easeOut"
                  }
                }}
                style={{ 
                  zIndex: 1,
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="flex items-start gap-4">
                  <motion.div 
                    className="flex-shrink-0 w-12 h-12 bg-orange-500 text-white rounded-lg flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                  >
                    {section.icon}
                  </motion.div>
                  <div className="flex-1">
                    <motion.h3 
                      className="text-xl md:text-2xl font-bold text-gray-900 mb-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                    >
                      {section.title}
                    </motion.h3>
                    <motion.p 
                      className="text-gray-700 leading-relaxed text-sm md:text-base"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
                    >
                      {section.content}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Conclusion */}
          <motion.div
            className="mt-12 p-6 md:p-8 bg-orange-50 rounded-xl border border-orange-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                Objektif Verilerle Karar Desteği
              </h3>
            </div>
            <p className="text-base md:text-lg text-gray-800 leading-relaxed">
              Zena Enerji, mevcut veya yeni güneş santralleri için 300'e yakın kriteri inceleyerek verim, raporlama ve fizibilite analizleri sunmaktadır. Bu hizmet sayesinde yatırımcılar, santrallerine ait gerçek teknik ve finansal verilere güvenilir şekilde ulaşabilmektedir.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


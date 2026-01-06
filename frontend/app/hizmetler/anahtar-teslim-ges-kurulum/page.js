// Anahtar Teslim GES Kurulum İşlemleri sayfası

'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';

export default function AnahtarTeslimGesKurulum() {
  const steps = [
    {
      title: "Uygulama Projelerinin Hazırlanması",
      content: "Süreç, onaylanmış proje ve fizibilite çalışmaları doğrultusunda uygulama projelerinin hazırlanmasıyla başlar. Santral yerleşim planları, elektrik ve mekanik projeler ile ekipman listeleri sahaya uygun şekilde netleştirilir. Kullanılacak panel, inverter, taşıyıcı konstrüksiyon ve yardımcı ekipmanlar teknik kriterlere göre belirlenir.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Kurulum Aşaması",
      content: "Kurulum aşamasında saha hazırlıkları, konstrüksiyon montajı, panel ve inverter yerleşimleri ile elektriksel bağlantılar proje standartlarına uygun olarak gerçekleştirilir. Tüm montaj işlemleri sırasında iş sağlığı ve güvenliği kuralları esas alınır ve saha çalışmaları planlı şekilde yürütülür.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: "Sistem Testleri ve Kontroller",
      content: "Kurulum tamamlandıktan sonra sistem testleri ve ön kontroller yapılır. Elektriksel ölçümler, koruma sistemleri ve haberleşme altyapısı kontrol edilerek santral devreye alınmaya hazır hale getirilir. Ardından ilgili kurumlar nezdinde geçici ve kesin kabul süreçleri yürütülür.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Bağlantı ve Devreye Alma",
      content: "Lisanslı ve lisanssız projelerde yürürlükteki mevzuat ve teknik şartnamelere uygunluk sağlanarak bağlantı, kabul ve devreye alma işlemleri tamamlanır. Santral, üretime hazır ve işletilebilir durumda yatırımcıya teslim edilir.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
          style={{ backgroundImage: `url(/5.jpg)` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-orange-500">
              Anahtar Teslim GES Kurulum İşlemleri
            </h1>
            <p className="text-sm md:text-base text-white/90 leading-relaxed">
              Tüm izinlerden kurulum ve kabul işlemlerine kadar süreci yöneterek santral kurulumunu anahtar teslim olarak gerçekleştiriyoruz.
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
              Anahtar teslim GES kurulum hizmetleri, bir güneş enerji santralinin planlama aşamasından devreye alınmasına kadar tüm teknik ve idari süreçlerin tek elden yönetilmesini kapsar. Bu yaklaşım, yatırımcı için zaman, maliyet ve koordinasyon risklerini azaltmayı hedefler.
            </p>
          </motion.div>

          {/* Process Steps */}
          <div className="space-y-8" style={{ perspective: '1000px' }}>
            {steps.map((step, index) => (
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
                    className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg md:text-xl"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                  >
                    {index + 1}
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div 
                        className="w-10 h-10 bg-orange-100 text-orange-500 rounded-lg flex items-center justify-center"
                        initial={{ scale: 0, rotate: -90 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.15 + 0.25 }}
                      >
                        {step.icon}
                      </motion.div>
                      <motion.h3 
                        className="text-xl md:text-2xl font-bold text-gray-900"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                      >
                        {step.title}
                      </motion.h3>
                    </div>
                    <motion.p 
                      className="text-gray-700 leading-relaxed text-sm md:text-base"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
                    >
                      {step.content}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                Tek Elden Çözüm
              </h3>
            </div>
            <p className="text-base md:text-lg text-gray-800 leading-relaxed">
              Bu anahtar teslim yaklaşım sayesinde yatırımcılar, farklı disiplinler arasında koordinasyon sağlamakla uğraşmadan, planlanan takvim ve teknik hedefler doğrultusunda güvenilir bir GES yatırımına sahip olur.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


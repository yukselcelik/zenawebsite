// İşletme Ve Bakım Hizmetleri sayfası

'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';

export default function IsletmeVeBakim() {
  const services = [
    {
      title: "Santral İzleme Faaliyetleri",
      content: "Santral izleme faaliyetleri kapsamında üretim verileri, inverter çalışma durumları ve sistem alarmları düzenli olarak takip edilir. Üretimde sapma tespit edildiğinde, kaybın kaynağı teknik veriler üzerinden analiz edilir ve gerekli aksiyonlar planlanır. Bu yaklaşım sayesinde arızalara reaktif değil, önleyici bakım anlayışıyla müdahale edilir.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      title: "Periyodik Bakım Çalışmaları",
      content: "Periyodik bakım çalışmaları; panel yüzey kontrolleri, bağlantı noktalarının ve kablolamanın incelenmesi, inverter ve trafo kontrolleri gibi kritik teknik adımları içerir. Bu kontroller, ekipman ömrünü uzatırken beklenmeyen üretim kayıplarının önüne geçilmesini sağlar.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: "Arıza ve Onarım Süreçleri",
      content: "Arıza ve onarım süreçlerinde, sistem güvenliği ve sürekliliği esas alınır. Arızanın türüne göre sahada veya uzaktan müdahale planlanır, müdahale sonrası sistem performansı doğrulanarak santral tekrar devreye alınır. Yapılan tüm işlemler kayıt altına alınır ve raporlanır.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    {
      title: "İşletme Yönetimi",
      content: "İşletme yönetimi kapsamında santralin aylık ve yıllık performans raporları hazırlanır. Bu raporlarda üretim değerleri, kayıplar, bakım faaliyetleri ve iyileştirme önerileri yer alır. Böylece yatırımcılar, santrallerinin teknik ve ekonomik durumunu şeffaf ve ölçülebilir verilerle takip edebilir.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
          style={{ backgroundImage: `url(/4.jpg)` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-orange-500">
              İşletme Ve Bakım Hizmetleri
            </h1>
            <p className="text-sm md:text-base text-white/90 leading-relaxed">
              Güneş enerji santrallerinizin performansını artırarak sürdürülebilir ve verimli enerji üretimi sağlıyoruz.
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
              İşletme ve bakım hizmetleri, bir güneş enerji santralinin kurulum sonrasında hedeflenen üretim değerlerine ulaşmasını ve bu performansın uzun yıllar korunmasını amaçlar. Bu hizmetler, yalnızca arıza durumlarına müdahaleyi değil, santralin sürekli izlenmesini ve planlı şekilde yönetilmesini kapsar.
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" style={{ perspective: '1000px' }}>
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500 cursor-pointer relative"
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
                    {service.icon}
                  </motion.div>
                  <div className="flex-1">
                    <motion.h3 
                      className="text-xl font-bold text-gray-900 mb-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                    >
                      {service.title}
                    </motion.h3>
                    <motion.p 
                      className="text-gray-700 leading-relaxed text-sm md:text-base"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
                    >
                      {service.content}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Conclusion */}
          <motion.div
            className="p-6 md:p-8 bg-orange-50 rounded-xl border border-orange-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                Sürdürülebilir Performans
              </h3>
            </div>
            <p className="text-base md:text-lg text-gray-800 leading-relaxed">
              Bu bütüncül işletme ve bakım yaklaşımı sayesinde santraller, fizibilite aşamasında öngörülen üretim hedeflerine daha yakın ve sürdürülebilir şekilde işletilir. Zena Enerji, bakım, onarım, izleme ve yönetim faaliyetlerimizle yatırımınızın fizibilite aşamasındaki hedef değerlere ulaşmasına destek oluyoruz.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


// GES Proje Geliştirme İşlemleri sayfası

'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';

export default function GesProjeGelistirme() {
  const steps = [
    {
      title: "Saha Tespiti ve Ön Değerlendirme",
      content: "İlk adımda saha tespiti ve ön değerlendirme çalışmaları yapılır. Arazinin konumu, erişilebilirliği, mülkiyet durumu, topografyası ve çevresel kısıtları incelenir. Aynı zamanda ilgili trafo merkezlerine olan mesafe ve bağlantı imkanları teknik açıdan değerlendirilir. Bu çalışmalar sonucunda sahanın GES yatırımı için uygunluğu netleştirilir."
    },
    {
      title: "Üretim Potansiyeli Analizi",
      content: "Uygun bulunan sahalar için güneşlenme verileri ve meteorolojik ölçümler esas alınarak üretim potansiyeli analiz edilir. Bu analizler, uzun dönemli veri setleri kullanılarak yapılır ve santralin yıllık enerji üretim tahmini ortaya konur. Elde edilen veriler, fizibilite çalışmalarının temelini oluşturur."
    },
    {
      title: "Teknik ve Mali Fizibilite",
      content: "Bir sonraki aşamada teknik ve mali fizibilite çalışmaları gerçekleştirilir. Santral gücü, panel ve inverter konfigürasyonları, yerleşim planı ve yaklaşık yatırım maliyeti hesaplanır. Aynı zamanda işletme giderleri, gelir projeksiyonları ve geri dönüş süresi belirlenerek yatırımcıya karar destek dokümanları sunulur."
    },
    {
      title: "İzin ve Mevzuat İşlemleri",
      content: "Proje geliştirme sürecinin önemli bir diğer adımı izin ve mevzuat işlemleridir. İlgili kurum ve kuruluşlar nezdinde gerekli başvurular hazırlanır ve takip edilir. İmar durumu, tarım dışı kullanım izinleri, bağlantı görüşleri ve diğer yasal gereklilikler yürürlükteki mevzuata uygun şekilde yönetilir."
    },
    {
      title: "Uygulama ve Yatırım Aşamasına Hazırlık",
      content: "Tüm bu çalışmaların sonunda proje, uygulama ve yatırım aşamasına hazır hale getirilir. Teknik, hukuki ve finansal riskleri minimize edilmiş, uygulanabilirliği netleşmiş bir GES projesi ortaya konur. Bu yaklaşım sayesinde projeler kontrollü, öngörülebilir ve sürdürülebilir şekilde hayata geçirilir."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[300px] overflow-hidden -mt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/projegelistirme.jpg)` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-orange-500">
              GES Proje Geliştirme İşlemleri
            </h1>
            <p className="text-sm md:text-base text-white/90 leading-relaxed">
              Proje geliştirme sürecini yürürlükteki mevzuatlara tam uyumlu şekilde, alanında uzman kadrosuyla titizlikle gerçekleştiriyoruz.
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
              GES proje geliştirme süreci, bir güneş enerji santralinin teknik, idari ve ekonomik olarak hayata geçirilebilirliğinin sistematik biçimde ortaya konulmasını kapsar. Bu aşama, yatırımın başarısını doğrudan belirlediği için tüm alt adımlar birbiriyle bağlantılı ve mevzuata uygun şekilde yürütülür.
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
                    <motion.h3 
                      className="text-xl md:text-2xl font-bold text-gray-900 mb-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                    >
                      {step.title}
                    </motion.h3>
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
            <p className="text-base md:text-lg text-gray-800 leading-relaxed text-center font-medium">
              Firmamız, proje geliştirme sürecini yürürlükteki mevzuatlara tam uyumlu şekilde, alanında uzman kadrosuyla titizlikle gerçekleştirmektedir. Her adımı özenle planlanan bu süreçle, projelerinizi güvenle hayata geçiriyoruz.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


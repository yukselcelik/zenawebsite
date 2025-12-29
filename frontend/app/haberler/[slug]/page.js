// Dinamik haber detay sayfası - Video ve içerik gösterimi
'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function HaberDetay() {
  const params = useParams();
  const slug = params.slug;

  // Haber verileri - slug'a göre içerik
  const haberData = {
    'toyotetsu-12mw-ges-gecici-kabul': {
      title: "Toyotetsu'ya ait 12 MW GES projemizin geçici kabulü yapılmıştır.",
      date: "12.10.2024",
      category: "Proje",
      videoUrl: "/haberler/tt.mp4",
      description: `Proje geliştirmesinden geçici kabulüne kadar tüm işlemleri yaptığımız ve anahtar teslim olarak kurduğumuz Yozgat'ın Yerköy İlçesinde bulunan 190 dönümlük arazide TOYOTETSU 'ya ait 12 MW GES projemizin geçici kabulü yapılmıştır. 3 yıl içerisinde ikisi çatı biri arazi projesi olmak üzere 17,8 MW GES projesinde Toyotetsu yönetimine bizimle çalıştığı için çok teşekkür ederiz. Kurumsal yapısı ve farklı iş kültürü ile firmamızın gelişimine katkıda bulundukları için de ayrıca teşekkür ederiz. Güzel bir 3 yılın kutlaması da olması amacıyla GES arazi projelerinde nadir olarak yapılan santral açılışımızı gerçekleştirdik. Bu projeyle birlikte Toyotetsu Türkiye'nin tüm elektrik tüketimi artık yenilenebilir enerjiyle karşılanmaktadır. Ülkemize, Toyotetsu'ya ve Şirketimize hayırlı olmasını dileriz.`
    }
  };

  const haber = haberData[slug] || null;

  if (!haber) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-500">Haber bulunamadı.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[250px] overflow-hidden -mt-20 pt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600">
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center px-6 py-8">
          <div className="text-center max-w-4xl px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-3 text-orange-500">
              {haber.title}
            </h1>
            <p className="text-sm md:text-base text-orange-500/90">
              {haber.date} • {haber.category}
            </p>
          </div>
        </div>
      </section>

      {/* Video ve İçerik Bölümü */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Video Player */}
            {haber.videoUrl && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
                <video
                  className="w-full h-full object-contain"
                  controls
                  autoPlay={false}
                >
                  <source src={haber.videoUrl} type="video/mp4" />
                  Tarayıcınız video oynatmayı desteklemiyor.
                </video>
              </div>
            )}

            {/* Açıklama Kutusu */}
            {haber.description && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
                <div className="text-gray-700 leading-relaxed text-xs md:text-sm">
                  {haber.description.split(/(TOYOTETSU|Toyotetsu)/gi).map((part, i) => 
                    part.toUpperCase() === 'TOYOTETSU' || part === 'Toyotetsu' ? (
                      <span key={i} className="text-green-600 font-semibold">{part}</span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Video yoksa mesaj */}
            {!haber.videoUrl && !haber.description && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Video ve açıklama yakında eklenecektir.</p>
                <a
                  href="/haberler"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
                >
                  Haberlere Dön
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


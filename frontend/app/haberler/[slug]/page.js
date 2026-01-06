// Dinamik haber detay sayfası - Video ve içerik gösterimi
'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function HaberDetay() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug;
  const page = searchParams.get('page') || '1';

  // Haber verileri - slug'a göre içerik
  const haberData = {
    'toyotetsu-12mw-ges-gecici-kabul': {
      title: "Toyotetsu'ya ait 12 MW GES projemizin geçici kabulü yapılmıştır.",
      date: "12.10.2024",
      category: "Proje",
      videoUrl: "/haberler/tt.mp4",
      description: `Proje geliştirmesinden geçici kabulüne kadar tüm işlemleri yaptığımız ve anahtar teslim olarak kurduğumuz Yozgat'ın Yerköy İlçesinde bulunan 190 dönümlük arazide TOYOTETSU 'ya ait 12 MW GES projemizin geçici kabulü yapılmıştır. 3 yıl içerisinde ikisi çatı biri arazi projesi olmak üzere 17,8 MW GES projesinde Toyotetsu yönetimine bizimle çalıştığı için çok teşekkür ederiz. Kurumsal yapısı ve farklı iş kültürü ile firmamızın gelişimine katkıda bulundukları için de ayrıca teşekkür ederiz. Güzel bir 3 yılın kutlaması da olması amacıyla GES arazi projelerinde nadir olarak yapılan santral açılışımızı gerçekleştirdik. Bu projeyle birlikte Toyotetsu Türkiye'nin tüm elektrik tüketimi artık yenilenebilir enerjiyle karşılanmaktadır. Ülkemize, Toyotetsu'ya ve Şirketimize hayırlı olmasını dileriz.`
    },
    '19500-kwp-ges-kabul': {
      title: "19.500 kWp kurulu gücündeki Güneş Enerji Santralinin kabul işlemleri tamamlanarak üretime başlamıştır.",
      date: "08.10.2024",
      category: "Proje",
      videoUrl: "/haberler/ags.mp4",
      description: `Proje geliştirmesi Zena Enerji tarafından yapılan anahtar teslim kurulumu Altun Grup Solar Enerji tarafından tamamlanan 19.500 kWp kurulu gücündeki Güneş Enerji Santralinin kabul işlemleri tamamlanarak üretime başlamıştır. Yatırımcılarımız Şık Makas ve Seki İnşaat firmalarına ve Ülkemize hayırlı olmasını dileriz.`
    },
    'toyotetsu-36mw-ges': {
      title: "Toyotetsu Otomotiv'e ait 3.6 MW'lık güneş enerji santralini anahtar teslim olarak tamamlamış bulunmaktayız.",
      date: "05.10.2024",
      category: "Proje",
      videoUrl: "/haberler/tt2.mp4",
      description: `Geçici kabulü tamamlanan GES tesisinin devreye alınması ile TOYOTETSU Otomotiv Parçaları San. ve Tic. A.Ş.'nin enerjisinin %30'u güneş enerjisinden karşılanacaktır. Ülkemizin enerji bağımsızlığı için yaptığımız çalışmalara bir yenisini daha eklemekten gurur duyuyoruz.`
    },
    '1200-kw-ges-gecici-kabul': {
      title: "1200 kW'lık güneş enerjisi santralimizin geçici kabulü tamamlanıp üretime başlamıştır.",
      date: "03.10.2024",
      category: "Proje",
      videoUrl: "/haberler/elektroaktif.mp4",
      description: `Cumhuriyet şehrimiz Sivas'ta proje geliştirmesini ve anahtar teslim kurulumunu yaptığımız 1200 kW'lık güneş enerjisi santralimizin geçici kabulü tamamlanıp üretime başlamıştır. Yatırımcımız Elektroaktif Bobinaj firması ve ülkemize hayırlı olmasını dileriz.`
    },
    'toyotetsu-226mw-ges': {
      title: "Toyotetsu Otomotiv'e ait 2.26 MW'lık güneş enerjisi santralini anahtar teslim olarak tamamlamış bulunmaktayız.",
      date: "25.09.2024",
      category: "Proje",
      videoUrl: "/haberler/tt3.mp4",
      description: `Tamamlamış olduğumuz bu proje Toyota Türkiye ve TOSB OTOMOTİV TEDARİK SANAYİ İHTİSAS ORGANİZE SANAYİ BÖLGESİ'nin ilk GES projesi olma özelliğini taşımaktadır. Ülkemiz için büyük değer oluşturan TOYOTETSU Otomotiv Parçaları San. ve Tic. A.Ş. projesinin başından sonuna kadar yer almak bizi ayrıca onurlandırmıştır.`
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
            <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white">
              {haber.title}
            </h1>
            <p className="text-sm md:text-base text-white/90">
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
                  {(() => {
                    let text = haber.description;
                    // Yeşil vurgular
                    const greenTerms = [
                      'TOYOTETSU', 'Toyotetsu', 
                      'Otomotiv Parçaları San. ve Tic. A.Ş.',
                      'Altun Grup Solar Enerji',
                      'Şık Makas',
                      'Seki İnşaat',
                      'Elektroaktif Bobinaj'
                    ];
                    // Turuncu vurgular
                    const orangeTerms = ['Zena Enerji'];
                    // Kalın vurgular
                    const boldTerms = ['Sivas'];
                    
                    // Önce yeşil terimleri işaretle
                    greenTerms.forEach(term => {
                      const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                      text = text.replace(regex, '||GREEN||$1||/GREEN||');
                    });
                    
                    // Sonra turuncu terimleri işaretle
                    orangeTerms.forEach(term => {
                      const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                      text = text.replace(regex, '||ORANGE||$1||/ORANGE||');
                    });
                    
                    // Sonra kalın terimleri işaretle
                    boldTerms.forEach(term => {
                      const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                      text = text.replace(regex, '||BOLD||$1||/BOLD||');
                    });
                    
                    // İşaretlenmiş metni parse et
                    const parts = text.split(/(\|\|GREEN\|\|.*?\|\|\/GREEN\|\||\|\|ORANGE\|\|.*?\|\|\/ORANGE\|\||\|\|BOLD\|\|.*?\|\|\/BOLD\|\|)/);
                    
                    return parts.map((part, i) => {
                      if (part.startsWith('||GREEN||')) {
                        const content = part.replace(/\|\|GREEN\|\||\|\|\/GREEN\|\|/g, '');
                        return <span key={i} className="text-green-600 font-semibold">{content}</span>;
                      } else if (part.startsWith('||ORANGE||')) {
                        const content = part.replace(/\|\|ORANGE\|\||\|\|\/ORANGE\|\|/g, '');
                        return <span key={i} className="text-orange-500 font-semibold">{content}</span>;
                      } else if (part.startsWith('||BOLD||')) {
                        const content = part.replace(/\|\|BOLD\|\||\|\|\/BOLD\|\|/g, '');
                        return <span key={i} className="font-bold">{content}</span>;
                      }
                      return <span key={i}>{part}</span>;
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Geri Dön Butonu */}
            <div className="text-center pt-4">
              <a
                href={`/haberler?page=${page}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Haberlere Dön
              </a>
            </div>

            {/* Video yoksa mesaj */}
            {!haber.videoUrl && !haber.description && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Video ve açıklama yakında eklenecektir.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


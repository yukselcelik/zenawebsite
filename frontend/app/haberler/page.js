// Haberler sayfası - Zena Enerji haberleri ve güneş enerjisi haberleri
// Bu sayfa şirket haberlerini ve sektör haberlerini listeler

'use client'; // Client-side bileşen - Framer Motion animasyonları için gerekli

import { useState, useEffect, Suspense } from 'react'; // useState ve useEffect hook'ları - sayfalama için
import { useSearchParams, useRouter } from 'next/navigation'; // URL parametreleri için
import Header from '../components/Header'; // Header bileşenini import ediyoruz
import Footer from '../components/Footer'; // Footer bileşenini import ediyoruz
import { motion } from 'framer-motion'; // Framer Motion - animasyonlar için

function HaberlerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // URL'den sayfa numarasını oku
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  
  // Sayfa durumu
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const itemsPerPage = 6; // Her sayfada 6 haber

  // URL'den sayfa değiştiğinde state'i güncelle
  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  // Haber verileri - Toplam 12 haber (2 sayfa)
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
    },
    {
      id: 7,
      title: "Len Challenger Cup Şampiyonu Olduk",
      hoverTitle: "Sponsoru olduğumuz Galatasaray Su Topu Takımımız Avrupa Şampiyonu olmuştur. Türk'ün Avrupadaki sesi Aslanlarımızı tebrik ederiz.",
      date: "01.10.2024",
      category: "Spor",
      image: "/haberler/gs2.jpeg",
      hasVideo: false,
      slug: "len-challenger-cup-sampiyonu",
      externalUrl: "https://www.galatasaray.org/sl/sutopu-ana-sayfa/9"
    },
    {
      id: 8,
      title: "YTÜ ile KOOP protokolü imzaladık.",
      hoverTitle: "Şirketimiz Zena Enerji ile YTÜ arasında KOOP Eğitim Modeli (İşletmede Mesleki Eğitim) kapsamında KOOP protokolü imzalanmıştır.",
      date: "28.09.2024",
      category: "Eğitim",
      image: "/haberler/ytu.jpeg",
      hasVideo: false,
      slug: "ytu-koop-protokolu",
      externalUrl: "https://elk.yildiz.edu.tr/duyurular/ytu-koop-egitim-modeli-isletmede-mesleki-egitim-protokolu-zena-enerji"
    },
    {
      id: 9,
      title: "Toyotetsu Otomotiv'e ait 2.26 MW'lık güneş enerjisi santralini anahtar teslim olarak tamamlamış bulunmaktayız.",
      date: "25.09.2024",
      category: "Proje",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      hasVideo: true,
      slug: "toyotetsu-226mw-ges"
    },
    {
      id: 10,
      title: "Termal Drone tarafından düzenlenen Workshop etkinliğine katıldık.",
      hoverTitle: "Etkinlikte şirketimizin vizyonundan ve özellikle Kara Yorga ekibimizin gerçekleştirdiği İHA ile yaptığımız termal test hizmetimizden bahsettik. Davetlerinden ötürü Termal Drone ekibine ve bizleri dinleyen başta Türk Silahlı Kuvvetleri mensubu olmak üzere tüm değerli katılımcılara teşekkür ederiz.",
      date: "22.09.2024",
      category: "Etkinlik",
      image: "/haberler/termal.jpg",
      hasVideo: false,
      slug: "termal-drone-workshop"
    },
    {
      id: 11,
      title: "Zena Enerji ile Toyota grubundan Toyotetsu ile 2,266 kw GES projesinde anahtar teslim EPC olarak anlaşmaya varılmıştır.",
      hoverTitle: "Firmanın Kocaeli Çayırova TOSB'da bulunan fabrikasının 23.000 m2'lik çatısına kurulum işlemimiz başlamıştır. Bu proje Mayıs ayı sonunda tamamlanacak olup, hem TOYOTA grubunun hemde TOSB içerisinde gerçekleşen ilk Güneş Enerjisi projesi olacaktır.",
      date: "20.09.2024",
      category: "Proje",
      image: "/haberler/tt4.jpg",
      hasVideo: false,
      slug: "toyotetsu-2266kw-ges-epc"
    },
    {
      id: 12,
      title: "Solar istanbul Fuarına Katılım Gösterdik.",
      hoverTitle: "Zena Enerji olarak Güneş Enerjisinin önemli fuarlarından Solar İstanbul'da E-09 standında yer aldık.",
      date: "18.09.2024",
      category: "Etkinlik",
      image: "/haberler/fuar.jfif",
      hasVideo: false,
      slug: "solar-istanbul-fuari"
    },
    {
      id: 13,
      title: "Kütahya ve Burdur Toplam 16 MW GES Termal İncelemesi Tamamlandı.",
      hoverTitle: "Tekfen ve Zen Enerji ortaklığında kurulan Kütahya ve Burdur ilinde bulunan Toplam Gücü 16 MWp olan Güneş Enerji Santrallerinin yapay zeka ile termal incelenmesi tamamlanmıştır.",
      date: "15.09.2024",
      category: "Proje",
      image: "/haberler/dron.jpg",
      hasVideo: false,
      slug: "kutahya-burdur-16mw-termal-inceleme"
    },
    {
      id: 14,
      title: "Akfen 10 MW MT GES Termal incelemesi Tamamlandı.",
      hoverTitle: "Zena Enerji olarak, Konya Ereğlide bulunan Akfen Holdinge ait MT GES 10 MW Gücündeki güneş enerji santralinin İHA ve yapay zeka ile termal incelemesini gerçekleştirdik.",
      date: "12.09.2024",
      category: "Proje",
      image: "/haberler/dron2.jpg",
      hasVideo: false,
      slug: "akfen-10mw-mt-ges-termal-inceleme"
    },
    {
      id: 15,
      title: "Teknopark istanbul Zena Enerji Röportajı",
      hoverTitle: "Zena Enerji Sayın Genel Müdürümüz, Yüksel Çağrı Gürses'in İstanbul Ticaret ile gerçekleştirdiği Teknopark İstanbul röpartajı.",
      date: "10.09.2024",
      category: "Genel",
      image: "/haberler/gazete.jpg",
      hasVideo: false,
      slug: "teknopark-istanbul-zena-enerji-roportaj",
      externalUrl: "https://www.teknoparkistanbul.com.tr/"
    },
    {
      id: 16,
      title: "Sivas Zara 648 kWp Güneş Enerji Santrali Anahtar Teslim Olarak Tarafımızca Yapılıp Devreye Alınmıştır.",
      hoverTitle: "Zena Enerji olarak, Sivas ilinde başladığımız Güneş Santrali kurulumu bitmiş olup sıfırdan anahtar teslimi gerçekleştirilmiştir. Güneş Enerjisi Santrali kurulumu hakkında bilgi edinmek için lütfen iletişime geçiniz.",
      date: "08.09.2024",
      category: "Proje",
      image: "/haberler/sivas.jpg",
      hasVideo: false,
      slug: "sivas-zara-648-kwp-ges",
      externalUrl: "http://localhost:3001/projelerimiz"
    },
    {
      id: 17,
      title: "Akıllı İHA'lar GES'lerin hizmetinde!",
      hoverTitle: "Actus Solar ve Zena Enerji \"Yapay Zekayla Panel Verimi Maksimizasyonu\" hizmeti vermeye başladı.",
      date: "05.09.2024",
      category: "Teknoloji",
      image: "/haberler/dron3.png",
      hasVideo: false,
      slug: "akilli-iha-ges-hizmeti"
    },
    {
      id: 18,
      title: "Zena Enerji ile Singapurun Köklü Teknoloji Firması Ava Asia ile Çözüm Ortaklığı Anlaşmasına Varıldı.",
      date: "03.09.2024",
      category: "İşbirliği",
      image: "/haberler/dron4.jpg",
      hasVideo: false,
      slug: "zena-enerji-ava-asia-cozum-ortakligi",
      externalUrl: "https://www.teknoparkistanbul.com.tr/haberler/gunes-enerjisinde-ihayla-yuksek-verim",
      titleLinks: {
        "Ava Asia": "https://www.avaasia.co/",
        "Çözüm Ortaklığı Anlaşmasına": "https://www.teknoparkistanbul.com.tr/haberler/gunes-enerjisinde-ihayla-yuksek-verim"
      }
    }
  ];

  // Sayfalama hesaplamaları
  const totalPages = Math.ceil(news.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = news.slice(startIndex, endIndex);

  // Sayfa değiştirme fonksiyonları
  const goToPage = (page) => {
    setCurrentPage(page);
    // URL'i güncelle
    router.push(`/haberler?page=${page}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            
            {/* Haber kartları - Sadece mevcut sayfadaki haberler */}
            {currentNews.map((item, index) => (
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
                    style={item.id === 15 ? { objectPosition: 'center bottom' } : {}}
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
                        <h3 className="font-bold leading-tight group-hover:hidden text-base md:text-lg">
                          {item.titleLinks ? (
                            // Özel linkler varsa (ID 18 için)
                            (() => {
                              let titleText = item.title;
                              const parts = [];
                              let lastIndex = 0;
                              
                              // Tüm linkleri bul ve sırala
                              const linkPositions = [];
                              Object.keys(item.titleLinks).forEach(keyword => {
                                const index = titleText.indexOf(keyword);
                                if (index !== -1) {
                                  linkPositions.push({ index, keyword, url: item.titleLinks[keyword] });
                                }
                              });
                              
                              // Pozisyonlara göre sırala
                              linkPositions.sort((a, b) => a.index - b.index);
                              
                              linkPositions.forEach(({ index, keyword, url }) => {
                                // Önceki metni ekle
                                if (index > lastIndex) {
                                  parts.push(titleText.substring(lastIndex, index));
                                }
                                // Linki ekle
                                parts.push(
                                  <a
                                    key={`${keyword}-${index}`}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-orange-400 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {keyword}
                                  </a>
                                );
                                lastIndex = index + keyword.length;
                              });
                              
                              // Kalan metni ekle
                              if (lastIndex < titleText.length) {
                                parts.push(titleText.substring(lastIndex));
                              }
                              
                              return parts.length > 0 ? parts : titleText;
                            })()
                          ) : (
                            item.title
                          )}
                        </h3>
                        <h3 className="font-bold leading-tight hidden group-hover:block text-xs md:text-sm">
                          {item.hoverTitle}
                        </h3>
                      </>
                    ) : (
                      <h3 className="font-bold leading-tight text-base md:text-lg">
                        {item.titleLinks ? (
                          // Özel linkler varsa
                          (() => {
                            let titleText = item.title;
                            const parts = [];
                            let lastIndex = 0;
                            
                            const linkPositions = [];
                            Object.keys(item.titleLinks).forEach(keyword => {
                              const index = titleText.indexOf(keyword);
                              if (index !== -1) {
                                linkPositions.push({ index, keyword, url: item.titleLinks[keyword] });
                              }
                            });
                            
                            linkPositions.sort((a, b) => a.index - b.index);
                            
                            linkPositions.forEach(({ index, keyword, url }) => {
                              if (index > lastIndex) {
                                parts.push(titleText.substring(lastIndex, index));
                              }
                              parts.push(
                                <a
                                  key={`${keyword}-${index}`}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline hover:text-orange-400 transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {keyword}
                                </a>
                              );
                              lastIndex = index + keyword.length;
                            });
                            
                            if (lastIndex < titleText.length) {
                              parts.push(titleText.substring(lastIndex));
                            }
                            
                            return parts.length > 0 ? parts : titleText;
                          })()
                        ) : (
                          item.title
                        )}
                      </h3>
                    )}
                    
                    <motion.a 
                      href={item.externalUrl || `/haberler/${item.slug || `haber-${item.id}`}${item.hasVideo ? `?page=${currentPage}` : ''}`}
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

          {/* Sayfalama kontrolleri */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              {/* Önceki sayfa butonu */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Sayfa numaraları */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    currentPage === page
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Sonraki sayfa butonu */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer bileşeni */}
      <Footer />
    </div>
  );
}

export default function Haberler() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <HaberlerContent />
    </Suspense>
  );
}

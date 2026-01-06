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
      description: "Güneş enerji sistemlerinde tespit edilemeyen panel kusurları için havadan termal kameralarla inceleme ve yapay zeka (AI) analizleri yapıyoruz. 10MW kapasiteli bir GES için bile 70-80 sayfalık panel hasar raporunu 1 saat içinde hazır edebiliyoruz."
    },
    {
      title: "Termal İncelemede Yapay Zeka",
      description: "Toplamda 4 GW'lık Güneş enerji santrali ölçümlerinden elde edilen veriler ile hazırlanmış Yapay zeka programımız sayesinde Termal kameralarla aldığımız verileri işleyerek çok hızlı ve kesin doğruluk payına sahip bir rapor hazırlıyoruz."
    },
    {
      title: "Sıcak Noktaları Görüntü Analizi ile Raporluyoruz",
      description: "Güneş enerji panellerinin Hot spot olarak bilinen sıcak noktaları termal kameralı İHA'lar tarafından incelenir. Sıcak noktaları ve İnsan gözü ile görülemeyecek daha birçok kusurları Yapay zeka yazılımımız kullanılarak çok hızlı bir şekilde hatalar tespit edilip detaylı bir rapor haline getirilir."
    },
    {
      title: "PV Panel Hatalarını Onarıyoruz",
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
                initial={{ opacity: 0, x: 100, rotateY: -90 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -100, rotateY: 90 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <h1 className="text-[19px] md:text-[25px] lg:text-[31px] font-bold mb-6">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-[13.5px] md:text-[15.5px] text-white/90 mb-8 leading-relaxed">
                  {slides[currentSlide].description}
                </p>
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

      {/* İçerik Bölümleri */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Ana Başlık */}
          <h2 className="text-[25px] md:text-[31px] font-bold text-gray-900 mb-6 text-center uppercase">
            GÜNEŞ ENERJİ SANTRALİ TERMAL İNCELEME VE PANEL ONARIMI
          </h2>
          
          {/* Açıklama Paragrafı */}
          <div className="mb-16 text-center max-w-5xl mx-auto">
            <p className="text-[13.5px] md:text-[15.5px] text-gray-700 leading-relaxed mb-4">
              Programlanmış <strong>İHA'lar</strong> otomatik olarak Güneş Enerji Santrali (GES) sahalarına konuşlandırılarak yüksek kaliteli havadan veri toplama işlemi gerçekleştirilir. Bu otonom <strong>İHA'lar</strong>, gizli kusurları veya sorunları tespit etmek için panellerin termal incelemesini yaparak tüm güneş panellerinin kapsamlı taramasını sağlar. Panel verimliliğini düşüren noktaları belirlemek için <strong className="text-orange-500">"Hot-spot ölçümleri"</strong> gerçekleştirirler.
            </p>
            <p className="text-[13.5px] md:text-[15.5px] text-gray-700 leading-relaxed mb-4">
              Hızlı termal testler için tüm panellerde <strong className="text-orange-500">"Termal kameralar"</strong> bulunan otonom <strong>İHA'lar</strong> kullanılır. <strong className="text-orange-500">"Yapay zeka (AI)"</strong> yazılımı <strong className="text-orange-500">"görüntü işleme"</strong> için kullanılarak detaylı raporlar oluşturulur. Raporlamadan sonra, <strong>Zena Enerji</strong> tespit edilen panel hatalarının ve kusurlarının onarım ve bakımını gerçekleştirir. Bu hizmet, müşteriler ve yatırımcılar için güneş enerji santrallerinden elde edilen verimliliği maksimize etmeyi amaçlar.
            </p>
          </div>

          {/* 3 Kart - Termal İncelemeler, Panel Arızaları, Panel Tamiri */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Kart 1: Termal İncelemeler */}
            <motion.div
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <div className="h-64 relative overflow-hidden">
                <img 
                  src="/termal/t1.jpg" 
                  alt="Termal İnceleme" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-[15px] font-bold text-gray-900 mb-4">Termal İncelemelerimiz</h3>
                <p className="text-[13.5px] text-gray-700 leading-relaxed">
                  İHA'larda bulunan <strong className="text-orange-500">Termal kameralar</strong> ile incelemelerimiz sonucu insan gözüyle görünmeyecek hatalar ortaya çıkar.
                </p>
              </div>
            </motion.div>

            {/* Kart 2: Panel Arızaları */}
            <motion.div
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="h-64 relative overflow-hidden">
                <img 
                  src="/termal/t2.jpg" 
                  alt="Panel Arızaları" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-[15px] font-bold text-gray-900 mb-4">Panel Arızaları</h3>
                <p className="text-[13.5px] text-gray-700 leading-relaxed">
                  Zena Enerji, <strong className="text-orange-500">yapay zeka yazılımının</strong> termal görüntülerden bulduğu bazı panel kusurları.
                </p>
              </div>
            </motion.div>

            {/* Kart 3: Panel Tamiri */}
            <motion.div
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="h-64 relative overflow-hidden">
                <img 
                  src="/termal/t3.jpg" 
                  alt="Panel Tamiri" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-[15px] font-bold text-gray-900 mb-4">Panel Tamiri ve Yenilenmesi</h3>
                <p className="text-[13.5px] text-gray-700 leading-relaxed">
                  Zena Enerji olarak <strong className="text-orange-500">Yapay Zeka yazılımımızla</strong> tespit ettiğimiz arızalı ve kusurlu panellerin tamir, onarım ve ihtiyaç halinde yenileme işlemlerini gerçekleştiriyoruz.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Termal Görüntü İşleme ve Yapay Zeka Bölümü */}
          <div className="mb-16">
            <div className="bg-white rounded-2xl p-8 md:p-12 relative overflow-hidden">
              {/* Arka plan görseli - sağda, sol tarafı saydam */}
              <div className="absolute right-0 top-0 bottom-0 w-full md:w-2/3 lg:w-1/2">
                <div className="relative h-full w-full">
                  <img 
                    src="/aıgpt.png" 
                    alt="Yapay Zeka Görseli" 
                    className="w-full h-full object-cover object-right"
                  />
                  {/* Sol taraftan sağa gradient overlay - saydamdan opak */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent"></div>
                </div>
              </div>
              
              {/* İçerik - üstte */}
              <div className="relative z-10">
                <div className="mb-8">
                  <p className="text-[15.5px] text-gray-700 mb-4">
                    Güneş paneli verimliliğinizi arttırmak için <strong className="text-orange-500">AI Termal İHA Testi</strong> harika bir çözüm yoludur.
                  </p>
                  <h3 className="text-[19px] md:text-[25px] font-bold text-gray-900 mb-2 uppercase">
                    TERMAL GÖRÜNTÜ İŞLEME VE YAPAY ZEKA (AI)
                  </h3>
                  <div className="w-24 h-1 bg-orange-500 mt-2"></div>
                </div>
                
                <div className="max-w-md">
                  <p className="text-[13.5px] md:text-[15.5px] text-gray-700 leading-relaxed mb-6">
                    Tescilli <strong className="text-orange-500">Yapay zeka (AI) yazılımımızı</strong> kullanarak, <strong className="text-orange-500">Güneş Enerji Santralindeki</strong> anormallikleri belirlemeye ve bu sorunları çözmeye yardımcı olmak için <strong>İHA'dan</strong> elde edilen <strong className="text-orange-500">termal kamera</strong> verileri ve görsel görüntülerin işlenmesi sonucunda raporlarımızı oluşturuyoruz. <strong className="text-orange-500">Makine öğrenimi algoritmalarımızla</strong>, yazılımımız <strong className="text-orange-500">Güneş Enerji</strong> santralinin performansını düşürebilecek olası veya ihmal edilmiş kusurları tespit etmek için her bir paneli analiz eder ve kısa bir süre içinde detaylı bir raporlama gerçekleştirir.
                  </p>
                  
                  <div className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200">
                    <h4 className="text-[15px] font-bold text-gray-900 mb-3">Yapay Zeka ile Veriminizi Arttırın</h4>
                    <p className="text-[13.5px] text-gray-700 leading-relaxed">
                      <strong className="text-orange-500">Yapay Zeka</strong> teknolojimiz ile panel verimliliğinizi test edelim ve detaylı raporlamalarını gerçekleştirelim.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Zena Enerji Onarım Hizmetleri */}
          <div className="mb-16 bg-white rounded-2xl p-8 md:p-12">
            <h3 className="text-[19px] md:text-[25px] font-bold text-gray-900 mb-6 text-center">
              ZENA ENERJİ TESPİT EDİLEN PANEL KUSURLARINI DA ONARIR
            </h3>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-[13.5px] md:text-[15.5px] text-gray-700 leading-relaxed mb-8">
                <strong className="text-yellow-500">Zena Enerji</strong> olarak, pv panellerde tespit ettiğimiz anormallikleri veya kusurları profesyonel teknik ekibimiz ile onarım işlemlerini gerçekleştiriyoruz. Hatta dilerseniz panellerinizi daha verimli ve güç değeri yüksek yeni paneller ile değiştiriyoruz. Bu işlemler sonucunda sahip olduğunuz <strong className="text-yellow-500">Güneş Enerji Santralinizin</strong> verimini ve ömrünü maksimum seviyeye çıkarırız.
              </p>
              
              <h4 className="text-[15px] md:text-[19px] font-bold text-red-600 mb-6">
                TESPİT ETTİĞİMİZ KUSURLAR:
                <div className="w-24 h-1 bg-orange-500 mt-2"></div>
              </h4>
              
              <ul className="space-y-4">
                {[
                  "Gölgeleme sorunları",
                  "Kir Tortuları / Aşırı Kirlenme / Kuş Pisliği",
                  "Arızalı Paneller - örneğin, Bypass diyotları, Mikro çatlaklar, Sıcak Noktalar, Potansiyel Kaynaklı Bozunma (PID), Delaminasyon ve Dahili Korozyon, Salyangoz İzi Kontaminasyonu vb.",
                  "Elektrik Sorunları / Arızalı Kablolar, kablolarda kemirgen hasarı, topraklama hataları, kablolarda çizikler vb.",
                  "İnvertör / String Sorunları - örneğin, Açık Devre stringleri, Kısa Devre sitringleri, Düşük Performans, vb."
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3 text-[13.5px] text-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <svg 
                      className="w-6 h-6 text-orange-500 mt-0.5 flex-shrink-0" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="flex-1">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Santral Verimini Arttırma - 3 Kart */}
          <div className="mb-16">
            <h3 className="text-[19px] md:text-[25px] font-bold text-gray-900 mb-4 text-center uppercase">
              SANTRAL VERİMİNİZİ HEMEN ARTTIRALIM
            </h3>
            <div className="max-w-4xl mx-auto mb-12">
              <p className="text-[13.5px] md:text-[15.5px] text-gray-700 leading-relaxed text-center">
                <strong>Zena Enerji</strong> olarak <strong>İHA incelemesi</strong> ve <strong className="text-orange-500">yapay zeka (AI) yazılımımızı</strong> kullanarak güneş enerji tesislerindeki <strong>pv panel</strong> performansını optimize ediyoruz. Ayrıca <strong className="text-orange-500">YEKDEM gelirli GES sahiplerine %500 seviyelerinde risksiz getiriyi (IRR)</strong> sunuyoruz ve <strong className="text-orange-500">panel tamiri dâhil 1 ay içerisinde</strong> hizmet paketimizle <strong className="text-orange-500">Santral Veriminizi Arttırın.</strong>
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Kart 1 */}
              <motion.div
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src="/termal/t4.jpg" 
                    alt="Havadan İnceleme" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-[13px] font-bold text-gray-900 mb-3">Güneş PV Santrali için Havadan İnceleme Yapın Zamandan Tasarruf edin</h4>
                  <p className="text-gray-700 leading-relaxed text-[11.5px]">
                    Güneş Enerji Santralinizde termal <strong>İHA incelemesi</strong> ile zamandan tasarruf edersiniz. Panellerin havadan incelenmesi sorunların daha hızlı bir şekilde çözülmesine imkan tanır.
                  </p>
                </div>
              </motion.div>

              {/* Kart 2 */}
              <motion.div
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src="/termal/t5.jpg" 
                    alt="Hata Tespit" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-[13px] font-bold text-gray-900 mb-3">Tesisteki Hataları Tespit Edelim ve Raporlayalım</h4>
                  <p className="text-gray-700 leading-relaxed text-[11.5px]">
                    Panellerde <strong className="text-orange-500">Termal inceleme</strong> işleminden sonra Gelişmiş <strong className="text-orange-500">yapay zeka (AI) yazılımımız</strong>, tesisteki anormallikleri veya olası kusurları tespit eder ve toplanan tüm verileri analiz ettikten sonra hızlı bir şekilde raporlama için kullanır.
                  </p>
                </div>
              </motion.div>

              {/* Kart 3 */}
              <motion.div
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src="/termal/t6.jpg" 
                    alt="AVA Asia" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-[13px] font-bold text-gray-900 mb-3">AVA Asia ile Çözüm ortağıyız</h4>
                  <p className="text-gray-700 leading-relaxed text-[11.5px]">
                    Güneş enerjisi panel ve santralinizin verimini ölçmek ve raporlamalarını yapmak amacıyla <strong>İHA ile termal test</strong> işlemini gerçekleştiriyoruz. Bu verileri Singapur'lu iş ve çözüm ortağımız <strong>AVA Asia</strong> ile paylaşarak <strong className="text-orange-500">görüntü işleme</strong> ve <strong className="text-orange-500">yapay zeka (AI)</strong> ile birlikte kısa sürede raporluyoruz.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Profesyonel İHA Pilot Ekibi */}
          <div className="bg-gradient-to-br from-orange-50 via-white to-teal-50 rounded-2xl p-8 md:p-12">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-[15.5px] md:text-[17.5px] text-gray-700 mb-6">
                <strong className="text-orange-500">Yapay zeka (AI) yazılımımız</strong> <strong className="text-orange-500">güneş enerjisi</strong> panellerinin <strong className="text-red-500">hot spot</strong> noktalarını ve farklı kusurların tespitinde <strong>% 100 doğruluk oranına sahiptir.</strong>
              </p>
              
              <h3 className="text-[19px] md:text-[25px] font-bold text-gray-900 mb-4 uppercase">
                PROFESYONEL İHA PİLOT EKİBİMİZ VE ENERJİ UZMANLARIMIZLA HİZMETİNİZDEYİZ
              </h3>
              <div className="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
              
              <p className="text-[13.5px] md:text-[15.5px] text-gray-700 leading-relaxed">
                Herhangi bir yerde <strong className="text-orange-500">güneş paneli</strong> sisteminiz için <strong>İHA incelemesinin</strong> tüm işlemleri ve düzenlemeleri hakkında bize danışın. Profesyonel olarak eğitilmiş İHA pilotlarından ve <strong className="text-orange-500">güneş enerjisi</strong> uzmanlarından oluşan ekibimiz, doğrudan <strong className="text-orange-500">termal İHA'lar</strong> ile panellerde <strong className="text-orange-500">termal inceleme</strong> yaparak <strong className="text-red-500">hot-spot</strong> noktalarını ve daha bir çok veriyi toplamanıza yardımcı olur, bunları <strong className="text-orange-500">yapay zeka (AI) yazılımımızla</strong> analiz eder ve sonuçları sizin için kapsamlı bir rapor halinde sunarız.
              </p>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}


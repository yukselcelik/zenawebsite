// Hizmetler sayfası - Zena Enerji'nin sunduğu hizmetleri görsellerle gösterir
// Her hizmet kartı hover animasyonu ile kararma efekti içerir

'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState } from 'react';

export default function Hizmetler() {
  const [hoveredService, setHoveredService] = useState(null);

  // Hizmetler verisi - görseller ve içerikler
  const services = [
    {
      id: 1,
      title: "GES Proje Geliştirme İşlemleri",
      description: "GES projelerinde sağlam bir altyapının oluşturulması, proje geliştirme sürecinin doğru yönetilmesine bağlıdır. Bu süreç, projenin en temel ve en kritik aşamasını oluşturur. Firmamız, proje geliştirme sürecini yürürlükteki mevzuatlara tam uyumlu şekilde, alanında uzman kadrosuyla titizlikle gerçekleştirmektedir. Her adımı özenle planlanan bu süreçle, projelerinizi güvenle hayata geçiriyoruz.",
      backgroundImage: "/1.jpg"           // 1. görsel
    },
    {
      id: 2,
      title: "Danışmanlık Ve Teknik İnceleme",
      description: "Zena Enerji, mevcut veya yeni güneş santralleri için 300'e yakın kriteri inceleyerek verim, raporlama ve fizibilite analizleri sunmaktadır. Bu hizmet sayesinde yatırımcılar, santrallerine ait gerçek teknik ve finansal verilere güvenilir şekilde ulaşabilmektedir.",
      backgroundImage: "/2.jpg"           // 2. görsel
    },
    {
      id: 3,
      title: "Yapay Zeka Destekli Termal Test Ve Raporlama",
      description: "Güneş enerji sistemlerinde oluşan \"hot spot\" sıcak noktaları, İHA'larımızdaki termal kameralarla hızlıca tespit edilmekte, ardından Büyük Veri Analitiği, Yapay Zeka ve Makine Öğrenimi ile doğru, hızlı ve maliyet avantajlı çözümler sunulmaktadır.",
      backgroundImage: "/3.jpg"           // 3. görsel
    },
    {
      id: 4,
      title: "İşletme Ve Bakım Hizmetleri",
      description: "Zena Enerji, işletme ve bakım (O&M) hizmetleriyle güneş enerji santrallerinizin performansını artırarak sürdürülebilir ve verimli enerji üretimi sağlar. Bakım, onarım, izleme ve yönetim faaliyetlerimizle yatırımınızın fizibilite aşamasındaki hedef değerlere ulaşmasına destek oluyoruz.",
      backgroundImage: "/4.jpg"           // 4. görsel
    },
    {
      id: 5,
      title: "Anahtar Teslim GES Kurulum İşlemleri",
      description: "Zena Enerji, lisanslı ve lisanssız güneş enerjisi tesislerinde tüm izinlerden kurulum ve kabul işlemlerine kadar süreci yöneterek santral kurulumunu anahtar teslim olarak gerçekleştirmektedir.",
      backgroundImage: "/5.jpg"           // 5. görsel
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Sayfa başlığı */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-orange-500 mb-6">
            Hizmetlerimiz
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Zena Enerji olarak, güneş enerjisi sektöründe proje geliştirme, proje uygulama, imar uygulamaları, saha kurulumu, geçici kabul işlemleri, danışmanlık ve müşterilerimizin portföy verimliliğini en üst düzeye çıkarmak için kapsamlı hizmet sunuyoruz. Güneş PV tesislerindeki sorunları anlamaya yardımcı olmak amacıyla İHA'lar ile inceleme ve İHA'larda bulunan termal kamera ile havadan güneş enerjisi tesislerinin denetimi yapılmaktadır.
          </p>
        </div>
      </section>

      {/* Hizmetler kartları - Her biri tam genişlikte hero section gibi */}
      <section className="py-0">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="relative w-full min-h-[600px] md:min-h-[700px] overflow-hidden"
            onMouseEnter={() => setHoveredService(service.id)}
            onMouseLeave={() => setHoveredService(null)}
          >
            {/* Arka plan görseli */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700"
              style={{ 
                backgroundImage: `url(${service.backgroundImage})`,
                transform: hoveredService === service.id ? 'scale(1.05)' : 'scale(1)'
              }}
            />
            
            {/* Kararma overlay - hover'da daha koyu */}
            <div 
              className={`absolute inset-0 transition-all duration-500 ${
                hoveredService === service.id ? 'bg-black/70' : 'bg-black/50'
              }`}
            />
            
            {/* İçerik container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[600px] md:min-h-[700px] flex items-center">
              <div className="w-full text-center max-w-4xl mx-auto text-white">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-orange-500">
                  {service.title}
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-300 shadow-lg">
                    Daha Fazla Bilgi
                  </button>
                  <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-300 flex items-center gap-2">
                    Bize Ulaşın
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}

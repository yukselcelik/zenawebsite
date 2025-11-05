// Hizmetler sayfası - Zena Enerji'nin sunduğu 6 ana hizmeti gösterir
// Bu sayfa şirketin hizmetlerini detaylı olarak açıklar

'use client'; // Client-side bileşen - state yönetimi için

import Header from '../components/Header'; // Header bileşenini import ediyoruz
import Footer from '../components/Footer'; // Footer bileşenini import ediyoruz
import { useState } from 'react'; // useState hook'u - aktif tab yönetimi için

export default function Hizmetler() {
  // useState ile hangi hizmet kartının aktif olduğunu yönetiyoruz
  const [activeService, setActiveService] = useState(null);

  // Hizmetler verisi - 6 ana hizmet
  const services = [
    {
      id: 1,
      title: "Proje Geliştirme",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      description: "Güneş enerjisi projelerinizi baştan sona planlar ve geliştiririz."
    },
    {
      id: 2,
      title: "İmar Uygulamaları",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      description: "Tüm resmi izin ve onay süreçlerini yürütürüz."
    },
    {
      id: 3,
      title: "Saha Kurulumları",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      description: "Profesyonel ekip ile güvenli ve kaliteli kurulum yaparız."
    },
    {
      id: 4,
      title: "İHA İle Termal Test",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      description: "Drone teknolojisi ile termal analiz ve test hizmetleri sunuyoruz."
    },
    {
      id: 5,
      title: "İşletme Ve Bakım",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      description: "Santrallerinizin sürekli verimli çalışmasını sağlarız."
    },
    {
      id: 6,
      title: "Danışmanlık Ve Teknik İnceleme",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      description: "Uzman ekibimizle teknik danışmanlık ve inceleme hizmetleri veriyoruz."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header bileşeni */}
      <Header />
      
      {/* Sayfa başlığı */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Hizmetlerimiz
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Güneş enerjisi sektöründe kapsamlı hizmetlerimiz ile yanınızdayız.
          </p>
        </div>
      </section>

      {/* Hizmetler grid - 2x3 düzeninde */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Hizmet kartları - map fonksiyonu ile otomatik oluşturuluyor */}
            {services.map((service) => (
              <div
                key={service.id} // React için unique key
                className={`bg-gray-50 border-2 rounded-lg p-6 text-center transition-all duration-300 cursor-pointer ${
                  activeService === service.id 
                    ? 'border-orange-500 bg-orange-50 shadow-lg' 
                    : 'border-orange-200 hover:border-orange-300 hover:shadow-md'
                }`}
                onClick={() => setActiveService(activeService === service.id ? null : service.id)}
                onMouseEnter={() => setActiveService(service.id)}
                onMouseLeave={() => setActiveService(null)}
              >
                {/* İkon */}
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-orange-500">
                    {service.icon}
                  </div>
                </div>
                
                {/* Başlık */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                
                {/* Açıklama */}
                <p className="text-gray-600">
                  {service.description}
                </p>
                
                {/* Hover efekti için detay butonu */}
                {activeService === service.id && (
                  <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                    Detayları Gör
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hizmetler hakkında detay metni */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Neden Zena Enerji?
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Zena Enerji, güneş enerjisi sektöründe proje geliştirme, uygulama, imar, saha kurulumu, geçici kabul işlemleri, danışmanlık ve müşteri portföyü verimliliğini artırma konularında uzmanlaşmıştır. Ayrıca, güneş PV tesislerindeki sorunları tespit etmek amacıyla İHA'lar (insansız hava araçları) ve termal kameralar kullanılarak havadan denetim yapmaktadır.
            </p>
          </div>
          
          {/* Özellikler listesi */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Profesyonel Ekip</h3>
              <p className="text-gray-600">Alanında uzman mühendis ve teknisyen kadromuz</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hızlı Çözüm</h3>
              <p className="text-gray-600">Etkin proje yönetimi ile zamanında teslimat</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Güvenilir Hizmet</h3>
              <p className="text-gray-600">Kaliteli malzeme ve güvenilir kurulum</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer bileşeni */}
      <Footer />
    </div>
  );
}

// Termal Test ve Yapay Zeka sayfası - Detaylı hizmet bilgileri

'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermalTest() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[800px] md:min-h-[900px] lg:min-h-[1000px] overflow-hidden bg-gray-900">
        {/* Arka plan görseli */}
        <img 
          src="/9.jpg"
          alt="Termal test drone görseli"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        
        {/* Kararma overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* İçerik */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[800px] md:min-h-[900px] lg:min-h-[1000px] flex items-center">
          <div className="w-full text-center max-w-4xl mx-auto text-white">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
              Termal İncelemede Yapay Zeka
            </h1>
            <p className="text-base md:text-lg text-white/90 mb-8 leading-relaxed">
              Toplamda 4 GW'lık Güneş enerji santrali ölçümlerinden elde edilen veriler ile hazırlanmış Yapay zeka programımız sayesinde Termal kameralarla aldığımız verileri işleyerek çok hızlı ve kesin doğruluk payına sahip bir rapor hazırlıyoruz.
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg text-base transition-colors duration-300 shadow-lg">
              Daha Fazla Bilgi
            </button>
            <div className="mt-4 w-24 h-0.5 bg-orange-500 mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Hizmetin Özellikleri Bölümü */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Hizmetin Özellikleri
          </h2>
          
          <p className="text-sm md:text-base text-gray-700 mb-12 text-center max-w-4xl mx-auto leading-relaxed">
            Güneş santrallerinizdeki tüm sorunları hızlı, güvenli ve doğru bir şekilde tespit ediyoruz. Otonom dronelar ve yapay zeka destekli analiz sayesinde panelleriniz taranır, sıcak noktalar ve gizli arızalar belirlenir, ardından gerekli onarım ve bakım işlemleri profesyonel ekiplerimiz tarafından yapılır. Bu sayede santrallerinizin verimliliği maksimum seviyeye çıkarılır.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Özellik 1: Drone ile Termal İnceleme */}
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div className="w-0.5 h-16 bg-orange-500/30 ml-6 -mt-2"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Drone ile Termal İnceleme
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>Otonom uçabilen dronelar, termal kameralar ile tüm panelleri tarar.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>Hot-spot ve gözle görülmeyen sorunları tespit eder.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Özellik 2: Yapay Zeka Destekli Raporlama */}
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="w-0.5 h-16 bg-orange-500/30 ml-6 -mt-2"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Yapay Zeka Destekli Raporlama
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>Al yazılımımız termal görüntüleri analiz eder.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>%100 doğrulukla arızaları tespit eder ve 70-80 sayfalık detaylı rapor sunar.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Özellik 3: Panel Onarımı ve Yenileme */}
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Panel Onarımı ve Yenileme
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>Tespit edilen arızalar profesyonel ekiplerimiz tarafından onanlır.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>Gerekirse paneller yenilenir ve santrallerinizin performansı maksimize edilir.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


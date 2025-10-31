// Projelerimiz sayfası - Zena Enerji'nin tamamladığı projeleri gösterir
// Bu sayfa şirketin projelerini harita ve liste görünümünde sunar

'use client'; // Client-side bileşen - tab yönetimi için

import Header from '../components/Header'; // Header bileşenini import ediyoruz
import Footer from '../components/Footer'; // Footer bileşenini import ediyoruz
import { useState } from 'react'; // useState hook'u - tab yönetimi için

export default function Projelerimiz() {
  // useState ile hangi tab'ın aktif olduğunu yönetiyoruz
  const [activeTab, setActiveTab] = useState('harita');

  // Örnek proje verileri
  const projects = [
    {
      id: 1,
      name: "Adıyaman 8.4 MW",
      location: "Adıyaman",
      power: "8.4 MW",
      date: "2015",
      type: "Lisanssız",
      investor: "Muhtelif"
    },
    {
      id: 2,
      name: "Samsun 8.4 MW",
      location: "Samsun",
      power: "8.4 MW",
      date: "2016",
      type: "Lisanssız",
      investor: "Muhtelif"
    },
    {
      id: 3,
      name: "Kayseri 5.2 MW",
      location: "Kayseri",
      power: "5.2 MW",
      date: "2017",
      type: "Lisanslı",
      investor: "Muhtelif"
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
            Projelerimiz
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Zena Enerji olarak tamamladığımız başarılı güneş enerjisi projelerimizi keşfedin.
          </p>
        </div>
      </section>

      {/* Tab menüsü */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8">
            <button
              onClick={() => setActiveTab('harita')}
              className={`py-2 px-4 text-lg font-medium border-b-2 transition-colors ${
                activeTab === 'harita'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Harita
            </button>
            <button
              onClick={() => setActiveTab('liste')}
              className={`py-2 px-4 text-lg font-medium border-b-2 transition-colors ${
                activeTab === 'liste'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Liste
            </button>
          </div>
        </div>
      </section>

      {/* İçerik bölümü */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Harita görünümü */}
          {activeTab === 'harita' && (
            <div>
              <div className="text-center mb-8">
                <p className="text-gray-600">
                  Proje görüntülemek için haritadan bir il seçiniz.
                </p>
              </div>
              
              {/* Basit harita görseli */}
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-lg">Türkiye Haritası</p>
                  <p className="text-sm">Gerçek harita entegrasyonu için Google Maps API kullanılacak</p>
                </div>
                
                {/* Örnek proje bilgisi */}
                <div className="bg-white rounded-lg p-4 max-w-sm mx-auto shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">Samsun</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span>Samsun 8.4 MW</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Samsun 8.4 MW</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span>Samsun 8.4 MW</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Liste görünümü */}
          {activeTab === 'liste' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {/* Proje görseli */}
                    <div className="aspect-w-16 aspect-h-9">
                      <img 
                        src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                        alt={project.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    
                    {/* Lisanssız etiketi */}
                    {project.type === 'Lisanssız' && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-orange-500 text-white px-2 py-1 rounded text-sm font-medium">
                          Lisanssız
                        </span>
                      </div>
                    )}
                    
                    {/* Proje bilgileri */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {project.name}
                      </h3>
                      
                      <div className="space-y-2 text-gray-600">
                        <div className="flex justify-between">
                          <span className="font-medium">Proje Geliştirme Tarihi:</span>
                          <span>{project.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Proje Gücü:</span>
                          <span>{project.power}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Yatırımcı:</span>
                          <span>{project.investor}</span>
                        </div>
                      </div>
                      
                      {/* Detay butonu */}
                      <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                        Detayları Gör
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* İstatistikler bölümü */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Proje İstatistiklerimiz
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">50+</div>
              <p className="text-gray-600">Tamamlanan Proje</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">500+</div>
              <p className="text-gray-600">MW Kurulu Güç</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">25+</div>
              <p className="text-gray-600">İl</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">100%</div>
              <p className="text-gray-600">Müşteri Memnuniyeti</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer bileşeni */}
      <Footer />
    </div>
  );
}

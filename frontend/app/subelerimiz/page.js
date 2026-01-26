// Şubelerimiz sayfası - Zena Enerji'nin şubelerini harita ile gösterir

'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import GoogleMap from '../components/GoogleMap';
import { useState } from 'react';

// Şubeler verisi
const branches = [
  {
    id: 0,
    name: 'İstanbul Merkez Şubesi',
    address: 'Fenerbahçe Mahallesi Bağdat Caddesi No:200/6 Kadıköy/İstanbul',
    phone: '+90 (216) 606 44 58',
    coordinates: { lat: 40.97493589794215, lng: 29.05296105674061 }, 
  },
  {
    id: 1,
    name: 'İstanbul Çengelköy Ar-Ge Binası',
    address: 'Çengelköy Mah. Prf.Dr.Beynun Akyavaş Cad. No:90 Üsküdar / İstanbul',
    phone: '+90 (216) 606 44 58',
    coordinates: { lat: 41.05237721470146, lng: 29.067600415461087 }, 
  },
  {
    id: 2,
    name: 'Boğaziçi Üniversitesi Teknopark',
    address: 'Boğaziçi Üniversitesi Güney Kampüsü, Bebek, 34342 Beşiktaş/İstanbul',
    phone: '+90 (216) 606 44 58',
    coordinates: { lat: 41.0805, lng: 29.0444 }
  },
  {
    id: 3,
    name: 'Sivas Merkez Şubesi',
    address: 'SULARBAŞI MAH. 11-4 SK. NO:1/6 MERKEZ/SİVAS',
    phone: '+90 (216) 606 44 58',
    coordinates: { lat: 39.752198171525286, lng: 37.0157534904467 }
  },
  {
    id: 4,
    name: 'Sivas Cumhuriyet Teknokent Şubesi',
    address: 'YENİŞEHİR MAH. KARDEŞLER CD. TEKNOKENT ARGE KAT: 1 OFİS NO: 111 MERKEZ / SİVAS',
    phone: '+90 (216) 606 44 58',
    coordinates: { lat: 39.7023456, lng: 37.0223456 }
  }
];

export default function Subelerimiz() {
  const [selectedBranch, setSelectedBranch] = useState(0);

  const currentBranch = branches.find((branch) => branch.id === selectedBranch) ?? branches[0];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
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
              Şubelerimiz
            </h1>
          </div>
        </div>
      </section>

      {/* Şube listesi ve harita */}
      <section className="py-8 bg-gray-50 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Sol taraf - Şube listesi */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h2 className="text-xl font-bold text-gray-900">Bizi Buralarda Bulabilirsiniz</h2>
              </div>
              
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {branches.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedBranch(branch.id)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 hover:cursor-pointer ${
                      selectedBranch === branch.id
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{branch.name}</span>
                      {selectedBranch === branch.id && (
                        <svg className="w-5 h-5 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sağ taraf - Harita ve detaylar */}
            <div className="space-y-6">
              {/* Harita */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <GoogleMap
                  center={currentBranch.coordinates}
                  zoom={14}
                  className="w-full h-[400px] md:h-[500px] rounded-lg"
                  pinTitle={currentBranch.name}
                />
              </div>

              {/* Şube detayları */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{currentBranch.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-700">{currentBranch.address}</p>
                  </div>
                  <div className="flex items-center gap-3s">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a 
                      href={`tel:${currentBranch.phone.replace(/[\s()]/g, '')}`} 
                      className="text-green-500 font-medium hover:text-green-600 transition-colors"
                    >
                      {currentBranch.phone}
                    </a>
                  </div>
                </div>

                {/* Yol Tarifi Butonu */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${currentBranch.coordinates.lat},${currentBranch.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Yol Tarifi Al
                  </a>
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
// Şubelerimiz sayfası - Zena Enerji'nin şubelerini harita ile gösterir

'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState } from 'react';

export default function Subelerimiz() {
  const [selectedBranch, setSelectedBranch] = useState(0);

  // Şubeler verisi
  const branches = [
    {
      id: 0,
      name: 'İstanbul Çengelköy Ar-Ge Binası',
      address: 'Çengelköy Mah. Prf.Dr.Beynun Akyavaş Cad. No:90 Üsküdar / İstanbul',
      phone: '+90 (216) 606 44 58',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.1234567890!2d29.0123456!3d41.0123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzQ0LjQiTiAyOcKwMDAnNDQuNCJF!5e0!3m2!1str!2str!4v1234567890123!5m2!1str!2str',
      coordinates: { lat: 41.0123456, lng: 29.0123456 }
    },
    {
      id: 1,
      name: 'İstanbul Merkez Şubesi',
      address: 'Fenerbahçe Mahallesi Bağdat Caddesi No:200/6 Kadıköy/İstanbul',
      phone: '+90 (216) 606 44 58',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.1234567890!2d29.0123456!3d41.0123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzQ0LjQiTiAyOcKwMDAnNDQuNCJF!5e0!3m2!1str!2str!4v1234567890123!5m2!1str!2str',
      coordinates: { lat: 40.9876543, lng: 29.0234567 }
    },
    {
      id: 2,
      name: 'İstanbul Marmara Üniversitesi Teknopark Şubesi',
      address: 'Marmara Üniversitesi Teknopark Göztepe Kampüsü Kadıköy/İstanbul',
      phone: '+90 (216) 606 44 58',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.1234567890!2d29.0123456!3d41.0123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzQ0LjQiTiAyOcKwMDAnNDQuNCJF!5e0!3m2!1str!2str!4v1234567890123!5m2!1str!2str',
      coordinates: { lat: 40.9754321, lng: 29.0345678 }
    },
    {
      id: 3,
      name: 'Yozgat Bozok OSB Hızlı Şarj Ünitesi Fabrikası',
      address: 'Bozok Organize Sanayi Bölgesi Yozgat',
      phone: '+90 (354) 123 45 67',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.1234567890!2d34.0123456!3d39.8123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDQ4JzQ0LjQiTiAzNMKwMDAnNDQuNCJF!5e0!3m2!1str!2str!4v1234567890123!5m2!1str!2str',
      coordinates: { lat: 39.8123456, lng: 34.0123456 }
    },
    {
      id: 4,
      name: 'Sivas Merkez Şubesi',
      address: 'Merkez Mahallesi Atatürk Caddesi No:123 Sivas',
      phone: '+90 (346) 123 45 67',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.1234567890!2d37.0123456!3d39.7123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDQyJzQ0LjQiTiAzN8KwMDAnNDQuNCJF!5e0!3m2!1str!2str!4v1234567890123!5m2!1str!2str',
      coordinates: { lat: 39.7123456, lng: 37.0123456 }
    },
    {
      id: 5,
      name: 'Sivas Cumhuriyet Teknokent Şubesi',
      address: 'Cumhuriyet Üniversitesi Teknokent Kampüsü Sivas',
      phone: '+90 (346) 123 45 67',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.1234567890!2d37.0123456!3d39.7123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDQyJzQ0LjQiTiAzN8KwMDAnNDQuNCJF!5e0!3m2!1str!2str!4v1234567890123!5m2!1str!2str',
      coordinates: { lat: 39.7023456, lng: 37.0223456 }
    },
    {
      id: 6,
      name: 'Sivas Demirağ OSB Hızlı Şarj Ünitesi Fabrikası',
      address: 'Demirağ Organize Sanayi Bölgesi Sivas',
      phone: '+90 (346) 123 45 67',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.1234567890!2d37.0123456!3d39.7123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDQyJzQ0LjQiTiAzN8KwMDAnNDQuNCJF!5e0!3m2!1str!2str!4v1234567890123!5m2!1str!2str',
      coordinates: { lat: 39.6923456, lng: 37.0323456 }
    }
  ];

  const currentBranch = branches[selectedBranch];

  return (
    <div className="min-h-screen bg-white">
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
              
              <div className="space-y-2">
                {branches.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedBranch(branch.id)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                      selectedBranch === branch.id
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{branch.name}</span>
                      {selectedBranch === branch.id && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="w-full h-[400px] md:h-[500px]">
                  <iframe
                    src={currentBranch.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  ></iframe>
                </div>
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
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${currentBranch.phone.replace(/\s/g, '')}`} className="text-green-500 font-medium hover:text-green-600 transition-colors">
                      {currentBranch.phone}
                    </a>
                  </div>
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


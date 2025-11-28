// Projelerimiz sayfası - Zena Enerji'nin tamamladığı projeleri gösterir
// Bu sayfa şirketin projelerini harita ve liste görünümünde sunar

'use client'; // Client-side bileşen - tab yönetimi için

import Header from '../components/Header'; // Header bileşenini import ediyoruz
import Footer from '../components/Footer'; // Footer bileşenini import ediyoruz
import { useState, useEffect, useRef } from 'react'; // useState, useEffect ve useRef hook'ları

export default function Projelerimiz() {
  // useState ile hangi tab'ın aktif olduğunu yönetiyoruz
  const [activeTab, setActiveTab] = useState('harita');
  const svgContainerRef = useRef(null);
  const infoRef = useRef(null);

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

  // SVG Türkiye haritası yükleme ve event listener'ları ekleme
  useEffect(() => {
    if (activeTab !== 'harita' || !svgContainerRef.current) return;

    let element = null;
    let info = null;
    let cleanup = null;

    // SVG'yi yükle
    fetch('/turkey.svg')
      .then(res => res.text())
      .then(svgText => {
        if (svgContainerRef.current) {
          svgContainerRef.current.innerHTML = svgText;
          
          // SVG yüklendikten sonra event listener'ları ekle
          element = svgContainerRef.current.querySelector('#svg-turkiye-haritasi');
          info = infoRef.current;

          if (!element || !info) return;

          const handleMouseOver = (event) => {
            if (event.target.tagName === 'path' && event.target.parentNode.id !== 'guney-kibris') {
              const parent = event.target.parentNode;
              
              // Tooltip göster
              info.innerHTML = [
                '<div>',
                parent.getAttribute('data-iladi'),
                '</div>'
              ].join('');
              info.style.display = 'block';
            }
          };

          const handleMouseMove = (event) => {
            if (info.style.display === 'block') {
              // Tooltip'i mouse'un hemen yanında göster (15px offset)
              // Fixed position kullandığımız için clientY ve clientX kullanıyoruz
              info.style.top = (event.clientY + 15) + 'px';
              info.style.left = (event.clientX + 15) + 'px';
            }
          };

          const handleMouseOut = (event) => {
            if (event.target.tagName === 'path' && event.target.parentNode.id !== 'guney-kibris') {
              const path = event.target;
              
              // Tooltip'i gizle
              info.innerHTML = '';
              info.style.display = 'none';
              
              // Path rengini eski haline getir
              path.style.fill = '';
              path.style.cursor = '';
            }
          };

          const handleClick = (event) => {
            if (event.target.tagName === 'path') {
              const parent = event.target.parentNode;
              const id = parent.getAttribute('id');

              if (id === 'guney-kibris') {
                return;
              }

              // İl tıklandığında yapılacak işlem
              const ilAdi = parent.getAttribute('data-iladi');
              const plakaKodu = parent.getAttribute('data-plakakodu');
              
              // Burada il'e göre projeleri filtreleyebilir veya başka bir işlem yapabilirsiniz
              console.log('Seçilen il:', ilAdi, 'Plaka:', plakaKodu);
              
              // Örnek: URL hash ile yönlendirme
              window.location.href = '#' + id + '-' + plakaKodu;
            }
          };

          element.addEventListener('mouseover', handleMouseOver);
          element.addEventListener('mousemove', handleMouseMove);
          element.addEventListener('mouseout', handleMouseOut);
          element.addEventListener('click', handleClick);

          // Cleanup function'ı sakla
          cleanup = () => {
            if (element) {
              element.removeEventListener('mouseover', handleMouseOver);
              element.removeEventListener('mousemove', handleMouseMove);
              element.removeEventListener('mouseout', handleMouseOut);
              element.removeEventListener('click', handleClick);
            }
          };
        }
      })
      .catch(err => console.error('SVG yüklenirken hata:', err));

    // Cleanup function
    return () => {
      if (cleanup) cleanup();
      if (svgContainerRef.current) {
        svgContainerRef.current.innerHTML = '';
      }
    };
  }, [activeTab]);

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
              Projelerimiz
            </h1>
            <p className="text-sm md:text-base text-white/90 leading-relaxed">
              Zena Enerji olarak tamamladığımız başarılı güneş enerjisi projelerimizi keşfedin.
            </p>
          </div>
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
              
              
              {/* Türkiye haritası */}
              <div className="relative">
                {/* İl isimleri tooltip */}
                <div 
                  ref={infoRef}
                  className="il-isimleri fixed z-50 bg-orange-500 text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none text-sm font-medium"
                  style={{ display: 'none' }}
                ></div>
                
                {/* Türkiye SVG haritası */}
                <div 
                  ref={svgContainerRef}
                  className="flex justify-center items-center svg-map-container"
                ></div>
                
                {/* SVG hover stilleri */}
                <style dangerouslySetInnerHTML={{__html: `
                  .svg-map-container #svg-turkiye-haritasi path {
                    transition: fill 0.2s ease, opacity 0.2s ease;
                    cursor: pointer;
                  }
                  .svg-map-container #svg-turkiye-haritasi path:hover {
                    fill: #f97316 !important;
                    opacity: 0.9;
                  }
                `}} />
                
                {/* Örnek proje bilgisi */}
                
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

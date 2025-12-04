// Projelerimiz sayfası - Zena Enerji'nin tamamladığı projeleri gösterir
// Bu sayfa şirketin projelerini harita ve liste görünümünde sunar

'use client'; // Client-side bileşen - tab yönetimi için

import Header from '../components/Header'; // Header bileşenini import ediyoruz
import Footer from '../components/Footer'; // Footer bileşenini import ediyoruz
import { useState, useEffect, useRef } from 'react'; // useState, useEffect ve useRef hook'ları
import { citiesData } from '../../data/cities'; // Şehir ve proje verileri

export default function Projelerimiz() {
  // useState ile hangi tab'ın aktif olduğunu yönetiyoruz
  const [activeTab, setActiveTab] = useState('harita');
  const [selectedCity, setSelectedCity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const svgContainerRef = useRef(null);
  const infoRef = useRef(null);

  // cities.js'deki tüm projeleri düz liste haline getir
  const allProjects = citiesData.flatMap(city =>
    city.projects.map(project => ({
      id: `${city.id}-${project.id}`,
      name: project.ProjeAdi,
      location: project.ProjeYeri || city.name,
      power: project.ProjeGucu,
      date: project.ProjeTarihi || project.ProjeGelistirmeTarihi,
      type: project.ProjeTuru,
      investor: project.Yatirimci,
      cityName: city.name
    }))
  );

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

          // Önce tüm path'leri koyu gri renkle boya (varsayılan renk)
          const allPaths = element.querySelectorAll('path');
          allPaths.forEach(path => {
            if (path.parentNode.id !== 'guney-kibris') {
              path.style.fill = '#5A5A5A'; // koyu gri ton
              path.setAttribute('fill', '#5A5A5A');
              path.setAttribute('data-default-color', '#5A5A5A');
            }
          });

          // cities.js'deki illeri turuncu tonları ile renklendir ve il adlarını ekle
          citiesData.forEach(city => {
            const cityGroup = element.querySelector(`#${city.id}`);
            if (cityGroup) {
              // Tüm path'leri bul (bazı illerde birden fazla path olabilir)
              const paths = cityGroup.querySelectorAll('path');
              if (paths.length > 0) {
                // Proje sayısına göre temel turuncu tonu belirle (daha koyu tonlar)
                const projectCount = city.projects.length;
                let baseColor = '#fdba74'; // varsayılan: orta turuncu (orange-300)

                if (projectCount >= 3 && projectCount <= 5) {
                  baseColor = '#fb923c'; // koyu turuncu (orange-400)
                } else if (projectCount > 5) {
                  baseColor = '#f97316'; // daha koyu turuncu (orange-500)
                }

                // Tüm path'leri temel renkle boyayalım
                paths.forEach(path => {
                  // Temel turuncu tonu - hem style hem attribute olarak
                  path.style.fill = baseColor;
                  path.setAttribute('fill', baseColor);
                  path.setAttribute('data-has-project', 'true');
                  path.setAttribute('data-base-color', baseColor);
                });

                // İl adını ekle (sadece bir kez, tüm grubun merkezini kullan)
                const ilAdi = cityGroup.getAttribute('data-iladi') || city.name;
                if (ilAdi) {
                  // Grup bounding box'ını al (birden fazla path olsa bile)
                  const bbox = cityGroup.getBBox();
                  let centerX = bbox.x + bbox.width / 2;
                  let centerY = bbox.y + bbox.height / 2;

                  // Özel konum ayarlamaları
                  const positionAdjustments = {
                    'İzmir': { x: 0, y: 20 }, // daha aşağı
                    'Konya': { x: -8, y: 0 }, // biraz sola
                    'Giresun': { x: 0, y: -12 }, // yukarı, hafif
                    'Erzincan': { x: 0, y: -15 }, // üste, biraz
                    'Elazığ': { x: -7, y: 15 }, // biraz daha sola
                    'Malatya': { x: -9, y: 0 }, // biraz daha sola
                    'Balıkesir': { x: 5, y: 12 } // aşağı
                  };

                  const adjustment = positionAdjustments[ilAdi];
                  if (adjustment) {
                    centerX += adjustment.x;
                    centerY += adjustment.y;
                  }

                  // Text elementi oluştur
                  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                  text.setAttribute('x', centerX);
                  text.setAttribute('y', centerY);
                  text.setAttribute('text-anchor', 'middle');
                  text.setAttribute('dominant-baseline', 'middle');
                  text.setAttribute('fill', '#ffffff');
                  text.setAttribute('font-size', '8');
                  text.setAttribute('font-weight', '600');
                  text.setAttribute('pointer-events', 'none');
                  text.setAttribute('style', 'text-shadow: 1px 1px 2px rgba(0,0,0,0.5);');
                  text.setAttribute('class', 'il-adi-text');
                  text.textContent = ilAdi;

                  // Text'i il grubuna ekle (path'lerden sonra eklendiği için en üstte görünecek)
                  cityGroup.appendChild(text);
                }
              }
            }
          });

          const handleMouseOver = (event) => {
            if (event.target.tagName === 'path' && event.target.parentNode.id !== 'guney-kibris') {
              const parent = event.target.parentNode;
              const cityId = parent.getAttribute('id');

              // cities.js'den il bilgilerini bul
              const cityData = citiesData.find(city => city.id === cityId);
              const ilAdi = parent.getAttribute('data-iladi');

              if (cityData) {
                const projectCount = cityData.projects.length;
                const totalPower = cityData.projects.reduce((sum, p) => {
                  const powerStr = p.ProjeGucu || '';
                  const power = parseFloat(powerStr.replace(' MW', '').replace(' kW', '').replace(' ', ''));
                  if (isNaN(power)) return sum;
                  return sum + (powerStr.includes('MW') ? power : power / 1000);
                }, 0);

                // Tooltip göster - il adı, proje sayısı ve toplam güç
                info.innerHTML = [
                  '<div style="font-weight: 600; margin-bottom: 4px;">' + ilAdi + '</div>',
                  '<div style="font-size: 11px; margin-bottom: 2px;">' + projectCount + ' Proje</div>',
                  '<div style="font-size: 11px;">Toplam: ' + totalPower.toFixed(1) + ' MW</div>'
                ].join('');
              } else {
                // Proje yoksa sadece il adı
                info.innerHTML = '<div>' + ilAdi + '</div>';
              }
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

              // Eğer proje olan bir il ise turuncu rengi koru, değilse koyu kahverengiye dön
              if (path.getAttribute('data-has-project') === 'true') {
                const baseColor = path.getAttribute('data-base-color') || '#fdba74';
                path.style.fill = baseColor;
                path.setAttribute('fill', baseColor);
              } else {
                const defaultColor = path.getAttribute('data-default-color') || '#5A5A5A';
                path.style.fill = defaultColor;
                path.setAttribute('fill', defaultColor);
              }
            }
          };

          const handleClick = (event) => {
            if (event.target.tagName === 'path') {
              const parent = event.target.parentNode;
              const cityId = parent.getAttribute('id');

              if (cityId === 'guney-kibris') {
                return;
              }

              // cities.js'den il bilgilerini bul
              const cityData = citiesData.find(city => city.id === cityId);

              if (cityData) {
                // Modal'ı aç ve seçili şehri set et
                setSelectedCity(cityData);
                setIsModalOpen(true);
              }
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
              className={`py-2 px-4 text-lg font-medium border-b-2 transition-colors hover:cursor-pointer ${activeTab === 'harita'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Harita
            </button>
            <button
              onClick={() => setActiveTab('liste')}
              className={`py-2 px-4 text-lg font-medium border-b-2 transition-colors hover:cursor-pointer ${activeTab === 'liste'
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
              <div className="relative w-full overflow-x-auto">
                {/* İl isimleri tooltip */}
                <div
                  ref={infoRef}
                  className="il-isimleri fixed z-50 bg-orange-500 text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none text-sm font-medium"
                  style={{ display: 'none', minWidth: '120px', maxWidth: '200px' }}
                ></div>

                {/* Türkiye SVG haritası */}
                <div
                  ref={svgContainerRef}
                  className="flex justify-center items-center svg-map-container w-full min-h-[400px] md:min-h-[500px]"
                ></div>

                {/* SVG hover stilleri */}
                <style dangerouslySetInnerHTML={{
                  __html: `
                  .svg-map-container {
                    width: 100%;
                    overflow-x: auto;
                  }
                  .svg-map-container #svg-turkiye-haritasi {
                    width: 100%;
                    height: auto;
                    max-width: 100%;
                  }
                  .svg-map-container #svg-turkiye-haritasi path {
                    transition: fill 0.2s ease, opacity 0.2s ease;
                    cursor: pointer;
                    fill: #5A5A5A; /* varsayılan koyu gri renk */
                  }
                  .svg-map-container #svg-turkiye-haritasi path:hover {
                    fill: #ea580c !important; /* orange-600 - hover rengi */
                    opacity: 1;
                  }
                  .svg-map-container #svg-turkiye-haritasi path[data-has-project="true"]:hover {
                    fill: #c2410c !important; /* orange-700 - proje olan iller için hover rengi */
                  }
                  .svg-map-container #svg-turkiye-haritasi text.il-adi-text {
                    pointer-events: none;
                    z-index: 1000;
                    position: relative;
                  }
                  @media (max-width: 768px) {
                    .svg-map-container #svg-turkiye-haritasi {
                      min-width: 600px;
                    }
                  }
                `}} />

                {/* Renk Lejantı - Proje sayısına göre renk tonları */}
                <div className="flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fdba74' }}></div>
                    <span className="text-gray-600">1-2 Proje</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fb923c' }}></div>
                    <span className="text-gray-600">3-5 Proje</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f97316' }}></div>
                    <span className="text-gray-600">5+ Proje</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Liste görünümü */}
          {activeTab === 'liste' && (
            <div>
              <div className="mb-6">
                <p className="text-gray-600 text-center">
                  Toplam <span className="font-semibold text-orange-500">{allProjects.length}</span> proje bulundu
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allProjects.map((project) => (
                  <div key={project.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                    {/* Proje görseli */}
                    <div className="aspect-w-16 aspect-h-9 relative">
                      <img
                        src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                        alt={project.name}
                        className="w-full h-48 object-cover"
                      />

                      {/* Proje türü etiketi */}
                      {project.type && (
                        <div className="absolute top-4 left-4">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${project.type === 'Lisanssız'
                              ? 'bg-orange-500 text-white'
                              : project.type === 'Lisanslı'
                                ? 'bg-blue-500 text-white'
                                : 'bg-green-500 text-white'
                            }`}>
                            {project.type}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Proje bilgileri */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {project.name}
                      </h3>

                      <div className="space-y-2 text-gray-600 mb-4">
                        <div className="flex items-start">
                          <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm">{project.location}</span>
                        </div>

                        {project.date && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm">{project.date}</span>
                          </div>
                        )}

                        {project.power && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-sm font-medium">{project.power}</span>
                          </div>
                        )}

                        {project.investor && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-sm">{project.investor}</span>
                          </div>
                        )}
                      </div>

                      {/* Detay butonu */}
                      <button
                        onClick={() => {
                          const cityData = citiesData.find(city => city.name === project.cityName);
                          if (cityData) {
                            setSelectedCity(cityData);
                            setIsModalOpen(true);
                          }
                        }}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                      >
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

      {/* Proje Detay Modal */}
      {isModalOpen && selectedCity && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-orange-500 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedCity.name} - Projeler</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-4">
                <p className="text-gray-600">
                  <span className="font-semibold">{selectedCity.projects.length}</span> proje bulundu
                </p>
              </div>

              {/* Projeler Listesi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCity.projects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{project.ProjeAdi}</h3>
                      {project.ProjeTuru && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${project.ProjeTuru === 'Lisanssız'
                            ? 'bg-orange-100 text-orange-700'
                            : project.ProjeTuru === 'Lisanslı'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                          {project.ProjeTuru}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      {project.ProjeYeri && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{project.ProjeYeri}</span>
                        </div>
                      )}

                      {project.ProjeGucu && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="font-medium">{project.ProjeGucu}</span>
                        </div>
                      )}

                      {(project.ProjeTarihi || project.ProjeGelistirmeTarihi) && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{project.ProjeTarihi || project.ProjeGelistirmeTarihi}</span>
                        </div>
                      )}

                      {project.Yatirimci && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{project.Yatirimci}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer bileşeni */}
      <Footer />
    </div>
  );
}

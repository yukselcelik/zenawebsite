// Haberler sayfası - Zena Enerji haberleri ve güneş enerjisi haberleri
// Bu sayfa şirket haberlerini ve sektör haberlerini listeler

import Header from '../components/Header'; // Header bileşenini import ediyoruz
import Footer from '../components/Footer'; // Footer bileşenini import ediyoruz

export default function Haberler() {
  // Örnek haber verileri
  const news = [
    {
      id: 1,
      title: "Toyotetsu Otomotiv'e ait 2.26 MW'lık güneş enerjisi santralini anahtar teslim olarak tamamlamış bulunmaktayız",
      date: "15.10.2024",
      category: "Proje",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      hasVideo: true
    },
    {
      id: 2,
      title: "1200 kW'lık güneş enerjisi santralimizin geçici kabulü tamamlanıp üretime başlamıştır.",
      date: "12.10.2024",
      category: "Proje",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      hasVideo: false
    },
    {
      id: 3,
      title: "YTÜ ile KOOP protokolü imzaladık.",
      date: "10.10.2024",
      category: "Anlaşma",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      hasVideo: false
    },
    {
      id: 4,
      title: "Güneş enerjisi sektöründe yeni teknolojiler",
      date: "08.10.2024",
      category: "Teknoloji",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      hasVideo: false
    },
    {
      id: 5,
      title: "Sürdürülebilir enerji çözümleri hakkında",
      date: "05.10.2024",
      category: "Çevre",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      hasVideo: true
    },
    {
      id: 6,
      title: "Yenilenebilir enerji yatırımları artıyor",
      date: "03.10.2024",
      category: "Sektör",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      hasVideo: false
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
            Zena Enerji Haberler
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Zena Enerji ve Güneş Enerjisindeki önemli gelişme ve haberleri buradan takip edebilirsiniz!
          </p>
        </div>
      </section>

      {/* Tab menüsü */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8">
            <button className="py-2 px-4 text-lg font-medium border-b-2 border-orange-500 text-orange-500">
              Haberler
            </button>
            <button className="py-2 px-4 text-lg font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">
              Etkinlikler
            </button>
          </div>
        </div>
      </section>

      {/* Haberler grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Haber kartları */}
            {news.map((item) => (
              <article key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                
                {/* Haber görseli */}
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Video ikonu */}
                  {item.hasVideo && (
                    <div className="absolute top-4 left-4">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 5v10l8-5-8-5z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Haber içeriği */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-orange-500 font-medium">{item.category}</span>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
                    {item.title}
                  </h3>
                  
                  <button className="text-orange-500 hover:text-orange-600 font-medium text-sm transition-colors">
                    Devamını Oku →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer bileşeni */}
      <Footer />
    </div>
  );
}

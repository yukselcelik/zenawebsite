// Blog sayfası - Zena Enerji blog yazıları
// Bu sayfa şirketin blog içeriklerini listeler

import Header from '../components/Header'; // Header bileşenini import ediyoruz
import Footer from '../components/Footer'; // Footer bileşenini import ediyoruz

export default function Blog() {
  // Örnek blog yazıları
  const blogPosts = [
    {
      id: 1,
      title: "Güneş Enerjisi Santrallerinde Verimlilik Artırma Yöntemleri",
      excerpt: "Solar panel verimliliğini artırmak için uygulayabileceğiniz pratik yöntemler.",
      date: "18.10.2024",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      title: "Yenilenebilir Enerji Sektöründe Yapay Zeka Kullanımı",
      excerpt: "AI teknolojilerinin güneş enerjisi projelerindeki rolü ve avantajları.",
      date: "15.10.2024",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      title: "Güneş Paneli Bakım ve Temizlik Rehberi",
      excerpt: "Solar panellerinizin ömrünü uzatmak için düzenli bakım ipuçları.",
      date: "12.10.2024",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 4,
      title: "Sürdürülebilir Enerji Geleceği",
      excerpt: "Türkiye'nin yenilenebilir enerji hedefleri ve gelecek planları.",
      date: "10.10.2024",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 5,
      title: "Drone Teknolojisi ile Termal İnceleme",
      excerpt: "İHA'ların güneş enerjisi santrallerindeki kontrol ve bakım süreçlerindeki yeri.",
      date: "08.10.2024",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 6,
      title: "Güneş Enerjisi Yatırımının Geri Dönüş Hesaplaması",
      excerpt: "Solar enerji yatırımlarının karlılık analizi ve geri ödeme süreleri.",
      date: "05.10.2024",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
  ];

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
              Blog
            </h1>
            <p className="text-sm md:text-base text-white/90 leading-relaxed">
              Güneş enerjisi, yenilenebilir enerji teknolojileri ve sektör gelişmeleri hakkında güncel yazılar.
            </p>
          </div>
        </div>
      </section>

      {/* Blog yazıları grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Blog yazıları */}
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                
                {/* Blog görseli */}
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                {/* Blog içeriği */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-orange-500 font-medium">{post.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <button className="text-orange-500 hover:text-orange-600 font-medium text-sm transition-colors">
                    Devamını Oku →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter bölümü */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Blog Güncellemelerini Kaçırmayın
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Yeni blog yazılarımızdan haberdar olmak için e-posta listemize katılın.
          </p>
          
          <div className="max-w-md mx-auto flex space-x-4">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
              Abone Ol
            </button>
          </div>
        </div>
      </section>

      {/* Footer bileşeni */}
      <Footer />
    </div>
  );
}

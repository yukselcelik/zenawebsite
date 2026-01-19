// Blog sayfası - Zena Enerji blog yazıları
// Bu sayfa şirketin blog içeriklerini listeler

import Header from '../components/Header'; // Header bileşenini import ediyoruz
import Footer from '../components/Footer'; // Footer bileşenini import ediyoruz

export default function Blog() {
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

      {/* Blog içerik bölümü - şu an boş */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* İçerik buraya eklenecek */}
        </div>
      </section>

      {/* Footer bileşeni */}
      <Footer />
    </div>
  );
}

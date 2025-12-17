'use client';

import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Header forceDark={true} />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Sayı */}
          <div className="mb-6">
            <h1 className="text-6xl md:text-7xl font-bold text-orange-500 mb-3">404</h1>
            <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
          </div>

          {/* Başlık ve Açıklama */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Sayfa Bulunamadı
          </h2>
          <p className="text-base text-gray-300 mb-6">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir. 
            Lütfen URL'yi kontrol edin veya ana sayfaya dönün.
          </p>

          {/* Butonlar */}
          <div className="flex justify-center items-center">
            <Link
              href="/"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg text-base transition-colors duration-300"
            >
              Ana Sayfaya Dön
            </Link>
          </div>

          {/* Yardımcı Linkler */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-4">Hızlı Erişim:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/hakkimizda" className="text-orange-400 hover:text-orange-500 transition-colors">
                Hakkımızda
              </Link>
              <Link href="/hizmetler" className="text-orange-400 hover:text-orange-500 transition-colors">
                Hizmetlerimiz
              </Link>
              <Link href="/projelerimiz" className="text-orange-400 hover:text-orange-500 transition-colors">
                Projelerimiz
              </Link>
              <Link href="/kariyer" className="text-orange-400 hover:text-orange-500 transition-colors">
                Kariyer
              </Link>
              <Link href="/iletisim" className="text-orange-400 hover:text-orange-500 transition-colors">
                İletişim
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


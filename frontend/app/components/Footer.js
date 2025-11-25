// Footer bileşeni - Web sitesinin alt kısmındaki bilgi alanını içerir
// Bu bileşen tüm sayfalarda ortak olarak kullanılacak

import Link from 'next/link'; // Next.js Link bileşeni

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-items-center md:items-start">
          
          {/* Logo ve sosyal medya - Sol kolon */}
          <div className="col-span-1 flex flex-col items-start text-left -mt-2 md:justify-self-start w-full md:w-auto">
            <Link href="/" className="mb-4 inline-flex items-center justify-start md:-ml-2">
              <img
                src="/zena-logo.png"
                alt="Zena Enerji"
                className="h-16 w-auto object-contain"
              />
            </Link>

            <p className="text-gray-600 text-sm leading-relaxed">
              Zena Enerji olarak yenilenebilir enerji çözümleri ile işletmelerin geleceğini güçlendiriyoruz.
            </p>
          </div>

          {/* Sözleşmelerimiz - İkinci kolon */}
          <div className="col-span-1 md:col-span-1 w-full">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 h-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sözleşmelerimiz</h3>
              <ul className="space-y-2">
              <li><Link href="/kullanim-sozlesmesi" className="text-gray-600 hover:text-orange-500 transition-colors">Kullanıcı Sözleşmeleri</Link></li>
              <li><Link href="/kvkk-politikasi" className="text-gray-600 hover:text-orange-500 transition-colors">KVKK Politikaları</Link></li>
              <li><Link href="/cerez-politikasi" className="text-gray-600 hover:text-orange-500 transition-colors">Çerez Politikaları</Link></li>
              <li><Link href="/bilgi-guvenligi" className="text-gray-600 hover:text-orange-500 transition-colors">Bilgi Güvenliği</Link></li>
            </ul>
            </div>
          </div>

          {/* İletişim Bilgileri - Orta kolon */}
          <div className="col-span-1 md:col-span-1 w-full">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 h-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim Bilgileri</h3>
              <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-orange-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600 text-sm">
                  Fenerbahçe Mahallesi<br />
                  Bağdat Caddesi No:200/6<br />
                  Kadıköy/İstanbul
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@zenaenerji.com" className="text-gray-600 hover:text-orange-500 transition-colors">
                  info@zenaenerji.com
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+902166064458" className="text-gray-600 hover:text-orange-500 transition-colors">
                  +90 (216) 606 44 58
                </a>
              </div>
            </div>
            </div>
          </div>

          {/* Bize Ulaşın - Sağ kolon */}
          <div className="col-span-1 md:col-span-1 w-full flex justify-center md:justify-end">
            <div className="w-full max-w-xs">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center md:text-left">Bize Ulaşın</h3>
              <div className="group relative flex flex-col md:flex-row items-center md:items-start gap-4">
                <div className="rounded-2xl bg-gray-700 text-white flex items-center justify-center py-3 px-6 text-sm font-semibold tracking-wide shadow">
                  Bize Ulaşın
                </div>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-3 opacity-0 translate-y-3 md:translate-y-0 md:-translate-x-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 group-hover:pointer-events-auto transition-all duration-300 ease-out">
                  {[
                    { name: 'YouTube', href: 'https://youtube.com', icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.18a2.86 2.86 0 00-2-2C19.42 4 12 4 12 4s-7.42 0-9.5.18a2.86 2.86 0 00-2 2A29.94 29.94 0 000 12a29.94 29.94 0 00.5 5.82 2.86 2.86 0 002 2C2.58 20 12 20 12 20s7.42 0 9.5-.18a2.86 2.86 0 002-2A29.94 29.94 0 0024 12a29.94 29.94 0 00-.5-5.82zM9.75 15.02V8.98L15.5 12z"/></svg>
                    ) },
                    { name: 'Instagram', href: 'https://instagram.com', icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm11 2a1 1 0 100 2 1 1 0 000-2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"/></svg>
                    ) },
                    { name: 'LinkedIn', href: 'https://linkedin.com', icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452H17.2v-5.569c0-1.328-.026-3.036-1.852-3.036-1.853 0-2.136 1.447-2.136 2.94v5.665H9.964V9.001h3.1v1.561h.044c.432-.818 1.49-1.68 3.064-1.68 3.276 0 3.883 2.157 3.883 4.963v6.607zM5.337 7.433a2.063 2.063 0 110-4.126 2.063 2.063 0 010 4.126zM6.916 20.452H3.758V9h3.158v11.452z"/></svg>
                    ) },
                    { name: 'Gmail', href: 'mailto:info@zenaenerji.com', icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.5 4H1.5A1.5 1.5 0 000 5.5v13A1.5 1.5 0 001.5 20H6v-9l6 4 6-4v9h4.5a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0022.5 4zm-.5 3.75L12 12.5 2 7.75V6l10 5.5L22 6v1.75z"/></svg>
                    ) },
                  ].map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 bg-gray-700 text-white border border-gray-600 rounded-xl px-4 py-2 w-full shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <span className="text-white">{link.icon}</span>
                      <span className="text-sm font-medium">{link.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Alt çizgi - Telif hakkı bilgisi */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 Zena Enerji. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}

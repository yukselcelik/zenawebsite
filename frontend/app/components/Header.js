// Header bileşeni - Web sitesinin üst kısmındaki navigasyon menüsünü içerir
// Bu bileşen tüm sayfalarda ortak olarak kullanılacak

'use client'; // Client-side bileşen olduğunu belirtir (React hooks kullanabilmek için)

import Link from 'next/link'; // Next.js'in Link bileşeni - sayfa geçişleri için
import { useState, useRef, useEffect } from 'react'; // React'in useState hook'ları - state yönetimi için
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  // useState hook'u ile dropdown menülerin açık/kapalı durumunu yönetiyoruz
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const aboutCloseTimer = useRef(null);
  const servicesCloseTimer = useRef(null);
  const router = useRouter();

  // Token kontrolü için useEffect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('employeeToken');
      const role = localStorage.getItem('userRole');
      setIsLoggedIn(!!token);
      setUserRole(role);
    }
  }, []);

  // Çıkış yapma fonksiyonu
  const handleLogout = () => {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole(null);
    router.push('/');
  };

  const handleAboutEnter = () => {
    if (aboutCloseTimer.current) clearTimeout(aboutCloseTimer.current);
    setIsAboutOpen(true);
  };
  const handleAboutLeave = () => {
    if (aboutCloseTimer.current) clearTimeout(aboutCloseTimer.current);
    aboutCloseTimer.current = setTimeout(() => setIsAboutOpen(false), 200);
  };

  const handleServicesEnter = () => {
    if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current);
    setIsServicesOpen(true);
  };
  const handleServicesLeave = () => {
    if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current);
    servicesCloseTimer.current = setTimeout(() => setIsServicesOpen(false), 200);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Ana container - içeriği ortalar ve maksimum genişlik verir */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo kısmı - Sol üst köşe */}
          <Link href="/" className="flex items-center -ml-3 sm:-ml-5">
            <Image
              src="/zena-logo.png"
              alt="Zena Enerji"
              width={96}
              height={30}
              priority
            />
          </Link>

          {/* Ana navigasyon menüsü */}
          <nav className="hidden md:flex space-x-8">
            {/* Hakkımızda dropdown menüsü */}
            <div 
              className="relative"
              onMouseEnter={handleAboutEnter}
              onMouseLeave={handleAboutLeave}
            >
              <button 
                className="flex items-center text-gray-700 hover:text-orange-500 transition-colors"
                aria-haspopup="menu"
                aria-expanded={isAboutOpen}
              >
                Hakkımızda
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown menü - tıklama ve hover ile açılır */}
              {isAboutOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                  onMouseEnter={handleAboutEnter}
                  onMouseLeave={handleAboutLeave}
                >
                  <Link 
                    href="/hakkimizda" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                    onClick={() => setIsAboutOpen(false)}
                  >
                    Biz Kimiz
                  </Link>
                  <Link 
                    href="/hakkimizda" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                    onClick={() => setIsAboutOpen(false)}
                  >
                    Misyon & Vizyon
                  </Link>
                  <Link 
                    href="/hakkimizda" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                    onClick={() => setIsAboutOpen(false)}
                  >
                    Değerlerimiz
                  </Link>
                </div>
              )}
            </div>

            {/* Hizmetler dropdown menüsü */}
            <div 
              className="relative"
              onMouseEnter={handleServicesEnter}
              onMouseLeave={handleServicesLeave}
            >
              <button 
                className="flex items-center text-gray-700 hover:text-orange-500 transition-colors"
                aria-haspopup="menu"
                aria-expanded={isServicesOpen}
              >
                Hizmetler
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown menü - tıklama ve hover ile açılır */}
              {isServicesOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                  onMouseEnter={handleServicesEnter}
                  onMouseLeave={handleServicesLeave}
                >
                  <Link 
                    href="/hizmetler" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    Tüm Hizmetler
                  </Link>
                  <Link 
                    href="/hizmetler" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    Referanslarımız
                  </Link>
                  <Link 
                    href="/hizmetler" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    Şubelerimiz
                  </Link>
                  <Link 
                    href="/hizmetler" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    Galeri
                  </Link>
                </div>
              )}
            </div>

            {/* Diğer menü öğeleri */}
            <Link href="/projelerimiz" className="text-gray-700 hover:text-orange-500 transition-colors">
              Projelerimiz
            </Link>
            <Link href="/haberler" className="text-gray-700 hover:text-orange-500 transition-colors">
              Haberler
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-orange-500 transition-colors">
              Blog
            </Link>
            <Link href="/kariyer" className="text-gray-700 hover:text-orange-500 transition-colors">
              Kariyer
            </Link>
            <Link href="/iletisim" className="text-gray-700 hover:text-orange-500 transition-colors">
              İletişim
            </Link>
            
          {/* Dil seçici */}
          <div className="flex items-center justify-end">
              <span className="text-orange-500 font-medium bg-orange-50 px-3 py-1 rounded-md text-sm">
                TR
              </span>
            </div>
          </nav>

          {/* Mobil menü butonu - sadece mobilde görünür */}
          <button className="md:hidden p-2 text-gray-700 hover:text-orange-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

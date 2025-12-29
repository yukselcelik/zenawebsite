// Header bileşeni - Web sitesinin üst kısmındaki navigasyon menüsünü içerir
// Bu bileşen tüm sayfalarda ortak olarak kullanılacak

'use client'; // Client-side bileşen olduğunu belirtir (React hooks kullanabilmek için)

import Link from 'next/link'; // Next.js'in Link bileşeni - sayfa geçişleri için
import { useState, useRef, useEffect } from 'react'; // React'in useState hook'ları - state yönetimi için
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Header({ forceDark = false }) {
  // useState hook'u ile dropdown menülerin açık/kapalı durumunu yönetiyoruz
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Scroll durumunu takip et
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const shouldShowDark = forceDark || isScrolled;

  return (
    <header
      className="sticky top-0 z-[100] transition-all duration-300 pt-4 bg-black/90 shadow-lg"
    >
      {/* Ana container - içeriği ortalar ve maksimum genişlik verir */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-around items-center transition-all duration-300 ${isScrolled ? 'h-14' : 'h-16'
          }`}>

          {/* Logo kısmı - Sol üst köşe */}
          <Link href="/" className="flex items-center -ml-3 sm:-ml-5">
            <Image
              src="/zena-logo.png"
              alt="Zena Enerji"
              width={96}
              height={30}
              priority
              className="brightness-0 invert"
            />
          </Link>

          {/* Ana navigasyon menüsü */}
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="font-bold transition-colors text-white hover:text-orange-400"
            >
              Ana Sayfa
            </Link>

            {/* Hakkımızda dropdown menüsü */}
            <div
              className="relative"
              onMouseEnter={handleAboutEnter}
              onMouseLeave={handleAboutLeave}
            >
              <button
                className="flex items-center font-bold transition-colors text-white hover:text-orange-400 hover:cursor-pointer"
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
                  className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 bg-black/95"
                  onMouseEnter={handleAboutEnter}
                  onMouseLeave={handleAboutLeave}
                >
                  <Link
                    href="/hakkimizda"
                    className="block px-4 py-2 text-sm transition-colors text-white hover:bg-white/10 hover:text-orange-400"
                    onClick={() => setIsAboutOpen(false)}
                  >
                    Biz Kimiz?
                  </Link>
                  <Link
                    href="/#referanslarimiz"
                    className="block px-4 py-2 text-sm transition-colors text-white hover:bg-white/10 hover:text-orange-400"
                    onClick={() => setIsAboutOpen(false)}
                  >
                    Referanslarımız
                  </Link>
                  <Link
                    href="/subelerimiz"
                    className="block px-4 py-2 text-sm transition-colors text-white hover:bg-white/10 hover:text-orange-400"
                    onClick={() => setIsAboutOpen(false)}
                  >
                    Şubelerimiz
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
                className="flex items-center font-bold transition-colors text-white hover:text-orange-400 hover:cursor-pointer"
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
                  className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 bg-black/95"
                  onMouseEnter={handleServicesEnter}
                  onMouseLeave={handleServicesLeave}
                >
                  <Link
                    href="/hizmetler"
                    className="block px-4 py-2 text-sm transition-colors text-white hover:bg-white/10 hover:text-orange-400"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    Hizmetlerimiz
                  </Link>
                  <Link
                    href="/simulasyon"
                    className="block px-4 py-2 text-sm transition-colors text-white hover:bg-white/10 hover:text-orange-400"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    Solar Güç Hesaplama
                  </Link>
                </div>
              )}
            </div>

            {/* Diğer menü öğeleri */}
            <Link
              href="/projelerimiz"
              className="font-bold transition-colors text-white hover:text-orange-400"
            >
              Projelerimiz
            </Link>
            <Link
              href="/haberler"
              className="font-bold transition-colors text-white hover:text-orange-400"
            >
              Haberler
            </Link>
            <Link
              href="/kariyer"
              className="font-bold transition-colors text-white hover:text-orange-400"
            >
              Kariyer
            </Link>
            <Link
              href="/iletisim"
              className="font-bold transition-colors text-white hover:text-orange-400"
            >
              İletişim
            </Link>

            {/* Giriş butonu ve dil seçici */}
            {isLoggedIn && (
              <>
                <Link
                  href="/panel"
                  className="font-bold transition-colors text-white hover:text-orange-400"
                >
                  Panel
                </Link>
                <button
                  onClick={handleLogout}
                  className="font-bold transition-colors text-white hover:text-orange-400"
                >
                  Çıkış
                </button>
              </>
            )}
          </nav>

          {/* Mobil menü butonu - sadece mobilde görünür */}
          <button
            className="md:hidden p-2 transition-colors text-white hover:text-orange-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

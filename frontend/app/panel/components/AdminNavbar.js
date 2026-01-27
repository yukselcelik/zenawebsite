'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar({ userData, onLogout, isManager }) {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname?.includes('/dashboard')) return 'Dashboard';
    if (pathname?.includes('/profilim')) return 'Profilim';
    if (pathname?.includes('/izin-talepleri/yeni')) return 'Yeni İzin Talebi';
    if (pathname?.includes('/izin-talepleri')) return 'İzin Talepleri';
    if (pathname?.includes('/hak-ve-alacaklar')) return 'Hak ve Alacaklar';
    if (pathname?.includes('/taleplerim')) return 'Taleplerim';
    if (pathname?.includes('/talep-et')) return 'Talep Et';
    if (pathname?.includes('/masraf-talep-et')) return 'Masraf Talep Et';
    if (pathname?.includes('/masraf-taleplerim')) return 'Masraf Taleplerim';
    if (pathname?.includes('/talepleri-incele')) return 'Talepleri İncele';
    if (pathname?.includes('/masraf-talepleri')) return 'Masraf Talepleri';
    if (pathname?.includes('/odeme-takip')) return 'Ödeme Takip';
    if (pathname?.includes('/personeller') && pathname?.match(/\/personeller\/\d+/)) return 'Çalışan Detayı';
    if (pathname?.includes('/personeller')) return 'Çalışanlar';
    if (pathname?.includes('/is-basvurulari')) return 'İş/Staj Başvuruları';
    return 'Panel';
  };

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700 py-4 shadow-lg"
    >
      <div className="px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-extrabold text-white"
          >
            {getTitle()}
          </motion.h1>
          {isManager ? (
            <motion.div 
              className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2.5 py-1 rounded-full shadow-lg shadow-orange-500/50">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-bold">Yönetici</span>
            </motion.div>
          ) : (
            <motion.div 
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2.5 py-1 rounded-full shadow-lg shadow-blue-500/50">
              <span className="text-xs font-bold">Çalışan</span>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Kullanıcı Bilgisi */}
          <motion.div 
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all duration-300"
          >
            {userData?.photoPath ? (
              <motion.div 
                className="relative"
              >
                <img
                  src={userData.photoPath}
                  className="w-10 h-10 border border-gray-600 rounded-full object-cover ring-2 ring-gray-600 shadow-sm"
                  alt="Profil"
                />
                
              </motion.div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center ring-2 ring-gray-600 shadow-sm">
                <span className="text-white font-semibold text-sm">
                  {userData?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <div className="text-left">
              <p className="text-sm font-bold text-white">
                {userData?.name} {userData?.surname}
              </p>
              <p className="text-xs text-gray-400">
                {userData?.email}
              </p>
            </div>
          </motion.div>

          {/* Ana Sayfa Butonu */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className="group relative inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/50 hover:shadow-xl transition-all duration-300 text-sm font-bold cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <motion.svg 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="w-4.5 h-4.5 relative z-10 transition-transform duration-300 group-hover:scale-110" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </motion.svg>
              <span className="relative z-10">Ana Sayfa</span>
            </Link>
          </motion.div>

          {/* Çıkış Butonu */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <button
              onClick={onLogout}
              className="group relative inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg shadow-red-500/50 hover:shadow-xl transition-all duration-300 text-sm font-bold cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <motion.svg 
                // animate={{ x: [0, 3, 0] }}
                // transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                className="w-4.5 h-4.5 relative z-10 " 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </motion.svg>
              <span className="relative z-10">Çıkış Yap</span>
            </button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}


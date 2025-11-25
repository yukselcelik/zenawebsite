'use client';

import Link from 'next/link';

export default function Navbar({ userData, onLogout, activeTab, isManager }) {
  const tabTitles = {
    'dashboard': 'Dashboard',
    'profile': 'Profilim',
    'leaves': 'İzin Talepleri',
    'create-leave': 'Yeni İzin Talebi',
    'personnel': 'Personeller',
    'personnel-detail': 'Personel Detayı',
    'internships': 'Staj Başvuruları'
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-gray-800">
            {tabTitles[activeTab] || 'Panel'}
          </h1>
          {isManager && (
            <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1.5 rounded-full shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-bold">ADMIN</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">

          {/* Kullanıcı Bilgisi */}
          <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
            {userData?.photoPath ? (
              <div className="relative">
                <img
                  src={userData.photoPath}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-sm"
                  alt="Profil"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            ) : (
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center ring-2 ring-white shadow-sm">
                <span className="text-white font-semibold text-sm">
                  {userData?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">
                {userData?.name} {userData?.surname}
              </p>
              <p className="text-xs text-gray-500">{userData?.email}</p>
            </div>
          </div>

          {/* Ana Sayfa Butonu */}
          <Link
            href="/"
            className="group relative inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm font-semibold cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <svg className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="relative z-10">Ana Sayfa</span>
          </Link>

          {/* Çıkış Butonu */}
          <button
            onClick={onLogout}
            className="group relative inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm font-semibold cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <svg className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="relative z-10">Çıkış Yap</span>
          </button>
        </div>
      </div>
    </header>
  );
}


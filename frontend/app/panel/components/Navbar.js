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
    'internships': 'Staj Başvuruları',
    'pending-users': 'Onay Bekleyen Kullanıcılar'
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="px-6 py-4 flex justify-between items-center">
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
          {/* Ana Sayfa Butonu */}
          <Link
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium cursor-pointer flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Ana Sayfas</span>
          </Link>

          {/* Kullanıcı Bilgisi */}
          <div className="flex items-center space-x-3">
            {userData?.photoPath ? (
              <img
                src={userData.photoPath}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
             <></>
            )}
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
                {userData?.name} {userData?.surname}
              </p>
              <p className="text-xs text-gray-500">{userData?.email}</p>
            </div>
          </div>

          {/* Çıkış Butonu */}
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium cursor-pointer"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </header>
  );
}


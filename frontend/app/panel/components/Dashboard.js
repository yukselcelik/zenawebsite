'use client';

export default function Dashboard({ isManager, stats, userDetail, onTabChange }) {
  const isPendingApproval = userDetail && !userDetail.isApproved && !isManager;

  return (
    <div className="space-y-6">
      {/* Onay Bekleyen Kullanıcı Bildirimi */}
      {isPendingApproval && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                Hesabınız Onay Bekliyor
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Kayıt işleminiz başarıyla tamamlandı. Hesabınız yönetici onayı bekliyor. 
                  Onaylandıktan sonra tüm özelliklere erişebileceksiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          {isManager 
            ? 'Yönetici paneline hoş geldiniz. Tüm sistem yönetim işlemlerini buradan yapabilirsiniz.'
            : 'Personel paneline hoş geldiniz. İzin taleplerinizi ve profil bilgilerinizi buradan yönetebilirsiniz.'}
        </p>
      </div>

      {isManager && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => onTabChange && onTabChange('personnel')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-200 text-left w-full group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-500 transition-colors">Toplam Personel</h3>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-orange-500">{stats.personnelCount || 0}</p>
            <p className="text-xs text-gray-500 mt-2 group-hover:text-orange-500 transition-colors">Detayları görüntüle →</p>
          </button>
          
          <button
            onClick={() => onTabChange && onTabChange('leaves')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-200 text-left w-full group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-yellow-500 transition-colors">Bekleyen İzin Talepleri</h3>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-yellow-500">{stats.pendingLeaves || 0}</p>
            <p className="text-xs text-gray-500 mt-2 group-hover:text-yellow-500 transition-colors">Detayları görüntüle →</p>
          </button>
          
          <button
            onClick={() => onTabChange && onTabChange('internships')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-200 text-left w-full group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-500 transition-colors">İş/Staj Başvuruları</h3>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-3xl font-bold text-blue-500">{stats.internshipCount || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Toplam Başvuru</p>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-lg font-semibold text-gray-700">{stats.internshipLastMonthCount || 0}</p>
                  <p className="text-sm text-gray-500">Son 1 Ayda</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 group-hover:text-blue-500 transition-colors">Detayları görüntüle →</p>
          </button>
        </div>
      )}
    </div>
  );
}


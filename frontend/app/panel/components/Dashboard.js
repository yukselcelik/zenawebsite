'use client';

export default function Dashboard({ isManager, stats, userDetail }) {
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
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Hoş Geldiniz</h2>
        <p className="text-gray-600">
          {isManager 
            ? 'Yönetici paneline hoş geldiniz. Tüm sistem yönetim işlemlerini buradan yapabilirsiniz.'
            : 'Personel paneline hoş geldiniz. İzin taleplerinizi ve profil bilgilerinizi buradan yönetebilirsiniz.'}
        </p>
      </div>

      {isManager && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Toplam Personel</h3>
            <p className="text-3xl font-bold text-orange-500">{stats.personnelCount || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Bekleyen İzin Talepleri</h3>
            <p className="text-3xl font-bold text-yellow-500">{stats.pendingLeaves || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Staj Başvuruları</h3>
            <p className="text-3xl font-bold text-blue-500">{stats.internshipCount || 0}</p>
          </div>
        </div>
      )}
    </div>
  );
}


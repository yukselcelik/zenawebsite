// Yönetici paneli sayfası - Yöneticilerin tüm izin taleplerini yönetebileceği sayfa
// Bu sayfa yöneticilerin gelen izin taleplerini onaylayıp reddedebileceği sayfadır

'use client'; // Client-side bileşen - state yönetimi için

import { useState, useEffect } from 'react'; // React hooks - state ve lifecycle yönetimi için
import { useRouter } from 'next/navigation'; // Next.js router - sayfa yönlendirmesi için
import ApiService from '../../lib/api'; // API servis sınıfı

export default function YoneticiPaneli() {
  // useState ile yönetici verilerini ve loading durumunu yönetiyoruz
  const [adminData, setAdminData] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, PENDING, APPROVED, REJECTED
  const router = useRouter();

  // useEffect ile sayfa yüklendiğinde yönetici verilerini çekiyoruz
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // LocalStorage'dan token'ı al
        const token = localStorage.getItem('employeeToken');
        const userRole = localStorage.getItem('userRole');
        
        if (!token || userRole !== 'ADMIN') {
          // Token yoksa veya admin değilse giriş sayfasına yönlendir
          router.push('/calisan-girisi');
          return;
        }

        // Backend API'den verileri çek
        const [profileData, leaveRequestsData] = await Promise.all([
          ApiService.getProfile(),
          ApiService.getAllLeaveRequests()
        ]);

        setAdminData(profileData.data.user);
        setLeaveRequests(leaveRequestsData.data.leaveRequests);

      } catch (error) {
        console.error('Data fetch error:', error);
        if (error.message.includes('Geçersiz token') || error.message.includes('401')) {
          // Token geçersizse giriş sayfasına yönlendir
          localStorage.removeItem('employeeToken');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userName');
          router.push('/calisan-girisi');
        } else {
          setError('Veriler yüklenirken hata oluştu');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);

  // Çıkış yapma fonksiyonu
  const handleLogout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('employeeToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      router.push('/calisan-girisi');
    }
  };

  // İzin talebini onaylama
  const handleApproveLeaveRequest = async (id) => {
    try {
      await ApiService.approveLeaveRequest(id);
      
      // Verileri yenile
      const leaveRequestsData = await ApiService.getAllLeaveRequests();
      setLeaveRequests(leaveRequestsData.data.leaveRequests);
      
    } catch (error) {
      setError(error.message || 'İzin talebi onaylanamadı');
    }
  };

  // İzin talebini reddetme
  const handleRejectLeaveRequest = async (id) => {
    try {
      await ApiService.rejectLeaveRequest(id);
      
      // Verileri yenile
      const leaveRequestsData = await ApiService.getAllLeaveRequests();
      setLeaveRequests(leaveRequestsData.data.leaveRequests);
      
    } catch (error) {
      setError(error.message || 'İzin talebi reddedilemedi');
    }
  };

  // Filtrelenmiş izin taleplerini getir
  const filteredLeaveRequests = leaveRequests.filter(leave => {
    if (filterStatus === 'ALL') return true;
    return leave.status === filterStatus;
  });

  // Loading durumu
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-800">ZENA</span>
                <span className="text-sm text-orange-500 block -mt-1">enerji</span>
              </div>
            </div>

            {/* Çıkış butonu */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      {/* Ana içerik */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        
        {/* Hoş geldin mesajı */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Yönetici Paneli
          </h1>
          <p className="text-gray-600">
            Hoş geldin, {adminData?.fullName}! Tüm izin taleplerini buradan yönetebilirsin.
          </p>
        </div>

        {/* İstatistik kartları */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          
          {/* Toplam talep */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Toplam Talep
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {leaveRequests.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Bekleyen talepler */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Bekleyen
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {leaveRequests.filter(l => l.status === 'PENDING').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Onaylanan talepler */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Onaylanan
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {leaveRequests.filter(l => l.status === 'APPROVED').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Reddedilen talepler */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Reddedilen
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {leaveRequests.filter(l => l.status === 'REJECTED').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtreleme */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filtrele:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="ALL">Tümü</option>
              <option value="PENDING">Bekleyen</option>
              <option value="APPROVED">Onaylanan</option>
              <option value="REJECTED">Reddedilen</option>
            </select>
          </div>
        </div>

        {/* İzin talepleri listesi */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              İzin Talepleri
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Tüm çalışanların izin taleplerini buradan yönetebilirsin
            </p>
          </div>
          <div className="border-t border-gray-200">
            {filteredLeaveRequests?.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredLeaveRequests.map((leave) => (
                  <li key={leave.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-orange-600">
                              {leave.user.fullName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {leave.user.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {leave.daysCount} gün - {leave.reason || 'İzin talebi'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(leave.startDate).toLocaleDateString('tr-TR')} - {new Date(leave.endDate).toLocaleDateString('tr-TR')}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(leave.createdAt).toLocaleDateString('tr-TR')} tarihinde gönderildi
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          leave.status === 'APPROVED' 
                            ? 'bg-green-100 text-green-800'
                            : leave.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {leave.status === 'APPROVED' ? 'Onaylandı' : 
                           leave.status === 'PENDING' ? 'Beklemede' : 'Reddedildi'}
                        </span>
                        {leave.status === 'PENDING' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveLeaveRequest(leave.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Onayla
                            </button>
                            <button
                              onClick={() => handleRejectLeaveRequest(leave.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Reddet
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">İzin talebi yok</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filterStatus === 'ALL' ? 'Henüz izin talebi bulunmamaktadır.' : 
                   `Bu kategoride izin talebi bulunmamaktadır.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

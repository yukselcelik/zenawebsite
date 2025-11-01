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
  const [internshipApplications, setInternshipApplications] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [leavePagination, setLeavePagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  });
  const [internshipPagination, setInternshipPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  });
  const [userPagination, setUserPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, PENDING, APPROVED, REJECTED
  const [activeTab, setActiveTab] = useState('leaves'); // 'leaves', 'internships', or 'users'
  const router = useRouter();

  // useEffect ile sayfa yüklendiğinde yönetici verilerini çekiyoruz
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // LocalStorage'dan token'ı al
        const token = localStorage.getItem('employeeToken');
        const userRole = localStorage.getItem('userRole');
        
        if (!token || userRole !== 'Manager') {
          // Token yoksa veya manager değilse giriş sayfasına yönlendir
          router.push('/calisan-girisi');
          return;
        }

        // Backend API'den verileri çek
        const [profileData, leaveRequestsData, internshipApplicationsData, pendingUsersData] = await Promise.all([
          ApiService.getProfile(),
          ApiService.getAllLeaveRequests(1, 10), // İlk yüklemede sayfa 1, sayfa boyutu 10
          ApiService.getAllInternshipApplications(1, 10).catch(() => ({ data: { items: [], totalCount: 0, totalPages: 0, pageNumber: 1, pageSize: 10 } })), // İlk yüklemede sayfa 1, sayfa boyutu 10
          ApiService.getPendingUsers(1, 10).catch(() => ({ data: { items: [], totalCount: 0, totalPages: 0, pageNumber: 1, pageSize: 10 } })) // İlk yüklemede sayfa 1, sayfa boyutu 10
        ]);

        setAdminData(profileData.data);
        setLeaveRequests(leaveRequestsData.data?.items || []);
        setLeavePagination({
          pageNumber: leaveRequestsData.data?.pageNumber || 1,
          pageSize: leaveRequestsData.data?.pageSize || 10,
          totalCount: leaveRequestsData.data?.totalCount || 0,
          totalPages: leaveRequestsData.data?.totalPages || 0
        });
        setInternshipApplications(internshipApplicationsData.data?.items || []);
        setInternshipPagination({
          pageNumber: internshipApplicationsData.data?.pageNumber || 1,
          pageSize: internshipApplicationsData.data?.pageSize || 10,
          totalCount: internshipApplicationsData.data?.totalCount || 0,
          totalPages: internshipApplicationsData.data?.totalPages || 0
        });
        setPendingUsers(pendingUsersData.data?.items || []);
        setUserPagination({
          pageNumber: pendingUsersData.data?.pageNumber || 1,
          pageSize: pendingUsersData.data?.pageSize || 10,
          totalCount: pendingUsersData.data?.totalCount || 0,
          totalPages: pendingUsersData.data?.totalPages || 0
        });

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

  // Filtrelenmiş izin taleplerini getir (pagination sonrası frontend'de filtreleme için)
  const filteredLeaveRequests = leaveRequests.filter(leave => {
    if (filterStatus === 'ALL') return true;
    return leave.status === filterStatus;
  });

  // Pagination handlers
  const handleLeavePageChange = async (newPageNumber) => {
    setIsLoading(true);
    try {
      const leaveRequestsData = await ApiService.getAllLeaveRequests(newPageNumber, leavePagination.pageSize);
      setLeaveRequests(leaveRequestsData.data?.items || []);
      setLeavePagination({
        pageNumber: leaveRequestsData.data?.pageNumber || 1,
        pageSize: leaveRequestsData.data?.pageSize || 10,
        totalCount: leaveRequestsData.data?.totalCount || 0,
        totalPages: leaveRequestsData.data?.totalPages || 0
      });
    } catch (error) {
      setError(error.message || 'Sayfa yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInternshipPageChange = async (newPageNumber) => {
    setIsLoading(true);
    try {
      const internshipApplicationsData = await ApiService.getAllInternshipApplications(newPageNumber, internshipPagination.pageSize);
      setInternshipApplications(internshipApplicationsData.data?.items || []);
      setInternshipPagination({
        pageNumber: internshipApplicationsData.data?.pageNumber || 1,
        pageSize: internshipApplicationsData.data?.pageSize || 10,
        totalCount: internshipApplicationsData.data?.totalCount || 0,
        totalPages: internshipApplicationsData.data?.totalPages || 0
      });
    } catch (error) {
      setError(error.message || 'Sayfa yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserPageChange = async (newPageNumber) => {
    setIsLoading(true);
    try {
      const pendingUsersData = await ApiService.getPendingUsers(newPageNumber, userPagination.pageSize);
      setPendingUsers(pendingUsersData.data?.items || []);
      setUserPagination({
        pageNumber: pendingUsersData.data?.pageNumber || 1,
        pageSize: pendingUsersData.data?.pageSize || 10,
        totalCount: pendingUsersData.data?.totalCount || 0,
        totalPages: pendingUsersData.data?.totalPages || 0
      });
    } catch (error) {
      setError(error.message || 'Sayfa yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveUser = async (userId) => {
    if (!confirm('Bu kullanıcıyı onaylamak istediğinize emin misiniz?')) {
      return;
    }

    try {
      await ApiService.approveUser(userId);
      
      // Listeyi yenile
      const pendingUsersData = await ApiService.getPendingUsers(userPagination.pageNumber, userPagination.pageSize);
      setPendingUsers(pendingUsersData.data?.items || []);
      setUserPagination({
        pageNumber: pendingUsersData.data?.pageNumber || 1,
        pageSize: pendingUsersData.data?.pageSize || 10,
        totalCount: pendingUsersData.data?.totalCount || 0,
        totalPages: pendingUsersData.data?.totalPages || 0
      });
    } catch (error) {
      setError(error.message || 'Kullanıcı onaylanırken hata oluştu');
    }
  };

  const handleRejectUser = async (userId) => {
    if (!confirm('Bu kullanıcıyı reddetmek istediğinize emin misiniz? Kullanıcı silinecektir.')) {
      return;
    }

    try {
      await ApiService.rejectUser(userId);
      
      // Listeyi yenile
      const pendingUsersData = await ApiService.getPendingUsers(userPagination.pageNumber, userPagination.pageSize);
      setPendingUsers(pendingUsersData.data?.items || []);
      setUserPagination({
        pageNumber: pendingUsersData.data?.pageNumber || 1,
        pageSize: pendingUsersData.data?.pageSize || 10,
        totalCount: pendingUsersData.data?.totalCount || 0,
        totalPages: pendingUsersData.data?.totalPages || 0
      });
    } catch (error) {
      setError(error.message || 'Kullanıcı reddedilirken hata oluştu');
    }
  };

  // İzin talebini iptal etme (Manager için)
  const handleCancelLeaveRequest = async (id) => {
    if (!confirm('Bu izin talebini iptal etmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      await ApiService.deleteLeaveRequest(id);
      
      // Listeyi yenile
      const leaveRequestsData = await ApiService.getAllLeaveRequests(leavePagination.pageNumber, leavePagination.pageSize);
      setLeaveRequests(leaveRequestsData.data?.items || []);
      setLeavePagination({
        pageNumber: leaveRequestsData.data?.pageNumber || 1,
        pageSize: leaveRequestsData.data?.pageSize || 10,
        totalCount: leaveRequestsData.data?.totalCount || 0,
        totalPages: leaveRequestsData.data?.totalPages || 0
      });
    } catch (error) {
      setError(error.message || 'İzin talebi iptal edilirken hata oluştu');
    }
  };

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
            Hoş geldin, {adminData?.email}! Tüm izin taleplerini ve staj başvurularını buradan yönetebilirsin.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('leaves')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'leaves'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              İzin Talepleri
            </button>
            <button
              onClick={() => setActiveTab('internships')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'internships'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Staj Başvuruları
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Onay Bekleyen Kullanıcılar
              {userPagination.totalCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {userPagination.totalCount}
                </span>
              )}
            </button>
          </nav>
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
                      {leaveRequests.filter(l => l.status === 'Pending').length}
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
                      {leaveRequests.filter(l => l.status === 'Approved').length}
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
                      {leaveRequests.filter(l => l.status === 'Rejected').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* İzin talepleri listesi */}
        {activeTab === 'leaves' && (
          <>
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
                  <option value="Pending">Bekleyen</option>
                  <option value="Approved">Onaylanan</option>
                  <option value="Rejected">Reddedilen</option>
                  <option value="Cancelled">İptal Edilen</option>
                </select>
              </div>
            </div>

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
                                  {leave.userName?.charAt(0) || leave.userEmail?.charAt(0) || '?'}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {leave.userName} {leave.userSurname}
                              </div>
                              <div className="text-sm text-gray-500">
                                {leave.userEmail}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {new Date(leave.startDate).toLocaleDateString('tr-TR')} - {new Date(leave.endDate).toLocaleDateString('tr-TR')}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {leave.reason}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {new Date(leave.createdAt).toLocaleString('tr-TR')} tarihinde gönderildi
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              leave.status === 'Approved' 
                                ? 'bg-green-100 text-green-800'
                                : leave.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : leave.status === 'Rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {leave.status === 'Approved' ? 'Onaylandı' : 
                               leave.status === 'Pending' ? 'Beklemede' : 
                               leave.status === 'Rejected' ? 'Reddedildi' : 'İptal Edildi'}
                            </span>
                            {leave.status === 'Pending' && (
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
                
                {/* Pagination */}
                {leavePagination.totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                      <button
                        onClick={() => handleLeavePageChange(leavePagination.pageNumber - 1)}
                        disabled={!leavePagination.hasPreviousPage || isLoading}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Önceki
                      </button>
                      <button
                        onClick={() => handleLeavePageChange(leavePagination.pageNumber + 1)}
                        disabled={!leavePagination.hasNextPage || isLoading}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sonraki
                      </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Toplam <span className="font-medium">{leavePagination.totalCount}</span> kayıttan{' '}
                          <span className="font-medium">
                            {(leavePagination.pageNumber - 1) * leavePagination.pageSize + 1}
                          </span>
                          {' '}ile{' '}
                          <span className="font-medium">
                            {Math.min(leavePagination.pageNumber * leavePagination.pageSize, leavePagination.totalCount)}
                          </span>
                          {' '}arası gösteriliyor
                        </p>
                      </div>
                      <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                          <button
                            onClick={() => handleLeavePageChange(leavePagination.pageNumber - 1)}
                            disabled={!leavePagination.hasPreviousPage || isLoading}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Önceki</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                            </svg>
                          </button>
                          {Array.from({ length: leavePagination.totalPages }, (_, i) => i + 1).map((page) => {
                            if (
                              page === 1 ||
                              page === leavePagination.totalPages ||
                              (page >= leavePagination.pageNumber - 1 && page <= leavePagination.pageNumber + 1)
                            ) {
                              return (
                                <button
                                  key={page}
                                  onClick={() => handleLeavePageChange(page)}
                                  disabled={isLoading}
                                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                    page === leavePagination.pageNumber
                                      ? 'z-10 bg-orange-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600'
                                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                  {page}
                                </button>
                              );
                            } else if (
                              page === leavePagination.pageNumber - 2 ||
                              page === leavePagination.pageNumber + 2
                            ) {
                              return (
                                <span key={page} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}
                          <button
                            onClick={() => handleLeavePageChange(leavePagination.pageNumber + 1)}
                            disabled={!leavePagination.hasNextPage || isLoading}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Sonraki</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Staj Başvuruları Listesi */}
        {activeTab === 'internships' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Staj Başvuruları
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Tüm staj başvurularını buradan görüntüleyebilirsin
                  </p>
                </div>
                {internshipPagination.totalCount > 0 && (
                  <p className="text-sm text-gray-500">
                    Toplam {internshipPagination.totalCount} kayıt
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-gray-200">
              {internshipApplications?.length > 0 ? (
                <>
                  <ul className="divide-y divide-gray-200">
                    {internshipApplications.map((application) => (
                    <li key={application.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {application.fullName?.charAt(0) || '?'}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {application.fullName}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                <span className="font-medium">E-posta:</span> {application.email}
                              </div>
                              <div className="text-sm text-gray-500">
                                <span className="font-medium">Telefon:</span> {application.phone}
                              </div>
                              <div className="text-sm text-gray-500">
                                <span className="font-medium">Okul:</span> {application.school}
                              </div>
                              <div className="text-sm text-gray-500">
                                <span className="font-medium">Bölüm:</span> {application.department}
                              </div>
                              {application.year && (
                                <div className="text-sm text-gray-500">
                                  <span className="font-medium">Sınıf:</span> {application.year}
                                </div>
                              )}
                              {application.message && (
                                <div className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                                  <span className="font-medium">Mesaj:</span> {application.message}
                                </div>
                              )}
                              <div className="text-xs text-gray-400 mt-2">
                                {new Date(application.createdAt).toLocaleString('tr-TR')} tarihinde başvuruldu
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                
                {/* Pagination */}
                {internshipPagination.totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                      <button
                        onClick={() => handleInternshipPageChange(internshipPagination.pageNumber - 1)}
                        disabled={!internshipPagination.hasPreviousPage || isLoading}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Önceki
                      </button>
                      <button
                        onClick={() => handleInternshipPageChange(internshipPagination.pageNumber + 1)}
                        disabled={!internshipPagination.hasNextPage || isLoading}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sonraki
                      </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Toplam <span className="font-medium">{internshipPagination.totalCount}</span> kayıttan{' '}
                          <span className="font-medium">
                            {(internshipPagination.pageNumber - 1) * internshipPagination.pageSize + 1}
                          </span>
                          {' '}ile{' '}
                          <span className="font-medium">
                            {Math.min(internshipPagination.pageNumber * internshipPagination.pageSize, internshipPagination.totalCount)}
                          </span>
                          {' '}arası gösteriliyor
                        </p>
                      </div>
                      <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                          <button
                            onClick={() => handleInternshipPageChange(internshipPagination.pageNumber - 1)}
                            disabled={!internshipPagination.hasPreviousPage || isLoading}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Önceki</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                            </svg>
                          </button>
                          {Array.from({ length: internshipPagination.totalPages }, (_, i) => i + 1).map((page) => {
                            if (
                              page === 1 ||
                              page === internshipPagination.totalPages ||
                              (page >= internshipPagination.pageNumber - 1 && page <= internshipPagination.pageNumber + 1)
                            ) {
                              return (
                                <button
                                  key={page}
                                  onClick={() => handleInternshipPageChange(page)}
                                  disabled={isLoading}
                                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                    page === internshipPagination.pageNumber
                                      ? 'z-10 bg-orange-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600'
                                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                  {page}
                                </button>
                              );
                            } else if (
                              page === internshipPagination.pageNumber - 2 ||
                              page === internshipPagination.pageNumber + 2
                            ) {
                              return (
                                <span key={page} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}
                          <button
                            onClick={() => handleInternshipPageChange(internshipPagination.pageNumber + 1)}
                            disabled={!internshipPagination.hasNextPage || isLoading}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Sonraki</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
              ) : (
                <div className="px-4 py-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Staj başvurusu yok</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Henüz staj başvurusu bulunmamaktadır.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Onay Bekleyen Kullanıcılar Listesi */}
        {activeTab === 'users' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Onay Bekleyen Kullanıcılar
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Kayıt olmuş ancak henüz onaylanmamış personel kullanıcıları
                  </p>
                </div>
                {userPagination.totalCount > 0 && (
                  <p className="text-sm text-gray-500">
                    Toplam {userPagination.totalCount} kayıt
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-gray-200">
              {pendingUsers?.length > 0 ? (
                <>
                  <ul className="divide-y divide-gray-200">
                    {pendingUsers.map((user) => (
                      <li key={user.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-orange-600">
                                    {user.name?.charAt(0) || user.email?.charAt(0) || '?'}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name} {user.surname}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                                {user.phone && (
                                  <div className="text-sm text-gray-500 mt-1">
                                    {user.phone}
                                  </div>
                                )}
                                <div className="text-xs text-gray-400 mt-1">
                                  {new Date(user.createdAt).toLocaleString('tr-TR')} tarihinde kayıt oldu
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleApproveUser(user.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Onayla
                            </button>
                            <button
                              onClick={() => handleRejectUser(user.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Reddet
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Pagination */}
                  {userPagination.totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
                      <div className="flex flex-1 justify-between sm:hidden">
                        <button
                          onClick={() => handleUserPageChange(userPagination.pageNumber - 1)}
                          disabled={!userPagination.hasPreviousPage || isLoading}
                          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Önceki
                        </button>
                        <button
                          onClick={() => handleUserPageChange(userPagination.pageNumber + 1)}
                          disabled={!userPagination.hasNextPage || isLoading}
                          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Sonraki
                        </button>
                      </div>
                      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Toplam <span className="font-medium">{userPagination.totalCount}</span> kayıttan{' '}
                            <span className="font-medium">
                              {(userPagination.pageNumber - 1) * userPagination.pageSize + 1}
                            </span>
                            {' '}ile{' '}
                            <span className="font-medium">
                              {Math.min(userPagination.pageNumber * userPagination.pageSize, userPagination.totalCount)}
                            </span>
                            {' '}arası gösteriliyor
                          </p>
                        </div>
                        <div>
                          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button
                              onClick={() => handleUserPageChange(userPagination.pageNumber - 1)}
                              disabled={!userPagination.hasPreviousPage || isLoading}
                              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="sr-only">Önceki</span>
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                              </svg>
                            </button>
                            {Array.from({ length: userPagination.totalPages }, (_, i) => i + 1).map((page) => {
                              if (
                                page === 1 ||
                                page === userPagination.totalPages ||
                                (page >= userPagination.pageNumber - 1 && page <= userPagination.pageNumber + 1)
                              ) {
                                return (
                                  <button
                                    key={page}
                                    onClick={() => handleUserPageChange(page)}
                                    disabled={isLoading}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                      page === userPagination.pageNumber
                                        ? 'z-10 bg-orange-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600'
                                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                  >
                                    {page}
                                  </button>
                                );
                              } else if (
                                page === userPagination.pageNumber - 2 ||
                                page === userPagination.pageNumber + 2
                              ) {
                                return (
                                  <span key={page} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                                    ...
                                  </span>
                                );
                              }
                              return null;
                            })}
                            <button
                              onClick={() => handleUserPageChange(userPagination.pageNumber + 1)}
                              disabled={!userPagination.hasNextPage || isLoading}
                              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="sr-only">Sonraki</span>
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="px-4 py-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Onay bekleyen kullanıcı yok</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Henüz onay bekleyen personel kullanıcısı bulunmamaktadır.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

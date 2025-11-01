// Çalışan paneli sayfası - Giriş yapmış çalışanların görebileceği sayfa

'use client'; // Client-side bileşen - state yönetimi için

import { useState, useEffect } from 'react'; // React hooks - state ve lifecycle yönetimi için
import { useRouter } from 'next/navigation'; // Next.js router - sayfa yönlendirmesi için
import ApiService from '../../lib/api'; // API servis sınıfı

export default function CalisanPaneli() {
  // useState ile çalışan verilerini ve loading durumunu yönetiyoruz
  const [employeeData, setEmployeeData] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leavePagination, setLeavePagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [submittingLeave, setSubmittingLeave] = useState(false);
  const router = useRouter();

  // useEffect ile sayfa yüklendiğinde çalışan verilerini çekiyoruz
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // LocalStorage'dan token'ı al
        const token = localStorage.getItem('employeeToken');
        
        if (!token) {
          // Token yoksa giriş sayfasına yönlendir
          router.push('/calisan-girisi');
          return;
        }

        // Backend API'den verileri çek
        const [profileData, leaveRequestsData] = await Promise.all([
          ApiService.getProfile(),
          ApiService.getMyLeaveRequests(1, 10) // İlk yüklemede sayfa 1, sayfa boyutu 10
        ]);

        setEmployeeData(profileData.data);
        setLeaveRequests(leaveRequestsData.data?.items || []);
        setLeavePagination({
          pageNumber: leaveRequestsData.data?.pageNumber || 1,
          pageSize: leaveRequestsData.data?.pageSize || 10,
          totalCount: leaveRequestsData.data?.totalCount || 0,
          totalPages: leaveRequestsData.data?.totalPages || 0
        });

      } catch (error) {
        console.error('Data fetch error:', error);
        if (error.message.includes('Geçersiz token') || error.message.includes('401')) {
          // Token geçersizse giriş sayfasına yönlendir
          localStorage.removeItem('employeeToken');
          localStorage.removeItem('userEmail');
          router.push('/calisan-girisi');
        } else {
          setError('Veriler yüklenirken hata oluştu');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeData();
  }, [router]);

  // Çıkış yapma fonksiyonu
  const handleLogout = async () => {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    router.push('/calisan-girisi');
  };

  // İzin talebi oluşturma
  const handleSubmitLeaveRequest = async (e) => {
    e.preventDefault();
    setSubmittingLeave(true);
    setError('');

    try {
      console.log('Submitting leave request:', {
        startDate: leaveForm.startDate,
        endDate: leaveForm.endDate,
        reason: leaveForm.reason
      });

      const result = await ApiService.createLeaveRequest({
        startDate: leaveForm.startDate,
        endDate: leaveForm.endDate,
        reason: leaveForm.reason
      });

      console.log('Leave request created successfully:', result);

      // Formu temizle ve kapat
      setLeaveForm({ startDate: '', endDate: '', reason: '' });
      setShowLeaveForm(false);

      // Listeyi yenile
      const leaveRequestsData = await ApiService.getMyLeaveRequests(leavePagination.pageNumber, leavePagination.pageSize);
      setLeaveRequests(leaveRequestsData.data?.items || []);
      setLeavePagination({
        pageNumber: leaveRequestsData.data?.pageNumber || 1,
        pageSize: leaveRequestsData.data?.pageSize || 10,
        totalCount: leaveRequestsData.data?.totalCount || 0,
        totalPages: leaveRequestsData.data?.totalPages || 0
      });
    } catch (error) {
      console.error('Error creating leave request:', error);
      setError(error.message || 'İzin talebi oluşturulurken hata oluştu');
    } finally {
      setSubmittingLeave(false);
    }
  };

  // İzin talebini iptal etme
  const handleCancelLeaveRequest = async (id) => {
    if (!confirm('Bu izin talebini iptal etmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      await ApiService.deleteLeaveRequest(id);
      
      // Listeyi yenile
      const leaveRequestsData = await ApiService.getMyLeaveRequests(leavePagination.pageNumber, leavePagination.pageSize);
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

  // Durum renklerini belirleme
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Approved':
        return 'Onaylandı';
      case 'Rejected':
        return 'Reddedildi';
      case 'Cancelled':
        return 'İptal Edildi';
      default:
        return 'Beklemede';
    }
  };

  // Pagination handlers
  const handlePageChange = async (newPageNumber) => {
    setIsLoading(true);
    try {
      const leaveRequestsData = await ApiService.getMyLeaveRequests(newPageNumber, leavePagination.pageSize);
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
        {/* Hata mesajı */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Hoş geldin mesajı */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Hoş Geldin!
              </h1>
              <p className="text-gray-600 mb-4">
                Başarıyla giriş yaptınız.
              </p>
              
              {/* Kullanıcı bilgileri */}
              <div className="mt-6 bg-gray-50 rounded-lg p-6 text-left max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Bilgileriniz</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Kullanıcı ID</dt>
                    <dd className="text-sm text-gray-900">{employeeData?.userId}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">E-posta</dt>
                    <dd className="text-sm text-gray-900">{employeeData?.email}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Yeni İzin Talebi Butonu */}
        <div className="mb-6">
          <button
            onClick={() => setShowLeaveForm(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Yeni İzin Talebi
          </button>
        </div>

        {/* İzin Talebi Modal */}
        {showLeaveForm && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop - çok hafif, arkasındaki sayfa net görünür */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-10"
              onClick={() => {
                setShowLeaveForm(false);
                setLeaveForm({ startDate: '', endDate: '', reason: '' });
              }}
            ></div>

            {/* Modal - ortada konumlanmış */}
            <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
              <div 
                className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 pointer-events-auto max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Yeni İzin Talebi</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLeaveForm(false);
                      setLeaveForm({ startDate: '', endDate: '', reason: '' });
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Kapat"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal Body - Form */}
                <form onSubmit={handleSubmitLeaveRequest} className="space-y-5">
                  {/* Başlangıç Tarihi */}
                  <div>
                    <label htmlFor="modal-startDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Başlangıç Tarihi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="modal-startDate"
                      required
                      value={leaveForm.startDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                    />
                  </div>

                  {/* Bitiş Tarihi */}
                  <div>
                    <label htmlFor="modal-endDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Bitiş Tarihi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="modal-endDate"
                      required
                      value={leaveForm.endDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                    />
                  </div>

                  {/* Sebep */}
                  <div>
                    <label htmlFor="modal-reason" className="block text-sm font-medium text-gray-700 mb-2">
                      Sebep <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="modal-reason"
                      required
                      rows={4}
                      value={leaveForm.reason}
                      onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white resize-none"
                      placeholder="İzin talebinizin sebebini detaylı olarak açıklayın..."
                    />
                  </div>

                  {/* Modal Footer - Butonlar */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowLeaveForm(false);
                        setLeaveForm({ startDate: '', endDate: '', reason: '' });
                      }}
                      className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      disabled={submittingLeave}
                      className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submittingLeave ? 'Gönderiliyor...' : 'Gönder'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* İzin Talepleri Listesi */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">İzin Taleplerim</h2>
              {leavePagination.totalCount > 0 && (
                <p className="text-sm text-gray-500">
                  Toplam {leavePagination.totalCount} kayıt
                </p>
              )}
            </div>
            
            {leaveRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Henüz izin talebi oluşturmadınız.</p>
            ) : (
              <>
                <div className="space-y-4">
                  {leaveRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(request.status)}`}>
                            {getStatusText(request.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Başlangıç:</span> {new Date(request.startDate).toLocaleDateString('tr-TR')}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Bitiş:</span> {new Date(request.endDate).toLocaleDateString('tr-TR')}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Sebep:</span> {request.reason}
                        </p>
                      </div>
                      {request.status === 'Pending' && (
                        <button
                          onClick={() => handleCancelLeaveRequest(request.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          İptal Et
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Oluşturulma: {new Date(request.createdAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                ))}
                </div>
                
                {/* Pagination */}
                {leavePagination.totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                      <button
                        onClick={() => handlePageChange(leavePagination.pageNumber - 1)}
                        disabled={!leavePagination.hasPreviousPage || isLoading}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Önceki
                      </button>
                      <button
                        onClick={() => handlePageChange(leavePagination.pageNumber + 1)}
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
                            onClick={() => handlePageChange(leavePagination.pageNumber - 1)}
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
                                  onClick={() => handlePageChange(page)}
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
                            onClick={() => handlePageChange(leavePagination.pageNumber + 1)}
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
              </>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

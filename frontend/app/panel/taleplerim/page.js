'use client';

import { useState, useEffect } from 'react';
import ApiService from '../../../lib/api';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { getStatusBadgeClass, getStatusTextTR, isPendingStatus } from '../utils/requestStatus';

const TABS = {
  LEAVE: 'leave',
  EXPENSE: 'expense',
  MEETING_ROOM: 'meeting-room',
  OTHER: 'other'
};

export default function TaleplerimPage() {
  const [activeTab, setActiveTab] = useState(TABS.LEAVE);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [expenseRequests, setExpenseRequests] = useState([]);
  const [meetingRoomRequests, setMeetingRoomRequests] = useState([]);
  const [otherRequests, setOtherRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedExpenseDetail, setSelectedExpenseDetail] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab, pageNumber]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === TABS.LEAVE) {
        const result = await ApiService.getMyLeaveRequests(pageNumber, 10);
        if (result && result.success && result.data) {
          setLeaveRequests(result.data.items || []);
          setTotalPages(result.data.totalPages || 1);
        }
      } else if (activeTab === TABS.EXPENSE) {
        const result = await ApiService.getMyExpenseRequests(pageNumber, 10);
        if (result && result.success && result.data) {
          setExpenseRequests(result.data.items || []);
          setTotalPages(result.data.totalPages || 1);
        }
      } else if (activeTab === TABS.MEETING_ROOM) {
        const result = await ApiService.getMyMeetingRoomRequests(pageNumber, 10);
        if (result && result.success && result.data) {
          setMeetingRoomRequests(result.data.items || []);
          setTotalPages(result.data.totalPages || 1);
        }
      } else if (activeTab === TABS.OTHER) {
        const result = await ApiService.getMyOtherRequests(pageNumber, 10);
        if (result && result.success && result.data) {
          setOtherRequests(result.data.items || []);
          setTotalPages(result.data.totalPages || 1);
        }
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadDocument = async (requestId) => {
    try {
      await ApiService.downloadExpenseRequestDocument(requestId);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert(error.message || 'Belge indirilirken hata oluştu');
    }
  };

  const handleShowDetails = (request) => {
    setSelectedExpenseDetail(request);
    setShowDetailModal(true);
  };

  const handleCancel = async () => {
    if (!selectedRequest) return;

    setIsProcessing(true);
    try {
      let result;
      if (activeTab === TABS.LEAVE) {
        result = await ApiService.deleteLeaveRequest(selectedRequest.id);
      } else if (activeTab === TABS.EXPENSE) {
        // Expense request cancellation - API endpoint kontrol et
        alert('Masraf talebi iptal işlemi henüz desteklenmiyor');
        return;
      } else if (activeTab === TABS.MEETING_ROOM) {
        // Meeting room request cancellation - API endpoint kontrol et
        alert('Toplantı odası talebi iptal işlemi henüz desteklenmiyor');
        return;
      }

      if (result && result.success) {
        setShowCancelModal(false);
        setSelectedRequest(null);
        fetchData();
      } else {
        alert(result?.message || 'İptal işlemi başarısız oldu');
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
      alert(error.message || 'İptal işlemi sırasında hata oluştu');
    } finally {
      setIsProcessing(false);
    }
  };

  const getLeaveTypeText = (type) => {
    const typeMap = {
      'annual': 'Yıllık İzin',
      'unpaid': 'Ücretsiz İzin',
      'hourly': 'Saatlik İzin',
      'excuse': 'Mazeret İzni'
    };
    return typeMap[type] || type;
  };

  const getMeetingRoomText = (room) => {
    const roomMap = {
      'tonyukuk': 'Tonyukuk Toplantı Salonu',
      'atatürk': 'Mustafa Kemal Atatürk Toplantı Salonu',
      'ataturk': 'Mustafa Kemal Atatürk Toplantı Salonu',
      'fatihsultanmehmet': 'Fatih Sultan Mehmet Toplantı Salonu',
      'boğaziçiteknokent': 'Boğaziçi Teknokent Toplantı Salonu',
      'bogaziciteknokent': 'Boğaziçi Teknokent Toplantı Salonu',
      'cumhuriyetteknopark': 'Cumhuriyet Teknopark Toplantı Salonu'
    };
    return roomMap[room] || room;
  };

  const renderLeaveRequests = () => {
    if (isLoading) {
      return <div className="text-center py-8 text-gray-300">Yükleniyor...</div>;
    }

    if (leaveRequests.length === 0) {
      return <div className="text-center py-8 text-gray-400">Henüz izin talebi bulunmamaktadır.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">İzin Türü</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Başlangıç</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Bitiş</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gün/Saat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Durum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {leaveRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {getLeaveTypeText(request.leaveType)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {formatDate(request.startDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {formatDate(request.endDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {request.days ? `${request.days} Gün` : request.hours ? `${request.hours} Saat` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>
                    {getStatusTextTR(request.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {isPendingStatus(request.status) && (
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowCancelModal(true);
                      }}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors"
                    >
                      İptal Et
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderExpenseRequests = () => {
    if (isLoading) {
      return <div className="text-center py-8 text-gray-300">Yükleniyor...</div>;
    }

    if (expenseRequests.length === 0) {
      return <div className="text-center py-8 text-gray-400">Henüz masraf talebi bulunmamaktadır.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Talep Tarihi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Masraf Türü</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tutar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Belge</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Durum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Açıklama</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {expenseRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {formatDate(request.requestDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {request.expenseTypeName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                  {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(request.requestedAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {request.documentPath ? (
                    <button
                      onClick={() => handleDownloadDocument(request.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-orange-400 bg-orange-900/20 border border-orange-700 rounded-lg hover:bg-orange-900/30 transition-colors cursor-pointer"
                      title="Belgeyi İndir"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Belgeyi İndir
                    </button>
                  ) : (
                    <span className="text-xs text-gray-500">Belge yok</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(request.statusName)}`}>
                    {getStatusTextTR(request.statusName)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {request.statusName === 'Reddedildi' && request.rejectionReason ? (
                    <div className="bg-red-900/30 border-2 border-red-600 rounded-lg p-3 max-w-md">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-red-300 mb-1.5 uppercase tracking-wide">Açıklama</p>
                          <p className="text-sm text-red-200 leading-relaxed">{request.rejectionReason}</p>
                        </div>
                      </div>
                    </div>
                  ) : request.statusName === 'Reddedildi' && !request.rejectionReason ? (
                    <span className="text-xs text-gray-500">-</span>
                  ) : (
                    <span className="text-xs text-gray-500">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderMeetingRoomRequests = () => {
    if (isLoading) {
      return <div className="text-center py-8 text-gray-300">Yükleniyor...</div>;
    }

    if (meetingRoomRequests.length === 0) {
      return <div className="text-center py-8 text-gray-400">Henüz toplantı odası talebi bulunmamaktadır.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Toplantı Salonu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tarih</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Saat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Durum</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {meetingRoomRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {getMeetingRoomText(request.meetingRoom)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {formatDate(request.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {request.startTime} - {request.endTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>
                    {getStatusTextTR(request.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderOtherRequests = () => {
    if (isLoading) {
      return <div className="text-center py-8 text-gray-300">Yükleniyor...</div>;
    }

    if (otherRequests.length === 0) {
      return <div className="text-center py-8 text-gray-400">Henüz diğer talep bulunmamaktadır.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Başlık</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Açıklama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tarih</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Durum</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {otherRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {request.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-200">
                  <div className="max-w-md">{request.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {formatDate(request.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>
                    {getStatusTextTR(request.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Taleplerim</h1>
        <p className="text-gray-400 mt-2">
          Tüm taleplerinizi buradan görüntüleyebilir ve durumlarını takip edebilirsiniz.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => {
              setActiveTab(TABS.LEAVE);
              setPageNumber(1);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === TABS.LEAVE
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            İzin Talepleri
          </button>
          <button
            onClick={() => {
              setActiveTab(TABS.EXPENSE);
              setPageNumber(1);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === TABS.EXPENSE
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Masraf Talepleri
          </button>
          <button
            onClick={() => {
              setActiveTab(TABS.MEETING_ROOM);
              setPageNumber(1);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === TABS.MEETING_ROOM
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Toplantı Odası Talepleri
          </button>
          <button
            onClick={() => {
              setActiveTab(TABS.OTHER);
              setPageNumber(1);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === TABS.OTHER
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Diğer Talepler
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
        {activeTab === TABS.LEAVE && renderLeaveRequests()}
        {activeTab === TABS.EXPENSE && renderExpenseRequests()}
        {activeTab === TABS.MEETING_ROOM && renderMeetingRoomRequests()}
        {activeTab === TABS.OTHER && renderOtherRequests()}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Sayfa {pageNumber} / {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                disabled={pageNumber === 1}
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-200 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Önceki
              </button>
              <button
                onClick={() => setPageNumber(p => Math.min(totalPages, p + 1))}
                disabled={pageNumber === totalPages}
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-200 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      <ConfirmDialog
        open={showCancelModal}
        onCancel={() => {
          setShowCancelModal(false);
          setSelectedRequest(null);
        }}
        onConfirm={handleCancel}
        title="Talebi İptal Et"
        message="Bu talebi iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Evet, İptal Et"
        cancelText="Vazgeç"
        loading={isProcessing}
        confirmButtonClass="bg-red-500 hover:bg-red-600 active:bg-red-700"
      />

      {/* Detaylar Modal - Reddetme Nedeni */}
      {showDetailModal && selectedExpenseDetail && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => {
            setShowDetailModal(false);
            setSelectedExpenseDetail(null);
          }} />
          <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
            <div className="px-6 pt-6">
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-full bg-blue-100 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">Masraf Talebi Detayları</h3>
                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Masraf Türü:</p>
                      <p className="text-sm text-gray-900">{selectedExpenseDetail.expenseTypeName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Talep Edilen Tutar:</p>
                      <p className="text-sm text-gray-900">
                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(selectedExpenseDetail.requestedAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Talep Tarihi:</p>
                      <p className="text-sm text-gray-900">{formatDate(selectedExpenseDetail.requestDate)}</p>
                    </div>
                    {selectedExpenseDetail.description && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Açıklama:</p>
                        <p className="text-sm text-gray-900">{selectedExpenseDetail.description}</p>
                      </div>
                    )}
                    {selectedExpenseDetail.rejectionReason && (
                      <div>
                        <p className="text-sm font-medium text-red-700 mb-1">Reddetme Nedeni:</p>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm text-red-900">{selectedExpenseDetail.rejectionReason}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-gray-50 px-6 py-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedExpenseDetail(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-100 transition"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


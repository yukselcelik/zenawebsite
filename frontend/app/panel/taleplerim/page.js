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
      'ataturk': 'Mustafa Kemal Atatürk Toplantı Salonu'
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Durum</th>
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
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(request.statusName)}`}>
                    {getStatusTextTR(request.statusName)}
                  </span>
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
    </div>
  );
}


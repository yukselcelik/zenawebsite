'use client';

import { useState, useEffect } from 'react';
import ApiService from '../../../lib/api';
import ConfirmDialog from '../components/common/ConfirmDialog';

const TABS = {
  LEAVE: 'leave',
  EXPENSE: 'expense',
  MEETING_ROOM: 'meeting-room'
};

export default function TalepleriIncelePage() {
  const [activeTab, setActiveTab] = useState(TABS.LEAVE);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [expenseRequests, setExpenseRequests] = useState([]);
  const [meetingRoomRequests, setMeetingRoomRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expenseApprovalData, setExpenseApprovalData] = useState({
    approvedAmount: '',
    department: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab, pageNumber]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === TABS.LEAVE) {
        const result = await ApiService.getAllLeaveRequests(pageNumber, 10);
        if (result && result.success && result.data) {
          setLeaveRequests(result.data.items || []);
          setTotalPages(result.data.totalPages || 1);
        }
      } else if (activeTab === TABS.EXPENSE) {
        const result = await ApiService.getAllExpenseRequests(pageNumber, 10);
        if (result && result.success && result.data) {
          setExpenseRequests(result.data.items || []);
          setTotalPages(result.data.totalPages || 1);
        }
      } else if (activeTab === TABS.MEETING_ROOM) {
        const result = await ApiService.getAllMeetingRoomRequests(pageNumber, 10);
        if (result && result.success && result.data) {
          setMeetingRoomRequests(result.data.items || []);
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

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) + (timeString ? ` ${timeString}` : '');
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Cancelled': 'bg-gray-100 text-gray-800',
      'Beklemede': 'bg-yellow-100 text-yellow-800',
      'Onaylandı': 'bg-green-100 text-green-800',
      'Reddedildi': 'bg-red-100 text-red-800',
      'Ödendi': 'bg-blue-100 text-blue-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'Pending': 'Beklemede',
      'Approved': 'Onaylandı',
      'Rejected': 'Reddedildi',
      'Cancelled': 'İptal Edildi'
    };
    return statusMap[status] || status;
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    setIsProcessing(true);
    try {
      let result;
      if (activeTab === TABS.LEAVE) {
        result = await ApiService.approveLeaveRequest(selectedRequest.id);
      } else if (activeTab === TABS.EXPENSE) {
        const approvedAmount = expenseApprovalData.approvedAmount 
          ? parseFloat(expenseApprovalData.approvedAmount.replace(',', '.'))
          : selectedRequest.requestedAmount;
        result = await ApiService.approveExpenseRequest(selectedRequest.id, {
          approvedAmount: approvedAmount,
          department: expenseApprovalData.department || selectedRequest.department || ''
        });
      } else if (activeTab === TABS.MEETING_ROOM) {
        result = await ApiService.approveMeetingRoomRequest(selectedRequest.id);
      }

      if (result && result.success) {
        setShowApproveModal(false);
        setSelectedRequest(null);
        setExpenseApprovalData({ approvedAmount: '', department: '' });
        fetchData();
      } else {
        alert(result?.message || 'Onaylama işlemi başarısız oldu');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert(error.message || 'Onaylama işlemi sırasında hata oluştu');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    setIsProcessing(true);
    try {
      let result;
      if (activeTab === TABS.LEAVE) {
        result = await ApiService.rejectLeaveRequest(selectedRequest.id);
      } else if (activeTab === TABS.EXPENSE) {
        result = await ApiService.rejectExpenseRequest(selectedRequest.id);
      } else if (activeTab === TABS.MEETING_ROOM) {
        result = await ApiService.rejectMeetingRoomRequest(selectedRequest.id);
      }

      if (result && result.success) {
        setShowRejectModal(false);
        setSelectedRequest(null);
        fetchData();
      } else {
        alert(result?.message || 'Reddetme işlemi başarısız oldu');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert(error.message || 'Reddetme işlemi sırasında hata oluştu');
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
      return <div className="text-center py-8">Yükleniyor...</div>;
    }

    if (leaveRequests.length === 0) {
      return <div className="text-center py-8 text-gray-500">Henüz izin talebi bulunmamaktadır.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İzin Türü</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlangıç</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bitiş</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gün/Saat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaveRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{request.userName} {request.userSurname}</div>
                  <div className="text-sm text-gray-500">{request.userEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getLeaveTypeText(request.leaveType)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(request.startDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(request.endDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.days ? `${request.days} Gün` : request.hours ? `${request.hours} Saat` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(request.status)}`}>
                    {getStatusText(request.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {request.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowApproveModal(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowRejectModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reddet
                      </button>
                    </div>
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
      return <div className="text-center py-8">Yükleniyor...</div>;
    }

    if (expenseRequests.length === 0) {
      return <div className="text-center py-8 text-gray-500">Henüz masraf talebi bulunmamaktadır.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talep Tarihi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Masraf Türü</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenseRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{request.userName} {request.userSurname}</div>
                  <div className="text-sm text-gray-500">{request.userEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(request.requestDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.expenseTypeName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(request.requestedAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(request.statusName)}`}>
                    {request.statusName}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {request.statusName === 'Beklemede' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowApproveModal(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowRejectModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reddet
                      </button>
                    </div>
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
      return <div className="text-center py-8">Yükleniyor...</div>;
    }

    if (meetingRoomRequests.length === 0) {
      return <div className="text-center py-8 text-gray-500">Henüz toplantı odası talebi bulunmamaktadır.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toplantı Salonu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {meetingRoomRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{request.userName} {request.userSurname}</div>
                  <div className="text-sm text-gray-500">{request.userEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getMeetingRoomText(request.meetingRoom)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(request.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.startTime} - {request.endTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(request.status)}`}>
                    {getStatusText(request.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {request.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowApproveModal(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowRejectModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reddet
                      </button>
                    </div>
                  )}
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
        <h1 className="text-2xl font-bold text-gray-800">Talepleri İncele</h1>
        <p className="text-gray-600 mt-2">
          Personel taleplerini buradan görüntüleyebilir, onaylayabilir veya reddedebilirsiniz.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => {
              setActiveTab(TABS.LEAVE);
              setPageNumber(1);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === TABS.LEAVE
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Toplantı Odası Talepleri
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {activeTab === TABS.LEAVE && renderLeaveRequests()}
        {activeTab === TABS.EXPENSE && renderExpenseRequests()}
        {activeTab === TABS.MEETING_ROOM && renderMeetingRoomRequests()}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Sayfa {pageNumber} / {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                disabled={pageNumber === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Önceki
              </button>
              <button
                onClick={() => setPageNumber(p => Math.min(totalPages, p + 1))}
                disabled={pageNumber === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Talebi Onayla</h3>
            {activeTab === TABS.EXPENSE && selectedRequest ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Onaylanan Tutar (TL)
                  </label>
                  <input
                    type="text"
                    value={expenseApprovalData.approvedAmount}
                    onChange={(e) => {
                      let cleaned = e.target.value.replace(/[^\d,]/g, '');
                      const commaIndex = cleaned.indexOf(',');
                      if (commaIndex !== -1) {
                        const afterComma = cleaned.substring(commaIndex + 1);
                        if (afterComma.length > 2) {
                          cleaned = cleaned.substring(0, commaIndex + 3);
                        }
                      }
                      setExpenseApprovalData({ ...expenseApprovalData, approvedAmount: cleaned });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="0,00"
                  />
                  <p className="text-xs text-gray-500 mt-1">Talep edilen: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(selectedRequest.requestedAmount)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departman (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={expenseApprovalData.department}
                    onChange={(e) => setExpenseApprovalData({ ...expenseApprovalData, department: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Departman adı"
                  />
                </div>
                <p className="text-sm text-gray-600">Bu talebi onaylamak istediğinizden emin misiniz?</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Bu talebi onaylamak istediğinizden emin misiniz?</p>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedRequest(null);
                  setExpenseApprovalData({ approvedAmount: '', department: '' });
                }}
                disabled={isProcessing}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className={`px-4 py-2 rounded-lg text-white ${
                  isProcessing ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isProcessing ? 'Onaylanıyor...' : 'Onayla'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      <ConfirmDialog
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedRequest(null);
        }}
        onConfirm={handleReject}
        title="Talebi Reddet"
        message="Bu talebi reddetmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Reddet"
        cancelText="İptal"
        isProcessing={isProcessing}
        confirmButtonClass="bg-red-500 hover:bg-red-600"
      />
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import ApiService from '../../../lib/api';
import { getStatusBadgeClass, getStatusTextTR, normalizeStatusKey } from '../utils/requestStatus';

const TABS = {
  LEAVE: 'leave',
  EXPENSE: 'expense',
  MEETING_ROOM: 'meeting-room',
  OTHER: 'other'
};

export default function TalepleriIncelePage() {
  const [activeTab, setActiveTab] = useState(TABS.LEAVE);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [expenseRequests, setExpenseRequests] = useState([]);
  const [meetingRoomRequests, setMeetingRoomRequests] = useState([]);
  const [otherRequests, setOtherRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const LEAVE_STATUS_OPTIONS = [
    { key: 'pending', label: 'Beklemede', api: 'Pending' },
    { key: 'approved', label: 'Onaylandı', api: 'Approved' },
    { key: 'rejected', label: 'Reddedildi', api: 'Rejected' },
    { key: 'cancelled', label: 'İptal Edildi', api: 'Cancelled' }
  ];

  const EXPENSE_STATUS_OPTIONS = [
    { key: 'pending', label: 'Beklemede', api: 'Pending' },
    { key: 'approved', label: 'Onaylandı', api: 'Approved' },
    { key: 'rejected', label: 'Reddedildi', api: 'Rejected' },
    { key: 'paid', label: 'Ödendi', api: 'Paid' }
  ];

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
      } else if (activeTab === TABS.OTHER) {
        const result = await ApiService.getAllOtherRequests(pageNumber, 10);
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

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) + (timeString ? ` ${timeString}` : '');
  };

  const getStatusBadge = (status) => getStatusBadgeClass(status);
  const getStatusText = (status) => getStatusTextTR(status);

  const updateStatus = async (kind, id, apiStatus) => {
    setIsProcessing(true);
    try {
      if (kind === TABS.LEAVE) {
        await ApiService.updateLeaveStatus(id, apiStatus);
      } else if (kind === TABS.MEETING_ROOM) {
        await ApiService.updateMeetingRoomRequestStatus(id, apiStatus);
      } else if (kind === TABS.EXPENSE) {
        await ApiService.updateExpenseRequestStatus(id, apiStatus);
      }
      await fetchData();
    } catch (error) {
      console.error('Error updating request status:', error);
      alert(error.message || 'Durum güncellenirken hata oluştu');
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
                  <select
                    value={normalizeStatusKey(request.status)}
                    onChange={(e) => {
                      const nextKey = e.target.value;
                      const opt = LEAVE_STATUS_OPTIONS.find(o => o.key === nextKey) || LEAVE_STATUS_OPTIONS[0];
                      updateStatus(TABS.LEAVE, request.id, opt.api);
                    }}
                    disabled={isProcessing}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 cursor-pointer ${getStatusBadge(request.status)}`}
                  >
                    {LEAVE_STATUS_OPTIONS.map(o => (
                      <option key={o.key} value={o.key}>{o.label}</option>
                    ))}
                  </select>
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
                  <select
                    value={normalizeStatusKey(request.statusName)}
                    onChange={(e) => {
                      const nextKey = e.target.value;
                      const opt = EXPENSE_STATUS_OPTIONS.find(o => o.key === nextKey) || EXPENSE_STATUS_OPTIONS[0];
                      updateStatus(TABS.EXPENSE, request.id, opt.api);
                    }}
                    disabled={isProcessing}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 cursor-pointer ${getStatusBadge(request.statusName)}`}
                  >
                    {EXPENSE_STATUS_OPTIONS.map(o => (
                      <option key={o.key} value={o.key}>{o.label}</option>
                    ))}
                  </select>
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
                  <select
                    value={normalizeStatusKey(request.status)}
                    onChange={(e) => {
                      const nextKey = e.target.value;
                      const opt = LEAVE_STATUS_OPTIONS.find(o => o.key === nextKey) || LEAVE_STATUS_OPTIONS[0];
                      updateStatus(TABS.MEETING_ROOM, request.id, opt.api);
                    }}
                    disabled={isProcessing}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 cursor-pointer ${getStatusBadge(request.status)}`}
                  >
                    {LEAVE_STATUS_OPTIONS.map(o => (
                      <option key={o.key} value={o.key}>{o.label}</option>
                    ))}
                  </select>
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
      return <div className="text-center py-8">Yükleniyor...</div>;
    }

    if (otherRequests.length === 0) {
      return <div className="text-center py-8 text-gray-500">Henüz diğer talep bulunmamaktadır.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Açıklama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {otherRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{request.userName} {request.userSurname}</div>
                  <div className="text-sm text-gray-500">{request.userEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {request.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-md truncate" title={request.description}>
                    {request.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(request.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(request.status)}`}>
                    {getStatusText(request.status)}
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
          <button
            onClick={() => {
              setActiveTab(TABS.OTHER);
              setPageNumber(1);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === TABS.OTHER
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Diğer Talepler
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {activeTab === TABS.LEAVE && renderLeaveRequests()}
        {activeTab === TABS.EXPENSE && renderExpenseRequests()}
        {activeTab === TABS.MEETING_ROOM && renderMeetingRoomRequests()}
        {activeTab === TABS.OTHER && renderOtherRequests()}

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

    </div>
  );
}


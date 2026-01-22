'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Personel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">İzin Türü</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Başlangıç</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Bitiş</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gün/Saat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Durum</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {leaveRequests.map((request, index) => (
              <motion.tr 
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{request.userName} {request.userSurname}</div>
                  <div className="text-sm text-gray-400">{request.userEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {getLeaveTypeText(request.leaveType)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {formatDate(request.startDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {formatDate(request.endDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
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
                    className={`px-3 py-2 rounded-lg text-sm font-medium border border-gray-600 bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white cursor-pointer transition-colors ${getStatusBadge(request.status)}`}
                  >
                    {LEAVE_STATUS_OPTIONS.map(o => (
                      <option key={o.key} value={o.key} className="bg-gray-700">{o.label}</option>
                    ))}
                  </select>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const handleDownloadDocument = async (requestId) => {
    try {
      await ApiService.downloadExpenseRequestDocument(requestId);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert(error.message || 'Belge indirilirken hata oluştu');
    }
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Personel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Talep Tarihi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Masraf Türü</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tutar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Açıklama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Belge</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Durum</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {expenseRequests.map((request, index) => (
              <motion.tr 
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{request.userName} {request.userSurname}</div>
                  <div className="text-sm text-gray-400">{request.userEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {formatDate(request.requestDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {request.expenseTypeName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                  {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(request.requestedAmount)}
                </td>
                <td className="px-6 py-4 text-sm text-white">
                  <div className="max-w-md">
                    {request.description ? (
                      <div className="text-sm text-gray-300" title={request.description}>
                        {request.description}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">Açıklama yok</span>
                    )}
                  </div>
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
                      İndir
                    </button>
                  ) : (
                    <span className="text-xs text-gray-500">Belge yok</span>
                  )}
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
                    className={`px-3 py-2 rounded-lg text-sm font-medium border border-gray-600 bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white cursor-pointer transition-colors ${getStatusBadge(request.statusName)}`}
                  >
                    {EXPENSE_STATUS_OPTIONS.map(o => (
                      <option key={o.key} value={o.key} className="bg-gray-700">{o.label}</option>
                    ))}
                  </select>
                </td>
              </motion.tr>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Personel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Toplantı Salonu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tarih</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Saat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Durum</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {meetingRoomRequests.map((request, index) => (
              <motion.tr 
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{request.userName} {request.userSurname}</div>
                  <div className="text-sm text-gray-400">{request.userEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {getMeetingRoomText(request.meetingRoom)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {formatDate(request.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
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
                    className={`px-3 py-2 rounded-lg text-sm font-medium border border-gray-600 bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white cursor-pointer transition-colors ${getStatusBadge(request.status)}`}
                  >
                    {LEAVE_STATUS_OPTIONS.map(o => (
                      <option key={o.key} value={o.key} className="bg-gray-700">{o.label}</option>
                    ))}
                  </select>
                </td>
              </motion.tr>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Personel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Başlık</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Açıklama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tarih</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Durum</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {otherRequests.map((request, index) => (
              <motion.tr 
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{request.userName} {request.userSurname}</div>
                  <div className="text-sm text-gray-400">{request.userEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {request.title}
                </td>
                <td className="px-6 py-4 text-sm text-white">
                  <div className="max-w-md truncate" title={request.description}>
                    {request.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {formatDate(request.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(request.status)}`}>
                    {getStatusText(request.status)}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-white">Talepleri İncele</h1>
        <p className="text-gray-400 mt-2">
          Personel taleplerini buradan görüntüleyebilir, onaylayabilir veya reddedebilirsiniz.
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 border-b border-gray-700"
      >
        <nav className="-mb-px flex space-x-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveTab(TABS.LEAVE);
              setPageNumber(1);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === TABS.LEAVE
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            İzin Talepleri
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveTab(TABS.EXPENSE);
              setPageNumber(1);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === TABS.EXPENSE
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Masraf Talepleri
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveTab(TABS.MEETING_ROOM);
              setPageNumber(1);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === TABS.MEETING_ROOM
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Toplantı Odası Talepleri
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveTab(TABS.OTHER);
              setPageNumber(1);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === TABS.OTHER
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Diğer Talepler
          </motion.button>
        </nav>
      </motion.div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg"
      >
        {activeTab === TABS.LEAVE && renderLeaveRequests()}
        {activeTab === TABS.EXPENSE && renderExpenseRequests()}
        {activeTab === TABS.MEETING_ROOM && renderMeetingRoomRequests()}
        {activeTab === TABS.OTHER && renderOtherRequests()}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="px-6 py-4 border-t border-gray-700 flex items-center justify-between"
          >
            <div className="text-sm text-gray-400">
              Sayfa {pageNumber} / {totalPages}
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                disabled={pageNumber === 1}
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Önceki
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPageNumber(p => Math.min(totalPages, p + 1))}
                disabled={pageNumber === totalPages}
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sonraki
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

    </motion.div>
  );
}


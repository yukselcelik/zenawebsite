'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import ApiService from '../../../lib/api';
import { isPendingStatus } from '../utils/requestStatus';

function getStatusBadgeClass(status) {
  const s = typeof status === 'string' ? status : String(status ?? '');
  switch (s) {
    case 'Approved':
    case '1':
    case 'Onaylandı':
      return 'bg-green-900/50 text-green-300 border border-green-700';
    case 'Rejected':
    case '2':
    case 'Reddedildi':
      return 'bg-red-900/50 text-red-300 border border-red-700';
    case 'Cancelled':
    case '3':
    case 'İptal':
    case 'İptal Edildi':
      return 'bg-gray-700 text-gray-300 border border-gray-600';
    case 'Ödendi':
      return 'bg-blue-900/50 text-blue-300 border border-blue-700';
    case 'Pending':
    case '0':
    case 'Beklemede':
    default:
      return 'bg-yellow-900/50 text-yellow-300 border border-yellow-700';
  }
}

function getStatusText(status, statusName) {
  if (statusName) return statusName;
  const s = typeof status === 'string' ? status : String(status ?? '');
  switch (s) {
    case 'Approved':
    case '1':
      return 'Onaylandı';
    case 'Rejected':
    case '2':
      return 'Reddedildi';
    case 'Cancelled':
    case '3':
      return 'İptal';
    case 'Pending':
    case '0':
    default:
      return 'Beklemede';
  }
}

function getLeaveTypeText(type) {
  const typeMap = {
    annual: 'Yıllık İzin',
    unpaid: 'Ücretsiz İzin',
    hourly: 'Saatlik İzin',
    excuse: 'Mazeret İzni'
  };
  return typeMap[type] || type || 'İzin';
}

function getMeetingRoomText(room) {
  const roomMap = {
    tonyukuk: 'Tonyukuk Toplantı Salonu',
    atatürk: 'Mustafa Kemal Atatürk Toplantı Salonu',
    ataturk: 'Mustafa Kemal Atatürk Toplantı Salonu',
    fatihsultanmehmet: 'Fatih Sultan Mehmet Toplantı Salonu',
    'boğaziçiteknokent': 'Boğaziçi Teknokent Toplantı Salonu',
    bogaziciteknokent: 'Boğaziçi Teknokent Toplantı Salonu',
    cumhuriyetteknopark: 'Cumhuriyet Teknopark Toplantı Salonu'
  };
  return roomMap[room] || room || 'Toplantı Salonu';
}

function formatDateTR(dateString) {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('tr-TR');
  } catch {
    return '-';
  }
}

export default function Dashboard({ isManager, stats, userDetail, onTabChange, myRequests, allRequests, onRequestsUpdated }) {
  const isPendingApproval = userDetail && !userDetail.isApproved && !isManager;
  const [actionLoading, setActionLoading] = useState(false);

  const unifiedMyRequests = useMemo(() => {
    if (!myRequests) return [];
    const leaveItems = myRequests.leave?.items || [];
    const expenseItems = myRequests.expense?.items || [];
    const meetingItems = myRequests.meetingRoom?.items || [];

    const normalized = [];

    for (const r of leaveItems) {
      normalized.push({
        id: `leave-${r.id}`,
        kind: 'İzin',
        date: r.createdAt || r.startDate || r.endDate,
        title: getLeaveTypeText(r.leaveType),
        statusText: getStatusText(r.status),
        statusClass: getStatusBadgeClass(r.status),
        href: '/panel/izin-talepleri'
      });
    }

    for (const r of expenseItems) {
      normalized.push({
        id: `expense-${r.id}`,
        kind: 'Masraf',
        date: r.requestDate || r.createdAt,
        title: r.expenseTypeName || r.requestNumber || 'Masraf Talebi',
        statusText: getStatusText(null, r.statusName),
        statusClass: getStatusBadgeClass(r.statusName),
        href: '/panel/dashboard'
      });
    }

    for (const r of meetingItems) {
      normalized.push({
        id: `meeting-${r.id}`,
        kind: 'Toplantı Odası',
        date: r.date || r.createdAt,
        title: `${getMeetingRoomText(r.meetingRoom)} (${r.startTime || '--:--'}-${r.endTime || '--:--'})`,
        statusText: getStatusText(r.status),
        statusClass: getStatusBadgeClass(r.status),
        href: '/panel/dashboard'
      });
    }

    normalized.sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });

    return normalized;
  }, [myRequests]);

  const unifiedAllRequests = useMemo(() => {
    if (!isManager) return [];

    const source = allRequests || {};
    const leaveItems = source.leave?.items || [];
    const expenseItems = source.expense?.items || [];
    const meetingItems = source.meetingRoom?.items || [];

    const normalized = [];

    for (const r of leaveItems) {
      normalized.push({
        id: `leave-${r.id}`,
        rawId: r.id,
        kindKey: 'leave',
        kind: 'İzin',
        person: `${r.userName || ''} ${r.userSurname || ''}`.trim() || '-',
        date: r.startDate || r.createdAt || r.endDate,
        title: getLeaveTypeText(r.leaveType),
        statusText: getStatusText(r.status),
        statusClass: getStatusBadgeClass(r.status),
        statusRaw: r.status,
        href: '/panel/talepleri-incele'
      });
    }

    for (const r of expenseItems) {
      normalized.push({
        id: `expense-${r.id}`,
        rawId: r.id,
        kindKey: 'expense',
        kind: 'Masraf',
        person: `${r.userName || ''} ${r.userSurname || ''}`.trim() || '-',
        date: r.requestDate || r.createdAt,
        title: r.expenseTypeName || r.requestNumber || 'Masraf Talebi',
        statusText: getStatusText(null, r.statusName),
        statusClass: getStatusBadgeClass(r.statusName),
        statusRaw: r.statusName,
        requestedAmount: r.requestedAmount,
        department: r.department || '',
        href: '/panel/talepleri-incele'
      });
    }

    for (const r of meetingItems) {
      normalized.push({
        id: `meeting-${r.id}`,
        rawId: r.id,
        kindKey: 'meetingRoom',
        kind: 'Toplantı Odası',
        person: `${r.userName || ''} ${r.userSurname || ''}`.trim() || '-',
        date: r.date || r.createdAt,
        title: `${getMeetingRoomText(r.meetingRoom)} (${r.startTime || '--:--'}-${r.endTime || '--:--'})`,
        statusText: getStatusText(r.status),
        statusClass: getStatusBadgeClass(r.status),
        statusRaw: r.status,
        href: '/panel/talepleri-incele'
      });
    }

    normalized.sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });

    return normalized;
  }, [isManager, allRequests]);

  // Beklemede durumundaki izin taleplerini say
  const pendingLeaveCount = useMemo(() => {
    if (!isManager || !unifiedAllRequests) return 0;
    return unifiedAllRequests.filter(r => 
      r.kindKey === 'leave' && 
      (r.statusText === 'Beklemede' || r.statusRaw === 'Pending' || r.statusRaw === '0' || r.statusRaw === 0)
    ).length;
  }, [isManager, unifiedAllRequests]);

  const refreshRequests = async () => {
    if (onRequestsUpdated) {
      await onRequestsUpdated();
    }
  };

  const handleManagerStatusChange = async (row, nextStatus) => {
    if (!row || actionLoading) return;
    try {
      setActionLoading(true);

      // Leave & MeetingRoom use LeaveStatusEnum strings
      if (row.kindKey === 'leave') {
        await ApiService.updateLeaveStatus(row.rawId, nextStatus);
      } else if (row.kindKey === 'meetingRoom') {
        await ApiService.updateMeetingRoomRequestStatus(row.rawId, nextStatus);
      } else if (row.kindKey === 'expense') {
        // Expense uses ExpenseStatusEnum strings
        await ApiService.updateExpenseRequestStatus(row.rawId, nextStatus);
      } else if (row.kindKey === 'other') {
        // Other requests currently have no status update here (handled in TalepleriIncele page)
      }

      await refreshRequests();
    } catch (e) {
      alert(e.message || 'Durum güncellenirken hata oluştu');
    } finally {
      setActionLoading(false);
    }
  };

  const handleManagerDeleteRequest = async (row) => {
    if (!row || actionLoading) return;
    if (!confirm('Bu talebi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;

    try {
      setActionLoading(true);

      if (row.kindKey === 'leave') {
        await ApiService.deleteLeaveRequest(row.rawId);
      } else if (row.kindKey === 'meetingRoom') {
        await ApiService.deleteMeetingRoomRequest(row.rawId);
      } else if (row.kindKey === 'expense') {
        await ApiService.deleteExpenseRequest(row.rawId);
      } else if (row.kindKey === 'other') {
        await ApiService.deleteOtherRequest(row.rawId);
      }

      await refreshRequests();
    } catch (e) {
      alert(e.message || 'Talep silinirken hata oluştu');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Onay Bekleyen Kullanıcı Bildirimi */}
      {isPendingApproval && (
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-yellow-900/30 border-l-4 border-yellow-500 p-4 rounded-lg"
        >
          <div className="flex items-start">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="flex-shrink-0"
            >
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </motion.div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-yellow-300">
                Hesabınız Onay Bekliyor
              </h3>
              <div className="mt-2 text-sm text-yellow-200">
                <p>
                  Kayıt işleminiz başarıyla tamamlandı. Hesabınız yönetici onayı bekliyor. 
                  Onaylandıktan sonra tüm özelliklere erişebileceksiniz.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {!isManager && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden"
        >
          <div className="p-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Talepler</h2>
              <p className="text-sm text-gray-400 mt-1">
                İzin, masraf ve toplantı odası taleplerinizin son durumunu burada görebilirsiniz.
              </p>
            </div>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Link
                href="/panel/talep-et"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-medium text-white hover:from-orange-600 hover:to-orange-700 transition shadow-lg shadow-orange-500/50 cursor-pointer"
              >
                Yeni Talep Oluştur
              </Link>
            </motion.div>
          </div>

          <div className="border-t border-gray-700">
            {unifiedMyRequests.length === 0 ? (
              <div className="p-6 text-sm text-gray-400">
                Henüz bir talebiniz bulunmuyor.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tür</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tarih</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Özet</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {unifiedMyRequests.slice(0, 10).map((r, index) => (
                      <motion.tr 
                        key={r.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {r.kind}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDateTR(r.date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {r.kind === 'İzin' ? (
                            <Link href={r.href} className="text-orange-400 hover:text-orange-300 transition-colors">
                              {r.title}
                            </Link>
                          ) : (
                            <span>{r.title}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${r.statusClass}`}>
                            {r.statusText}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {isManager && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => onTabChange && onTabChange('personnel')}
            className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 hover:shadow-xl hover:border-orange-500/50 transition-all duration-300 text-left w-full group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors">Toplam Çalışanlar</h3>
              <motion.svg 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="w-5 h-5 text-gray-400 group-hover:text-orange-400 transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </motion.svg>
            </div>
            <motion.p 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-3xl font-bold text-orange-400"
            >
              {stats.personnelCount || 0}
            </motion.p>
            <p className="text-xs text-gray-400 mt-2 group-hover:text-orange-400 transition-colors">Detayları görüntüle →</p>
          </motion.button>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => onTabChange && onTabChange('leaves')}
            className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 hover:shadow-xl hover:border-yellow-500/50 transition-all duration-300 text-left w-full group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">Bekleyen İzin Talepleri</h3>
              <motion.svg 
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </motion.svg>
            </div>
            <motion.p 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="text-3xl font-bold text-yellow-400"
            >
              {pendingLeaveCount}
            </motion.p>
            <p className="text-xs text-gray-400 mt-2 group-hover:text-yellow-400 transition-colors">Detayları görüntüle →</p>
          </motion.button>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => onTabChange && onTabChange('internships')}
            className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 text-left w-full group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">İş/Staj Başvuruları</h3>
              <motion.svg 
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </motion.svg>
            </div>
            <div className="space-y-2">
              <div>
                <motion.p 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="text-3xl font-bold text-blue-400"
                >
                  {stats.internshipCount || 0}
                </motion.p>
                <p className="text-sm text-gray-400 mt-1">Toplam Başvuru</p>
              </div>
              <div className="pt-2 border-t border-gray-700">
                <div className="flex items-center space-x-2">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-green-500 rounded-full"
                  ></motion.div>
                  <p className="text-lg font-semibold text-white">{stats.internshipLastMonthCount || 0}</p>
                  <p className="text-sm text-gray-400">Son 1 Ayda</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 group-hover:text-blue-400 transition-colors">Detayları görüntüle →</p>
          </motion.button>
        </div>
      )}

      {isManager && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Talepler</h2>
              <p className="text-sm text-gray-400 mt-1">
                İzin, masraf ve toplantı odası taleplerinin son durumunu burada görebilirsiniz.
              </p>
              {stats && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <motion.span 
                    className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/50"
                  >
                    Bekleyen İzin: {pendingLeaveCount}
                  </motion.span>
                  <motion.span 
                    className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/50"
                  >
                    Bekleyen Masraf: {stats.pendingExpenses || 0}
                  </motion.span>
                  <motion.span 
                    className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/50"
                  >
                    Bekleyen Toplantı: {stats.pendingMeetingRooms || 0}
                  </motion.span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Link
                  href="/panel/talepleri-incele"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 transition cursor-pointer"
                >
                  Talepleri İncele
                </Link>
              </motion.div>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Link
                  href="/panel/talep-et"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-medium text-white hover:from-orange-600 hover:to-orange-700 transition shadow-lg shadow-orange-500/50 cursor-pointer"
                >
                  Yeni Talep Oluştur
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="border-t border-gray-700">
            {unifiedAllRequests.length === 0 ? (
              <div className="p-6 text-sm text-gray-400">
                Görüntülenecek talep bulunamadı.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Çalışan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tür</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tarih</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Özet</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Durum</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {unifiedAllRequests.slice(0, 15).map((r, index) => (
                      <motion.tr 
                        key={r.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.03 }}
                        className="hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {r.person}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {r.kind}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDateTR(r.date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          <Link href={r.href} className="text-orange-400 hover:text-orange-300 transition-colors">
                            {r.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {r.kindKey === 'expense' ? (
                            <select
                              value={r.statusText}
                              onChange={(e) => {
                                const label = e.target.value;
                                const map = {
                                  'Beklemede': 'Pending',
                                  'Onaylandı': 'Approved',
                                  'Reddedildi': 'Rejected',
                                  'Ödendi': 'Paid'
                                };
                                handleManagerStatusChange(r, map[label] || 'Pending');
                              }}
                              disabled={actionLoading}
                              className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-600 bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white cursor-pointer"
                            >
                              <option className="bg-gray-700">Beklemede</option>
                              <option className="bg-gray-700">Onaylandı</option>
                              <option className="bg-gray-700">Reddedildi</option>
                              <option className="bg-gray-700">Ödendi</option>
                            </select>
                          ) : (
                            <select
                              value={r.statusText}
                              onChange={(e) => {
                                const label = e.target.value;
                                const map = {
                                  'Beklemede': 'Pending',
                                  'Onaylandı': 'Approved',
                                  'Reddedildi': 'Rejected',
                                  'İptal Edildi': 'Cancelled'
                                };
                                handleManagerStatusChange(r, map[label] || 'Pending');
                              }}
                              disabled={actionLoading}
                              className={`px-3 py-2 rounded-lg text-sm font-medium border border-gray-600 bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white cursor-pointer ${r.statusClass}`}
                            >
                              <option className="bg-gray-700">Beklemede</option>
                              <option className="bg-gray-700">Onaylandı</option>
                              <option className="bg-gray-700">Reddedildi</option>
                              <option className="bg-gray-700">İptal Edildi</option>
                            </select>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleManagerDeleteRequest(r)}
                            disabled={actionLoading}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-red-700 text-red-200 hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          >
                            Sil
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}


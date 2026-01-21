'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import ApiService from '../../../lib/api';
import { isPendingStatus } from '../utils/requestStatus';

function getStatusBadgeClass(status) {
  const s = typeof status === 'string' ? status : String(status ?? '');
  switch (s) {
    case 'Approved':
    case '1':
    case 'Onaylandı':
      return 'bg-green-100 text-green-800';
    case 'Rejected':
    case '2':
    case 'Reddedildi':
      return 'bg-red-100 text-red-800';
    case 'Cancelled':
    case '3':
    case 'İptal':
    case 'İptal Edildi':
      return 'bg-gray-100 text-gray-800';
    case 'Ödendi':
      return 'bg-blue-100 text-blue-800';
    case 'Pending':
    case '0':
    case 'Beklemede':
    default:
      return 'bg-yellow-100 text-yellow-800';
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
    ataturk: 'Mustafa Kemal Atatürk Toplantı Salonu'
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
      }

      await refreshRequests();
    } catch (e) {
      alert(e.message || 'Durum güncellenirken hata oluştu');
    } finally {
      setActionLoading(false);
    }
  };

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

      {!isManager && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Talepler</h2>
              <p className="text-sm text-gray-500 mt-1">
                İzin, masraf ve toplantı odası taleplerinizin son durumunu burada görebilirsiniz.
              </p>
            </div>
            <Link
              href="/panel/talep-et"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition cursor-pointer"
            >
              Yeni Talep Oluştur
            </Link>
          </div>

          <div className="border-t border-gray-200">
            {unifiedMyRequests.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">
                Henüz bir talebiniz bulunmuyor.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tür</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Özet</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {unifiedMyRequests.slice(0, 10).map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {r.kind}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTR(r.date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {r.kind === 'İzin' ? (
                            <Link href={r.href} className="text-orange-600 hover:text-orange-800">
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {isManager && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => onTabChange && onTabChange('personnel')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-200 text-left w-full group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-500 transition-colors">Toplam Personel</h3>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-orange-500">{stats.personnelCount || 0}</p>
            <p className="text-xs text-gray-500 mt-2 group-hover:text-orange-500 transition-colors">Detayları görüntüle →</p>
          </button>
          
          <button
            onClick={() => onTabChange && onTabChange('leaves')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-200 text-left w-full group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-yellow-500 transition-colors">Bekleyen İzin Talepleri</h3>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-yellow-500">{stats.pendingLeaves || 0}</p>
            <p className="text-xs text-gray-500 mt-2 group-hover:text-yellow-500 transition-colors">Detayları görüntüle →</p>
          </button>
          
          <button
            onClick={() => onTabChange && onTabChange('internships')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-200 text-left w-full group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-500 transition-colors">İş/Staj Başvuruları</h3>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-3xl font-bold text-blue-500">{stats.internshipCount || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Toplam Başvuru</p>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-lg font-semibold text-gray-700">{stats.internshipLastMonthCount || 0}</p>
                  <p className="text-sm text-gray-500">Son 1 Ayda</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 group-hover:text-blue-500 transition-colors">Detayları görüntüle →</p>
          </button>
        </div>
      )}

      {isManager && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Talepler</h2>
              <p className="text-sm text-gray-500 mt-1">
                İzin, masraf ve toplantı odası taleplerinin son durumunu burada görebilirsiniz.
              </p>
              {stats && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                    Bekleyen İzin: {stats.pendingLeaves || 0}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                    Bekleyen Masraf: {stats.pendingExpenses || 0}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                    Bekleyen Toplantı: {stats.pendingMeetingRooms || 0}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Link
                href="/panel/talepleri-incele"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                Talepleri İncele
              </Link>
              <Link
                href="/panel/talep-et"
                className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition cursor-pointer"
              >
                Yeni Talep Oluştur
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-200">
            {unifiedAllRequests.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">
                Görüntülenecek talep bulunamadı.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personel</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tür</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Özet</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {unifiedAllRequests.slice(0, 15).map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {r.person}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {r.kind}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTR(r.date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <Link href={r.href} className="text-orange-600 hover:text-orange-800">
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
                              className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 cursor-pointer"
                            >
                              <option>Beklemede</option>
                              <option>Onaylandı</option>
                              <option>Reddedildi</option>
                              <option>Ödendi</option>
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
                              className={`px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 cursor-pointer ${r.statusClass}`}
                            >
                              <option>Beklemede</option>
                              <option>Onaylandı</option>
                              <option>Reddedildi</option>
                              <option>İptal Edildi</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


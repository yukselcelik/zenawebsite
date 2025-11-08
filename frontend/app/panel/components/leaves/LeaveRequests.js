'use client';

import { useState, useEffect } from 'react';
import ApiService from '../../../../lib/api';

export default function LeaveRequests({ isManager, onLeaveRequestsChange, onCreateNew }) {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaveRequests();
  }, [pagination.pageNumber, isManager]);

  const fetchLeaveRequests = async () => {
    try {
      setIsLoading(true);
      const data = isManager 
        ? await ApiService.getAllLeaveRequests(pagination.pageNumber, pagination.pageSize)
        : await ApiService.getMyLeaveRequests(pagination.pageNumber, pagination.pageSize);
      
      const items = data.data?.items || [];
      setLeaveRequests(items);
      setPagination({
        pageNumber: data.data?.pageNumber || 1,
        pageSize: data.data?.pageSize || 10,
        totalCount: data.data?.totalCount || 0,
        totalPages: data.data?.totalPages || 0
      });

      // Pending count'u hesapla ve parent'a bildir
      if (onLeaveRequestsChange) {
        const pendingCount = items.filter(r => r.status === 'Pending').length;
        onLeaveRequestsChange(pendingCount);
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

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


  const handleCancelLeaveRequest = async (id) => {
    if (!confirm('Bu izin talebini iptal etmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      await ApiService.deleteLeaveRequest(id);
      await fetchLeaveRequests();
    } catch (error) {
      console.error('Error cancelling leave request:', error);
      setError(error.message || 'İzin talebi iptal edilirken hata oluştu');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await ApiService.updateLeaveStatus(id, newStatus);
      await fetchLeaveRequests();
    } catch (error) {
      console.error('Error updating leave status:', error);
      setError(error.message || 'İzin talebi durumu güncellenirken hata oluştu');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hata mesajı */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {isManager ? 'Tüm İzin Talepleri' : 'İzin Taleplerim'}
            </h2>
            {!isManager && (
              <button
                onClick={() => onCreateNew && onCreateNew()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Yeni İzin Talebi
              </button>
            )}
          </div>
          <div className="space-y-4">
          {leaveRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Henüz izin talebi bulunmamaktadır.</p>
          ) : (
            leaveRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                      {isManager && request.userName && (
                        <span className="text-xs text-gray-500">
                          ({request.userName} {request.userSurname})
                        </span>
                      )}
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
                    <p className="text-xs text-gray-500 mt-2">
                      Oluşturulma: {new Date(request.createdAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    {isManager && (
                      <select
                        value={request.status}
                        onChange={(e) => handleStatusChange(request.id, e.target.value)}
                        className={`px-3 py-2 rounded text-sm font-medium border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 ${
                          request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          request.status === 'Cancelled' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <option value="Pending">Beklemede</option>
                        <option value="Approved">Onaylandı</option>
                        <option value="Rejected">Reddedildi</option>
                        <option value="Cancelled">İptal Edildi</option>
                      </select>
                    )}
                    {!isManager && request.status === 'Pending' && (
                      <button
                        onClick={() => handleCancelLeaveRequest(request.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                      >
                        İptal Et
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Toplam {pagination.totalCount} kayıttan {((pagination.pageNumber - 1) * pagination.pageSize) + 1} ile {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)} arası gösteriliyor
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination({ ...pagination, pageNumber: pagination.pageNumber - 1 })}
                disabled={pagination.pageNumber === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Önceki
              </button>
              <button
                onClick={() => setPagination({ ...pagination, pageNumber: pagination.pageNumber + 1 })}
                disabled={pagination.pageNumber >= pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}


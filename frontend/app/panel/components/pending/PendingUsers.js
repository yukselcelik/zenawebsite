'use client';

import { useState, useEffect } from 'react';
import ApiService from '../../../../lib/api';
import ConfirmDialog from '../common/ConfirmDialog';

export default function PendingUsers() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchPendingUsers();
  }, [pagination.pageNumber]);

  const fetchPendingUsers = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getAllPersonnelUsers(pagination.pageNumber, pagination.pageSize);
      setPendingUsers(data.data?.items || []);
      setPagination({
        pageNumber: data.data?.pageNumber || 1,
        pageSize: data.data?.pageSize || 10,
        totalCount: data.data?.totalCount || 0,
        totalPages: data.data?.totalPages || 0
      });
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovalStatusChange = async (userId, isApproved) => {
    try {
      await ApiService.updateUserApprovalStatus(userId, isApproved);
      fetchPendingUsers();
    } catch (error) {
      console.error('Error updating user approval status:', error);
    }
  };

  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      setConfirmLoading(true);
      await ApiService.deleteUser(userToDelete);
      setConfirmOpen(false);
      setUserToDelete(null);
      fetchPendingUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setConfirmLoading(false);
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
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Soyad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-posta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kayıt Tarihi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    Onay bekleyen kullanıcı bulunamadı
                  </td>
                </tr>
              ) : (
                pendingUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.name} {user.surname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <select
                          value={user.isApproved ? 'true' : 'false'}
                          onChange={(e) => handleApprovalStatusChange(user.id, e.target.value === 'true')}
                          className={`px-3 py-2 rounded text-sm font-medium border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 cursor-pointer ${
                            user.isApproved 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          <option value="false">Onaylanmadı</option>
                          <option value="true">Onaylandı</option>
                        </select>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900 px-3 py-2 rounded border border-red-300 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Önceki
              </button>
              <button
                onClick={() => setPagination({ ...pagination, pageNumber: pagination.pageNumber + 1 })}
                disabled={pagination.pageNumber >= pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Kullanıcıyı silmek istediğinize emin misiniz?"
        message="Bu işlem geri alınamaz. Kullanıcı kalıcı olarak silinecektir."
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        loading={confirmLoading}
        onCancel={() => {
          setConfirmOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}


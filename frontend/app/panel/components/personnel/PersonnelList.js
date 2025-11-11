'use client';

import { useState, useEffect } from 'react';
import ApiService from '../../../../lib/api';
export default function PersonnelList({ onViewDetail }) {
  const [personnelList, setPersonnelList] = useState([]);
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
    fetchPersonnel();
  }, [pagination.pageNumber]);

  const fetchPersonnel = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getPersonnelList(pagination.pageNumber, pagination.pageSize);
      setPersonnelList(data.data?.items || []);
      setPagination({
        pageNumber: data.data?.pageNumber || 1,
        pageSize: data.data?.pageSize || 10,
        totalCount: data.data?.totalCount || 0,
        totalPages: data.data?.totalPages || 0
      });
    } catch (error) {
      console.error('Error fetching personnel:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovalStatusChange = async (userId, isApproved) => {
    try {
      await ApiService.updateUserApprovalStatus(userId, isApproved);
      fetchPersonnel();
    } catch (error) {
      console.error('Error updating user approval status:', error);
      alert(error.message || 'Onay durumu güncellenirken hata oluştu');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await ApiService.updateUser(userId, { role: newRole });
      fetchPersonnel();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert(error.message || 'Rol güncellenirken hata oluştu');
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
      fetchPersonnel();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleViewDetail = (userId) => {
    if (onViewDetail) {
      onViewDetail(userId);
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
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Personeller</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Soyad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-posta</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Onay Durumu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {personnelList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      Personel bulunamadı
                    </td>
                  </tr>
                ) : (
                  personnelList.map((personnel) => (
                    <tr key={personnel.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {personnel.photoPath ? (
                          <img
                            src={personnel.photoPath}
                            alt={`${personnel.name} ${personnel.surname}`}
                            className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center text-white font-semibold">
                            {(personnel.name?.[0] || 'U').toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {personnel.name} {personnel.surname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{personnel.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{personnel.phone || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          value={personnel.role || 'Personel'}
                          onChange={(e) => handleRoleChange(personnel.id, e.target.value)}
                          className="px-3 py-2 rounded text-sm font-medium border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 cursor-pointer bg-white hover:bg-gray-50"
                        >
                          <option value="Personel">Personel</option>
                          <option value="Manager">Manager</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          value={personnel.isApproved ? 'true' : 'false'}
                          onChange={(e) => handleApprovalStatusChange(personnel.id, e.target.value === 'true')}
                          className={`px-3 py-2 rounded text-sm font-medium border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 cursor-pointer ${
                            personnel.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          <option value="false">Onaylanmadı</option>
                          <option value="true">Onaylandı</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleViewDetail(personnel.id)}
                            className="text-orange-600 hover:text-orange-900 cursor-pointer px-2 py-1 rounded hover:bg-orange-50 transition-colors"
                          >
                            Detay
                          </button>
                          <button
                            onClick={() => handleDelete(personnel.id)}
                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded border border-red-300 hover:bg-red-50 transition-colors cursor-pointer"
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
            <div className="mt-4 flex items-center justify-between">
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
      </div>

      {/* Silme onayı */}
      {confirmOpen && (
        <div className="relative">
          {/* Simple confirm inline to avoid extra import dependencies */}
          <div className="fixed inset-0 bg-black/30"></div>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Kullanıcı silinsin mi?</h4>
              <p className="text-sm text-gray-600 mb-4">Bu işlem geri alınamaz.</p>
              <div className="flex justify-end gap-2">
                <button
                  disabled={confirmLoading}
                  onClick={() => { setConfirmOpen(false); setUserToDelete(null); }}
                  className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  disabled={confirmLoading}
                  onClick={handleConfirmDelete}
                  className={`px-4 py-2 rounded text-white cursor-pointer ${confirmLoading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


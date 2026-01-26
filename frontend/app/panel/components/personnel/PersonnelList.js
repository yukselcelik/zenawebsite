'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6"
      >
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Yükleniyor...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            <h3 className="text-lg font-semibold text-white">Çalışanlar</h3>
          </motion.div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Foto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ad Soyad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">E-posta</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Telefon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Onay Durumu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {personnelList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-400">
                      Çalışan bulunamadı
                    </td>
                  </tr>
                ) : (
                  personnelList.map((personnel, index) => (
                    <motion.tr 
                      key={personnel.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {personnel.photoPath ? (
                          <motion.img
                            whileHover={{ scale: 1.1 }}
                            src={personnel.photoPath}
                            alt={`${personnel.name} ${personnel.surname}`}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-600"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center text-white font-semibold shadow-lg">
                            {(personnel.name?.[0] || 'U').toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                        {personnel.name} {personnel.surname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{personnel.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{personnel.phone || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          value={personnel.role || 'Personel'}
                          onChange={(e) => handleRoleChange(personnel.id, e.target.value)}
                          className="px-3 py-2 rounded text-sm font-medium border border-gray-600 bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white cursor-pointer hover:bg-gray-600 transition-colors"
                        >
                          <option className="bg-gray-700" value="Personel">Personel</option>
                          <option className="bg-gray-700" value="Manager">Yönetici</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          value={personnel.isApproved ? 'true' : 'false'}
                          onChange={(e) => handleApprovalStatusChange(personnel.id, e.target.value === 'true')}
                          className={`px-3 py-2 rounded text-sm font-medium border focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer transition-colors ${
                            personnel.isApproved 
                              ? 'bg-green-900/50 text-green-300 border-green-700' 
                              : 'bg-yellow-900/50 text-yellow-300 border-yellow-700'
                          }`}
                        >
                          <option className="bg-gray-700" value="false">Onaylanmadı</option>
                          <option className="bg-gray-700" value="true">Onaylandı</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewDetail(personnel.id)}
                            className="text-orange-400 hover:text-orange-300 cursor-pointer px-2 py-1 rounded hover:bg-orange-900/30 transition-colors"
                          >
                            Detay
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(personnel.id)}
                            className="text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-700 hover:bg-red-900/30 transition-colors cursor-pointer"
                          >
                            Sil
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 flex items-center justify-between"
            >
              <div className="text-sm text-gray-400">
                Toplam {pagination.totalCount} kayıttan {((pagination.pageNumber - 1) * pagination.pageSize) + 1} ile {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)} arası gösteriliyor
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPagination({ ...pagination, pageNumber: pagination.pageNumber - 1 })}
                  disabled={pagination.pageNumber === 1}
                  className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Önceki
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPagination({ ...pagination, pageNumber: pagination.pageNumber + 1 })}
                  disabled={pagination.pageNumber >= pagination.totalPages}
                  className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Sonraki
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Silme onayı */}
      {confirmOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative"
        >
          {/* Simple confirm inline to avoid extra import dependencies */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6 max-w-sm w-full"
            >
              <h4 className="text-lg font-semibold text-white mb-2">Kullanıcı silinsin mi?</h4>
              <p className="text-sm text-gray-400 mb-4">Bu işlem geri alınamaz.</p>
              <div className="flex justify-end gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={confirmLoading}
                  onClick={() => { setConfirmOpen(false); setUserToDelete(null); }}
                  className="px-4 py-2 rounded border border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  Vazgeç
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={confirmLoading}
                  onClick={handleConfirmDelete}
                  className={`px-4 py-2 rounded text-white cursor-pointer transition-colors ${confirmLoading ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/50'}`}
                >
                  Sil
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApiService from '../../../../lib/api';
import ConfirmDialog from '../common/ConfirmDialog';

export default function InternshipApplications() {
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingCv, setDownloadingCv] = useState({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingApplicationId, setDeletingApplicationId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [expandedApplications, setExpandedApplications] = useState({});

  useEffect(() => {
    fetchApplications();
  }, [pagination.pageNumber]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getAllInternshipApplications(pagination.pageNumber, pagination.pageSize);
      setApplications(data.data?.items || []);
      setPagination({
        pageNumber: data.data?.pageNumber || 1,
        pageSize: data.data?.pageSize || 10,
        totalCount: data.data?.totalCount || 0,
        totalPages: data.data?.totalPages || 0
      });
    } catch (error) {
      console.error('Error fetching internship applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCv = async (applicationId, originalFileName) => {
    try {
      setDownloadingCv(prev => ({ ...prev, [applicationId]: true }));
      await ApiService.downloadInternshipCv(applicationId, originalFileName);
    } catch (error) {
      console.error('Error downloading CV:', error);
      // Kullanıcı iptal ettiyse alert gösterme
      if (error.message !== 'İndirme iptal edildi') {
        alert(error.message || 'CV dosyası indirilemedi');
      }
    } finally {
      setDownloadingCv(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  const getFileName = (application) => {
    // Önce orijinal dosya adını kullan, yoksa stored file name'i kullan
    if (application.originalFileName) {
      return application.originalFileName;
    }
    if (!application.cvFilePath) return null;
    try {
      // URL'den dosya adını çıkar: "http://localhost:5133/uploads/cvs/1_20250118151852_cv.pdf" -> "1_20250118151852_cv.pdf"
      const url = new URL(application.cvFilePath);
      const pathParts = url.pathname.split('/');
      return pathParts[pathParts.length - 1];
    } catch {
      // URL değilse direkt dosya adı olabilir
      const parts = application.cvFilePath.split('/');
      return parts[parts.length - 1];
    }
  };

  const handleDeleteClick = (applicationId, fullName) => {
    setDeletingApplicationId(applicationId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingApplicationId) return;

    try {
      setDeleteLoading(true);
      await ApiService.deleteInternshipApplication(deletingApplicationId);
      setDeleteConfirmOpen(false);
      setDeletingApplicationId(null);
      // Listeyi yenile
      await fetchApplications();
    } catch (error) {
      console.error('Error deleting application:', error);
      alert(error.message || 'Başvuru silinirken hata oluştu');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setDeletingApplicationId(null);
  };

  const toggleApplication = (applicationId) => {
    setExpandedApplications(prev => ({
      ...prev,
      [applicationId]: !prev[applicationId]
    }));
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="space-y-4">
          {applications.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Henüz iş/staj başvurusu bulunmamaktadır.</p>
          ) : (
            applications.map((application, index) => {
              const isExpanded = expandedApplications[application.id];
              return (
                <motion.div 
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800 hover:border-gray-600 transition-colors"
                >
                  {/* Header - Tıklanabilir */}
                  <motion.button
                    onClick={() => toggleApplication(application.id)}
                    className="w-full p-4 flex justify-between items-center hover:bg-gray-700/50 transition-colors text-left"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">
                          {application.fullName}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {new Date(application.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-400">
                        <span><span className="font-medium text-gray-300">E-posta:</span> {application.email}</span>
                        <span><span className="font-medium text-gray-300">Telefon:</span> {application.phone}</span>
                        <span><span className="font-medium text-gray-300">Pozisyon:</span> {application.position}</span>
                      </div>
                    </div>
                    <motion.div 
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-4 flex items-center"
                    >
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </motion.button>

                  {/* Detaylar - Açılır/Kapanır */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-gray-700 bg-gray-700/30">
                          <div className="pt-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <p className="text-sm text-gray-300">
                                <span className="font-medium text-white">Okul:</span> {application.school}
                              </p>
                              <p className="text-sm text-gray-300">
                                <span className="font-medium text-white">Bölüm:</span> {application.department}
                              </p>
                              <p className="text-sm text-gray-300">
                                <span className="font-medium text-white">Sınıf:</span> {application.year || '-'}
                              </p>
                              <p className="text-sm text-gray-300">
                                <span className="font-medium text-white">Başvuru Tarihi:</span>{' '}
                                {new Date(application.createdAt).toLocaleString('tr-TR')}
                              </p>
                            </div>

                            {application.message && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-white mb-1">Mesaj:</p>
                                <p className="text-sm text-gray-300 whitespace-pre-wrap bg-gray-800 p-3 rounded border border-gray-600">
                                  {application.message}
                                </p>
                              </div>
                            )}

                            {application.cvFilePath && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-white mb-1">CV Dosyası:</p>
                                <p className="text-xs text-gray-400 font-mono bg-gray-800 p-2 rounded border border-gray-600">
                                  {getFileName(application)}
                                </p>
                              </div>
                            )}

                            {/* Butonlar */}
                            <div className="flex gap-2 mt-4">
                              {application.cvFilePath && (
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadCv(application.id, application.originalFileName);
                                  }}
                                  disabled={downloadingCv[application.id]}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 shadow-lg ${
                                    downloadingCv[application.id]
                                      ? 'bg-gray-600 text-white cursor-not-allowed'
                                      : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-orange-500/50'
                                  }`}
                                >
                                  {downloadingCv[application.id] ? (
                                    <>
                                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      İndiriliyor...
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      CV İndir
                                    </>
                                  )}
                                </motion.button>
                              )}
                              <motion.button
                                
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(application.id, application.fullName);
                                }}
                                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/50"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Sil
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex items-center justify-between"
          >
            <div className="text-sm text-gray-400">
              Toplam {pagination.totalCount} kayıttan {((pagination.pageNumber - 1) * pagination.pageSize) + 1} ile {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)} arası gösteriliyor
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setPagination({ ...pagination, pageNumber: pagination.pageNumber - 1 })}
                disabled={pagination.pageNumber === 1}
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Önceki
              </motion.button>
              <motion.button
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

      {/* Silme Onay Dialog'u */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Başvuruyu Sil"
        message={`${deletingApplicationId ? applications.find(a => a.id === deletingApplicationId)?.fullName : ''} adlı başvuruyu silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve CV dosyası da silinecektir.`}
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </motion.div>
  );
}


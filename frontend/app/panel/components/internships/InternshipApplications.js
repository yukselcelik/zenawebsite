'use client';

import { useState, useEffect } from 'react';
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
        <div className="space-y-4">
          {applications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Henüz iş/staj başvurusu bulunmamaktadır.</p>
          ) : (
            applications.map((application) => {
              const isExpanded = expandedApplications[application.id];
              return (
                <div key={application.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Header - Tıklanabilir */}
                  <button
                    onClick={() => toggleApplication(application.id)}
                    className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {application.fullName}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(application.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-600">
                        <span><span className="font-medium">E-posta:</span> {application.email}</span>
                        <span><span className="font-medium">Telefon:</span> {application.phone}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center">
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Detaylar - Açılır/Kapanır */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-200 bg-gray-50">
                      <div className="pt-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Okul:</span> {application.school}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Bölüm:</span> {application.department}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Sınıf:</span> {application.year || '-'}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Başvuru Tarihi:</span>{' '}
                            {new Date(application.createdAt).toLocaleString('tr-TR')}
                          </p>
                        </div>
                        
                        {application.message && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Mesaj:</p>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap bg-white p-3 rounded border border-gray-200">
                              {application.message}
                            </p>
                          </div>
                        )}

                        {application.cvFilePath && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">CV Dosyası:</p>
                            <p className="text-xs text-gray-600 font-mono bg-white p-2 rounded border border-gray-200">
                              {getFileName(application)}
                            </p>
                          </div>
                        )}

                        {/* Butonlar */}
                        <div className="flex gap-2 mt-4">
                          {application.cvFilePath && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadCv(application.id, application.originalFileName);
                              }}
                              disabled={downloadingCv[application.id]}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                                downloadingCv[application.id]
                                  ? 'bg-gray-400 text-white cursor-not-allowed'
                                  : 'bg-orange-500 hover:bg-orange-600 text-white'
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
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(application.id, application.fullName);
                            }}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
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
    </div>
  );
}


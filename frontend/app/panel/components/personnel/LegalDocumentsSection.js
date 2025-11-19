'use client';

import { useState, useEffect } from 'react';
import ApiService from '../../../../lib/api';
import ConfirmDialog from '../common/ConfirmDialog';

export default function LegalDocumentsSection({ legalDocuments: initialLegalDocuments, userId, onUpdate }) {
  const [legalDocuments, setLegalDocuments] = useState(initialLegalDocuments);
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [documentFormData, setDocumentFormData] = useState({
    documentType: '1', // Contract
    file: null
  });
  const [uploading, setUploading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  // Update local state when prop changes
  useEffect(() => {
    setLegalDocuments(initialLegalDocuments);
  }, [initialLegalDocuments]);

  // All available document types
  const allDocumentTypeOptions = [
    { value: '1', label: 'İş Sözleşmesi' },
    { value: '2', label: 'Nüfus Cüzdanı Fotokopisi' },
    { value: '3', label: 'Adli Sicil Kaydı' },
    { value: '4', label: 'Diploma Fotokopisi' },
    { value: '5', label: 'Askerlik Durumu Belgesi' },
    { value: '6', label: 'İkametgah Belgesi' },
    { value: '7', label: 'Çalışma İzni Belgesi' },
    { value: '8', label: 'Vesikalık' }
  ];

  // Update document type when available options change
  useEffect(() => {
    const existingDocumentTypes = legalDocuments?.documents?.map(doc => doc.legalDocumentType.toString()) || [];
    const availableOptions = allDocumentTypeOptions.filter(
      option => !existingDocumentTypes.includes(option.value)
    );
    
    // If current selected type is no longer available, select first available option
    if (availableOptions.length > 0 && !availableOptions.find(opt => opt.value === documentFormData.documentType)) {
      setDocumentFormData(prev => ({ ...prev, documentType: availableOptions[0].value }));
    }
  }, [legalDocuments?.documents]);

  const refreshLegalDocuments = async () => {
    try {
      const response = await ApiService.getLegalDocuments(userId);
      if (response?.data) {
        setLegalDocuments(response.data);
      }
    } catch (error) {
      console.error('Error refreshing legal documents:', error);
    }
  };

  const handleDocumentUpload = async (e) => {
    e.preventDefault();
    if (!documentFormData.file) {
      alert('Lütfen bir dosya seçin');
      return;
    }

    try {
      setUploading(true);
      await ApiService.uploadLegalDocument(
        userId,
        parseInt(documentFormData.documentType),
        documentFormData.file
      );
      setShowDocumentForm(false);
      setDocumentFormData({
        documentType: '1',
        file: null
      });
      // Refresh only legal documents data
      await refreshLegalDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      alert(error.message || 'Belge yüklenemedi');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (documentId) => {
    setDocumentToDelete(documentId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!documentToDelete) return;
    try {
      setConfirmLoading(true);
      await ApiService.deleteLegalDocument(documentToDelete);
      setConfirmOpen(false);
      setDocumentToDelete(null);
      // Refresh only legal documents data
      await refreshLegalDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      alert(error.message || 'Belge silinemedi');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleDownloadDocument = async (doc) => {
    try {
      await ApiService.downloadLegalDocument(doc.id);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert(error.message || 'Dosya indirilemedi');
    }
  };

  // Filter out document types that already exist for this user
  const existingDocumentTypes = legalDocuments?.documents?.map(doc => doc.legalDocumentType.toString()) || [];
  const documentTypeOptions = allDocumentTypeOptions.filter(
    option => !existingDocumentTypes.includes(option.value)
  );

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-md font-semibold text-gray-700">Yasal Belgeler</h4>
        <button
          onClick={() => setShowDocumentForm(!showDocumentForm)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
        >
          {showDocumentForm ? 'İptal' : 'Yeni Belge Ekle'}
        </button>
      </div>

      {showDocumentForm && (
        <form onSubmit={handleDocumentUpload} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
          {documentTypeOptions.length === 0 ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Tüm belge tipleri zaten eklenmiş. Yeni belge eklemek için mevcut belgelerden birini silmeniz gerekmektedir.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Belge Tipi</label>
              <select
                value={documentFormData.documentType}
                onChange={(e) => setDocumentFormData({ ...documentFormData, documentType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 cursor-pointer"
              >
                {documentTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dosya</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => setDocumentFormData({ ...documentFormData, file: e.target.files[0] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 cursor-pointer"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowDocumentForm(false);
                setDocumentFormData({
                  documentType: '1',
                  file: null
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={uploading || !documentFormData.file || documentTypeOptions.length === 0}
              className={`px-4 py-2 rounded-lg text-white cursor-pointer ${
                uploading || !documentFormData.file || documentTypeOptions.length === 0
                  ? 'bg-gray-400'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {uploading ? 'Yükleniyor...' : 'Yükle'}
            </button>
          </div>
        </form>
      )}

      {/* Documents Grid */}
      <div className="mt-4">
        {legalDocuments?.documents && legalDocuments.documents.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {legalDocuments.documents.map((doc) => {
              const getFileIcon = (url) => {
                if (!url) return '📄';
                const extension = url.split('.').pop()?.toLowerCase();
                if (['pdf'].includes(extension)) return '📕';
                if (['doc', 'docx'].includes(extension)) return '📘';
                if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return '🖼️';
                return '📄';
              };

              const getFileExtension = (url) => {
                if (!url) return '';
                const extension = url.split('.').pop()?.toUpperCase();
                return extension || '';
              };

              return (
                <div
                  key={doc.id}
                  className="relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* Delete Button - Top Right */}
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800 cursor-pointer bg-white rounded-full p-1 shadow-sm hover:bg-red-50 transition-colors"
                    title="Sil"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {/* File Icon */}
                  <div className="flex flex-col items-center">
                    <div className="text-6xl mb-2">
                      {getFileIcon(doc.documentUrl)}
                    </div>
                    
                    {/* File Type */}
                    <div className="text-sm font-medium text-gray-700 text-center mb-1 line-clamp-2">
                      {doc.legalDocumentTypeName}
                    </div>
                    
                    {/* Original File Name */}
                    {doc.originalFileName && (
                      <div className="text-xs text-gray-600 text-center mb-1 line-clamp-1" title={doc.originalFileName}>
                        {doc.originalFileName.length > 20 
                          ? doc.originalFileName.substring(0, 20) + '...' 
                          : doc.originalFileName}
                      </div>
                    )}
                    
                    {/* Upload Date */}
                    <div className="text-xs text-gray-500 text-center mb-2">
                      {new Date(doc.createdAt).toLocaleDateString('tr-TR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </div>
                    
                    {/* File Extension */}
                    <div className="text-xs text-gray-400 text-center mb-3">
                      {getFileExtension(doc.originalFileName || doc.documentUrl)}
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownloadDocument(doc)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs cursor-pointer flex items-center justify-center gap-1"
                      title="İndir"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      İndir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm">
            Belge bulunmamaktadır.
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Belgeyi silmek istediğinize emin misiniz?"
        message="Bu işlem geri alınamaz. Belge kalıcı olarak silinecektir."
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        loading={confirmLoading}
        onCancel={() => {
          setConfirmOpen(false);
          setDocumentToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}


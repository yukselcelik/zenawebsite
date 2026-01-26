'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ApiService from '../../../lib/api';

const DOCUMENT_TYPES = [
  { id: 1, name: 'Diploma' },
  { id: 2, name: 'Bordro' },
  { id: 3, name: 'Avans Formu' },
  { id: 4, name: 'Fiş Formu' },
  { id: 5, name: 'Noter Belgeleri' },
  { id: 6, name: 'Vekaletname' },
  { id: 7, name: 'Bilanço' },
  { id: 8, name: 'Gelir Tablosu' },
  { id: 9, name: 'İş Sözleşmesi' },
  { id: 10, name: 'İş Kuralları' },
  { id: 11, name: 'Organizasyon Şeması' },
  { id: 12, name: 'İş Akış Çizelgesi' },
  { id: 13, name: 'Toplantı Notları' },
  { id: 14, name: 'ARGE Çalışma Raporu' },
  { id: 15, name: 'Proje - Proje Geliştirme Çalışma Raporu' },
  { id: 16, name: 'İş Geliştirme Çalışma Raporu' },
  { id: 17, name: 'Yatırım Çalışma Raporu' },
  { id: 18, name: 'İSG Raporu' }
];

export default function ArsivPage() {
  const [documents, setDocuments] = useState({});
  const [uploading, setUploading] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setError('');
      const result = await ApiService.getAllArchiveDocuments();
      if (result && result.success) {
        const docsMap = {};
        // Boş liste de normal bir durum, hata değil
        if (result.data && Array.isArray(result.data)) {
          result.data.forEach(doc => {
            docsMap[doc.documentType] = doc;
          });
        }
        setDocuments(docsMap);
      } else {
        // API başarısız oldu
        const errorMessage = result?.message || 'Belgeler yüklenirken hata oluştu';
        console.error('API Error:', errorMessage, result);
        setError(errorMessage);
        setTimeout(() => setError(''), 5000);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      setError(error.message || 'Belgeler yüklenirken hata oluştu');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleFileUpload = async (documentType, file) => {
    if (!file) return;

    // Sadece PDF dosyaları kabul et
    if (file.type !== 'application/pdf') {
      setError('Sadece PDF dosyaları yüklenebilir');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setUploading(prev => ({ ...prev, [documentType]: true }));
    setError('');
    setSuccess('');

    try {
      const result = await ApiService.uploadArchiveDocument(file, documentType);
      if (result.success) {
        setSuccess(`${DOCUMENT_TYPES.find(d => d.id === documentType)?.name} başarıyla yüklendi`);
        setTimeout(() => setSuccess(''), 3000);
        await loadDocuments();
      } else {
        setError(result.message || 'Belge yüklenirken hata oluştu');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      setError('Belge yüklenirken hata oluştu');
      setTimeout(() => setError(''), 3000);
    } finally {
      setUploading(prev => ({ ...prev, [documentType]: false }));
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      const blob = await ApiService.downloadArchiveDocument(documentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'document.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading document:', error);
      setError('Belge indirilirken hata oluştu');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (documentId, documentType) => {
    if (!confirm('Bu belgeyi silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const result = await ApiService.deleteArchiveDocument(documentId);
      if (result.success) {
        setSuccess('Belge başarıyla silindi');
        setTimeout(() => setSuccess(''), 3000);
        await loadDocuments();
      } else {
        setError(result.message || 'Belge silinirken hata oluştu');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      setError('Belge silinirken hata oluştu');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Arşiv Yönetimi</h1>
        <p className="text-gray-400">Belgeleri yükleyin, görüntüleyin ve yönetin</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-900/30 border border-green-700/50 text-green-300 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DOCUMENT_TYPES.map((docType) => {
          const document = documents[docType.id];
          const isUploading = uploading[docType.id];

          return (
            <div
              key={docType.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-all"
            >
              <h3 className="text-lg font-semibold text-white mb-4">{docType.name}</h3>

              {document && document.documentPath ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="truncate">{document.originalFileName}</span>
                  </div>

                  {document.uploadedByUserName && (
                    <div className="text-xs text-gray-500">
                      Yükleyen: {document.uploadedByUserName}
                    </div>
                  )}

                  {document.createdAt && (
                    <div className="text-xs text-gray-500">
                      Yüklenme: {new Date(document.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(document.id, document.originalFileName)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      İndir
                    </button>
                    <button
                      onClick={() => handleDelete(document.id, docType.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(docType.id, file);
                        }
                      }}
                      className="hidden"
                      disabled={isUploading}
                      id={`file-input-new-${docType.id}`}
                    />
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                          <span className="text-gray-400 text-sm">Yükleniyor...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-gray-400 text-sm">PDF Yükle</span>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              )}

              {document && document.documentPath && (
                <div className="mt-3">
                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(docType.id, file);
                        }
                      }}
                      className="hidden"
                      disabled={isUploading}
                      id={`file-input-update-${docType.id}`}
                    />
                    <div
                      onClick={() => {
                        const input = document.getElementById(`file-input-update-${docType.id}`);
                        if (input && !isUploading) input.click();
                      }}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors text-center cursor-pointer"
                    >
                      {isUploading ? 'Yükleniyor...' : 'Güncelle'}
                    </div>
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


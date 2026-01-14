'use client';

import { useState, useEffect } from 'react';
import ApiService from '../../../../lib/api';
import ConfirmDialog from '../common/ConfirmDialog';

const OFFBOARDING_REASONS = [
  { value: 1, label: 'İstifa' },
  { value: 2, label: 'İşveren Feshi' },
  { value: 3, label: 'Deneme Süresi Feshi' },
  { value: 4, label: 'Emeklilik' },
  { value: 5, label: 'Vefat' },
  { value: 6, label: 'İş Kazası/Sağlık Sebebi' },
  { value: 7, label: 'Karşılıklı Anlaşma' },
  { value: 8, label: 'İkale' }
];

const DOCUMENT_TYPES = [
  { value: 1, label: 'İşten Ayrılış Belgesi' },
  { value: 2, label: 'Fesih Bildirimi' },
  { value: 3, label: 'Kapanış Bordrosu' },
  { value: 4, label: 'İstifa Dilekçesi' },
  { value: 5, label: 'Kıdem/İhbar Tazminat Belgeleri' },
  { value: 6, label: 'İbraname' }
];

export default function OffBoardingSection({ offBoarding, userId, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    offBoardingDate: '',
    offBoardingReason: ''
  });
  const [uploadingDocuments, setUploadingDocuments] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [documentsExpanded, setDocumentsExpanded] = useState(false);

  // offBoarding prop'u değiştiğinde formData'yı güncelle
  useEffect(() => {
    if (offBoarding && offBoarding.offBoardingDate) {
      try {
        const date = new Date(offBoarding.offBoardingDate);
        if (!isNaN(date.getTime())) {
          setFormData({
            offBoardingDate: date.toISOString().split('T')[0],
            offBoardingReason: offBoarding.offBoardingReason || ''
          });
        } else {
          setFormData({
            offBoardingDate: '',
            offBoardingReason: offBoarding.offBoardingReason || ''
          });
        }
      } catch (error) {
        console.error('Error parsing offBoarding date:', error);
        setFormData({
          offBoardingDate: '',
          offBoardingReason: offBoarding.offBoardingReason || ''
        });
      }
    } else {
      setFormData({
        offBoardingDate: '',
        offBoardingReason: ''
      });
    }
  }, [offBoarding]);

  const isActive = offBoarding?.isActive || false;
  const documents = offBoarding?.documents || [];

  const handleSave = async () => {
    try {
      await ApiService.createOrUpdateOffBoarding({
        userId: userId,
        offBoardingDate: formData.offBoardingDate || null,
        offBoardingReason: formData.offBoardingReason ? parseInt(formData.offBoardingReason) : null
      });
      setIsEditing(false);
      setShowOffBoardingForm(false);
      onUpdate();
    } catch (error) {
      console.error('Error saving offboarding:', error);
      alert(error.message || 'İşten ayrılma bilgileri kaydedilemedi');
    }
  };

  const handleDocumentUpload = async (documentType) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        setUploadingDocuments(prev => ({ ...prev, [documentType]: true }));
        await ApiService.uploadOffBoardingDocument(userId, documentType, file);
        // Belge yüklendikten sonra parent component'i güncelle
        // Biraz bekle ki backend veriyi işlesin
        await new Promise(resolve => setTimeout(resolve, 500));
        if (onUpdate) {
          await onUpdate();
        }
      } catch (error) {
        console.error('Error uploading document:', error);
        alert(error.message || 'Belge yüklenemedi');
      } finally {
        setUploadingDocuments(prev => ({ ...prev, [documentType]: false }));
      }
    };
    input.click();
  };

  const handleDocumentView = async (document) => {
    try {
      await ApiService.downloadOffBoardingDocument(document.id);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert(error.message || 'Belge görüntülenemedi');
    }
  };

  const handleDocumentDelete = (documentId) => {
    setDocumentToDelete(documentId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!documentToDelete) return;
    try {
      setConfirmLoading(true);
      await ApiService.deleteOffBoardingDocument(documentToDelete);
      setConfirmOpen(false);
      setDocumentToDelete(null);
      // Belge silindikten sonra parent component'i güncelle
      await new Promise(resolve => setTimeout(resolve, 300));
      if (onUpdate) {
        await onUpdate();
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert(error.message || 'Belge silinemedi');
    } finally {
      setConfirmLoading(false);
    }
  };

  // Enum string değerlerini number'a çeviren mapping (backend'den gelen enum adları)
  const enumStringToNumber = {
    'OffBoardingDocument': 1,
    'TerminationNotice': 2,
    'FinalPayroll': 3,
    'ResignationLetter': 4,
    'SeveranceNoticePayDocuments': 5,
    'ReleaseWaiverDocument': 6
  };

  const getDocumentByType = (documentType) => {
    if (!documents || documents.length === 0) {
      return null;
    }
    // documentType hem number hem string olabilir
    const searchType = Number(documentType);
    
    const found = documents.find(doc => {
      if (doc.documentType == null) return false;
      
      // Eğer documentType string ise (enum name), number'a çevir
      let docTypeNum;
      if (typeof doc.documentType === 'string') {
        // Enum string değerini number'a çevir
        docTypeNum = enumStringToNumber[doc.documentType];
        if (docTypeNum === undefined) {
          // Eğer mapping'de yoksa, direkt number'a çevirmeyi dene
          docTypeNum = Number(doc.documentType);
        }
      } else {
        // Zaten number ise direkt kullan
        docTypeNum = Number(doc.documentType);
      }
      
      // NaN kontrolü
      if (isNaN(docTypeNum)) return false;
      
      return docTypeNum === searchType;
    });
    
    return found || null;
  };

  // Debug: offBoarding ve documents değiştiğinde log'la
  useEffect(() => {
    console.log('OffBoarding prop changed:', offBoarding);
    console.log('Documents array:', documents);
    if (documents && documents.length > 0) {
      console.log('Document types:', documents.map(d => ({ 
        id: d.id, 
        type: d.documentType, 
        typeName: d.documentTypeName,
        fileName: d.originalFileName 
      })));
    }
  }, [offBoarding, documents]);

  // Personel işten ayrılmış mı kontrolü
  const hasOffBoardingDate = offBoarding?.offBoardingDate != null && offBoarding.offBoardingDate !== '';
  const isTerminated = hasOffBoardingDate || (isEditing && formData.offBoardingDate);
  const [showOffBoardingForm, setShowOffBoardingForm] = useState(false);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800">İşten Ayrılma Bilgileri:</h3>
          {isTerminated ? (
            <span className="text-lg font-semibold text-gray-800">
              {offBoarding?.offBoardingReasonName ? `(${offBoarding.offBoardingReasonName})` : 'İşten Ayrıldı'}
            </span>
          ) : (
            <span className="text-base font-normal text-gray-500">
              Güncel Olarak Çalışmaya Devam Ediyor
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {isEditing && showOffBoardingForm && (
            <button
              onClick={() => {
                setShowOffBoardingForm(false);
                setIsEditing(false);
                setFormData({
                  offBoardingDate: offBoarding?.offBoardingDate ? new Date(offBoarding.offBoardingDate).toISOString().split('T')[0] : '',
                  offBoardingReason: offBoarding?.offBoardingReason || ''
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer text-sm"
            >
              İptal
            </button>
          )}
          {isEditing && !showOffBoardingForm && (
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  offBoardingDate: offBoarding?.offBoardingDate ? new Date(offBoarding.offBoardingDate).toISOString().split('T')[0] : '',
                  offBoardingReason: offBoarding?.offBoardingReason || ''
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer text-sm"
            >
              İptal
            </button>
          )}
          {!isTerminated && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
            >
              Düzenle
            </button>
          )}
          {!isTerminated && isEditing && !showOffBoardingForm && (
            <button
              onClick={() => setShowOffBoardingForm(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
            >
              İş Çıkışını Yap
            </button>
          )}
          {isTerminated && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
            >
              Düzenle
            </button>
          )}
          {(isEditing && showOffBoardingForm) || (isTerminated && isEditing && !showOffBoardingForm) ? (
            <button
              onClick={handleSave}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
            >
              Kaydet
            </button>
          ) : null}
        </div>
      </div>

      {/* Eğer personel işten ayrılmışsa veya düzenleme modunda "İş Çıkışını Yap"a basıldıysa detayları göster */}
      {(isTerminated || (isEditing && showOffBoardingForm)) && (
        <>
          {/* İşten Ayrılma Tarihi */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <label className="block text-sm font-medium text-gray-700 min-w-[180px]">
                İşten Ayrılma Tarihi:
              </label>
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="date"
                    value={formData.offBoardingDate}
                    onChange={(e) => setFormData({ ...formData, offBoardingDate: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  />
                  {formData.offBoardingDate && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, offBoardingDate: '' })}
                      className="text-xs text-red-600 hover:text-red-800 underline self-start"
                    >
                      Tarihi Temizle (Kullanıcıyı Tekrar Aktif Et)
                    </button>
                  )}
                  {formData.offBoardingDate && (
                    <p className="text-xs text-amber-600">
                      ⚠️ Tarih girildiğinde kullanıcı sisteme giriş yapamayacak. Tarihi temizleyerek tekrar aktif edebilirsiniz.
                    </p>
                  )}
                </div>
              ) : (
                <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-w-[200px]">
                  {offBoarding?.offBoardingDate 
                    ? (() => {
                        try {
                          const date = new Date(offBoarding.offBoardingDate);
                          return !isNaN(date.getTime()) ? <span className="text-gray-900">{date.toLocaleDateString('tr-TR')}</span> : <span className="text-gray-500">Devam Ediyor</span>;
                        } catch {
                          return <span className="text-gray-500">Devam Ediyor</span>;
                        }
                      })()
                    : <span className="text-gray-500">Devam Ediyor</span>
                  }
                </div>
              )}
            </div>
          </div>

          {/* İşten Ayrılma Nedeni - Tarih girildiğinde (kaydetmeden önce) veya kaydedilmiş tarih varsa göster */}
          {((isEditing && showOffBoardingForm && formData.offBoardingDate) || isActive) && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <label className="block text-sm font-medium text-gray-700 min-w-[180px]">
                  İşten Ayrılma Nedeni:
                </label>
                {isEditing ? (
                  <select
                    value={formData.offBoardingReason}
                    onChange={(e) => setFormData({ ...formData, offBoardingReason: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 min-w-[300px]"
                  >
                    <option value="">Seçiniz</option>
                    {OFFBOARDING_REASONS.map(reason => (
                      <option key={reason.value} value={reason.value}>{reason.label}</option>
                    ))}
                  </select>
                ) : (
                  <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-w-[300px]">
                    <span className="text-gray-900">{offBoarding?.offBoardingReasonName || '-'}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* İşten Ayrılma Belgeleri - Sadece işten ayrılmışsa göster */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setDocumentsExpanded(!documentsExpanded)}
              className="flex items-center justify-between w-full mb-4 text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <h4 className="text-md font-semibold text-gray-800">İşten Ayrılma Belgeleri</h4>
              <svg
                className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${documentsExpanded ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {documentsExpanded && (
              <div className="space-y-4">
                {DOCUMENT_TYPES.map(docType => {
                const document = getDocumentByType(docType.value);
                const hasDocument = !!document;
                
                return (
                  <div key={docType.value} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700 min-w-[250px]">
                        {docType.label}:
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDocumentUpload(docType.value);
                          }}
                          disabled={uploadingDocuments[docType.value]}
                          className={`px-3 py-1 rounded text-sm ${
                            uploadingDocuments[docType.value]
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                          }`}
                        >
                          {uploadingDocuments[docType.value] ? 'Yükleniyor...' : hasDocument ? 'Yeniden Yükle' : 'Yükle'}
                        </button>
                        {hasDocument && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDocumentView(document);
                              }}
                              className="px-3 py-1 rounded text-sm bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                            >
                              Görüntüle
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDocumentDelete(document.id);
                              }}
                              className="px-3 py-1 rounded text-sm bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                            >
                              Sil
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {hasDocument && (
                      <p className="text-xs text-gray-500 mt-2">
                        {document.originalFileName || 'Belge yüklü'}
                      </p>
                    )}
                  </div>
                );
              })}
              </div>
            )}
          </div>
        </>
      )}

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


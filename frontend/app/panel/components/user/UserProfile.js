'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApiService from '../../../../lib/api';
import ConfirmDialog from '../common/ConfirmDialog';
import ContactInfoSection from './ContactInfoSection';
import EmergencyContactSection from './EmergencyContactSection';
import EducationInfoSection from './EducationInfoSection';
import PhoneInput from '../common/PhoneInput';
import RightsAndReceivablesSection from '../personnel/RightsAndReceivablesSection';

function toDateInputValue(value) {
  if (!value) return '';
  if (typeof value === 'string') return value.slice(0, 10);
  try {
    return new Date(value).toISOString().slice(0, 10);
  } catch {
    return '';
  }
}

function formatDateTR(value) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleDateString('tr-TR', { timeZone: 'UTC' });
  } catch {
    return '-';
  }
}

export default function UserProfile({ userDetail, onUpdate, onUserDetailUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: userDetail?.name || '',
    surname: userDetail?.surname || '',
    phone: userDetail?.phone || '',
    photoPath: userDetail?.photoPath || '',
    tcNo: userDetail?.tcNo || '',
    birthPlace: userDetail?.birthPlace || '',
    birthDate: toDateInputValue(userDetail?.birthDate)
  });

  // userDetail değişince formData'yı güncelle
  useEffect(() => {
    if (userDetail) {
      setFormData({
        name: userDetail.name || '',
        surname: userDetail.surname || '',
        phone: userDetail.phone || '',
        photoPath: userDetail.photoPath || '',
        tcNo: userDetail.tcNo || '',
        birthPlace: userDetail.birthPlace || '',
        birthDate: toDateInputValue(userDetail.birthDate)
      });
    }
  }, [userDetail]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      const tempUrl = URL.createObjectURL(file);
      if (previewUrl) {
        try { URL.revokeObjectURL(previewUrl); } catch {}
      }
      setPreviewUrl(tempUrl);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedPhoto) return;
    try {
      setUploading(true);
      const res = await ApiService.uploadProfilePhoto(userDetail.id, selectedPhoto);
      // Backend tam URL döndürüyor (static file URL)
      const newPhotoPath = res?.data || res?.photoPath || res;
      setFormData(prev => ({ ...prev, photoPath: newPhotoPath }));
      // Parent'i tetikle (mevcut profilin yeniden yüklenmesi için)
      if (onUserDetailUpdate) {
        await onUserDetailUpdate(userDetail.id);
      }
      setSelectedPhoto(null);
      if (previewUrl) {
        try { URL.revokeObjectURL(previewUrl); } catch {}
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error('Photo upload error:', err);
      alert(err.message || 'Fotoğraf yüklenirken hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      // TC No boş string ise null gönder (backend'de ignore edilsin)
      const updateData = {
        name: formData.name,
        surname: formData.surname,
        phone: formData.phone,
        photoPath: formData.photoPath,
        tcNo: formData.tcNo && formData.tcNo.trim() !== '' ? formData.tcNo.trim() : null,
        birthPlace: formData.birthPlace,
        birthDate: formData.birthDate && formData.birthDate.trim() !== '' ? formData.birthDate : null
      };
      
      await onUpdate(userDetail.id, updateData);
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      // Hata mesajını kullanıcıya göster
      alert(error.message || 'Güncelleme sırasında bir hata oluştu.');
    }
  };

  if (!userDetail) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
        <p className="text-gray-300">Yükleniyor...</p>
      </div>
    );
  }

  const refreshUserDetail = async () => {
    if (onUserDetailUpdate) {
      await onUserDetailUpdate(userDetail.id);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Profil Fotoğrafı */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative w-28 h-28">
            <motion.div 
              className="w-28 h-28 rounded-full overflow-hidden bg-gray-700 ring-2 ring-gray-600 shadow-lg"
            >
              {(previewUrl || userDetail?.photoPath) ? (
                <img
                  src={previewUrl || userDetail.photoPath}
                  alt="Profil"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                  <span className="text-gray-400 text-sm">Fotoğraf yok</span>
                </div>
              )}
            </motion.div>
          </div>

          <div className="flex-1 w-full">
            <div className="rounded-lg border-2 border-dashed border-gray-600 bg-gray-800 px-4 py-5">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <motion.label
                  whileTap={{ scale: 0.95 }}
                  htmlFor="photo-upload-input"
                  className="inline-flex items-center gap-2 cursor-pointer rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 active:bg-gray-500 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 00-2 2v3h2V5h3V3H4zM13 3v2h3v3h2V5a2 2 0 00-2-2h-3zM4 12H2v3a2 2 0 002 2h3v-2H4v-3zM18 12h-2v3h-3v2h3a2 2 0 002-2v-3z" /><path d="M7 10a3 3 0 116 0 3 3 0 01-6 0z" /></svg>
                  Fotoğraf Seç
                </motion.label>
                <input
                  id="photo-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={!selectedPhoto || uploading}
                  onClick={handlePhotoUpload}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white cursor-pointer transition shadow-lg ${
                    (!selectedPhoto || uploading) 
                      ? 'bg-gray-600' 
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/50'
                  }`}
                >
                  {uploading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                      Yükleniyor...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 00-2 2v3h2V5h3V3H4zM13 3v2h3v3h2V5a2 2 0 00-2-2h-3zM4 12H2v3a2 2 0 002 2h3v-2H4v-3zM18 12h-2v3h-3v2h3a2 2 0 002-2v-3z" /><path d="M7 10l3-3 3 3H7zM7 12h6v5H7z" /></svg>
                      Fotoğraf Yükle
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    if (!userDetail?.photoPath) return;
                    setConfirmOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-300 bg-gray-700 border border-gray-600 hover:bg-gray-600 active:bg-gray-500 transition"
                >
                  Fotoğrafı Kaldır
                </motion.button>
                {selectedPhoto && (
                  <span className="text-xs text-gray-400 truncate max-w-full sm:max-w-xs">
                    {selectedPhoto.name}
                  </span>
                )}
              </div>
              <p className="mt-3 text-xs text-gray-400">
                JPG, PNG desteklenir. Önerilen boyut: 400x400+. Maks. 5MB.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      <ConfirmDialog
        open={confirmOpen}
        title="Profil fotoğrafı kaldırılsın mı?"
        message="Bu işlem geri alınamaz. Profil fotoğrafınız kaldırılacaktır."
        confirmText="Evet, Kaldır"
        cancelText="Vazgeç"
        loading={confirmLoading}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          try {
            setConfirmLoading(true);
            await ApiService.deleteProfilePhoto(userDetail.id);
            if (previewUrl) {
              try { URL.revokeObjectURL(previewUrl); } catch {}
              setPreviewUrl(null);
            }
            setSelectedPhoto(null);
            setConfirmOpen(false);
            if (onUserDetailUpdate) {
              await onUserDetailUpdate(userDetail.id);
            }
          } catch (err) {
            alert(err.message || 'Fotoğraf kaldırılırken hata oluştu.');
          } finally {
            setConfirmLoading(false);
          }
        }}
      />

      {/* Temel Bilgiler */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6"
      >
        <div className="flex justify-end items-center mb-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg text-sm cursor-pointer shadow-lg shadow-orange-500/50 transition-all"
          >
            {isEditing ? 'Kaydet' : 'Düzenle'}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Ad</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400"
              />
            ) : (
              <p className="text-white">{userDetail.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Soyad</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400"
              />
            ) : (
              <p className="text-white">{userDetail.surname}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">E-posta</label>
            <p className="text-white">{userDetail.email}</p>
            <p className="text-xs text-gray-400 mt-1">E-posta değiştirilemez</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Telefon</label>
            {isEditing ? (
              <PhoneInput
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value })}
                placeholder="5XX XXX XX XX"
              />
            ) : (
              <p className="text-white">{userDetail.phone || '-'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">TC No</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.tcNo}
                onChange={(e) => setFormData({ ...formData, tcNo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400"
                maxLength={11}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="11 haneli TC No"
              />
            ) : (
              <p className="text-white">{userDetail.tcNo || '-'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Doğum Yeri</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.birthPlace}
                onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400"
                placeholder="Örn: İstanbul"
              />
            ) : (
              <p className="text-white">{userDetail.birthPlace || '-'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Doğum Tarihi</label>
            {isEditing ? (
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white"
              />
            ) : (
              <p className="text-white">{formatDateTR(userDetail.birthDate)}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* İletişim Bilgileri */}
      <ContactInfoSection 
        contactInfos={userDetail.contactInfos || []} 
        userId={userDetail.id}
        onUpdate={onUserDetailUpdate}
        isApproved={userDetail.isApproved}
      />

      {/* Acil Durum İletişim Bilgileri */}
      <EmergencyContactSection 
        emergencyContacts={userDetail.emergencyContacts || []} 
        userId={userDetail.id}
        onUpdate={onUserDetailUpdate}
        isApproved={userDetail.isApproved}
      />

      {/* Eğitim Bilgileri */}
      <EducationInfoSection 
        educationInfos={userDetail.educationInfos || []} 
        userId={userDetail.id}
        onUpdate={onUserDetailUpdate}
      />

      {/* Hak ve Alacaklar (Personel - salt okunur) */}
      {userDetail?.role !== 'Manager' && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">Hak ve Alacaklar</h2>
            <p className="text-sm text-gray-400 mt-1">
              Bu bilgiler yönetici tarafından güncellenir. Personel sadece görüntüleyebilir.
            </p>
          </div>
          <RightsAndReceivablesSection
            rightsAndReceivables={userDetail.rightsAndReceivables || null}
            userId={userDetail.id}
            userRole={userDetail.role || 'Personel'}
            onUpdate={refreshUserDetail}
          />
        </motion.div>
      )}
    </motion.div>
  );
}


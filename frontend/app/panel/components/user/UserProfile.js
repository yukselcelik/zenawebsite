'use client';

import { useState, useEffect } from 'react';
import ApiService from '../../../../lib/api';
import ConfirmDialog from '../common/ConfirmDialog';
import ContactInfoSection from './ContactInfoSection';
import EmergencyContactSection from './EmergencyContactSection';
import EducationInfoSection from './EducationInfoSection';

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
    tcNo: userDetail?.tcNo || ''
  });

  // userDetail değişince formData'yı güncelle
  useEffect(() => {
    if (userDetail) {
      setFormData({
        name: userDetail.name || '',
        surname: userDetail.surname || '',
        phone: userDetail.phone || '',
        photoPath: userDetail.photoPath || '',
        tcNo: userDetail.tcNo || ''
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
      await onUpdate(userDetail.id, {
        name: formData.name,
        surname: formData.surname,
        phone: formData.phone,
        photoPath: formData.photoPath,
        tcNo: formData.tcNo
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  if (!userDetail) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profil Fotoğrafı */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative w-28 h-28">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white shadow">
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
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400 text-sm">Fotoğraf yok</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 py-5">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <label
                  htmlFor="photo-upload-input"
                  className="inline-flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 00-2 2v3h2V5h3V3H4zM13 3v2h3v3h2V5a2 2 0 00-2-2h-3zM4 12H2v3a2 2 0 002 2h3v-2H4v-3zM18 12h-2v3h-3v2h3a2 2 0 002-2v-3z" /><path d="M7 10a3 3 0 116 0 3 3 0 01-6 0z" /></svg>
                  Fotoğraf Seç
                </label>
                <input
                  id="photo-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <button
                  disabled={!selectedPhoto || uploading}
                  onClick={handlePhotoUpload}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white cursor-pointer transition ${(!selectedPhoto || uploading) ? 'bg-gray-300' : 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700'}`}
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
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!userDetail?.photoPath) return;
                    setConfirmOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition"
                >
                  Fotoğrafı Kaldır
                </button>
                {selectedPhoto && (
                  <span className="text-xs text-gray-600 truncate max-w-full sm:max-w-xs">
                    {selectedPhoto.name}
                  </span>
                )}
              </div>
              <p className="mt-3 text-xs text-gray-500">
                JPG, PNG desteklenir. Önerilen boyut: 400x400+. Maks. 5MB.
              </p>
            </div>
          </div>
        </div>
      </div>
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
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-end items-center mb-6">
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
          >
            {isEditing ? 'Kaydet' : 'Düzenle'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
              />
            ) : (
              <p className="text-gray-900">{userDetail.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
              />
            ) : (
              <p className="text-gray-900">{userDetail.surname}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
            <p className="text-gray-900">{userDetail.email}</p>
            <p className="text-xs text-gray-500 mt-1">E-posta değiştirilemez</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
              />
            ) : (
              <p className="text-gray-900">{userDetail.phone || '-'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">TC No</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.tcNo}
                onChange={(e) => setFormData({ ...formData, tcNo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                maxLength={11}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="11 haneli TC No"
              />
            ) : (
              <p className="text-gray-900">{userDetail.tcNo || '-'}</p>
            )}
          </div>
        </div>
      </div>

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
    </div>
  );
}


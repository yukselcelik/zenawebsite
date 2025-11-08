'use client';

import { useState } from 'react';
import ApiService from '../../../../lib/api';
import ContactInfoSection from './ContactInfoSection';
import EmergencyContactSection from './EmergencyContactSection';
import EducationInfoSection from './EducationInfoSection';

export default function UserProfile({ userDetail, onUpdate, onUserDetailUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userDetail?.name || '',
    surname: userDetail?.surname || '',
    phone: userDetail?.phone || '',
    photoPath: userDetail?.photoPath || ''
  });

  const handleSave = async () => {
    try {
      await onUpdate(userDetail.id, {
        name: formData.name,
        surname: formData.surname,
        phone: formData.phone,
        photoPath: formData.photoPath
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


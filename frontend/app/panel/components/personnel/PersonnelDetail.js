'use client';

import { useState, useEffect } from 'react';
import ApiService from '../../../../lib/api';
import EmploymentInfoSection from './EmploymentInfoSection';
import ContactInfoSection from '../user/ContactInfoSection';
import EmergencyContactSection from '../user/EmergencyContactSection';
import EducationInfoSection from '../user/EducationInfoSection';

export default function PersonnelDetail({ userId, onBack }) {
  const [userDetail, setUserDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserDetail();
  }, [userId]);

  const fetchUserDetail = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getUserDetail(userId);
      if (data?.data) {
        setUserDetail(data.data);
      }
    } catch (error) {
      console.error('Error fetching user detail:', error);
    } finally {
      setIsLoading(false);
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

  if (!userDetail) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Kullanıcı bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-gray-800">Personel Detayları</h2>
            </div>
          </div>

          {/* Temel Bilgiler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
              <p className="text-gray-900">{userDetail.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
              <p className="text-gray-900">{userDetail.surname}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
              <p className="text-gray-900">{userDetail.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
              <p className="text-gray-900">{userDetail.phone || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">TC No</label>
              <p className="text-gray-900">{userDetail.tcNo || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
              <p className="text-gray-900">{userDetail.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Onay Durumu</label>
              <p className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                userDetail.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {userDetail.isApproved ? 'Onaylandı' : 'Onay Bekliyor'}
              </p>
            </div>
            {userDetail.approvedAt && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Onay Tarihi</label>
                <p className="text-gray-900">{new Date(userDetail.approvedAt).toLocaleDateString('tr-TR')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* İletişim Bilgileri */}
      <ContactInfoSection 
        contactInfos={userDetail.contactInfos || []} 
        userId={userDetail.id}
        onUpdate={(updatedDetail) => {
          setUserDetail(updatedDetail);
        }}
        isApproved={userDetail.isApproved}
      />

      {/* Acil Durum İletişim Bilgileri */}
      <EmergencyContactSection 
        emergencyContacts={userDetail.emergencyContacts || []} 
        userId={userDetail.id}
        onUpdate={(updatedDetail) => {
          setUserDetail(updatedDetail);
        }}
        isApproved={userDetail.isApproved}
      />

      {/* Eğitim Bilgileri */}
      <EducationInfoSection 
        educationInfos={userDetail.educationInfos || []} 
        userId={userDetail.id}
        onUpdate={(updatedDetail) => {
          setUserDetail(updatedDetail);
        }}
      />

      {/* İstihdam Bilgileri - Sadece yönetici için */}
      <div className="bg-white rounded-lg shadow p-6">
        <EmploymentInfoSection 
          employmentInfos={userDetail.employmentInfos || []} 
          userId={userDetail.id}
          onUpdate={fetchUserDetail}
        />
      </div>
    </div>
  );
}


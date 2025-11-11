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
  const [roleEditing, setRoleEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Personel');
  const [roleSaving, setRoleSaving] = useState(false);

  useEffect(() => {
    fetchUserDetail();
  }, [userId]);

  const fetchUserDetail = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getUserDetail(userId);
      if (data?.data) {
        setUserDetail(data.data);
        setSelectedRole(data.data.role === 'Manager' ? 'Manager' : 'Personel');
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
              {roleEditing ? (
                <div className="flex items-center gap-3">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  >
                    <option value="Personel">Personel</option>
                    <option value="Manager">Manager</option>
                  </select>
                  <button
                    disabled={roleSaving}
                    onClick={async () => {
                      try {
                        setRoleSaving(true);
                        await ApiService.updateUser(userDetail.id, { role: selectedRole });
                        await fetchUserDetail();
                        setRoleEditing(false);
                      } catch (err) {
                        console.error('Role update error:', err);
                        alert(err.message || 'Rol güncellenemedi');
                      } finally {
                        setRoleSaving(false);
                      }
                    }}
                    className={`px-3 py-2 rounded-lg text-white text-sm cursor-pointer ${roleSaving ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'}`}
                  >
                    Kaydet
                  </button>
                  <button
                    disabled={roleSaving}
                    onClick={() => {
                      setSelectedRole(userDetail.role === 'Manager' ? 'Manager' : 'Personel');
                      setRoleEditing(false);
                    }}
                    className="px-3 py-2 rounded-lg text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 cursor-pointer"
                  >
                    Vazgeç
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <p className="text-gray-900">{userDetail.role}</p>
                  <button
                    onClick={() => setRoleEditing(true)}
                    className="px-3 py-1.5 rounded-lg text-sm text-white bg-orange-500 hover:bg-orange-600 cursor-pointer"
                  >
                    Rolü Değiştir
                  </button>
                </div>
              )}
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


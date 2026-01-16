'use client';

import { useState, useEffect } from 'react';
import ApiService from '../../../../lib/api';
import EmploymentInfoSection from './EmploymentInfoSection';
import SocialSecuritySection from './SocialSecuritySection';
import LegalDocumentsSection from './LegalDocumentsSection';
import OffBoardingSection from './OffBoardingSection';
import RightsAndReceivablesSection from './RightsAndReceivablesSection';
import EmployeeBenefitsSection from './EmployeeBenefitsSection';
import ContactInfoSection from '../user/ContactInfoSection';
import EmergencyContactSection from '../user/EmergencyContactSection';
import EducationInfoSection from '../user/EducationInfoSection';

export default function PersonnelDetail({ userId, onBack }) {
  const [userDetail, setUserDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [roleEditing, setRoleEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Personel');
  const [roleSaving, setRoleSaving] = useState(false);
  const [socialSecurityEditing, setSocialSecurityEditing] = useState(false);
  const [socialSecurityNumber, setSocialSecurityNumber] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [socialSecuritySaving, setSocialSecuritySaving] = useState(false);

  useEffect(() => {
    // Giriş yapan kullanıcının rolünü localStorage'dan al
    const role = localStorage.getItem('userRole');
    setCurrentUserRole(role);
    fetchUserDetail(true); // İlk yüklemede loading göster
  }, [userId]);

  const fetchUserDetail = async (showLoading = false) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      const data = await ApiService.getUserDetail(userId);
      if (data?.data) {
        console.log('User detail fetched:', data.data);
        console.log('OffBoarding data:', data.data.offBoarding);
        console.log('User role:', data.data.role);
        setUserDetail(data.data);
        setSelectedRole(data.data.role === 'Manager' ? 'Manager' : 'Personel');
        setSocialSecurityNumber(data.data.socialSecurityNumber || '');
        setTaxNumber(data.data.taxNumber || '');
      } else {
        console.error('User detail data is missing:', data);
        setUserDetail(null);
        alert('Kullanıcı bilgileri alınamadı');
      }
    } catch (error) {
      console.error('Error fetching user detail:', error);
      setUserDetail(null);
      alert(error.message || 'Kullanıcı bilgileri yüklenirken hata oluştu');
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
      {/* Profil Fotoğrafı */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative w-28 h-28">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white shadow">
              {userDetail?.photoPath ? (
                <img
                  src={userDetail.photoPath}
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
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                {userDetail.name} {userDetail.surname}
              </h2>
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 transition-colors hover:bg-gray-100 rounded-full p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Temel Bilgiler */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Ad:</span> <span className="text-gray-900 ml-2">{userDetail.name}</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Soyad:</span> <span className="text-gray-900 ml-2">{userDetail.surname}</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">E-posta:</span> <span className="text-gray-900 ml-2">{userDetail.email}</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Telefon:</span> <span className="text-gray-900 ml-2">{userDetail.phone || '-'}</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">TC No:</span> <span className="text-gray-900 ml-2">{userDetail.tcNo || '-'}</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Sosyal Güvenlik Numarası:</span>{' '}
              {socialSecurityEditing ? (
                <input
                  type="text"
                  value={socialSecurityNumber}
                  onChange={(e) => setSocialSecurityNumber(e.target.value)}
                  className="inline-block ml-2 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  placeholder="Sosyal güvenlik numarası"
                />
              ) : (
                <span className="text-gray-900 ml-2">{userDetail.socialSecurityNumber || '-'}</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Vergi Numarası:</span>{' '}
              {socialSecurityEditing ? (
                <input
                  type="text"
                  value={taxNumber}
                  onChange={(e) => setTaxNumber(e.target.value)}
                  className="inline-block ml-2 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  placeholder="Vergi numarası"
                />
              ) : (
                <span className="text-gray-900 ml-2">{userDetail.taxNumber || '-'}</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Rol:</span>{' '}
              {roleEditing ? (
                <span className="inline-flex items-center gap-3 ml-2">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  >
                    <option value="Personel">Personel</option>
                    <option value="Manager">Yönetici</option>
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
                </span>
              ) : (
                <span className="inline-flex items-center gap-3 ml-2">
                  <span className="text-gray-900">{userDetail.role === 'Manager' ? 'Yönetici' : 'Personel'}</span>
                  <button
                    onClick={() => setRoleEditing(true)}
                    className="px-3 py-1.5 rounded-lg text-sm text-white bg-orange-500 hover:bg-orange-600 cursor-pointer"
                  >
                    Rolü Değiştir
                  </button>
                </span>
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Onay Durumu:</span>{' '}
              <span className={`inline-block ml-2 px-2 py-1 rounded text-sm font-medium ${
                userDetail.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {userDetail.isApproved ? 'Onaylandı' : 'Onay Bekliyor'}
              </span>
            </p>
          </div>
          {userDetail.approvedAt && (
            <div>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Onay Tarihi:</span> <span className="text-gray-900 ml-2">{new Date(userDetail.approvedAt).toLocaleDateString('tr-TR')}</span>
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Sosyal Güvenlik & Vergi:</span>{' '}
              {socialSecurityEditing ? (
                <span className="inline-flex items-center gap-3 ml-2">
                  <button
                    disabled={socialSecuritySaving}
                    onClick={async () => {
                      try {
                        setSocialSecuritySaving(true);
                        await ApiService.updateUser(userDetail.id, {
                          socialSecurityNumber: socialSecurityNumber || null,
                          taxNumber: taxNumber || ''
                        });
                        await fetchUserDetail();
                        setSocialSecurityEditing(false);
                      } catch (err) {
                        console.error('Social security update error:', err);
                        alert(err.message || 'Sosyal güvenlik bilgileri güncellenemedi');
                      } finally {
                        setSocialSecuritySaving(false);
                      }
                    }}
                    className={`px-3 py-2 rounded-lg text-white text-sm cursor-pointer ${socialSecuritySaving ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'}`}
                  >
                    Kaydet
                  </button>
                  <button
                    disabled={socialSecuritySaving}
                    onClick={() => {
                      setSocialSecurityNumber(userDetail.socialSecurityNumber || '');
                      setTaxNumber(userDetail.taxNumber || '');
                      setSocialSecurityEditing(false);
                    }}
                    className="px-3 py-2 rounded-lg text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 cursor-pointer"
                  >
                    Vazgeç
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => setSocialSecurityEditing(true)}
                  className="ml-2 px-3 py-1.5 rounded-lg text-sm text-white bg-orange-500 hover:bg-orange-600 cursor-pointer"
                >
                  Düzenle
                </button>
              )}
            </p>
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

      {/* Sosyal Güvenlik Bilgileri - Sadece yönetici için */}
      <div className="bg-white rounded-lg shadow p-6">
        <SocialSecuritySection 
          socialSecurity={userDetail.socialSecurity} 
          userId={userDetail.id}
          onUpdate={fetchUserDetail}
        />
        
        {/* Yasal Belgeler - Sosyal Güvenlik Bilgileri altında */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <LegalDocumentsSection 
            legalDocuments={userDetail.legalDocuments} 
            userId={userDetail.id}
            onUpdate={fetchUserDetail}
          />
        </div>
      </div>

      {/* İşten Ayrılma Bilgileri - Sadece yönetici için */}
      <div className="bg-white rounded-lg shadow p-6">
        <OffBoardingSection 
          offBoarding={userDetail.offBoarding || null} 
          userId={userDetail.id}
          onUpdate={() => fetchUserDetail(false)}
        />
      </div>

      {/* Hak ve Alacaklar - Hem personel hem yönetici görebilir, sadece yönetici düzenleyebilir */}
      <div className="bg-white rounded-lg shadow p-6">
        <RightsAndReceivablesSection 
          rightsAndReceivables={userDetail.rightsAndReceivables || null} 
          userId={userDetail.id}
          userRole={currentUserRole}
          onUpdate={() => fetchUserDetail(false)}
        />
      </div>

      {/* Yan Haklar - Ayrı form */}
      <div className="bg-white rounded-lg shadow p-6">
        <EmployeeBenefitsSection
          userId={userDetail.id}
          userRole={currentUserRole}
          onUpdate={() => fetchUserDetail(false)}
        />
      </div>
    </div>
  );
}


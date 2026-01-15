'use client';

import { useState, useEffect } from 'react';
import ApiService from '../../../../lib/api';

const TRAVEL_SUPPORT_TYPES = [
  { value: 1, label: 'Nakit' },
  { value: 2, label: 'Servis' },
  { value: 3, label: 'Şirket Aracı' },
  { value: 4, label: 'Yok' }
];

const FOOD_SUPPORT_TYPES = [
  { value: 1, label: 'Yemek Kartı' },
  { value: 2, label: 'Nakit' },
  { value: 3, label: 'Yemekhane' }
];

const BONUS_TYPES = [
  { value: 1, label: 'Performans' },
  { value: 2, label: 'Satış' },
  { value: 3, label: 'Diğer' }
];

const PAYMENT_PERIODS = [
  { value: 1, label: 'Aylık' },
  { value: 2, label: 'Üç Aylık' },
  { value: 3, label: 'Yıllık' },
  { value: 4, label: 'Düzensiz' }
];

export default function RightsAndReceivablesSection({ rightsAndReceivables, userId, userRole, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    netSalaryAmount: '',
    grossSalaryAmount: '',
    advancesReceived: '',
    unusedAnnualLeaveDays: '',
    unusedAnnualLeaveAmount: '',
    overtimeHours: '',
    overtimeAmount: '',
    travelSupportType: '',
    travelSupportDescription: '',
    travelSupportAmount: '',
    foodSupportType: '',
    foodSupportDailyAmount: '',
    foodSupportCardCompanyInfo: '',
    foodSupportDescription: '',
    bonusType: '',
    bonusPaymentPeriod: '',
    bonusAmount: '',
    bonusDescription: '',
    otherBenefitsPaymentPeriod: '',
    otherBenefitsAmount: '',
    otherBenefitsDescription: ''
  });

  // userRole kontrolü - Manager veya Manager string'i olabilir
  const isManager = userRole === 'Manager' || userRole === 'Yönetici' || userRole?.toLowerCase() === 'manager';
  
  // Debug için
  console.log('RightsAndReceivablesSection - userRole:', userRole, 'isManager:', isManager);

  useEffect(() => {
    if (rightsAndReceivables) {
      setFormData({
        netSalaryAmount: rightsAndReceivables.netSalaryAmount?.toString() || '',
        grossSalaryAmount: rightsAndReceivables.grossSalaryAmount?.toString() || '',
        advancesReceived: rightsAndReceivables.advancesReceived?.toString() || '',
        unusedAnnualLeaveDays: rightsAndReceivables.unusedAnnualLeaveDays?.toString() || '',
        unusedAnnualLeaveAmount: rightsAndReceivables.unusedAnnualLeaveAmount?.toString() || '',
        overtimeHours: rightsAndReceivables.overtimeHours?.toString() || '',
        overtimeAmount: rightsAndReceivables.overtimeAmount?.toString() || '',
        travelSupportType: rightsAndReceivables.travelSupportType?.toString() || '',
        travelSupportDescription: rightsAndReceivables.travelSupportDescription || '',
        travelSupportAmount: rightsAndReceivables.travelSupportAmount?.toString() || '',
        foodSupportType: rightsAndReceivables.foodSupportType?.toString() || '',
        foodSupportDailyAmount: rightsAndReceivables.foodSupportDailyAmount?.toString() || '',
        foodSupportCardCompanyInfo: rightsAndReceivables.foodSupportCardCompanyInfo || '',
        foodSupportDescription: rightsAndReceivables.foodSupportDescription || '',
        bonusType: rightsAndReceivables.bonusType?.toString() || '',
        bonusPaymentPeriod: rightsAndReceivables.bonusPaymentPeriod?.toString() || '',
        bonusAmount: rightsAndReceivables.bonusAmount?.toString() || '',
        bonusDescription: rightsAndReceivables.bonusDescription || '',
        otherBenefitsPaymentPeriod: rightsAndReceivables.otherBenefitsPaymentPeriod?.toString() || '',
        otherBenefitsAmount: rightsAndReceivables.otherBenefitsAmount?.toString() || '',
        otherBenefitsDescription: rightsAndReceivables.otherBenefitsDescription || ''
      });
    }
  }, [rightsAndReceivables]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updateData = {
        netSalaryAmount: parseCurrencyValue(formData.netSalaryAmount),
        grossSalaryAmount: parseCurrencyValue(formData.grossSalaryAmount),
        advancesReceived: parseCurrencyValue(formData.advancesReceived),
        unusedAnnualLeaveDays: formData.unusedAnnualLeaveDays ? parseInt(formData.unusedAnnualLeaveDays) : null,
        unusedAnnualLeaveAmount: parseCurrencyValue(formData.unusedAnnualLeaveAmount),
        overtimeHours: formData.overtimeHours ? parseInt(formData.overtimeHours) : null,
        overtimeAmount: parseCurrencyValue(formData.overtimeAmount),
        travelSupportType: formData.travelSupportType ? parseInt(formData.travelSupportType) : null,
        travelSupportDescription: formData.travelSupportDescription || null,
        travelSupportAmount: parseCurrencyValue(formData.travelSupportAmount),
        foodSupportType: formData.foodSupportType ? parseInt(formData.foodSupportType) : null,
        foodSupportDailyAmount: parseCurrencyValue(formData.foodSupportDailyAmount),
        foodSupportCardCompanyInfo: formData.foodSupportCardCompanyInfo || null,
        foodSupportDescription: formData.foodSupportDescription || null,
        bonusType: formData.bonusType ? parseInt(formData.bonusType) : null,
        bonusPaymentPeriod: formData.bonusPaymentPeriod ? parseInt(formData.bonusPaymentPeriod) : null,
        bonusAmount: parseCurrencyValue(formData.bonusAmount),
        bonusDescription: formData.bonusDescription || null,
        otherBenefitsPaymentPeriod: formData.otherBenefitsPaymentPeriod ? parseInt(formData.otherBenefitsPaymentPeriod) : null,
        otherBenefitsAmount: parseCurrencyValue(formData.otherBenefitsAmount),
        otherBenefitsDescription: formData.otherBenefitsDescription || null
      };

      console.log('=== Sending updateData ===');
      console.log('UserId:', userId);
      console.log('UpdateData:', JSON.stringify(updateData, null, 2));
      
      const result = await ApiService.updateRightsAndReceivables(userId, updateData);
      
      console.log('=== API Response ===');
      console.log('Result:', JSON.stringify(result, null, 2));
      
      // API response kontrolü
      if (result && result.success === false) {
        throw new Error(result.message || 'Bilgiler kaydedilirken hata oluştu');
      }
      
      setIsEditing(false);
      if (onUpdate) {
        await onUpdate();
      }
    } catch (error) {
      console.error('Error saving rights and receivables:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        userId,
        formData
      });
      alert(error.message || 'Bilgiler kaydedilirken hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return '';
    // Türk Lirası formatı: 50.000,00 TL
    return new Intl.NumberFormat('tr-TR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value) + ' TL';
  };

  const formatNumber = (value) => {
    if (!value && value !== 0) return '';
    return value.toString();
  };

  // Para input validasyonu - sadece rakam ve 1 virgül (küsürat için)
  const handleCurrencyInput = (value, fieldName) => {
    // Sadece rakam ve virgül kabul et
    let cleaned = value.replace(/[^\d,]/g, '');
    
    // Virgül kontrolü - sadece 1 tane virgül olabilir
    const commaIndex = cleaned.indexOf(',');
    if (commaIndex !== -1) {
      // Virgülden sonra maksimum 2 hane
      const afterComma = cleaned.substring(commaIndex + 1);
      if (afterComma.length > 2) {
        // Sadece ilk 2 haneyi al
        cleaned = cleaned.substring(0, commaIndex + 3);
      }
      
      // Birden fazla virgül varsa sadece ilkini al
      const parts = cleaned.split(',');
      if (parts.length > 2) {
        cleaned = parts[0] + ',' + parts.slice(1).join('');
      }
    }
    
    setFormData({ ...formData, [fieldName]: cleaned });
  };

  // Sayı input validasyonu - sadece rakam
  const handleNumberInput = (value, fieldName) => {
    // Sadece rakam kabul et
    const cleaned = value.replace(/[^\d]/g, '');
    setFormData({ ...formData, [fieldName]: cleaned });
  };

  // Para değerini parse et (virgülü noktaya çevir)
  const parseCurrencyValue = (value) => {
    if (!value || value === '') return null;
    // Virgülü noktaya çevir (JavaScript parseFloat için)
    const normalized = value.replace(',', '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? null : parsed;
  };

  // Para değerini formata göre göster (virgülle)
  const formatCurrencyInput = (value) => {
    if (!value && value !== 0) return '';
    // Backend'den gelen değer ondalıklı sayı olabilir, virgülle göster
    if (typeof value === 'number') {
      return value.toString().replace('.', ',');
    }
    return value.toString();
  };

  return (
    <div className="mb-6">
      {/* Başlık ve Düzenle Butonu */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Hak ve Alacaklar</h3>
        {isManager && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    if (rightsAndReceivables) {
                      setFormData({
                        netSalaryAmount: rightsAndReceivables.netSalaryAmount?.toString() || '',
                        grossSalaryAmount: rightsAndReceivables.grossSalaryAmount?.toString() || '',
                        advancesReceived: rightsAndReceivables.advancesReceived?.toString() || '',
                        unusedAnnualLeaveDays: rightsAndReceivables.unusedAnnualLeaveDays?.toString() || '',
                        unusedAnnualLeaveAmount: rightsAndReceivables.unusedAnnualLeaveAmount?.toString() || '',
                        overtimeHours: rightsAndReceivables.overtimeHours?.toString() || '',
                        overtimeAmount: rightsAndReceivables.overtimeAmount?.toString() || '',
                        travelSupportType: rightsAndReceivables.travelSupportType?.toString() || '',
                        travelSupportDescription: rightsAndReceivables.travelSupportDescription || '',
                        travelSupportAmount: rightsAndReceivables.travelSupportAmount?.toString() || '',
                        foodSupportType: rightsAndReceivables.foodSupportType?.toString() || '',
                        foodSupportDailyAmount: rightsAndReceivables.foodSupportDailyAmount?.toString() || '',
                        foodSupportCardCompanyInfo: rightsAndReceivables.foodSupportCardCompanyInfo || '',
                        foodSupportDescription: rightsAndReceivables.foodSupportDescription || '',
                        bonusType: rightsAndReceivables.bonusType?.toString() || '',
                        bonusPaymentPeriod: rightsAndReceivables.bonusPaymentPeriod?.toString() || '',
                        bonusAmount: rightsAndReceivables.bonusAmount?.toString() || '',
                        bonusDescription: rightsAndReceivables.bonusDescription || '',
                        otherBenefitsPaymentPeriod: rightsAndReceivables.otherBenefitsPaymentPeriod?.toString() || '',
                        otherBenefitsAmount: rightsAndReceivables.otherBenefitsAmount?.toString() || '',
                        otherBenefitsDescription: rightsAndReceivables.otherBenefitsDescription || ''
                      });
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer text-sm"
                >
                  İptal
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`px-4 py-2 rounded-lg text-sm cursor-pointer ${
                    isSaving ? 'bg-gray-400 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
              >
                Düzenle
              </button>
            )}
          </div>
        )}
      </div>

      {/* Ana Bilgiler */}
      <div className="mb-6 space-y-4">
        <h4 className="text-md font-semibold text-gray-700 mb-3">Ana Bilgiler</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Net Ücret Tutarı:</label>
            {isEditing && isManager ? (
              <input
                type="text"
                value={formData.netSalaryAmount}
                onChange={(e) => handleCurrencyInput(e.target.value, 'netSalaryAmount')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                placeholder=""
              />
            ) : (
              <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[42px]">
                <span className="text-gray-900">{formatCurrency(rightsAndReceivables?.netSalaryAmount)}</span>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Brüt Ücret Tutarı:</label>
            {isEditing && isManager ? (
              <input
                type="text"
                value={formData.grossSalaryAmount}
                onChange={(e) => handleCurrencyInput(e.target.value, 'grossSalaryAmount')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                placeholder=""
              />
            ) : (
              <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[42px]">
                <span className="text-gray-900">{formatCurrency(rightsAndReceivables?.grossSalaryAmount)}</span>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Alınan Avanslar:</label>
            {isEditing && isManager ? (
              <input
                type="text"
                value={formData.advancesReceived}
                onChange={(e) => handleCurrencyInput(e.target.value, 'advancesReceived')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                placeholder=""
              />
            ) : (
              <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[42px]">
                <span className="text-gray-900">{formatCurrency(rightsAndReceivables?.advancesReceived)}</span>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Kullanılmamış Yıllık İzin Süreleri:</label>
            {isEditing && isManager ? (
              <input
                type="text"
                value={formData.unusedAnnualLeaveDays}
                onChange={(e) => handleNumberInput(e.target.value, 'unusedAnnualLeaveDays')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                placeholder=""
              />
            ) : (
              <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[42px]">
                <span className="text-gray-900">
                  {rightsAndReceivables?.unusedAnnualLeaveDays != null 
                    ? `${formatNumber(rightsAndReceivables.unusedAnnualLeaveDays)} Gün` 
                    : ''}
                </span>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Kullanılmamış Yıllık İzin Ücretleri:</label>
            {isEditing && isManager ? (
              <input
                type="text"
                value={formData.unusedAnnualLeaveAmount}
                onChange={(e) => handleCurrencyInput(e.target.value, 'unusedAnnualLeaveAmount')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                placeholder=""
              />
            ) : (
              <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[42px]">
                <span className="text-gray-900">{formatCurrency(rightsAndReceivables?.unusedAnnualLeaveAmount)}</span>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Fazla Mesai Süreleri:</label>
            {isEditing && isManager ? (
              <input
                type="text"
                value={formData.overtimeHours}
                onChange={(e) => handleNumberInput(e.target.value, 'overtimeHours')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                placeholder=""
              />
            ) : (
              <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[42px]">
                <span className="text-gray-900">
                  {rightsAndReceivables?.overtimeHours != null 
                    ? `${formatNumber(rightsAndReceivables.overtimeHours)} Gün` 
                    : ''}
                </span>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Fazla Mesai Ücreti:</label>
            {isEditing && isManager ? (
              <input
                type="text"
                value={formData.overtimeAmount}
                onChange={(e) => handleCurrencyInput(e.target.value, 'overtimeAmount')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                placeholder=""
              />
            ) : (
              <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[42px]">
                <span className="text-gray-900">{formatCurrency(rightsAndReceivables?.overtimeAmount)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Yan Haklar */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-700 mb-4">Yan Haklar</h4>
        
        <div className="space-y-6">
          {/* Yol Desteği */}
          <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
            <h5 className="text-sm font-semibold text-gray-800 mb-3">Yol Desteği</h5>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tür:</label>
                {isEditing && isManager ? (
                  <select
                    value={formData.travelSupportType}
                    onChange={(e) => setFormData({ ...formData, travelSupportType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  >
                    <option value="">Seçiniz</option>
                    {TRAVEL_SUPPORT_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                ) : (
                  <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[42px]">
                    <span className="text-gray-900">{rightsAndReceivables?.travelSupportTypeName || ''}</span>
                  </div>
                )}
              </div>
              {/* Açıklama ve Tutar sadece "Yok" seçilmediğinde göster */}
              {((isEditing && isManager && formData.travelSupportType && formData.travelSupportType !== '4') || 
                (!isEditing && rightsAndReceivables?.travelSupportType && rightsAndReceivables.travelSupportType !== 4)) && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama:</label>
                    {isEditing && isManager ? (
                      <textarea
                        value={formData.travelSupportDescription}
                        onChange={(e) => setFormData({ ...formData, travelSupportDescription: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                        rows="2"
                        placeholder=""
                      />
                    ) : (
                      <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[42px]">
                        <span className="text-gray-900">{rightsAndReceivables?.travelSupportDescription || ''}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tutar:</label>
                    {isEditing && isManager ? (
                      <input
                        type="text"
                        value={formData.travelSupportAmount}
                        onChange={(e) => handleCurrencyInput(e.target.value, 'travelSupportAmount')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                        placeholder=""
                      />
                    ) : (
                      <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[42px]">
                        <span className="text-gray-900">{formatCurrency(rightsAndReceivables?.travelSupportAmount)}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Yemek Desteği */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h5 className="text-sm font-semibold text-gray-800 mb-3">Yemek Desteği</h5>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tür:</label>
                {isEditing && isManager ? (
                  <select
                    value={formData.foodSupportType}
                    onChange={(e) => setFormData({ ...formData, foodSupportType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  >
                    <option value="">Seçiniz</option>
                    {FOOD_SUPPORT_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                ) : (
                  <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[42px]">
                    <span className="text-gray-900">{rightsAndReceivables?.foodSupportTypeName || ''}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Günlük Tutar:</label>
                {isEditing && isManager ? (
                  <input
                    type="text"
                    value={formData.foodSupportDailyAmount}
                    onChange={(e) => handleCurrencyInput(e.target.value, 'foodSupportDailyAmount')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                    placeholder=""
                  />
                ) : (
                  <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[42px]">
                    <span className="text-gray-900">{formatCurrency(rightsAndReceivables?.foodSupportDailyAmount)}</span>
                  </div>
                )}
              </div>
              {/* Kart/Firma Bilgileri sadece "Yemek Kartı" (value: 1) seçildiğinde göster */}
              {((isEditing && isManager && formData.foodSupportType === '1') || 
                (!isEditing && rightsAndReceivables?.foodSupportType === 1)) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kart/Firma Bilgileri:</label>
                  {isEditing && isManager ? (
                    <input
                      type="text"
                      value={formData.foodSupportCardCompanyInfo}
                      onChange={(e) => setFormData({ ...formData, foodSupportCardCompanyInfo: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                      placeholder=""
                    />
                  ) : (
                    <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[42px]">
                      <span className="text-gray-900">{rightsAndReceivables?.foodSupportCardCompanyInfo || ''}</span>
                    </div>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama:</label>
                {isEditing && isManager ? (
                  <textarea
                    value={formData.foodSupportDescription}
                    onChange={(e) => setFormData({ ...formData, foodSupportDescription: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                    rows="2"
                  />
                ) : (
                  <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[42px]">
                    <span className="text-gray-900">{rightsAndReceivables?.foodSupportDescription || ''}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prim */}
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h5 className="text-sm font-semibold text-gray-800 mb-3">Prim</h5>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tür:</label>
                {isEditing && isManager ? (
                  <select
                    value={formData.bonusType}
                    onChange={(e) => setFormData({ ...formData, bonusType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  >
                    <option value="">Seçiniz</option>
                    {BONUS_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                ) : (
                  <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[42px]">
                    <span className="text-gray-900">{rightsAndReceivables?.bonusTypeName || ''}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ödeme Periyodu:</label>
                {isEditing && isManager ? (
                  <select
                    value={formData.bonusPaymentPeriod}
                    onChange={(e) => setFormData({ ...formData, bonusPaymentPeriod: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  >
                    <option value="">Seçiniz</option>
                    {PAYMENT_PERIODS.map(period => (
                      <option key={period.value} value={period.value}>{period.label}</option>
                    ))}
                  </select>
                ) : (
                  <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[42px]">
                    <span className="text-gray-900">{rightsAndReceivables?.bonusPaymentPeriodName || ''}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tutar:</label>
                {isEditing && isManager ? (
                  <input
                    type="text"
                    value={formData.bonusAmount}
                    onChange={(e) => handleCurrencyInput(e.target.value, 'bonusAmount')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                    placeholder=""
                  />
                ) : (
                  <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[42px]">
                    <span className="text-gray-900">{formatCurrency(rightsAndReceivables?.bonusAmount)}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama:</label>
                {isEditing && isManager ? (
                  <textarea
                    value={formData.bonusDescription}
                    onChange={(e) => setFormData({ ...formData, bonusDescription: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                    rows="2"
                  />
                ) : (
                  <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[42px]">
                    <span className="text-gray-900">{rightsAndReceivables?.bonusDescription || ''}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Diğer Yan Haklar */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h5 className="text-sm font-semibold text-gray-800 mb-3">Diğer Yan Haklar</h5>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ödeme Periyodu:</label>
                {isEditing && isManager ? (
                  <select
                    value={formData.otherBenefitsPaymentPeriod}
                    onChange={(e) => setFormData({ ...formData, otherBenefitsPaymentPeriod: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  >
                    <option value="">Seçiniz</option>
                    {PAYMENT_PERIODS.map(period => (
                      <option key={period.value} value={period.value}>{period.label}</option>
                    ))}
                  </select>
                ) : (
                  <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[42px]">
                    <span className="text-gray-900">{rightsAndReceivables?.otherBenefitsPaymentPeriodName || ''}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tutar:</label>
                {isEditing && isManager ? (
                  <input
                    type="text"
                    value={formData.otherBenefitsAmount}
                    onChange={(e) => handleCurrencyInput(e.target.value, 'otherBenefitsAmount')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                    placeholder=""
                  />
                ) : (
                  <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[42px]">
                    <span className="text-gray-900">{formatCurrency(rightsAndReceivables?.otherBenefitsAmount)}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama:</label>
                {isEditing && isManager ? (
                  <textarea
                    value={formData.otherBenefitsDescription}
                    onChange={(e) => setFormData({ ...formData, otherBenefitsDescription: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                    rows="2"
                  />
                ) : (
                  <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-h-[42px]">
                    <span className="text-gray-900">{rightsAndReceivables?.otherBenefitsDescription || ''}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

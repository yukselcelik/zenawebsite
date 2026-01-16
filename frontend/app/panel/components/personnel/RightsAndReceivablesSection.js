'use client';

import { useState, useEffect } from 'react';
import ApiService from '../../../../lib/api';

export default function RightsAndReceivablesSection({ rightsAndReceivables, userId, userRole, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Accordion state'leri - başlangıçta kapalı
  const [showMainInfo, setShowMainInfo] = useState(false);

  const [formData, setFormData] = useState({
    netSalaryAmount: '',
    grossSalaryAmount: '',
    advancesReceived: '',
    unusedAnnualLeaveDays: '',
    unusedAnnualLeaveAmount: '',
    overtimeHours: '',
    overtimeAmount: ''
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
        overtimeAmount: rightsAndReceivables.overtimeAmount?.toString() || ''
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
        overtimeAmount: parseCurrencyValue(formData.overtimeAmount)
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

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (rightsAndReceivables) {
      setFormData({
        netSalaryAmount: rightsAndReceivables.netSalaryAmount?.toString() || '',
        grossSalaryAmount: rightsAndReceivables.grossSalaryAmount?.toString() || '',
        advancesReceived: rightsAndReceivables.advancesReceived?.toString() || '',
        unusedAnnualLeaveDays: rightsAndReceivables.unusedAnnualLeaveDays?.toString() || '',
        unusedAnnualLeaveAmount: rightsAndReceivables.unusedAnnualLeaveAmount?.toString() || '',
        overtimeHours: rightsAndReceivables.overtimeHours?.toString() || '',
        overtimeAmount: rightsAndReceivables.overtimeAmount?.toString() || ''
      });
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
      {/* Ana Başlık - Sola Hizalı */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Ana Bilgiler</h3>
        </div>
      </div>

      {/* Ana Bilgiler - Accordion */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowMainInfo(!showMainInfo)}
          className="flex items-center justify-between w-full mb-4 text-left hover:bg-gray-50 p-3 rounded-lg transition-colors border border-gray-200"
        >
          <h4 className="text-md font-semibold text-gray-700">Ana Bilgiler</h4>
          <svg
            className="w-5 h-5 text-gray-600 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {showMainInfo ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            )}
          </svg>
        </button>
        
        {showMainInfo && (
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
                    ? `${formatNumber(rightsAndReceivables.overtimeHours)} Saat` 
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
        )}
      </div>

      {/* Form Altı Aksiyonlar (best practice: tek yerden yönetim) */}
      {isManager && (
        <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-2 justify-end">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className={`px-4 py-2 rounded-lg text-sm ${
                  isSaving ? 'bg-gray-400 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Düzenle
            </button>
          )}
        </div>
      )}
    </div>
  );
}

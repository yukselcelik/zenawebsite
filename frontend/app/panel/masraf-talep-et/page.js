'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ApiService from '../../../lib/api';

const EXPENSE_TYPES = [
  { value: 1, label: 'Yemek' },
  { value: 2, label: 'Konaklama' },
  { value: 3, label: 'Ulaşım' },
  { value: 4, label: 'Ağırlama' },
  { value: 5, label: 'Ofis Giderleri' },
  { value: 6, label: 'İletişim ve Teknoloji Giderleri' },
  { value: 7, label: 'Personel ve Organizasyon Giderleri' },
  { value: 8, label: 'Bakım, Onarım ve Hizmet Giderleri' },
  { value: 9, label: 'Finansal ve Resmi Giderler' },
  { value: 10, label: 'Diğer Giderler' }
];

export default function MasrafTalepEtPage() {
  const [formData, setFormData] = useState({
    requestDate: '',
    expenseType: '',
    requestedAmount: '',
    description: ''
  });
  const [dateInput, setDateInput] = useState({ day: '', month: '', year: '' });
  const [documentFile, setDocumentFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Tarih input handler - gg.aa.yyyy formatı
  const handleDateInput = (field, value) => {
    // Sadece rakam kabul et
    const cleaned = value.replace(/[^\d]/g, '');
    
    let newDateInput = { ...dateInput };
    
    if (field === 'day') {
      // Gün: maksimum 2 rakam, 01-31 arası
      if (cleaned.length <= 2) {
        newDateInput.day = cleaned;
        if (cleaned.length === 2 && (parseInt(cleaned) < 1 || parseInt(cleaned) > 31)) {
          return; // Geçersiz gün
        }
      }
    } else if (field === 'month') {
      // Ay: maksimum 2 rakam, 01-12 arası
      if (cleaned.length <= 2) {
        newDateInput.month = cleaned;
        if (cleaned.length === 2 && (parseInt(cleaned) < 1 || parseInt(cleaned) > 12)) {
          return; // Geçersiz ay
        }
      }
    } else if (field === 'year') {
      // Yıl: maksimum 4 rakam
      if (cleaned.length <= 4) {
        newDateInput.year = cleaned;
      }
    }
    
    setDateInput(newDateInput);
    
    // Tarihi ISO formatına çevir (YYYY-MM-DD)
    if (newDateInput.day.length === 2 && newDateInput.month.length === 2 && newDateInput.year.length === 4) {
      const day = parseInt(newDateInput.day);
      const month = parseInt(newDateInput.month);
      const year = parseInt(newDateInput.year);
      
      // Tarih validasyonu
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 2000 && year <= 2100) {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setFormData({ ...formData, requestDate: dateStr });
      }
    } else {
      setFormData({ ...formData, requestDate: '' });
    }
  };

  // Para input validasyonu - sadece rakam ve 1 virgül (küsürat için)
  const handleCurrencyInput = (value) => {
    let cleaned = value.replace(/[^\d,]/g, '');
    
    const commaIndex = cleaned.indexOf(',');
    if (commaIndex !== -1) {
      const afterComma = cleaned.substring(commaIndex + 1);
      if (afterComma.length > 2) {
        cleaned = cleaned.substring(0, commaIndex + 3);
      }
      
      const parts = cleaned.split(',');
      if (parts.length > 2) {
        cleaned = parts[0] + ',' + parts.slice(1).join('');
      }
    }
    
    setFormData({ ...formData, requestedAmount: cleaned });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Dosya boyutu 10MB\'dan büyük olamaz');
        return;
      }
      setDocumentFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validasyon
    if (!formData.requestDate) {
      setError('Talep tarihi seçilmelidir');
      return;
    }

    if (!formData.expenseType) {
      setError('Masraf türü seçilmelidir');
      return;
    }

    if (!formData.requestedAmount || parseFloat(formData.requestedAmount.replace(',', '.')) <= 0) {
      setError('Talep edilen tutar girilmelidir');
      return;
    }

    if (!formData.description.trim()) {
      setError('Açıklama girilmelidir');
      return;
    }

    setIsLoading(true);

    try {
      const amount = parseFloat(formData.requestedAmount.replace(',', '.'));
      
      const result = await ApiService.createExpenseRequest(
        {
          requestDate: formData.requestDate,
          expenseType: parseInt(formData.expenseType),
          requestedAmount: amount,
          description: formData.description
        },
        documentFile
      );

      if (result && result.success) {
        setSuccess('Masraf talebiniz başarıyla oluşturuldu!');
        // Formu temizle
        setFormData({
          requestDate: '',
          expenseType: '',
          requestedAmount: '',
          description: ''
        });
        setDateInput({ day: '', month: '', year: '' });
        setDocumentFile(null);
        const fileInput = document.getElementById('documentFile');
        if (fileInput) fileInput.value = '';
        
        setTimeout(() => {
          router.push('/panel/masraf-taleplerim');
        }, 2000);
      } else {
        setError(result?.message || 'Masraf talebi oluşturulurken hata oluştu');
      }
    } catch (error) {
      console.error('Error creating expense request:', error);
      setError(error.message || 'Masraf talebi oluşturulurken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Masraf Talep Et</h1>
        <p className="text-gray-600 mt-2">
          Masraf talebinizi oluşturmak için aşağıdaki formu doldurunuz.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Talep Tarihi ve Talep Numarası */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Talep Tarihi: <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={dateInput.day}
                  onChange={(e) => handleDateInput('day', e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value.length === 1) {
                      setDateInput({ ...dateInput, day: e.target.value.padStart(2, '0') });
                    }
                  }}
                  className="w-16 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 text-center"
                  placeholder="gg"
                  maxLength={2}
                  inputMode="numeric"
                />
                <span className="text-gray-500">.</span>
                <input
                  type="text"
                  value={dateInput.month}
                  onChange={(e) => handleDateInput('month', e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value.length === 1) {
                      setDateInput({ ...dateInput, month: e.target.value.padStart(2, '0') });
                    }
                  }}
                  className="w-16 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 text-center"
                  placeholder="aa"
                  maxLength={2}
                  inputMode="numeric"
                />
                <span className="text-gray-500">.</span>
                <input
                  type="text"
                  value={dateInput.year}
                  onChange={(e) => handleDateInput('year', e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 text-center"
                  placeholder="yyyy"
                  maxLength={4}
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Talep Numarası:
              </label>
              <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                <span className="text-gray-500 italic">Sistem tarafından otomatik oluşturulacak</span>
              </div>
            </div>
          </div>

          {/* Masraf Türü */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Masraf Türü: <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.expenseType}
              onChange={(e) => setFormData({ ...formData, expenseType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
              required
            >
              <option value="">Seçiniz</option>
              {EXPENSE_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Talep Edilen Tutar */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Talep Edilen Tutar (TL): <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.requestedAmount}
              onChange={(e) => handleCurrencyInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
              placeholder=""
              required
            />
            <p className="text-xs text-gray-500 mt-1">Sadece rakam giriniz. Küsürat için virgül kullanabilirsiniz (örn: 1500,50)</p>
          </div>

          {/* Açıklama */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama: <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
              rows="4"
              placeholder="Masraf açıklamasını giriniz"
              required
            />
          </div>

          {/* Fatura/Fiş/Belge */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fatura/Fiş/Belge:
            </label>
            <div className="space-y-3">
              <input
                id="documentFile"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
              />
              {documentFile && (
                <div className="text-sm text-gray-600">
                  Seçilen dosya: <span className="font-medium">{documentFile.name}</span>
                </div>
              )}
              <p className="text-xs text-gray-500">PDF, JPG, PNG formatları kabul edilir. Maksimum dosya boyutu: 10MB</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg text-white cursor-pointer ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {isLoading ? 'Gönderiliyor...' : 'Talep Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

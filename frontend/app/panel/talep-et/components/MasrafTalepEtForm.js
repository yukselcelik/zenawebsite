'use client';

import { useEffect, useRef, useState } from 'react';
import ApiService from '../../../../lib/api';

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

export default function MasrafTalepEtForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    requestDate: '',
    expenseType: '',
    requestedAmount: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [documentFile, setDocumentFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  // Default date = today for better UX
  useEffect(() => {
    if (!formData.requestDate) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setFormData((p) => ({ ...p, requestDate: `${yyyy}-${mm}-${dd}` }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const setFile = (file) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Dosya boyutu 10MB\'dan büyük olamaz');
        return;
      }
      setDocumentFile(file);
      setError('');
      setErrors((p) => ({ ...p, documentFile: undefined }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    setFile(file);
  };

  const validate = () => {
    const next = {};

    if (!formData.requestDate) next.requestDate = 'Talep tarihi seçilmelidir';
    if (!formData.expenseType) next.expenseType = 'Masraf türü seçilmelidir';

    const amount = parseFloat((formData.requestedAmount || '').replace(',', '.'));
    if (!formData.requestedAmount || isNaN(amount) || amount <= 0) {
      next.requestedAmount = 'Talep edilen tutar girilmelidir';
    }

    if (!formData.description.trim()) next.description = 'Açıklama girilmelidir';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setErrors({});

    if (!validate()) return;

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
          requestDate: formData.requestDate, // keep last selected date for speed
          expenseType: '',
          requestedAmount: '',
          description: ''
        });
        setDocumentFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        setTimeout(() => {
          if (onSuccess) onSuccess();
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
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Masraf Talep Et</h2>
      </div>

      {error && (
        <div className="mb-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Küçük alanlar - aynı satır */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Talep Tarihi */}
          <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between gap-3 mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Talep Tarihi <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    const yyyy = d.getFullYear();
                    const mm = String(d.getMonth() + 1).padStart(2, '0');
                    const dd = String(d.getDate()).padStart(2, '0');
                    setFormData((p) => ({ ...p, requestDate: `${yyyy}-${mm}-${dd}` }));
                  }}
                  className="text-xs px-2 py-1 rounded border border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                >
                  Bugün
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() - 1);
                    const yyyy = d.getFullYear();
                    const mm = String(d.getMonth() + 1).padStart(2, '0');
                    const dd = String(d.getDate()).padStart(2, '0');
                    setFormData((p) => ({ ...p, requestDate: `${yyyy}-${mm}-${dd}` }));
                  }}
                  className="text-xs px-2 py-1 rounded border border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                >
                  Dün
                </button>
              </div>
            </div>
            <input
              type="date"
              value={formData.requestDate}
              onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white ${
                errors.requestDate ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.requestDate && <p className="text-xs text-red-400 mt-1">{errors.requestDate}</p>}
          </div>

          {/* Masraf Türü */}
          <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Masraf Türü: <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.expenseType}
              onChange={(e) => setFormData({ ...formData, expenseType: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white ${
                errors.expenseType ? 'border-red-500' : 'border-gray-600'
              }`}
              required
            >
              <option value="" className="bg-gray-700">Seçiniz</option>
              {EXPENSE_TYPES.map(type => (
                <option key={type.value} value={type.value} className="bg-gray-700">{type.label}</option>
              ))}
            </select>
            {errors.expenseType && <p className="text-xs text-red-400 mt-1">{errors.expenseType}</p>}
          </div>

          {/* Talep Edilen Tutar */}
          <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Talep Edilen Tutar (TL): <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₺</span>
              <input
                type="text"
                inputMode="decimal"
                value={formData.requestedAmount}
                onChange={(e) => handleCurrencyInput(e.target.value)}
                className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white placeholder-gray-400 ${
                  errors.requestedAmount ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="0,00"
                required
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Örn: 1500,50</p>
            {errors.requestedAmount && <p className="text-xs text-red-400 mt-1">{errors.requestedAmount}</p>}
          </div>
        </div>

        {/* Açıklama */}
        <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Açıklama: <span className="text-red-400">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white placeholder-gray-400 ${
              errors.description ? 'border-red-500' : 'border-gray-600'
            }`}
            rows="4"
            placeholder="Kısa ama net bir açıklama yazın (örn: müşteri toplantısı yemeği)"
            required
          />
          {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
        </div>

        {/* Fatura/Fiş/Belge */}
        <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Fatura/Fiş/Belge:
          </label>
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-gray-300">
                  <div className="font-medium text-white">Belge ekle (opsiyonel)</div>
                  <div className="text-xs text-gray-400">Sürükle-bırak yapın veya dosya seçin (PDF/JPG/PNG, max 10MB)</div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click?.()}
                  className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 hover:bg-gray-600 text-sm text-gray-300 transition-colors"
                >
                  Dosya Seç
                </button>
              </div>
            </div>
            {documentFile && (
              <div className="flex items-center justify-between gap-3 text-sm text-gray-300 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3">
                <div className="truncate">
                  Seçilen dosya: <span className="font-medium text-white">{documentFile.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDocumentFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Kaldır
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg text-white transition-all ${
              isLoading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/50'
            }`}
          >
            {isLoading ? 'Gönderiliyor...' : 'Talep Oluştur'}
          </button>
        </div>
      </form>
    </div>
  );
}


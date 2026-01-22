'use client';

import { useState } from 'react';
import ApiService from '../../../../lib/api';

export default function DigerTaleplerForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validate = () => {
    const next = {};

    if (!formData.title || formData.title.trim().length < 3) {
      next.title = 'Başlık girilmelidir (en az 3 karakter)';
    }

    if (!formData.description || formData.description.trim().length < 10) {
      next.description = 'Açıklama girilmelidir (en az 10 karakter)';
    }

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
      const result = await ApiService.createOtherRequest({
        title: formData.title.trim(),
        description: formData.description.trim()
      });
      
      if (result && result.success) {
      setSuccess('Talebiniz alınmıştır. En kısa sürede değerlendirilecektir.');
      
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
      } else {
        setError(result?.message || 'Talep oluşturulurken hata oluştu');
      }
    } catch (error) {
      console.error('Error creating other request:', error);
      setError(error.message || 'Talep oluşturulurken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Diğer Talepler</h2>
      </div>

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
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Başlık <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Talep başlığını giriniz"
            required
          />
          {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Açıklama <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            rows="6"
            placeholder="Talebinizi detaylı olarak açıklayın..."
            required
          />
          {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg text-white ${
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
  );
}


'use client';

import { useState } from 'react';
import ApiService from '../../../../lib/api';

export default function CreateLeaveRequest({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const todayStr = new Date().toISOString().slice(0, 10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Basit doğrulamalar
      if (!formData.startDate || !formData.endDate) {
        throw new Error('Lütfen başlangıç ve bitiş tarihlerini seçiniz.');
      }
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const today = new Date(todayStr);
      if (start < today) {
        throw new Error('Başlangıç tarihi bugünden önce olamaz.');
      }
      if (end < start) {
        throw new Error('Bitiş tarihi başlangıç tarihinden önce olamaz.');
      }
      if (!formData.reason || formData.reason.trim().length < 5) {
        throw new Error('Lütfen geçerli bir izin sebebi giriniz (en az 5 karakter).');
      }

      await ApiService.createLeaveRequest({
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason
      });

      // Formu temizle
      setFormData({ startDate: '', endDate: '', reason: '' });
      
      // Başarılı olduğunda parent'a bildir
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating leave request:', error);
      setError(error.message || 'İzin talebi oluşturulurken hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={onCancel}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-900/20 border border-red-800 text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Başlangıç Tarihi */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">
              Başlangıç Tarihi <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              required
            min={todayStr}
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white bg-gray-700"
            />
          </div>

          {/* Bitiş Tarihi */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-2">
              Bitiş Tarihi <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              min={formData.startDate}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white bg-gray-700"
            />
          </div>

          {/* Sebep */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-2">
              Sebep <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              required
              rows={6}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white bg-gray-700 resize-none placeholder:text-gray-400"
              placeholder="İzin talebinizin sebebini detaylı olarak açıklayın..."
            />
          </div>

          {/* Butonlar */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 border border-gray-600 rounded-lg text-gray-200 bg-gray-700 font-medium hover:bg-gray-600 transition-colors cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {submitting ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


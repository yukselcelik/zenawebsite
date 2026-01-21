'use client';

import { useState } from 'react';
import ApiService from '../../../../lib/api';

const MEETING_ROOMS = {
  TONYUKUK: 'tonyukuk',
  ATATURK: 'atatürk'
};

const MEETING_ROOM_LABELS = {
  [MEETING_ROOMS.TONYUKUK]: 'Tonyukuk Toplantı Salonu',
  [MEETING_ROOMS.ATATURK]: 'Mustafa Kemal Atatürk Toplantı Salonu'
};

export default function ToplantiOdasiTalepEtForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    meetingRoom: '',
    date: '',
    startTime: '',
    endTime: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const todayStr = new Date().toISOString().slice(0, 10);

  const validate = () => {
    const next = {};

    if (!formData.meetingRoom) {
      next.meetingRoom = 'Toplantı salonu seçilmelidir';
    }

    if (!formData.date) {
      next.date = 'Tarih seçilmelidir';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date(todayStr);
      if (selectedDate < today) {
        next.date = 'Tarih bugünden önce olamaz';
      }
    }

    if (!formData.startTime) {
      next.startTime = 'Başlangıç saati seçilmelidir';
    }

    if (!formData.endTime) {
      next.endTime = 'Bitiş saati seçilmelidir';
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(`${formData.date}T${formData.startTime}`);
      const end = new Date(`${formData.date}T${formData.endTime}`);
      if (end <= start) {
        next.endTime = 'Bitiş saati başlangıç saatinden sonra olmalıdır';
      }
    }

    if (!formData.description || formData.description.trim().length < 5) {
      next.description = 'Açıklama girilmelidir (en az 5 karakter)';
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
      const meetingData = {
        meetingRoom: formData.meetingRoom,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        description: formData.description
      };

      const result = await ApiService.createMeetingRoomRequest(meetingData);

      if (result && result.success) {
        setSuccess('Toplantı odası talebiniz başarıyla oluşturuldu!');
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 2000);
      } else {
        setError(result?.message || 'Toplantı odası talebi oluşturulurken hata oluştu');
      }
    } catch (error) {
      console.error('Error creating meeting room request:', error);
      setError(error.message || 'Toplantı odası talebi oluşturulurken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Toplantı Odası Kullanımı Talep Et</h2>
        <p className="text-gray-600 mt-2">
          Toplantı salonu rezervasyonu için aşağıdaki formu doldurunuz.
        </p>
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
            Toplantı Salonu <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.meetingRoom}
            onChange={(e) => setFormData({ ...formData, meetingRoom: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 ${
              errors.meetingRoom ? 'border-red-300' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Seçiniz</option>
            <option value={MEETING_ROOMS.TONYUKUK}>{MEETING_ROOM_LABELS[MEETING_ROOMS.TONYUKUK]}</option>
            <option value={MEETING_ROOMS.ATATURK}>{MEETING_ROOM_LABELS[MEETING_ROOMS.ATATURK]}</option>
          </select>
          {errors.meetingRoom && <p className="text-xs text-red-600 mt-1">{errors.meetingRoom}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tarih <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              min={todayStr}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 ${
                errors.date ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Başlangıç Saati <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 ${
                errors.startTime ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            {errors.startTime && <p className="text-xs text-red-600 mt-1">{errors.startTime}</p>}
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bitiş Saati <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 ${
                errors.endTime ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            {errors.endTime && <p className="text-xs text-red-600 mt-1">{errors.endTime}</p>}
          </div>
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
            rows="4"
            placeholder="Toplantı hakkında kısa bir açıklama yazın..."
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


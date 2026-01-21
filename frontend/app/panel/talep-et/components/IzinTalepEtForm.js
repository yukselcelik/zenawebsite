'use client';

import { useState, useEffect } from 'react';
import ApiService from '../../../../lib/api';

const LEAVE_TYPES = {
  ANNUAL: 'annual',
  UNPAID: 'unpaid',
  HOURLY: 'hourly',
  EXCUSE: 'excuse'
};

const LEAVE_TYPE_LABELS = {
  [LEAVE_TYPES.ANNUAL]: 'Yıllık İzin Talep Et',
  [LEAVE_TYPES.UNPAID]: 'Ücretsiz İzin Talep Et',
  [LEAVE_TYPES.HOURLY]: 'Saatlik İzin Talep Et',
  [LEAVE_TYPES.EXCUSE]: 'Mazeret İzni Talep Et'
};

export default function IzinTalepEtForm({ onSuccess, onCancel }) {
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    days: '',
    hours: '',
    reason: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableDays, setAvailableDays] = useState(null);

  useEffect(() => {
    // Kullanıcının yıllık izin bilgilerini çek
    const fetchUserInfo = async () => {
      try {
        const profile = await ApiService.getProfile();
        if (profile?.data?.id) {
          const userDetail = await ApiService.getUserDetail(profile.data.id);
          if (userDetail?.data?.rightsAndReceivables) {
            setAvailableDays(userDetail.data.rightsAndReceivables.unusedAnnualLeaveDays);
          }
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };
    fetchUserInfo();
  }, []);

  const handleLeaveTypeSelect = (type) => {
    setSelectedLeaveType(type);
    setFormData({
      leaveType: type,
      startDate: '',
      endDate: '',
      days: '',
      hours: '',
      reason: ''
    });
    setErrors({});
    setError('');
  };

  const validate = () => {
    const next = {};

    if (!formData.leaveType) {
      next.leaveType = 'İzin türü seçilmelidir';
    }

    if (formData.leaveType === LEAVE_TYPES.ANNUAL) {
      if (!formData.days || parseInt(formData.days) <= 0) {
        next.days = 'Gün sayısı girilmelidir';
      } else if (availableDays !== null && parseInt(formData.days) > availableDays) {
        next.days = `Kalan yıllık izin gününüz ${availableDays} gündür`;
      }
      if (!formData.startDate) next.startDate = 'Başlangıç tarihi seçilmelidir';
    } else if (formData.leaveType === LEAVE_TYPES.HOURLY) {
      if (!formData.hours || parseInt(formData.hours) <= 0) {
        next.hours = 'Saat sayısı girilmelidir';
      }
      if (!formData.startDate) next.startDate = 'Tarih seçilmelidir';
    } else {
      if (!formData.startDate) next.startDate = 'Başlangıç tarihi seçilmelidir';
      if (!formData.endDate) next.endDate = 'Bitiş tarihi seçilmelidir';
      if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
        next.endDate = 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır';
      }
    }

    if (!formData.reason || formData.reason.trim().length < 5) {
      next.reason = 'Sebep girilmelidir (en az 5 karakter)';
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
      let startDate, endDate;

      if (formData.leaveType === LEAVE_TYPES.ANNUAL) {
        // Yıllık izin için sadece başlangıç tarihi ve gün sayısı
        startDate = new Date(formData.startDate);
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + parseInt(formData.days) - 1);
      } else if (formData.leaveType === LEAVE_TYPES.HOURLY) {
        // Saatlik izin için sadece tarih
        startDate = new Date(formData.startDate);
        endDate = new Date(formData.startDate);
      } else {
        startDate = new Date(formData.startDate);
        endDate = new Date(formData.endDate);
      }

      const leaveData = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        reason: formData.reason,
        leaveType: formData.leaveType,
        days: formData.leaveType === LEAVE_TYPES.ANNUAL ? parseInt(formData.days) : null,
        hours: formData.leaveType === LEAVE_TYPES.HOURLY ? parseInt(formData.hours) : null
      };

      const result = await ApiService.createLeaveRequest(leaveData);

      if (result && result.success) {
        setSuccess('İzin talebiniz başarıyla oluşturuldu!');
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 2000);
      } else {
        setError(result?.message || 'İzin talebi oluşturulurken hata oluştu');
      }
    } catch (error) {
      console.error('Error creating leave request:', error);
      setError(error.message || 'İzin talebi oluşturulurken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  if (!selectedLeaveType) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">İzin Talep Et</h2>
          <p className="text-gray-600 mt-2">
            Talep etmek istediğiniz izin türünü seçiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => handleLeaveTypeSelect(LEAVE_TYPES.ANNUAL)}
            className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-800 mb-2">Yıllık İzin Talep Et</h3>
            <p className="text-sm text-gray-600">
              {availableDays !== null ? `Kalan izin gününüz: ${availableDays} gün` : 'Yıllık izin talebi oluşturun'}
            </p>
          </div>

          <div
            onClick={() => handleLeaveTypeSelect(LEAVE_TYPES.UNPAID)}
            className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-800 mb-2">Ücretsiz İzin Talep Et</h3>
            <p className="text-sm text-gray-600">Ücretsiz izin talebi oluşturun</p>
          </div>

          <div
            onClick={() => handleLeaveTypeSelect(LEAVE_TYPES.HOURLY)}
            className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-800 mb-2">Saatlik İzin Talep Et</h3>
            <p className="text-sm text-gray-600">Saatlik izin talebi oluşturun</p>
          </div>

          <div
            onClick={() => handleLeaveTypeSelect(LEAVE_TYPES.EXCUSE)}
            className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-800 mb-2">Mazeret İzni Talep Et</h3>
            <p className="text-sm text-gray-600">Mazeret izni talebi oluşturun</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            İptal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setSelectedLeaveType(null)}
            className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-gray-800">{LEAVE_TYPE_LABELS[selectedLeaveType]}</h2>
        </div>
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
        {formData.leaveType === LEAVE_TYPES.ANNUAL && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gün Sayısı <span className="text-red-500">*</span>
              {availableDays !== null && (
                <span className="text-xs text-gray-500 ml-2">(Kalan: {availableDays} gün)</span>
              )}
            </label>
            <input
              type="number"
              min="1"
              max={availableDays || 365}
              value={formData.days}
              onChange={(e) => setFormData({ ...formData, days: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 ${
                errors.days ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            {errors.days && <p className="text-xs text-red-600 mt-1">{errors.days}</p>}
          </div>
        )}

        {formData.leaveType === LEAVE_TYPES.HOURLY && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Saat Sayısı <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="8"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 ${
                errors.hours ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            {errors.hours && <p className="text-xs text-red-600 mt-1">{errors.hours}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.leaveType === LEAVE_TYPES.HOURLY ? 'Tarih' : 'Başlangıç Tarihi'} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              min={todayStr}
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 ${
                errors.startDate ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            {errors.startDate && <p className="text-xs text-red-600 mt-1">{errors.startDate}</p>}
          </div>

          {formData.leaveType !== LEAVE_TYPES.ANNUAL && formData.leaveType !== LEAVE_TYPES.HOURLY && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bitiş Tarihi <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                min={formData.startDate || todayStr}
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 ${
                  errors.endDate ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.endDate && <p className="text-xs text-red-600 mt-1">{errors.endDate}</p>}
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sebep <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 ${
              errors.reason ? 'border-red-300' : 'border-gray-300'
            }`}
            rows="4"
            placeholder="İzin talebinizin sebebini detaylı olarak açıklayın..."
            required
          />
          {errors.reason && <p className="text-xs text-red-600 mt-1">{errors.reason}</p>}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setSelectedLeaveType(null)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Geri
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


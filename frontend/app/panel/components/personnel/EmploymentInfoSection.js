'use client';

import { useState } from 'react';
import ApiService from '../../../../lib/api';
import ConfirmDialog from '../common/ConfirmDialog';

export default function EmploymentInfoSection({ employmentInfos, userId, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    position: '',
    workType: 'FullTime',
    contractType: 'FixedTerm',
    workplaceNumber: ''
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [employmentInfoToDelete, setEmploymentInfoToDelete] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await ApiService.createEmploymentInfo({
        userId: userId,
        startDate: formData.startDate,
        position: formData.position,
        workType: formData.workType,
        contractType: formData.contractType,
        workplaceNumber: formData.workplaceNumber
      });
      setShowForm(false);
      setFormData({
        startDate: '',
        position: '',
        workType: 'FullTime',
        contractType: 'FixedTerm',
        workplaceNumber: ''
      });
      onUpdate();
    } catch (error) {
      console.error('Error adding employment info:', error);
    }
  };

  const handleDelete = (employmentInfoId) => {
    setEmploymentInfoToDelete(employmentInfoId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!employmentInfoToDelete) return;
    try {
      setConfirmLoading(true);
      await ApiService.deleteEmploymentInfo(employmentInfoToDelete);
      setConfirmOpen(false);
      setEmploymentInfoToDelete(null);
      onUpdate();
    } catch (error) {
      console.error('Error deleting employment info:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">İstihdam Bilgileri</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
        >
          {showForm ? 'İptal' : 'Yeni Ekle'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-6 p-4 bg-gray-900/30 border border-gray-700 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Başlangıç Tarihi</label>
            <input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Pozisyon</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Çalışma Tipi</label>
            <select
              value={formData.workType}
              onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white cursor-pointer"
            >
              <option value="FullTime" className="bg-gray-700">Tam Zamanlı</option>
              <option value="PartTime" className="bg-gray-700">Yarı Zamanlı</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sözleşme Tipi</label>
            <select
              value={formData.contractType}
              onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white cursor-pointer"
            >
              <option value="FixedTerm" className="bg-gray-700">Belirli Süreli</option>
              <option value="Continuous" className="bg-gray-700">Sürekli</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">İş Yeri Numarası</label>
            <input
              type="text"
              value={formData.workplaceNumber}
              onChange={(e) => setFormData({ ...formData, workplaceNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white cursor-pointer"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormData({
                  startDate: '',
                  position: '',
                  workType: 'FullTime',
                  contractType: 'FixedTerm',
                  workplaceNumber: ''
                });
              }}
              className="px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg text-gray-200 hover:bg-gray-600 cursor-pointer transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg cursor-pointer"
            >
              Kaydet
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {employmentInfos && employmentInfos.length > 0 ? (
          employmentInfos.map((emp) => (
            <div key={emp.id} className="border border-gray-700 bg-gray-900/30 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-gray-300"><span className="font-medium text-gray-200">Pozisyon:</span> {emp.position || '-'}</p>
                  <p className="text-sm text-gray-300"><span className="font-medium text-gray-200">Başlangıç:</span> {new Date(emp.startDate).toLocaleDateString('tr-TR')}</p>
                  <p className="text-sm text-gray-300"><span className="font-medium text-gray-200">Çalışma Tipi:</span> {emp.workType === 'FullTime' ? 'Tam Zamanlı' : 'Yarı Zamanlı'}</p>
                  <p className="text-sm text-gray-300"><span className="font-medium text-gray-200">Sözleşme Tipi:</span> {emp.contractType === 'FixedTerm' ? 'Belirli Süreli' : 'Sürekli'}</p>
                  {emp.workplaceNumber && (
                    <p className="text-sm text-gray-300"><span className="font-medium text-gray-200">İş Yeri No:</span> {emp.workplaceNumber}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(emp.id)}
                  className="text-red-300 hover:text-red-200 text-sm cursor-pointer"
                >
                  Sil
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">İstihdam bilgisi bulunmamaktadır.</p>
        )}
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="İstihdam bilgisini silmek istediğinize emin misiniz?"
        message="Bu işlem geri alınamaz. İstihdam bilgisi kalıcı olarak silinecektir."
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        loading={confirmLoading}
        onCancel={() => {
          setConfirmOpen(false);
          setEmploymentInfoToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}


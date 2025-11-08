'use client';

import { useState } from 'react';
import ApiService from '../../../../lib/api';

export default function EducationInfoSection({ educationInfos, userId, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    university: '',
    department: '',
    graduationYear: '',
    certification: ''
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        educationInfos: [
          ...educationInfos.map(e => ({
            id: e.id,
            university: e.university,
            department: e.department,
            graduationYear: e.graduationYear,
            certification: e.certification
          })),
          {
            id: 0,
            university: formData.university,
            department: formData.department,
            graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : null,
            certification: formData.certification
          }
        ]
      };
      await ApiService.updateUser(userId, updateData);
      setShowForm(false);
      setFormData({ university: '', department: '', graduationYear: '', certification: '' });
      // Refresh user detail and notify parent
      const detailData = await ApiService.getUserDetail(userId);
      if (detailData?.data && onUpdate) {
        onUpdate(detailData.data);
      }
    } catch (error) {
      console.error('Error adding education info:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Eğitim Bilgileri</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
        >
          {showForm ? 'İptal' : 'Yeni Ekle'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Üniversite</label>
            <input
              type="text"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bölüm</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mezuniyet Yılı</label>
            <input
              type="number"
              value={formData.graduationYear}
              onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sertifika</label>
            <input
              type="text"
              value={formData.certification}
              onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormData({ university: '', department: '', graduationYear: '', certification: '' });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
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
        {educationInfos && educationInfos.length > 0 ? (
          educationInfos.map((education) => (
            <div key={education.id} className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600"><span className="font-medium">Üniversite:</span> {education.university || '-'}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Bölüm:</span> {education.department || '-'}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Mezuniyet Yılı:</span> {education.graduationYear || '-'}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Sertifika:</span> {education.certification || '-'}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">Eğitim bilgisi bulunmamaktadır.</p>
        )}
      </div>
    </div>
  );
}


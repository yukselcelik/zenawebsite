'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Eğitim Bilgileri</h3>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg text-sm cursor-pointer shadow-lg shadow-orange-500/50 transition-all"
        >
          {showForm ? 'İptal' : 'Yeni Ekle'}
        </motion.button>
      </div>

      {showForm && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleAdd} 
          className="mb-6 p-4 bg-gray-700/50 rounded-lg space-y-4 border border-gray-600"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Üniversite</label>
            <input
              type="text"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bölüm</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mezuniyet Yılı</label>
            <input
              type="number"
              value={formData.graduationYear}
              onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sertifika</label>
            <input
              type="text"
              value={formData.certification}
              onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormData({ university: '', department: '', graduationYear: '', certification: '' });
              }}
              className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors"
            >
              İptal
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg cursor-pointer shadow-lg shadow-orange-500/50 transition-all"
            >
              Kaydet
            </motion.button>
          </div>
        </motion.form>
      )}

      <div className="space-y-4">
        {educationInfos && educationInfos.length > 0 ? (
          educationInfos.map((education, index) => (
            <motion.div 
              key={education.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-700 rounded-lg p-4 bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
            >
              <p className="text-sm text-gray-300"><span className="font-medium text-white">Üniversite:</span> {education.university || '-'}</p>
              <p className="text-sm text-gray-300"><span className="font-medium text-white">Bölüm:</span> {education.department || '-'}</p>
              <p className="text-sm text-gray-300"><span className="font-medium text-white">Mezuniyet Yılı:</span> {education.graduationYear || '-'}</p>
              <p className="text-sm text-gray-300"><span className="font-medium text-white">Sertifika:</span> {education.certification || '-'}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">Eğitim bilgisi bulunmamaktadır.</p>
        )}
      </div>
    </motion.div>
  );
}


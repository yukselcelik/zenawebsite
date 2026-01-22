'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Diğer Talepler</h2>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4 bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg"
        >
          {success}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Başlık <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white placeholder-gray-400 ${
              errors.title ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="Talep başlığını giriniz"
            required
          />
          {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
        </div>

        <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Açıklama <span className="text-red-400">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white placeholder-gray-400 ${
              errors.description ? 'border-red-500' : 'border-gray-600'
            }`}
            rows="6"
            placeholder="Talebinizi detaylı olarak açıklayın..."
            required
          />
          {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
        </div>

        <div className="flex justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            İptal
          </motion.button>
          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg text-white transition-all ${
              isLoading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/50'
            }`}
          >
            {isLoading ? 'Gönderiliyor...' : 'Talep Oluştur'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}


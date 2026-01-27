'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ApiService from '../../../../lib/api';
import ConfirmDialog from '../common/ConfirmDialog';
import PhoneInput from '../common/PhoneInput';

export default function ContactInfoSection({ contactInfos, userId, onUpdate, isApproved }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    phoneNumber: '',
    mail: ''
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const hasContactInfo = contactInfos && contactInfos.length > 0;
  const canAdd = isApproved && !hasContactInfo;
  const canEdit = isApproved && hasContactInfo;
  const canDelete = isApproved && hasContactInfo;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!canAdd) return;
    
    try {
      const updateData = {
        contactInfos: [
          {
            id: 0,
            address: formData.address,
            phoneNumber: formData.phoneNumber,
            mail: formData.mail
          }
        ]
      };
      await ApiService.updateUser(userId, updateData);
      setShowForm(false);
      setFormData({ address: '', phoneNumber: '', mail: '' });
      // Refresh user detail and notify parent
      const detailData = await ApiService.getUserDetail(userId);
      if (detailData?.data && onUpdate) {
        onUpdate(detailData.data);
      }
    } catch (error) {
      console.error('Error adding contact info:', error);
    }
  };

  const handleUpdate = async (contactId) => {
    if (!canEdit) return;
    
    try {
      const contact = contactInfos.find(c => c.id === contactId);
      if (!contact) return;

      const updateData = {
        contactInfos: [
          {
            id: contactId,
            address: formData.address || contact.address,
            phoneNumber: formData.phoneNumber || contact.phoneNumber,
            mail: formData.mail || contact.mail
          }
        ]
      };
      await ApiService.updateUser(userId, updateData);
      setShowForm(false);
      setIsEditing(false);
      setFormData({ address: '', phoneNumber: '', mail: '' });
      // Refresh user detail and notify parent
      const detailData = await ApiService.getUserDetail(userId);
      if (detailData?.data && onUpdate) {
        onUpdate(detailData.data);
      }
    } catch (error) {
      console.error('Error updating contact info:', error);
    }
  };

  const handleDelete = () => {
    if (!canDelete) return;
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setConfirmLoading(true);
      const updateData = {
        contactInfos: []
      };
      await ApiService.updateUser(userId, updateData);
      setConfirmOpen(false);
      // Refresh user detail and notify parent
      const detailData = await ApiService.getUserDetail(userId);
      if (detailData?.data && onUpdate) {
        onUpdate(detailData.data);
      }
    } catch (error) {
      console.error('Error deleting contact info:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleEdit = (contact) => {
    if (!canEdit) return;
    setFormData({
      address: contact.address || '',
      phoneNumber: contact.phoneNumber || '',
      mail: contact.mail || ''
    });
    setIsEditing(true);
    setShowForm(true);
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">İletişim Bilgileri</h3>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (canAdd) {
              setShowForm(!showForm);
              setIsEditing(false);
              setFormData({ address: '', phoneNumber: '', mail: '' });
            }
          }}
          disabled={!canAdd}
          className={`px-4 py-2 rounded-lg text-sm transition-all ${
            canAdd
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white cursor-pointer shadow-lg shadow-orange-500/50'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {showForm ? 'İptal' : 'Yeni Ekle'}
        </motion.button>
      </div>

      {showForm && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={isEditing ? (e) => { e.preventDefault(); handleUpdate(contactInfos[0]?.id); } : handleAdd} 
          className="mb-6 p-4 bg-gray-700/50 rounded-lg space-y-4 border border-gray-600"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Adres</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={!isApproved}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Telefon</label>
            <PhoneInput
              value={formData.phoneNumber}
              onChange={(value) => setFormData({ ...formData, phoneNumber: value })}
              disabled={!isApproved}
              placeholder="5XX XXX XX XX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">E-posta</label>
            <input
              type="email"
              value={formData.mail}
              onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
              disabled={!isApproved}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white placeholder-gray-400"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => {
                setShowForm(false);
                setIsEditing(false);
                setFormData({ address: '', phoneNumber: '', mail: '' });
              }}
              className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors"
            >
              İptal
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!isApproved}
              className={`px-4 py-2 rounded-lg transition-all ${
                isApproved
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white cursor-pointer shadow-lg shadow-orange-500/50'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isEditing ? 'Güncelle' : 'Kaydet'}
            </motion.button>
          </div>
        </motion.form>
      )}

      <div className="space-y-4">
        {contactInfos && contactInfos.length > 0 ? (
          contactInfos.map((contact, index) => (
            <motion.div 
              key={contact.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-700 rounded-lg p-4 bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-gray-300"><span className="font-medium text-white">Adres:</span> {contact.address || '-'}</p>
                  <p className="text-sm text-gray-300"><span className="font-medium text-white">Telefon:</span> {contact.phoneNumber || '-'}</p>
                  <p className="text-sm text-gray-300"><span className="font-medium text-white">E-posta:</span> {contact.mail || '-'}</p>
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(contact)}
                    disabled={!canEdit}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      canEdit
                        ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Düzenle
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    disabled={!canDelete}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      canDelete
                        ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Sil
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">İletişim bilgisi bulunmamaktadır.</p>
        )}
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="İletişim bilgisini silmek istediğinize emin misiniz?"
        message="Bu işlem geri alınamaz. İletişim bilginiz kalıcı olarak silinecektir."
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        loading={confirmLoading}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </motion.div>
  );
}


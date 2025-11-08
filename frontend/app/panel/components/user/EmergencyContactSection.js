'use client';

import { useState } from 'react';
import ApiService from '../../../../lib/api';

export default function EmergencyContactSection({ emergencyContacts, userId, onUpdate, isApproved }) {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: ''
  });

  const hasEmergencyContact = emergencyContacts && emergencyContacts.length > 0;
  const canAdd = isApproved && !hasEmergencyContact;
  const canEdit = isApproved && hasEmergencyContact;
  const canDelete = isApproved && hasEmergencyContact;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!canAdd) return;
    
    try {
      const updateData = {
        emergencyContacts: [
          {
            id: 0,
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            address: formData.address
          }
        ]
      };
      await ApiService.updateUser(userId, updateData);
      setShowForm(false);
      setIsEditing(false);
      setFormData({ fullName: '', phoneNumber: '', address: '' });
      // Refresh user detail and notify parent
      const detailData = await ApiService.getUserDetail(userId);
      if (detailData?.data && onUpdate) {
        onUpdate(detailData.data);
      }
    } catch (error) {
      console.error('Error adding emergency contact:', error);
    }
  };

  const handleUpdate = async (contactId) => {
    if (!canEdit) return;
    
    try {
      const contact = emergencyContacts.find(c => c.id === contactId);
      if (!contact) return;

      const updateData = {
        emergencyContacts: [
          {
            id: contactId,
            fullName: formData.fullName || contact.fullName,
            phoneNumber: formData.phoneNumber || contact.phoneNumber,
            address: formData.address || contact.address
          }
        ]
      };
      await ApiService.updateUser(userId, updateData);
      setShowForm(false);
      setIsEditing(false);
      setFormData({ fullName: '', phoneNumber: '', address: '' });
      // Refresh user detail and notify parent
      const detailData = await ApiService.getUserDetail(userId);
      if (detailData?.data && onUpdate) {
        onUpdate(detailData.data);
      }
    } catch (error) {
      console.error('Error updating emergency contact:', error);
    }
  };

  const handleDelete = async () => {
    if (!canDelete) return;
    if (!confirm('Acil durum iletişim bilgisini silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const updateData = {
        emergencyContacts: []
      };
      await ApiService.updateUser(userId, updateData);
      // Refresh user detail and notify parent
      const detailData = await ApiService.getUserDetail(userId);
      if (detailData?.data && onUpdate) {
        onUpdate(detailData.data);
      }
    } catch (error) {
      console.error('Error deleting emergency contact:', error);
    }
  };

  const handleEdit = (contact) => {
    if (!canEdit) return;
    setFormData({
      fullName: contact.fullName || '',
      phoneNumber: contact.phoneNumber || '',
      address: contact.address || ''
    });
    setIsEditing(true);
    setShowForm(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Acil Durum İletişim Bilgileri</h3>
        <button
          onClick={() => {
            if (canAdd) {
              setShowForm(!showForm);
              setIsEditing(false);
              setFormData({ fullName: '', phoneNumber: '', address: '' });
            }
          }}
          disabled={!canAdd}
          className={`px-4 py-2 rounded-lg text-sm ${
            canAdd
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {showForm ? 'İptal' : 'Yeni Ekle'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={isEditing ? (e) => { e.preventDefault(); handleUpdate(emergencyContacts[0]?.id); } : handleAdd} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              disabled={!isApproved}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              disabled={!isApproved}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={!isApproved}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setIsEditing(false);
                setFormData({ fullName: '', phoneNumber: '', address: '' });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={!isApproved}
              className={`px-4 py-2 rounded-lg ${
                isApproved
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isEditing ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {emergencyContacts && emergencyContacts.length > 0 ? (
          emergencyContacts.map((contact) => (
            <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-gray-600"><span className="font-medium">Ad Soyad:</span> {contact.fullName}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Telefon:</span> {contact.phoneNumber || '-'}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Adres:</span> {contact.address || '-'}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(contact)}
                    disabled={!canEdit}
                    className={`px-3 py-1 rounded text-sm ${
                      canEdit
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={!canDelete}
                    className={`px-3 py-1 rounded text-sm ${
                      canDelete
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">Acil durum iletişim bilgisi bulunmamaktadır.</p>
        )}
      </div>
    </div>
  );
}


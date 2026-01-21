'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MasrafTalepEtForm from './components/MasrafTalepEtForm';
import IzinTalepEtForm from './components/IzinTalepEtForm';
import ToplantiOdasiTalepEtForm from './components/ToplantiOdasiTalepEtForm';
import DigerTaleplerForm from './components/DigerTaleplerForm';

const REQUEST_TYPES = {
  EXPENSE: 'expense',
  LEAVE: 'leave',
  MEETING_ROOM: 'meeting-room',
  OTHER: 'other'
};

export default function TalepEtPage() {
  const [selectedType, setSelectedType] = useState(null);
  const router = useRouter();

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleBack = () => {
    if (selectedType) {
      setSelectedType(null);
    } else {
      router.back();
    }
  };

  const renderForm = () => {
    switch (selectedType) {
      case REQUEST_TYPES.EXPENSE:
        return <MasrafTalepEtForm onSuccess={() => router.back()} onCancel={handleBack} />;
      case REQUEST_TYPES.LEAVE:
        return <IzinTalepEtForm onSuccess={() => router.back()} onCancel={handleBack} />;
      case REQUEST_TYPES.MEETING_ROOM:
        return <ToplantiOdasiTalepEtForm onSuccess={() => router.back()} onCancel={handleBack} />;
      case REQUEST_TYPES.OTHER:
        return <DigerTaleplerForm onSuccess={() => router.back()} onCancel={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          {selectedType && (
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {!selectedType ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Masraf Talep Et */}
          <div
            onClick={() => handleTypeSelect(REQUEST_TYPES.EXPENSE)}
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow border border-gray-200 hover:border-orange-500"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Masraf Talep Et</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Yemek, konaklama, ulaşım ve diğer masraflarınız için talep oluşturun.
            </p>
          </div>

          {/* İzin Talep Et */}
          <div
            onClick={() => handleTypeSelect(REQUEST_TYPES.LEAVE)}
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow border border-gray-200 hover:border-orange-500"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">İzin Talep Et</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Yıllık izin, ücretsiz izin, saatlik izin ve mazeret izni taleplerinizi oluşturun.
            </p>
          </div>

          {/* Toplantı Odası Kullanımı Talep Et */}
          <div
            onClick={() => handleTypeSelect(REQUEST_TYPES.MEETING_ROOM)}
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow border border-gray-200 hover:border-orange-500"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Toplantı Odası Kullanımı Talep Et</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Toplantı salonlarını rezerve etmek için talep oluşturun.
            </p>
          </div>

          {/* Diğer Talepler */}
          <div
            onClick={() => handleTypeSelect(REQUEST_TYPES.OTHER)}
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow border border-gray-200 hover:border-orange-500"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Diğer Talepler</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Diğer talep türleriniz için buradan oluşturun.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          {renderForm()}
        </div>
      )}
    </div>
  );
}


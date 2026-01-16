'use client';

import { useRef, useState } from 'react';
import ApiService from '../../../../lib/api';
import EmployeeBenefitsTabs from './EmployeeBenefitsTabs';

export default function EmployeeBenefitsSection({ userId, userRole, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const tabsRef = useRef(null);

  const isManager = userRole === 'Manager' || userRole === 'Yönetici' || userRole?.toLowerCase() === 'manager';

  const handleSave = async () => {
    if (!isManager || !isEditing) return;
    try {
      setIsSaving(true);
      const state = tabsRef.current?.getBenefitsState?.() ?? [];

      const hasAnyMeaningfulValue = (b) => {
        if (!b) return false;
        const fields = [
          b.customBenefitName,
          b.travelSupportType,
          b.travelSupportDescription,
          b.travelSupportAmount,
          b.foodSupportType,
          b.foodSupportDailyAmount,
          b.foodSupportCardCompanyInfo,
          b.foodSupportDescription,
          b.bonusType,
          b.bonusPaymentPeriod,
          b.bonusAmount,
          b.bonusDescription,
          b.otherBenefitsPaymentPeriod,
          b.otherBenefitsAmount,
          b.otherBenefitsDescription
        ];

        return fields.some((v) => v != null && String(v).trim() !== '');
      };

      const invalidTabIndexes = state
        .map((b, idx) => (!b?.benefitType && hasAnyMeaningfulValue(b) ? idx : null))
        .filter((x) => x != null);

      if (invalidTabIndexes.length > 0) {
        const tabsText = invalidTabIndexes.map((i) => `Tab ${i + 1}`).join(', ');
        throw new Error(`Hak türü seçilmemiş bir yan hak kaydı var (${tabsText}). Lütfen tür seçin veya tabı silin.`);
      }

      const payload = (tabsRef.current?.getPayload?.() ?? []).filter((p) => p?.benefitType != null);
      const result = await ApiService.upsertEmployeeBenefits(userId, payload);

      if (result && result.success === false) {
        throw new Error(result.message || 'Yan haklar kaydedilirken hata oluştu');
      }

      setIsEditing(false);
      await tabsRef.current?.refresh?.();
      if (onUpdate) {
        await onUpdate();
      }
    } catch (e) {
      console.error('Error saving employee benefits:', e);
      alert(e.message || 'Yan haklar kaydedilirken hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!isManager) return;
    setIsEditing(false);
    tabsRef.current?.resetToSnapshot?.();
  };

  const handleDeleteActive = () => {
    if (!isManager || !isEditing) return;
    if (!confirm('Bu yan hak tabını silmek istediğinize emin misiniz?')) return;
    tabsRef.current?.removeActiveTab?.();
  };

  return (
    <div className="mb-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Yan Haklar</h3>
        </div>
      </div>

      <EmployeeBenefitsTabs
        ref={tabsRef}
        userId={userId}
        isManager={isManager}
        isEditing={isEditing}
        onRequestEdit={() => setIsEditing(true)}
      />

      <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-2 justify-end">
        {isManager ? (
          isEditing ? (
            <>
              <button
                type="button"
                onClick={handleDeleteActive}
                className="px-4 py-2 rounded-lg text-sm border border-red-200 text-red-700 hover:bg-red-50"
              >
                Sil
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className={`px-4 py-2 rounded-lg text-sm ${
                  isSaving ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Düzenle
            </button>
          )
        ) : null}
      </div>
    </div>
  );
}


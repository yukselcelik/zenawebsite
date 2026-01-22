'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ApiService from '../../../../lib/api';

const TRAVEL_SUPPORT_TYPES = [
  { value: 1, label: 'Nakit' },
  { value: 2, label: 'Servis' },
  { value: 3, label: 'Şirket Aracı' },
  { value: 4, label: 'Yok' }
];

const FOOD_SUPPORT_TYPES = [
  { value: 1, label: 'Yemek Kartı' },
  { value: 2, label: 'Nakit' },
  { value: 3, label: 'Yemekhane' }
];

const BONUS_TYPES = [
  { value: 1, label: 'Performans' },
  { value: 2, label: 'Satış' },
  { value: 3, label: 'Diğer' }
];

const PAYMENT_PERIODS = [
  { value: 1, label: 'Aylık' },
  { value: 2, label: 'Üç Aylık' },
  { value: 3, label: 'Yıllık' },
  { value: 4, label: 'Düzensiz' }
];

const BENEFIT_TYPES = [
  { value: 1, label: 'Yemek' },
  { value: 2, label: 'Yol' },
  { value: 3, label: 'Prim' },
  { value: 4, label: 'Diğer' }
];

const EmployeeBenefitsTabs = forwardRef(function EmployeeBenefitsTabs(
  { userId, isManager, isEditing, onRequestEdit },
  ref
) {
  const [benefits, setBenefits] = useState([]);
  const [snapshot, setSnapshot] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // Keep a synchronous reference to latest benefits to avoid "stale state" during fast Save clicks
  const benefitsRef = useRef([]);

  const createEmptyBenefit = (order = 1) => ({
    id: null,
    order: order?.toString() || '1',
    benefitType: '',
    benefitTypeName: '',
    customBenefitName: '',

    travelSupportType: '',
    travelSupportDescription: '',
    travelSupportAmount: '',

    foodSupportType: '',
    foodSupportDailyAmount: '',
    foodSupportCardCompanyInfo: '',
    foodSupportDescription: '',

    bonusType: '',
    bonusPaymentPeriod: '',
    bonusAmount: '',
    bonusDescription: '',

    otherBenefitsPaymentPeriod: '',
    otherBenefitsAmount: '',
    otherBenefitsDescription: ''
  });

  const normalizeBenefit = (b) => ({
    id: b?.id ?? null,
    order: (b?.order ?? 1).toString(),
    benefitType: b?.benefitType?.toString() || '',
    benefitTypeName: b?.benefitTypeName || '',
    customBenefitName: b?.customBenefitName || '',

    travelSupportType: b?.travelSupportType?.toString() || '',
    travelSupportDescription: b?.travelSupportDescription || '',
    travelSupportAmount: b?.travelSupportAmount?.toString() || '',

    foodSupportType: b?.foodSupportType?.toString() || '',
    foodSupportDailyAmount: b?.foodSupportDailyAmount?.toString() || '',
    foodSupportCardCompanyInfo: b?.foodSupportCardCompanyInfo || '',
    foodSupportDescription: b?.foodSupportDescription || '',

    bonusType: b?.bonusType?.toString() || '',
    bonusPaymentPeriod: b?.bonusPaymentPeriod?.toString() || '',
    bonusAmount: b?.bonusAmount?.toString() || '',
    bonusDescription: b?.bonusDescription || '',

    otherBenefitsPaymentPeriod: b?.otherBenefitsPaymentPeriod?.toString() || '',
    otherBenefitsAmount: b?.otherBenefitsAmount?.toString() || '',
    otherBenefitsDescription: b?.otherBenefitsDescription || ''
  });

  const parseCurrencyValue = (value) => {
    if (!value || value === '') return null;
    const normalized = value.replace(',', '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? null : parsed;
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return '';
    return (
      new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value) + ' TL'
    );
  };

  const refresh = async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const res = await ApiService.getEmployeeBenefits(userId);
      const list = Array.isArray(res?.data) ? res.data : [];
      const normalized = list
        .slice()
        .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
        .map(normalizeBenefit);

      const finalList = normalized.length > 0 ? normalized : [createEmptyBenefit(1)];
      setBenefits(finalList);
      benefitsRef.current = finalList;
      setSnapshot(finalList);
      setActiveTab(0);
    } catch (e) {
      console.error('Error fetching employee benefits:', e);
      const fallback = [createEmptyBenefit(1)];
      setBenefits(fallback);
      benefitsRef.current = fallback;
      setSnapshot(fallback);
      setActiveTab(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const resetToSnapshot = () => {
    setBenefits(snapshot);
    benefitsRef.current = snapshot;
    setActiveTab(0);
  };

  const getPayload = () => {
    return (benefitsRef.current || []).map((b, idx) => ({
      id: b.id ? parseInt(b.id) : null,
      order: b.order ? parseInt(b.order) : idx + 1,
      benefitType: b.benefitType ? parseInt(b.benefitType) : null,
      customBenefitName: b.customBenefitName || null,

      travelSupportType: b.travelSupportType ? parseInt(b.travelSupportType) : null,
      travelSupportDescription: b.travelSupportDescription || null,
      travelSupportAmount: parseCurrencyValue(b.travelSupportAmount),

      foodSupportType: b.foodSupportType ? parseInt(b.foodSupportType) : null,
      foodSupportDailyAmount: parseCurrencyValue(b.foodSupportDailyAmount),
      foodSupportCardCompanyInfo: b.foodSupportCardCompanyInfo || null,
      foodSupportDescription: b.foodSupportDescription || null,

      bonusType: b.bonusType ? parseInt(b.bonusType) : null,
      bonusPaymentPeriod: b.bonusPaymentPeriod ? parseInt(b.bonusPaymentPeriod) : null,
      bonusAmount: parseCurrencyValue(b.bonusAmount),
      bonusDescription: b.bonusDescription || null,

      otherBenefitsPaymentPeriod: b.otherBenefitsPaymentPeriod ? parseInt(b.otherBenefitsPaymentPeriod) : null,
      otherBenefitsAmount: parseCurrencyValue(b.otherBenefitsAmount),
      otherBenefitsDescription: b.otherBenefitsDescription || null
    }));
  };

  const removeActiveTab = () => {
    setBenefits((prev) => {
      const next = Array.isArray(prev) ? [...prev] : [];
      next.splice(activeTab, 1);
      if (next.length === 0) {
        next.push(createEmptyBenefit(1));
        setActiveTab(0);
        benefitsRef.current = next;
        return next;
      }
      const newIndex = Math.min(activeTab, next.length - 1);
      setActiveTab(newIndex);
      benefitsRef.current = next;
      return next;
    });
  };

  useImperativeHandle(ref, () => ({
    refresh,
    resetToSnapshot,
    getPayload,
    removeActiveTab,
    getBenefitsState: () => benefitsRef.current
  }));

  const updateField = (index, field, value) => {
    setBenefits((prev) => {
      const next = Array.isArray(prev) ? [...prev] : [];
      const current = next[index] ? { ...next[index] } : createEmptyBenefit(index + 1);
      current[field] = value;
      next[index] = current;
      benefitsRef.current = next;
      return next;
    });
  };

  const handleCurrencyInput = (index, value, fieldName) => {
    let cleaned = value.replace(/[^\d,]/g, '');
    const commaIndex = cleaned.indexOf(',');
    if (commaIndex !== -1) {
      const afterComma = cleaned.substring(commaIndex + 1);
      if (afterComma.length > 2) {
        cleaned = cleaned.substring(0, commaIndex + 3);
      }
      const parts = cleaned.split(',');
      if (parts.length > 2) {
        cleaned = parts[0] + ',' + parts.slice(1).join('');
      }
    }
    updateField(index, fieldName, cleaned);
  };

  const getTabTitle = (benefit, index) => {
    if (!benefit) return index === 0 ? 'Default Tab' : `Tab ${index + 1}`;
    if (benefit.benefitType?.toString() === '4' && benefit.customBenefitName) return benefit.customBenefitName;
    if (benefit.benefitTypeName) return benefit.benefitTypeName;
    const match = benefit.benefitType
      ? BENEFIT_TYPES.find((t) => t.value.toString() === benefit.benefitType.toString())
      : null;
    return match?.label || 'Yan Hak';
  };

  const handleAddTab = () => {
    setBenefits((prev) => {
      const next = Array.isArray(prev) ? [...prev] : [];
      const maxOrder = next.reduce((max, b) => {
        const n = parseInt(b?.order || '0');
        return isNaN(n) ? max : Math.max(max, n);
      }, 0);
      next.push(createEmptyBenefit(maxOrder + 1));
      setActiveTab(next.length - 1);
      benefitsRef.current = next;
      return next;
    });
  };

  const b = (benefits || [])[activeTab] || createEmptyBenefit(activeTab + 1);
  const type = b.benefitType?.toString() || '';

  return (
    <div className="border border-gray-700 rounded-lg bg-gray-800">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-700 p-3 overflow-x-auto">
        <div className="flex items-center gap-2">
          {(benefits || []).map((item, idx) => (
            <button
              key={item?.id ?? `new-${idx}`}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap border ${
                idx === activeTab
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
              }`}
            >
              {getTabTitle(item, idx)}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            if (!isManager) return;
            if (!isEditing && typeof onRequestEdit === 'function') {
              onRequestEdit();
            }
            handleAddTab();
          }}
          disabled={!isManager}
          className={`ml-auto inline-flex items-center justify-center w-9 h-9 rounded-lg border ${
            !isManager ? 'border-gray-600 bg-gray-700 cursor-not-allowed' : 'border-gray-600 hover:bg-gray-700'
          }`}
          title={!isManager ? 'Yetkiniz yok' : 'Yeni tab ekle'}
        >
          <svg className={`w-5 h-5 ${!isManager ? 'text-gray-500' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Active tab content */}
      <div className="p-4">
        {isLoading ? (
          <div className="text-sm text-gray-400">Yan haklar yükleniyor...</div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Hak Türü:</label>
              {isEditing && isManager ? (
                <select
                  value={type}
                  onChange={(e) => updateField(activeTab, 'benefitType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white"
                >
                  <option value="">Seçiniz</option>
                  {BENEFIT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg min-h-[42px]">
                  <span className="text-white">{b.benefitTypeName || getTabTitle(b, activeTab)}</span>
                </div>
              )}
            </div>

            {/* Yol */}
            {type === '2' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tür:</label>
                  {isEditing && isManager ? (
                    <select
                      value={b.travelSupportType}
                      onChange={(e) => updateField(activeTab, 'travelSupportType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white"
                    >
                      <option value="">Seçiniz</option>
                      {TRAVEL_SUPPORT_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg min-h-[42px]">
                      <span className="text-white">
                        {TRAVEL_SUPPORT_TYPES.find((t) => t.value.toString() === (b.travelSupportType || '').toString())
                          ?.label || ''}
                      </span>
                    </div>
                  )}
                </div>

                {((isEditing && isManager && b.travelSupportType && b.travelSupportType !== '4') ||
                  (!isEditing && b.travelSupportType && b.travelSupportType !== '4')) && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Açıklama:</label>
                      {isEditing && isManager ? (
                        <textarea
                          value={b.travelSupportDescription}
                          onChange={(e) => updateField(activeTab, 'travelSupportDescription', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white"
                          rows="2"
                        />
                      ) : (
                        <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg min-h-[42px]">
                          <span className="text-white">{b.travelSupportDescription || ''}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Tutar:</label>
                      {isEditing && isManager ? (
                        <input
                          type="text"
                          value={b.travelSupportAmount}
                          onChange={(e) => handleCurrencyInput(activeTab, e.target.value, 'travelSupportAmount')}
                          className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white"
                        />
                      ) : (
                        <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg min-h-[42px]">
                          <span className="text-white">{formatCurrency(parseCurrencyValue(b.travelSupportAmount))}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Yemek */}
            {type === '1' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tür:</label>
                  {isEditing && isManager ? (
                    <select
                      value={b.foodSupportType}
                      onChange={(e) => updateField(activeTab, 'foodSupportType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white"
                    >
                      <option value="">Seçiniz</option>
                      {FOOD_SUPPORT_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg min-h-[42px]">
                      <span className="text-white">
                        {FOOD_SUPPORT_TYPES.find((t) => t.value.toString() === (b.foodSupportType || '').toString())
                          ?.label || ''}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Günlük Tutar:</label>
                  {isEditing && isManager ? (
                    <input
                      type="text"
                      value={b.foodSupportDailyAmount}
                      onChange={(e) => handleCurrencyInput(activeTab, e.target.value, 'foodSupportDailyAmount')}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg min-h-[42px]">
                      <span className="text-white">{formatCurrency(parseCurrencyValue(b.foodSupportDailyAmount))}</span>
                    </div>
                  )}
                </div>

                {((isEditing && isManager && b.foodSupportType === '1') || (!isEditing && b.foodSupportType === '1')) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Kart/Firma Bilgileri:</label>
                    {isEditing && isManager ? (
                      <input
                        type="text"
                        value={b.foodSupportCardCompanyInfo}
                        onChange={(e) => updateField(activeTab, 'foodSupportCardCompanyInfo', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white"
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg min-h-[42px]">
                        <span className="text-white">{b.foodSupportCardCompanyInfo || ''}</span>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Açıklama:</label>
                  {isEditing && isManager ? (
                    <textarea
                      value={b.foodSupportDescription}
                      onChange={(e) => updateField(activeTab, 'foodSupportDescription', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white"
                      rows="2"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg min-h-[42px]">
                      <span className="text-white">{b.foodSupportDescription || ''}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Prim */}
            {type === '3' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tür:</label>
                  {isEditing && isManager ? (
                    <select
                      value={b.bonusType}
                      onChange={(e) => updateField(activeTab, 'bonusType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white"
                    >
                      <option value="">Seçiniz</option>
                      {BONUS_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg min-h-[42px]">
                      <span className="text-white">
                        {BONUS_TYPES.find((t) => t.value.toString() === (b.bonusType || '').toString())?.label || ''}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ödeme Periyodu:</label>
                  {isEditing && isManager ? (
                    <select
                      value={b.bonusPaymentPeriod}
                      onChange={(e) => updateField(activeTab, 'bonusPaymentPeriod', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white"
                    >
                      <option value="">Seçiniz</option>
                      {PAYMENT_PERIODS.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg min-h-[42px]">
                      <span className="text-white">
                        {PAYMENT_PERIODS.find((t) => t.value.toString() === (b.bonusPaymentPeriod || '').toString())
                          ?.label || ''}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tutar:</label>
                  {isEditing && isManager ? (
                    <input
                      type="text"
                      value={b.bonusAmount}
                      onChange={(e) => handleCurrencyInput(activeTab, e.target.value, 'bonusAmount')}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg min-h-[42px]">
                      <span className="text-white">{formatCurrency(parseCurrencyValue(b.bonusAmount))}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Açıklama:</label>
                  {isEditing && isManager ? (
                    <textarea
                      value={b.bonusDescription}
                      onChange={(e) => updateField(activeTab, 'bonusDescription', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white"
                      rows="2"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg min-h-[42px]">
                      <span className="text-white">{b.bonusDescription || ''}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Diğer */}
            {type === '4' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Diğer Hak Adı:</label>
                  {isEditing && isManager ? (
                    <input
                      type="text"
                      value={b.customBenefitName}
                      onChange={(e) => updateField(activeTab, 'customBenefitName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white placeholder-gray-400"
                      placeholder="Örn: Sağlık Sigortası"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg min-h-[42px]">
                      <span className="text-white">{b.customBenefitName || ''}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ödeme Periyodu:</label>
                  {isEditing && isManager ? (
                    <select
                      value={b.otherBenefitsPaymentPeriod}
                      onChange={(e) => updateField(activeTab, 'otherBenefitsPaymentPeriod', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white"
                    >
                      <option value="">Seçiniz</option>
                      {PAYMENT_PERIODS.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg min-h-[42px]">
                      <span className="text-white">
                        {PAYMENT_PERIODS.find((t) => t.value.toString() === (b.otherBenefitsPaymentPeriod || '').toString())
                          ?.label || ''}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tutar:</label>
                  {isEditing && isManager ? (
                    <input
                      type="text"
                      value={b.otherBenefitsAmount}
                      onChange={(e) => handleCurrencyInput(activeTab, e.target.value, 'otherBenefitsAmount')}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg min-h-[42px]">
                      <span className="text-white">{formatCurrency(parseCurrencyValue(b.otherBenefitsAmount))}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Açıklama:</label>
                  {isEditing && isManager ? (
                    <textarea
                      value={b.otherBenefitsDescription}
                      onChange={(e) => updateField(activeTab, 'otherBenefitsDescription', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-700 text-white"
                      rows="2"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg min-h-[42px]">
                      <span className="text-white">{b.otherBenefitsDescription || ''}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!type && <div className="text-sm text-gray-400">Bu tab için önce <span className="font-medium text-gray-300">Hak Türü</span> seçiniz.</div>}
          </div>
        )}
      </div>
    </div>
  );
});

export default EmployeeBenefitsTabs;


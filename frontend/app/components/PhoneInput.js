'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Modern telefon numarası input bileşeni
 * 10 haneli telefon numarası girişi için formatlanmış input
 * Format: XXX XXX XX XX
 */
export default function PhoneInput({ value, onChange, disabled, className = '', placeholder = '5XX XXX XX XX', required = false }) {
  const [displayValue, setDisplayValue] = useState('');

  // Telefon numarasını formatla: XXX XXX XX XX
  const formatPhoneNumber = useCallback((input, shouldCallOnChange = true) => {
    // Sadece rakamları al
    const digits = input.replace(/\D/g, '').slice(0, 10);
    
    // Formatla
    let formatted = '';
    if (digits.length > 0) {
      formatted = digits.slice(0, 3);
      if (digits.length > 3) {
        formatted += ' ' + digits.slice(3, 6);
      }
      if (digits.length > 6) {
        formatted += ' ' + digits.slice(6, 8);
      }
      if (digits.length > 8) {
        formatted += ' ' + digits.slice(8, 10);
      }
    }
    
    setDisplayValue(formatted);
    
    // Parent component'e sadece rakamları gönder (formatlanmamış)
    if (shouldCallOnChange && onChange) {
      onChange(digits);
    }
  }, [onChange]);

  // Value prop'u değiştiğinde displayValue'yu güncelle
  useEffect(() => {
    if (value !== undefined && value !== null) {
      // Sadece display değerini güncelle, onChange çağırma (sonsuz döngüyü önlemek için)
      const digits = String(value).replace(/\D/g, '').slice(0, 10);
      let formatted = '';
      if (digits.length > 0) {
        formatted = digits.slice(0, 3);
        if (digits.length > 3) {
          formatted += ' ' + digits.slice(3, 6);
        }
        if (digits.length > 6) {
          formatted += ' ' + digits.slice(6, 8);
        }
        if (digits.length > 8) {
          formatted += ' ' + digits.slice(8, 10);
        }
      }
      setDisplayValue(formatted);
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e) => {
    const input = e.target.value;
    formatPhoneNumber(input, true);
  };

  const handleKeyDown = (e) => {
    // Sadece rakam, backspace, delete, tab, arrow keys ve space'e izin ver
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ];
    
    if (allowedKeys.includes(e.key)) {
      return;
    }
    
    // Ctrl/Cmd + A, C, V, X, Z gibi kısayollar
    if (e.ctrlKey || e.metaKey) {
      return;
    }
    
    // Sadece rakam ve space'e izin ver
    if (!/[\d\s]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    formatPhoneNumber(pastedText, true);
  };

  // Geçerli telefon numarası kontrolü (10 haneli)
  const isValid = displayValue.replace(/\s/g, '').length === 10;
  const isEmpty = displayValue.replace(/\s/g, '').length === 0;

  return (
    <div className="relative">
      <input
        type="tel"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        inputMode="numeric"
        maxLength={14} // XXX XXX XX XX formatı için maksimum uzunluk
        className={`
          w-full px-4 py-3 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          text-gray-900
          transition-all duration-200
          ${!isEmpty && !isValid ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
          ${className}
        `}
      />
      {!isEmpty && !isValid && (
        <p className="mt-1 text-xs text-red-500">
          10 haneli telefon numarası giriniz
        </p>
      )}
      {isEmpty && required && (
        <p className="mt-1 text-xs text-gray-500">
          Örnek: {placeholder}
        </p>
      )}
    </div>
  );
}


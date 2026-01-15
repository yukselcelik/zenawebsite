'use client';

import { useEffect, useState } from 'react';
import ApiService from '../../../lib/api';

const PAYMENT_METHODS = [
  { value: 1, label: 'Nakit' },
  { value: 2, label: 'Havale' },
  { value: 3, label: 'EFT' },
  { value: 4, label: 'Kredi Kartı' },
  { value: 5, label: 'Diğer' }
];

export default function OdemeTakipPage() {
  const [expenseRequests, setExpenseRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    paymentMethod: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchApprovedExpenseRequests();
  }, [pageNumber]);

  const fetchApprovedExpenseRequests = async () => {
    try {
      setIsLoading(true);
      const result = await ApiService.getAllExpenseRequests(pageNumber, 10);
      if (result && result.success && result.data) {
        // Sadece onaylanmış talepleri göster
        const approvedRequests = (result.data.items || []).filter(
          req => req.statusName === 'Onaylandı' || req.statusName === 'Ödendi'
        );
        setExpenseRequests(approvedRequests);
        setTotalPages(result.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching expense requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return '-';
    return new Intl.NumberFormat('tr-TR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value) + ' TL';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const handleMarkAsPaid = (request) => {
    setSelectedRequest(request);
    setPaymentData({ paymentMethod: request.paymentMethod?.toString() || '' });
    setShowPaymentModal(true);
  };

  const confirmMarkAsPaid = async () => {
    if (!selectedRequest) return;

    try {
      setIsProcessing(true);
      const result = await ApiService.markExpenseRequestAsPaid(selectedRequest.id, {
        paymentMethod: paymentData.paymentMethod ? parseInt(paymentData.paymentMethod) : null
      });

      if (result && result.success) {
        setShowPaymentModal(false);
        setSelectedRequest(null);
        fetchApprovedExpenseRequests();
      } else {
        alert(result?.message || 'Ödeme işaretleme başarısız oldu');
      }
    } catch (error) {
      console.error('Error marking as paid:', error);
      alert('Ödeme işaretleme sırasında hata oluştu');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ödeme Takip</h1>
        <p className="text-gray-600 mt-2">
          Onaylanmış masraf taleplerinin ödeme durumunu buradan takip edebilirsiniz.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : expenseRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500">Ödeme bekleyen onaylanmış masraf talebi bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Talep Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Çalışan Adı Soyadı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Masraf Türü
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Onaylanan Tutar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ödeme Durumu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ödeme Yöntemi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenseRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.requestDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.userName} {request.userSurname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.expenseTypeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(request.approvedAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.statusName === 'Ödendi' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.statusName === 'Ödendi' ? 'Ödendi' : 'Ödenmedi'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.paymentMethodName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.statusName === 'Onaylandı' && (
                        <button
                          onClick={() => handleMarkAsPaid(request)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Ödendi Olarak İşaretle
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                  disabled={pageNumber === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Önceki
                </button>
                <button
                  onClick={() => setPageNumber(Math.min(totalPages, pageNumber + 1))}
                  disabled={pageNumber === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Sonraki
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Sayfa <span className="font-medium">{pageNumber}</span> / <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                      disabled={pageNumber === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Önceki
                    </button>
                    <button
                      onClick={() => setPageNumber(Math.min(totalPages, pageNumber + 1))}
                      disabled={pageNumber === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Sonraki
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ödeme Modal */}
      {showPaymentModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ödeme Olarak İşaretle</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ödeme Yöntemi:
                  </label>
                  <select
                    value={paymentData.paymentMethod}
                    onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  >
                    <option value="">Seçiniz</option>
                    {PAYMENT_METHODS.map(method => (
                      <option key={method.value} value={method.value}>{method.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedRequest(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={isProcessing}
                >
                  İptal
                </button>
                <button
                  onClick={confirmMarkAsPaid}
                  disabled={isProcessing}
                  className={`px-4 py-2 rounded-lg text-white ${
                    isProcessing ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isProcessing ? 'İşaretleniyor...' : 'Ödendi Olarak İşaretle'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


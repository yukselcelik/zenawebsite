'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ApiService from '../../../lib/api';
import ConfirmDialog from '../components/common/ConfirmDialog';

const PAYMENT_METHODS = [
  { value: 1, label: 'Nakit' },
  { value: 2, label: 'Havale' },
  { value: 3, label: 'EFT' },
  { value: 4, label: 'Kredi Kartı' },
  { value: 5, label: 'Diğer' }
];

export default function MasrafTalepleriPage() {
  const [expenseRequests, setExpenseRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [activeTab, setActiveTab] = useState('requests');
  const [editingData, setEditingData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    // Admin kontrolü yap
    const checkUserRole = async () => {
      try {
        const profileData = await ApiService.getProfile();
        if (profileData.data?.role === 'Manager') {
          router.push('/panel/talepleri-incele');
          return;
        }
        fetchExpenseRequests();
      } catch (error) {
        console.error('Error fetching user data:', error);
        fetchExpenseRequests();
      }
    };
    checkUserRole();
  }, [pageNumber, router]);

  const fetchExpenseRequests = async () => {
    try {
      setIsLoading(true);
      const result = await ApiService.getAllExpenseRequests(pageNumber, 10);
      if (result && result.success && result.data) {
        const requests = result.data.items || [];
        setExpenseRequests(requests);
        // Her request için editing data başlat
        const initialEditingData = {};
        requests.forEach(req => {
          if (req.statusName === 'Beklemede') {
            initialEditingData[req.id] = {
              approvedAmount: req.approvedAmount ? formatCurrencyForInput(req.approvedAmount) : '',
              department: req.department || ''
            };
          }
        });
        setEditingData(initialEditingData);
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

  const formatCurrencyForInput = (value) => {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('tr-TR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value).replace('.', ',');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Beklemede': 'bg-yellow-100 text-yellow-800',
      'Onaylandı': 'bg-green-100 text-green-800',
      'Reddedildi': 'bg-red-100 text-red-800',
      'Ödendi': 'bg-blue-100 text-blue-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const handleCurrencyInput = (requestId, value) => {
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
    setEditingData({
      ...editingData,
      [requestId]: {
        ...editingData[requestId],
        approvedAmount: cleaned
      }
    });
  };

  const handleDepartmentChange = (requestId, value) => {
    setEditingData({
      ...editingData,
      [requestId]: {
        ...editingData[requestId],
        department: value
      }
    });
  };

  const handleApprove = async (request) => {
    if (!editingData[request.id]) {
      alert('Lütfen onaylanan tutarı giriniz');
      return;
    }

    const approvedAmount = editingData[request.id].approvedAmount;
    if (!approvedAmount || parseFloat(approvedAmount.replace(',', '.')) <= 0) {
      alert('Lütfen geçerli bir onaylanan tutar giriniz');
      return;
    }

    try {
      setIsProcessing(true);
      const amount = parseFloat(approvedAmount.replace(',', '.'));
      const department = editingData[request.id].department || '';
      
      const result = await ApiService.approveExpenseRequest(request.id, {
        approvedAmount: amount,
        department: department
      });

      if (result && result.success) {
        fetchExpenseRequests();
      } else {
        alert(result?.message || 'Onaylama işlemi başarısız oldu');
      }
    } catch (error) {
      console.error('Error approving expense request:', error);
      alert('Onaylama işlemi sırasında hata oluştu');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!selectedRequest) return;

    try {
      setIsProcessing(true);
      const result = await ApiService.rejectExpenseRequest(selectedRequest.id, rejectionReason);

      if (result && result.success) {
        setShowRejectModal(false);
        setSelectedRequest(null);
        setRejectionReason('');
        fetchExpenseRequests();
      } else {
        alert(result?.message || 'Reddetme işlemi başarısız oldu');
      }
    } catch (error) {
      console.error('Error rejecting expense request:', error);
      alert('Reddetme işlemi sırasında hata oluştu');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewDocument = async (requestId) => {
    try {
      await ApiService.downloadExpenseRequestDocument(requestId);
    } catch (error) {
      console.error('Error viewing document:', error);
      alert(error.message || 'Belge görüntülenirken hata oluştu');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Masraf Talepleri</h1>
        <p className="text-gray-600 mt-2">
          Çalışan masraf taleplerini buradan görüntüleyebilir, onaylayabilir veya reddedebilirsiniz.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Masraf Talepleri
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payment'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Ödeme Takip
          </button>
        </nav>
      </div>

      {activeTab === 'payment' ? (
        <OdemeTakipContent />
      ) : (
        <>
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Talep Tarihi
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Çalışan
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Masraf Türü
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Açıklama
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Talep Edilen
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Onaylanan Tutar
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Şirket/Departman
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Durum
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenseRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.requestDate)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.userName} {request.userSurname}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.expenseTypeName}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 max-w-xs">
                      <div className="truncate" title={request.description}>
                        {request.description}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(request.requestedAmount)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      {request.statusName === 'Beklemede' ? (
                        <input
                          type="text"
                          value={editingData[request.id]?.approvedAmount || ''}
                          onChange={(e) => handleCurrencyInput(request.id, e.target.value)}
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-gray-900 text-sm"
                          placeholder="0,00"
                        />
                      ) : (
                        <span className="text-gray-900">
                          {request.approvedAmount ? formatCurrency(request.approvedAmount) : '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-sm">
                      {request.statusName === 'Beklemede' ? (
                        <input
                          type="text"
                          value={editingData[request.id]?.department || ''}
                          onChange={(e) => handleDepartmentChange(request.id, e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-gray-900 text-sm"
                          placeholder="Departman"
                        />
                      ) : (
                        <span className="text-gray-500">{request.department || '-'}</span>
                      )}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(request.statusName)}`}>
                          {request.statusName}
                        </span>
                        {request.statusName === 'Reddedildi' && request.rejectionReason && (
                          <div className="mt-1 text-xs text-red-600 max-w-xs">
                            <span className="font-medium">Neden:</span> {request.rejectionReason}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                      {request.documentPath && (
                        <button
                          onClick={() => handleViewDocument(request.id)}
                          className="text-blue-600 hover:text-blue-900 text-xs"
                        >
                          Belge
                        </button>
                      )}
                      {request.statusName === 'Beklemede' && (
                        <>
                          <button
                            onClick={() => handleApprove(request)}
                            disabled={isProcessing}
                            className="text-green-600 hover:text-green-900 text-xs disabled:opacity-50"
                          >
                            Onayla
                          </button>
                          <button
                            onClick={() => handleReject(request)}
                            disabled={isProcessing}
                            className="text-red-600 hover:text-red-900 text-xs disabled:opacity-50"
                          >
                            Reddet
                          </button>
                        </>
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

      {/* Reddet Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => {
            if (!isProcessing) {
              setShowRejectModal(false);
              setSelectedRequest(null);
              setRejectionReason('');
            }
          }} />
          <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
            <div className="px-6 pt-6">
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-full bg-red-100 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l6.518 11.59c.75 1.334-.213 2.985-1.743 2.985H3.482c-1.53 0-2.493-1.651-1.743-2.985l6.518-11.59zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">Masraf Talebini Reddet</h3>
                  <p className="mt-1 text-sm text-gray-600 mb-4">
                    Bu masraf talebini reddetmek istediğinizden emin misiniz? Lütfen reddetme nedenini açıklayın.
                  </p>
                  <div>
                    <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
                      Reddetme Nedeni <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="rejectionReason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Reddetme nedeninizi yazın..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm text-gray-900"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!isProcessing) {
                    setShowRejectModal(false);
                    setSelectedRequest(null);
                    setRejectionReason('');
                  }
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-100 transition"
                disabled={isProcessing}
              >
                İptal
              </button>
              <button
                type="button"
                onClick={confirmReject}
                disabled={isProcessing || !rejectionReason.trim()}
                className={`px-4 py-2 rounded-lg text-sm text-white transition ${
                  isProcessing || !rejectionReason.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                }`}
              >
                {isProcessing ? 'İşleniyor...' : 'Reddet'}
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}

// Ödeme Takip İçeriği
function OdemeTakipContent() {
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

  // Close modal with ESC (native modal UX)
  useEffect(() => {
    if (!showPaymentModal) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isProcessing) return;
        setShowPaymentModal(false);
        setSelectedRequest(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showPaymentModal, isProcessing]);

  const fetchApprovedExpenseRequests = async () => {
    try {
      setIsLoading(true);
      const result = await ApiService.getAllExpenseRequests(pageNumber, 10);
      if (result && result.success && result.data) {
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
    <>
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
        </div>
      )}

      {/* Ödeme Modal */}
      {showPaymentModal && selectedRequest && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => {
              if (isProcessing) return;
              setShowPaymentModal(false);
              setSelectedRequest(null);
            }}
          />
          <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
            <div className="px-6 pt-6">
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-full bg-green-100 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-gray-900">Ödeme Olarak İşaretle</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Ödeme yöntemini seçerek masraf talebini <span className="font-medium">Ödendi</span> olarak işaretleyebilirsiniz.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ödeme Yöntemi</label>
                  <select
                    value={paymentData.paymentMethod}
                    onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  >
                    <option value="">Seçiniz</option>
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedRequest(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-100 transition"
                disabled={isProcessing}
              >
                İptal
              </button>
              <button
                type="button"
                onClick={confirmMarkAsPaid}
                disabled={isProcessing}
                className={`px-4 py-2 rounded-lg text-sm text-white transition ${
                  isProcessing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                }`}
              >
                {isProcessing ? 'İşaretleniyor...' : 'Ödendi Olarak İşaretle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

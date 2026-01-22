export function normalizeStatusKey(status) {
  if (status === null || status === undefined) return 'unknown';

  // numbers or numeric strings from .NET enum serialization
  const s = typeof status === 'string' ? status.trim() : status;
  const num = typeof s === 'number' ? s : (typeof s === 'string' && s !== '' && !Number.isNaN(Number(s)) ? Number(s) : null);
  if (num !== null) {
    switch (num) {
      case 0: return 'pending';
      case 1: return 'approved';
      case 2: return 'rejected';
      case 3: return 'cancelled';
      default: return 'unknown';
    }
  }

  const str = String(s);
  switch (str) {
    case 'Pending':
    case 'pending':
    case 'Beklemede':
      return 'pending';
    case 'Approved':
    case 'approved':
    case 'Onaylandı':
      return 'approved';
    case 'Rejected':
    case 'rejected':
    case 'Reddedildi':
      return 'rejected';
    case 'Cancelled':
    case 'cancelled':
    case 'İptal':
    case 'İptal Edildi':
      return 'cancelled';
    case 'Paid':
    case 'paid':
    case 'Ödendi':
      return 'paid';
    default:
      return 'unknown';
  }
}

export function getStatusTextTR(status) {
  const key = normalizeStatusKey(status);
  switch (key) {
    case 'pending': return 'Beklemede';
    case 'approved': return 'Onaylandı';
    case 'rejected': return 'Reddedildi';
    case 'cancelled': return 'İptal Edildi';
    case 'paid': return 'Ödendi';
    default:
      return typeof status === 'string' && status.trim() ? status : '-';
  }
}

export function getStatusBadgeClass(status) {
  const key = normalizeStatusKey(status);
  switch (key) {
    case 'approved': return 'bg-green-900/50 text-green-300 border border-green-700';
    case 'rejected': return 'bg-red-900/50 text-red-300 border border-red-700';
    case 'cancelled': return 'bg-gray-700 text-gray-300 border border-gray-600';
    case 'paid': return 'bg-blue-900/50 text-blue-300 border border-blue-700';
    case 'pending':
    default:
      return 'bg-yellow-900/50 text-yellow-300 border border-yellow-700';
  }
}

export function isPendingStatus(status) {
  return normalizeStatusKey(status) === 'pending';
}


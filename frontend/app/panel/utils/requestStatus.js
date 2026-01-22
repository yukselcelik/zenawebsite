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
    case 'approved': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    case 'cancelled': return 'bg-gray-100 text-gray-800';
    case 'paid': return 'bg-blue-100 text-blue-800';
    case 'pending':
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
}

export function isPendingStatus(status) {
  return normalizeStatusKey(status) === 'pending';
}


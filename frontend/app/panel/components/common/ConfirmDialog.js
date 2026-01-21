'use client';

export default function ConfirmDialog({
  open,
  title = 'Emin misiniz?',
  message = 'Bu işlemi gerçekleştirmek istediğinize emin misiniz?',
  confirmText = 'Evet',
  cancelText = 'Vazgeç',
  onConfirm,
  onCancel,
  loading = false,
  confirmButtonClass = 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800'
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
        <div className="px-6 pt-6">
          <div className="flex items-start gap-3">
            <div className="shrink-0 rounded-full bg-orange-100 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l6.518 11.59c.75 1.334-.213 2.985-1.743 2.985H3.482c-1.53 0-2.493-1.651-1.743-2.985l6.518-11.59zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">{title}</h3>
              <p className="mt-1 text-sm text-gray-600">{message}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-100 transition"
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm text-white transition ${loading ? 'bg-gray-400' : confirmButtonClass}`}
          >
            {loading ? 'İşleniyor...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}



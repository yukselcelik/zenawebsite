// Çalışan paneli sayfası - Giriş yapmış çalışanların görebileceği sayfa

'use client'; // Client-side bileşen - state yönetimi için

import { useState, useEffect } from 'react'; // React hooks - state ve lifecycle yönetimi için
import { useRouter } from 'next/navigation'; // Next.js router - sayfa yönlendirmesi için
import ApiService from '../../lib/api'; // API servis sınıfı

export default function CalisanPaneli() {
  // useState ile çalışan verilerini ve loading durumunu yönetiyoruz
  const [employeeData, setEmployeeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // useEffect ile sayfa yüklendiğinde çalışan verilerini çekiyoruz
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // LocalStorage'dan token'ı al
        const token = localStorage.getItem('employeeToken');
        
        if (!token) {
          // Token yoksa giriş sayfasına yönlendir
          router.push('/calisan-girisi');
          return;
        }

        // Backend API'den verileri çek
        const profileData = await ApiService.getProfile();

        setEmployeeData(profileData.data);

      } catch (error) {
        console.error('Data fetch error:', error);
        if (error.message.includes('Geçersiz token') || error.message.includes('401')) {
          // Token geçersizse giriş sayfasına yönlendir
          localStorage.removeItem('employeeToken');
          localStorage.removeItem('userEmail');
          router.push('/calisan-girisi');
        } else {
          setError('Veriler yüklenirken hata oluştu');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeData();
  }, [router]);

  // Çıkış yapma fonksiyonu
  const handleLogout = async () => {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('userEmail');
    router.push('/calisan-girisi');
  };

  // Loading durumu
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-800">ZENA</span>
                <span className="text-sm text-orange-500 block -mt-1">enerji</span>
              </div>
            </div>

            {/* Çıkış butonu */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      {/* Ana içerik */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        
        {/* Hoş geldin mesajı */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Hoş Geldin!
              </h1>
              <p className="text-gray-600 mb-4">
                Başarıyla giriş yaptınız.
              </p>
              
              {/* Kullanıcı bilgileri */}
              <div className="mt-6 bg-gray-50 rounded-lg p-6 text-left max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Bilgileriniz</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Kullanıcı ID</dt>
                    <dd className="text-sm text-gray-900">{employeeData?.userId}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">E-posta</dt>
                    <dd className="text-sm text-gray-900">{employeeData?.email}</dd>
                  </div>
                </dl>
              </div>

              {/* Ana sayfaya dönüş linki */}
              <div className="mt-8">
                <a 
                  href="/" 
                  className="text-orange-600 hover:text-orange-500 transition-colors"
                >
                  ← Ana sayfaya dön
                </a>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

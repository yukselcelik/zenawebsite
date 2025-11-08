// Çalışan giriş sayfası - Firmada çalışan kişilerin giriş yapabileceği sayfa
// Bu sayfa çalışanların şifre ile giriş yapmasını ve izin durumlarını görmesini sağlar

'use client'; // Client-side bileşen - form yönetimi için

import { useState, useEffect } from 'react'; // useState ve useEffect hook'ları - form state ve lifecycle yönetimi için
import { useRouter } from 'next/navigation'; // Next.js router - sayfa yönlendirmesi için
import Link from 'next/link'; // Next.js Link bileşeni
import ApiService from '../../lib/api'; // API servis sınıfı

export default function CalisanGirisi() {
  // useState ile form verilerini ve giriş durumunu yönetiyoruz
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false); // Yükleme durumu
  const [error, setError] = useState(''); // Hata mesajı
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Giriş kontrolü durumu
  const router = useRouter(); // Router hook'u

  // Sayfa yüklendiğinde kullanıcının zaten giriş yapmış olup olmadığını kontrol et
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('employeeToken');
      if (token) {
        // Token varsa panele yönlendir
        router.push('/panel');
      } else {
        // Token yoksa giriş sayfasında kal
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  // Form alanlarını güncelleyen fonksiyon
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Hata mesajını temizle
  };

  // Giriş formunu gönderen fonksiyon
  const handleSubmit = async (e) => {
    e.preventDefault(); // Sayfa yenilenmesini engeller
    setIsLoading(true); // Yükleme durumunu aktif et
    setError(''); // Hata mesajını temizle

    try {
      // Backend API'ye giriş isteği gönder
      const data = await ApiService.login(loginData.email, loginData.password);

      // Giriş başarılı - token'ı sakla
      localStorage.setItem('employeeToken', data.data.token);
      localStorage.setItem('userEmail', data.data.email);
      
      // Kullanıcı bilgilerini al (role dahil)
      try {
        const profileData = await ApiService.getProfile();
        if (profileData.data?.role) {
          localStorage.setItem('userRole', profileData.data.role);
        }
      } catch (profileError) {
        console.error('Profile fetch error:', profileError);
        // Profile fetch hatası login'i engellemez
      }
      
      // Tüm kullanıcıları panele yönlendir
      router.push('/panel');
    } catch (error) {
      // Hata mesajını göster
      setError(error.message || 'Giriş başarısız!');
    } finally {
      setIsLoading(false); // Yükleme durumunu kapat
    }
  };

  // Giriş kontrolü yapılırken loading göster
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Logo ve başlık */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            {/* Güneş ikonu */}
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-800">ZENA</span>
              <span className="text-sm text-orange-500 block -mt-1">enerji</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Çalışan Girişi
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Çalışan paneline erişmek için giriş yapın
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {/* Hata mesajı */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Giriş formu */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* E-posta alanı */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={loginData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="E-posta adresinizi girin"
                />
              </div>
            </div>

            {/* Şifre alanı */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={loginData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Şifrenizi girin"
                />
              </div>
            </div>

            {/* Giriş butonu */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Giriş yapılıyor...
                  </div>
                ) : (
                  'Giriş Yap'
                )}
              </button>
            </div>
          </form>

          {/* Kayıt ol linki */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Hesabınız yok mu?{' '}
              <Link 
                href="/kayit-ol" 
                className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
              >
                Kayıt olun
              </Link>
            </p>
          </div>

          {/* Ana sayfaya dönüş linki */}
          <div className="mt-4 text-center">
            <a 
              href="/" 
              className="text-sm text-orange-600 hover:text-orange-500 transition-colors"
            >
              ← Ana sayfaya dön
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

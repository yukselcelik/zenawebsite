// Kayıt ol sayfası - Yeni kullanıcıların kayıt olabileceği sayfa

'use client'; // Client-side bileşen - form yönetimi için

import { useState, useEffect } from 'react'; // useState ve useEffect hook'ları
import { useRouter } from 'next/navigation'; // Next.js router - sayfa yönlendirmesi için
import Link from 'next/link'; // Next.js Link bileşeni
import ApiService from '../../lib/api'; // API servis sınıfı

export default function KayitOl() {
  // useState ile form verilerini ve kayıt durumunu yönetiyoruz
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false); // Yükleme durumu
  const [error, setError] = useState(''); // Hata mesajı
  const [successMessage, setSuccessMessage] = useState(''); // Başarı mesajı
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Giriş kontrolü durumu
  const router = useRouter(); // Router hook'u

  // Sayfa yüklendiğinde kullanıcının zaten giriş yapmış olup olmadığını kontrol et
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('employeeToken');
      if (token) {
        // Token varsa çalışan paneline yönlendir
        router.push('/panel');
      } else {
        // Token yoksa kayıt sayfasında kal
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  // Form alanlarını güncelleyen fonksiyon
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Hata mesajını temizle
  };

  // Kayıt formunu gönderen fonksiyon
  const handleSubmit = async (e) => {
    e.preventDefault(); // Sayfa yenilenmesini engeller
    setIsLoading(true); // Yükleme durumunu aktif et
    setError(''); // Hata mesajını temizle

    // Email doğrulaması - @zenaenerji.com ile bitmeli
    const emailLower = registerData.email.toLowerCase().trim();
    if (!emailLower.endsWith('@zenaenerji.com')) {
      setError('Zena Enerji Firmasında ait böyle bir mail bulunmamaktadır. Lütfen @zenaenerji.com uzantılı e-posta adresinizi kullanın.');
      setIsLoading(false);
      return;
    }

    // Şifre doğrulama
    if (registerData.password !== registerData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      setIsLoading(false);
      return;
    }

    // Şifre uzunluk kontrolü
    if (registerData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      setIsLoading(false);
      return;
    }

    try {
      // Backend API'ye kayıt isteği gönder
      const data = await ApiService.register({
        email: registerData.email,
        password: registerData.password
      });

      // Kayıt başarılı mesajını kontrol et
      const successMessage = data.message || 'Kayıt işleminiz başarıyla tamamlandı.';

      // Token varsa sakla ve giriş yap
      if (data.data?.token) {
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
          // Profile fetch hatası kayıtı engellemez
        }
        
        // Başarı mesajını göster ve panele yönlendir
        setSuccessMessage(successMessage);
        setTimeout(() => {
          router.push('/panel');
        }, 2000); // 2 saniye sonra yönlendir
      } else {
        // Token yoksa sadece mesaj göster
        setError(successMessage);
      }
    } catch (error) {
      // Hata mesajını göster
      setError(error.message || 'Kayıt başarısız');
    } finally {
      setIsLoading(false); // Yükleme durumunu kapat
    }
  };

  // Giriş kontrolü yapılırken loading göster
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
              <span className="text-2xl font-bold text-white">ZENA</span>
              <span className="text-sm text-orange-500 block -mt-1">enerji</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">
            Kayıt Ol
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Yeni hesap oluşturun
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 border border-gray-700 py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10">
          
          {/* Başarı mesajı */}
          {successMessage && (
            <div className="mb-4 bg-green-900/20 border border-green-800 text-green-200 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {successMessage}
              </div>
            </div>
          )}

          {/* Hata mesajı */}
          {error && (
            <div className="mb-4 bg-red-900/20 border border-red-800 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Kayıt formu */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* E-posta alanı */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                E-posta
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={registerData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-md placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="ornek@zenaenerji.com"
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Sadece @zenaenerji.com uzantılı e-posta adresleri kabul edilir.
              </p>
            </div>

            {/* Şifre alanı */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Şifre
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={registerData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-md placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="En az 6 karakter"
                />
              </div>
            </div>

            {/* Şifre tekrar alanı */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Şifre Tekrar
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={registerData.confirmPassword}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-md placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Şifrenizi tekrar girin"
                />
              </div>
            </div>

            {/* Kayıt butonu */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Kayıt yapılıyor...
                  </div>
                ) : (
                  'Kayıt Ol'
                )}
              </button>
            </div>
          </form>

          {/* Giriş yap linki */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Zaten hesabınız var mı?{' '}
              <Link 
                href="/calisan-girisi" 
                className="font-medium text-orange-400 hover:text-orange-300 transition-colors"
              >
                Giriş yapın
              </Link>
            </p>
          </div>

          {/* Ana sayfaya dönüş linki */}
          <div className="mt-4 text-center">
            <a 
              href="/" 
              className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
            >
              ← Ana sayfaya dön
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

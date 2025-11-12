// Kariyer sayfası - İş başvuru ve staj başvuru formları
// Bu sayfa çalışan başvurularını ve staj başvurularını toplar

'use client'; // Client-side bileşen - form yönetimi için

import Header from '../components/Header'; // Header bileşenini import ediyoruz
import Footer from '../components/Footer'; // Footer bileşenini import ediyoruz
import PhoneInput from '../components/PhoneInput'; // PhoneInput bileşenini import ediyoruz
import { useState } from 'react'; // useState hook'u - form state yönetimi için
import ApiService from '../../lib/api'; // API servis sınıfı

export default function Kariyer() {
  // useState ile form verilerini yönetiyoruz
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    birthDate: '',
    education: '',
    position: '',
    school: '',
    department: '',
    year: '',
    message: '',
    cv: null,
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form alanlarını güncelleyen fonksiyon
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Form gönderme fonksiyonu
  const handleSubmit = async (e) => {
    e.preventDefault(); // Sayfa yenilenmesini engeller
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    
    try {
      // Eğer pozisyon "staj" ise staj başvurusu API'sine gönder
      if (formData.position === 'staj') {
        const internshipData = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          school: formData.school || '',
          department: formData.department || '',
          year: formData.year || '',
          message: formData.message || ''
        };

        // Dosya varsa birlikte gönder
        await ApiService.submitInternshipApplication(internshipData, formData.cv);
        
        // Başvuru başarılı
        setSubmitSuccess(true);
        
        // Formu temizle
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          birthDate: '',
          education: '',
          position: '',
          school: '',
          department: '',
          year: '',
          message: '',
          cv: null,
          consent: false
        });
      } else {
        // Diğer pozisyonlar için mevcut API'ye gönder
        const response = await fetch('/api/applications/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            birthDate: formData.birthDate,
            education: formData.education,
            position: formData.position,
            kvkkConsent: formData.consent
          }),
        });

        const result = await response.json();

        if (response.ok) {
          // Başvuru başarılı
          setSubmitSuccess(true);
          
          // Formu temizle
          setFormData({
            fullName: '',
            phone: '',
            email: '',
            birthDate: '',
            education: '',
            position: '',
            school: '',
            department: '',
            year: '',
            message: '',
            cv: null,
            consent: false
          });
        } else {
          setSubmitError(result.message || 'Başvuru gönderilirken hata oluştu');
        }
      }
    } catch (error) {
      // Ağ hatası
      setSubmitError(error.message || 'Bağlantı hatası! Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header bileşeni */}
      <Header />
      
      {/* Sayfa başlığı */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Kariyer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Enerji sektöründe birlikte çalışmaya, öğrenmeye ve gelişime açık adaylarla tanışmaktan büyük bir memnuniyet duyarız. Ekip ruhuna değer veren, sorumluluk bilinci yüksek ve geleceğe katkı sunmayı hedefleyen çalışma arkadaşlarının başvurularını bekliyoruz.
          </p>
          
          {/* Bilgi kutusu */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-gray-700">
              <strong>Başvuru Süreci:</strong> Bizlere başvurmak için aşağıdaki formu doldurmanız yeterlidir. Başvurular ekibimiz tarafından özenle incelenecek ve uygun bulunması halinde sizinle en kısa sürede iletişime geçilecektir.
            </p>
          </div>
        </div>
      </section>

      {/* Başvuru formu */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              Başvurunuz başarıyla gönderildi! Teşekkür ederiz.
            </div>
          )}
          {submitError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {submitError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Ad Soyad alanı */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Adınız Soyadınız <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Ad Soyad"
                required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              />
            </div>

            {/* Telefon alanı */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefon Numaranız <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value })}
                placeholder="5XX XXX XX XX"
                required
              />
            </div>

            {/* E-posta alanı */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-Posta Adresiniz <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="E-Posta"
                required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              />
            </div>

            {/* Doğum tarihi alanı */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                Doğum Tarihiniz <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              />
            </div>

            {/* Eğitim durumu alanı */}
            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                Eğitim Durumunuz <span className="text-red-500">*</span>
              </label>
              <select
                id="education"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              >
                <option value="">Eğitim Durumu Seçiniz</option>
                <option value="lise">Lise</option>
                <option value="onlisans">Ön Lisans</option>
                <option value="lisans">Lisans</option>
                <option value="yukseklisans">Yüksek Lisans</option>
                <option value="doktora">Doktora</option>
              </select>
            </div>

            {/* Pozisyon alanı */}
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                Başvurmak İstediğiniz Pozisyon <span className="text-red-500">*</span>
              </label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              >
                <option value="">Pozisyon Seçiniz</option>
                <option value="staj">Staj</option>
                <option value="elektrik-muhendisi">Elektrik Mühendisi</option>
                <option value="mekanik-muhendisi">Mekanik Mühendisi</option>
                <option value="proje-muduru">Proje Müdürü</option>
                <option value="tekniker">Tekniker</option>
                <option value="saha-sorumlusu">Saha Sorumlusu</option>
                <option value="satış-temsilcisi">Satış Temsilcisi</option>
                <option value="diger">Diğer</option>
              </select>
            </div>

            {/* Staj için özel alanlar */}
            {formData.position === 'staj' && (
              <>
                <div>
                  <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
                    Okul <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="school"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    placeholder="Okul adı"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    Bölüm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Bölüm adı"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                    Sınıf
                  </label>
                  <input
                    type="text"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="Örn: 3. Sınıf"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mesajınız
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Eklemek istediğiniz bir mesaj varsa yazabilirsiniz..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </>
            )}

            {/* CV yükleme alanı */}
            <div>
              <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-2">
                CV Yükleyiniz (PDF, DOC, DOCX)
              </label>
              <input
                type="file"
                id="cv"
                name="cv"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFormData(prev => ({ ...prev, cv: e.target.files[0] }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              />
            </div>

            {/* KVKK onay kutusu */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="consent"
                name="consent"
                checked={formData.consent}
                onChange={handleInputChange}
                required
                className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="consent" className="text-sm text-gray-700">
                <span className="text-red-500">*</span> Kişisel verilerimin KVKK Aydınlatma Metni kapsamında işlenmesine izin veriyorum.
              </label>
            </div>

            {/* Gönder butonu */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Gönderiliyor...' : 'Başvur'}
            </button>
          </form>
        </div>
      </section>

      {/* Çalışan giriş bölümü */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Mevcut Çalışanlarımız
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Zena Enerji'de çalışıyorsanız, aşağıdaki butona tıklayarak çalışan panelinize giriş yapabilirsiniz.
          </p>
          <a 
            href="/calisan-girisi"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-300"
          >
            Çalışan Girişi
          </a>
        </div>
      </section>

      {/* Footer bileşeni */}
      <Footer />
    </div>
  );
}

'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import PhoneInput from '../components/PhoneInput';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ApiService from '../../lib/api';

export default function Kariyer() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
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

  useEffect(() => {
    if (submitError && submitError.toLowerCase().includes('unauthorized')) {
      router.push('/calisan-girisi');
    }
  }, [submitError, router]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const internshipData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        education: formData.education,
        school: formData.school || '',
        department: formData.department || '',
        year: formData.year || '',
        message: formData.message || ''
      };
      await ApiService.submitInternshipApplication(internshipData, formData.cv);
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(error.message || 'Bağlantı hatası! Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="relative h-[300px] overflow-hidden -mt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&q=80)` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-orange-500">
              Kariyer
            </h1>
            <p className="text-sm md:text-base text-white/90 leading-relaxed">
              Enerji sektöründe birlikte çalışmaya, öğrenmeye ve gelişime açık adaylarla tanışmaktan büyük bir memnuniyet duyarız. Ekip ruhuna değer veren, sorumluluk bilinci yüksek ve geleceğe katkı sunmayı hedefleyen çalışma arkadaşlarının başvurularını bekliyoruz.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-gray-700">
              <strong>Başvuru Süreci:</strong> Bizlere başvurmak için aşağıdaki formu doldurmanız yeterlidir. Başvurular ekibimiz tarafından özenle incelenecek ve uygun bulunması halinde sizinle en kısa sürede iletişime geçilecektir.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white relative">
        {/* Arka plan görseli - hafif şeffaf */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-75"
          style={{ backgroundImage: `url(/kariyer.png)` }}
        ></div>
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 md:p-10">
            {submitSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                Başvurunuz başarıyla gönderildi. Teşekkür ederiz.
              </div>
            )}
            {submitError && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {submitError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">
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
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-medium shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                Telefon Numaranız <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value })}
                placeholder="5XX XXX XX XX"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
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
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-medium shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="education" className="block text-sm font-semibold text-gray-900 mb-2">
                Eğitim Durumunuz <span className="text-red-500">*</span>
              </label>
              <select
                id="education"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-medium shadow-sm"
              >
                <option value="">Eğitim Durumu Seçiniz</option>
                <option value="lise">Lise</option>
                <option value="onlisans">Ön Lisans</option>
                <option value="lisans">Lisans</option>
                <option value="yukseklisans">Yüksek Lisans</option>
                <option value="doktora">Doktora</option>
              </select>
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-semibold text-gray-900 mb-2">
                Başvurmak İstediğiniz Pozisyon <span className="text-red-500">*</span>
              </label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-medium shadow-sm"
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

            {formData.position === 'staj' && (
              <>
                <div>
                  <label htmlFor="school" className="block text-sm font-semibold text-gray-900 mb-2">
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
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-medium shadow-sm"
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-semibold text-gray-900 mb-2">
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
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-medium shadow-sm"
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-semibold text-gray-900 mb-2">
                    Sınıf
                  </label>
                  <input
                    type="text"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="Örn: 3. Sınıf"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-medium shadow-sm"
                  />
                </div>
              </>
            )}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                Mesajınız
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                placeholder="Eklemek istediğiniz bir mesaj varsa yazabilirsiniz..."
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-medium shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="cv" className="block text-sm font-semibold text-gray-900 mb-2">
                CV Yükleyiniz (PDF, DOC, DOCX)
              </label>
              <input
                type="file"
                id="cv"
                name="cv"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFormData(prev => ({ ...prev, cv: e.target.files[0] }))}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-medium shadow-sm"
              />
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="consent"
                name="consent"
                checked={formData.consent}
                onChange={handleInputChange}
                required
                className="mt-1 w-4 h-4 text-orange-600 border-2 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="consent" className="text-sm font-medium text-gray-900">
                <span className="text-red-500">*</span> Kişisel verilerimin KVKK Aydınlatma Metni kapsamında işlenmesine izin veriyorum.
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Gönderiliyor...' : 'Başvur'}
            </button>
          </form>
          </div>
        </div>
      </section>

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

      <Footer />
    </div>
  );
}

// İletişim sayfası - İletişim formu ve şirket bilgileri
// Bu sayfa kullanıcıların şirketle iletişime geçmesini sağlar

'use client'; // Client-side bileşen - form yönetimi için

import Header from '../components/Header'; // Header bileşenini import ediyoruz
import Footer from '../components/Footer'; // Footer bileşenini import ediyoruz
import PhoneInput from '../components/PhoneInput'; // PhoneInput bileşenini import ediyoruz
import { useState } from 'react'; // useState hook'u - form state yönetimi için

export default function Iletisim() {
  // useState ile form verilerini yönetiyoruz
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: '',
    consent: false
  });

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
    
    try {
      // API'ye mesaj gönder
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Mesaj başarılı
        alert(`Mesajınız başarıyla gönderildi. Mesaj No: ${result.messageId}`);
        
        // Formu temizle
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          message: '',
          consent: false
        });
      } else {
        // Mesaj başarısız
        alert(`Hata: ${result.message}`);
      }
    } catch (error) {
      // Ağ hatası
      alert('Bağlantı hatası. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header bileşeni */}
      <Header />
      
      {/* Hero Section - Header arkasında küçük banner */}
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
              İletişim
            </h1>
            <p className="text-sm md:text-base text-white/90 leading-relaxed">
              Her türlü soru, öneri veya geri bildiriminiz için bizimle iletişime geçebilirsiniz. Aşağıdaki formu doldurarak mesajınızı iletebilir, ayrıca telefon, e-posta ve adres bilgilerimiz üzerinden doğrudan bize ulaşabilirsiniz. Size en kısa sürede dönüş yapacağız.
            </p>
          </div>
        </div>
      </section>

      {/* Ana içerik bölümü */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Sol taraf - Görsel */}
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Contact us" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Sağ taraf - İletişim formu */}
            <div>
              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  İletişim Formu
                </h2>
                <p className="text-gray-600 mb-6">
                  Sorularınızı, önerilerinizi veya taleplerinizi bize iletin. En kısa sürede size geri döneceğiz.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Ad Soyad alanı */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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

                  {/* Mesaj alanı */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mesajınız <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Mesajınızı yazınız"
                      rows={4}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
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
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                  >
                    Gönder
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* İletişim bilgileri bölümü */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              İletişim Bilgilerimiz
            </h2>
            <p className="text-lg text-gray-600">
              Size daha iyi hizmet verebilmek için her zaman yanınızdayız.
            </p>
          </div>

          {/* İletişim kartları */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Adres kartı */}
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Adres</h3>
              <p className="text-gray-600">
                Fenerbahçe Mahallesi<br />
                Bağdat Caddesi No:200/6<br />
                Kadıköy/İstanbul
              </p>
            </div>

            {/* Telefon kartı */}
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Telefon</h3>
              <p className="text-gray-600">
                <a href="tel:+902166064458" className="hover:text-orange-500 transition-colors">
                  +90 (216) 606 44 58
                </a>
              </p>
            </div>

            {/* E-posta kartı */}
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">E-Posta</h3>
              <p className="text-gray-600">
                <a href="mailto:info@zenaenerji.com" className="hover:text-orange-500 transition-colors">
                  info@zenaenerji.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer bileşeni */}
      <Footer />
    </div>
  );
}

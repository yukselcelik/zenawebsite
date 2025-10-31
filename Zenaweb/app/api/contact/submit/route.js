// İletişim formu API endpoint'i - POST /api/contact/submit
// Bu endpoint iletişim formundan gelen mesajları işler

import { NextResponse } from 'next/server'; // Next.js API response bileşeni

// Geçici bellek içi mesaj depolama (sunucu yeniden başlatılınca sıfırlanır)
const inMemoryMessages = [];
let nextId = 1;

export async function POST(request) {
  try {
    // Request body'den form verilerini al
    const formData = await request.json();

    // Gerekli alanları kontrol et
    if (!formData.name || !formData.email || !formData.message) {
      return NextResponse.json(
        { message: 'Ad, e-posta ve mesaj alanları gereklidir' },
        { status: 400 }
      );
    }

    // E-posta formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        { message: 'Geçerli bir e-posta adresi giriniz' },
        { status: 400 }
      );
    }

    // KVKK onayını kontrol et
    if (!formData.kvkkConsent) {
      return NextResponse.json(
        { message: 'KVKK onayı gereklidir' },
        { status: 400 }
      );
    }

    // Bellek içine kaydet
    const messageId = nextId++;
    inMemoryMessages.unshift({
      id: messageId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      subject: formData.subject || null,
      message: formData.message,
      kvkkConsent: formData.kvkkConsent,
      status: 'Okunmadı',
      createdAt: new Date().toISOString()
    });

    // Başarılı yanıt
    return NextResponse.json({
      message: 'Mesajınız başarıyla gönderildi',
      messageId: messageId,
      status: 'Okunmadı'
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { message: 'Mesaj gönderilirken hata oluştu' },
      { status: 500 }
    );
  }
}

// Admin için mesajları listeleme endpoint'i
export async function GET(request) {
  try {
    // Basit admin kontrolü (gerçek uygulamada daha güvenli olmalı)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Yetki gerekli' },
        { status: 401 }
      );
    }

    // Tüm mesajları getir (bellekten)
    return NextResponse.json({
      messages: inMemoryMessages,
      total: inMemoryMessages.length
    });

  } catch (error) {
    console.error('Contact messages fetch error:', error);
    return NextResponse.json(
      { message: 'Mesajlar getirilirken hata oluştu' },
      { status: 500 }
    );
  }
}
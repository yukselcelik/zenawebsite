// İş başvurusu API endpoint'i - POST /api/applications/submit
// Bu endpoint iş başvurularını ve staj başvurularını işler

import { NextResponse } from 'next/server'; // Next.js API response bileşeni

// Geçici bellek içi başvuru depolama (sunucu yeniden başlatılınca sıfırlanır)
const inMemoryApplications = [];
let nextId = 1;

export async function POST(request) {
  try {
    // Request body'den form verilerini al
    const formData = await request.json();

    // Form alanlarını kariyer sayfası ile hizala (fallback'ler)
    const normalized = {
      applicationType: formData.position || formData.applicationType || 'genel',
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || null,
      birthDate: formData.birthDate || null,
      education: formData.education || null,
      cvFileName: formData.cv?.name || null,
      kvkkConsent: formData.consent ?? formData.kvkkConsent ?? false,
      createdAt: new Date().toISOString(),
      status: 'Beklemede'
    };

    // Gerekli alanları kontrol et
    if (!normalized.applicationType || !normalized.fullName || !normalized.email) {
      return NextResponse.json(
        { message: 'Başvuru türü, ad soyad ve e-posta gereklidir' },
        { status: 400 }
      );
    }

    // KVKK onayını kontrol et
    if (!normalized.kvkkConsent) {
      return NextResponse.json(
        { message: 'KVKK onayı gereklidir' },
        { status: 400 }
      );
    }

    // E-posta formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalized.email)) {
      return NextResponse.json(
        { message: 'Geçerli bir e-posta adresi giriniz' },
        { status: 400 }
      );
    }

    // Bellek içine kaydet
    const applicationId = nextId++;
    inMemoryApplications.unshift({ id: applicationId, ...normalized });

    // Başarılı yanıt
    return NextResponse.json({
      message: 'Başvurunuz başarıyla gönderildi',
      applicationId: applicationId,
      status: 'Beklemede'
    });

  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { message: 'Başvuru gönderilirken hata oluştu' },
      { status: 500 }
    );
  }
}

// Admin için başvuruları listeleme endpoint'i
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

    // Tüm başvuruları getir (bellekten)
    return NextResponse.json({
      applications: inMemoryApplications,
      total: inMemoryApplications.length
    });

  } catch (error) {
    console.error('Applications fetch error:', error);
    return NextResponse.json(
      { message: 'Başvurular getirilirken hata oluştu' },
      { status: 500 }
    );
  }
}
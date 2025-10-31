// Çalışan giriş API endpoint'i - POST /api/auth/login
// Bu endpoint artık backend API'ye proxy olarak çalışır

import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5133';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Backend API'ye isteği yönlendir
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
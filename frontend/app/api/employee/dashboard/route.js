// Çalışan dashboard API endpoint'i - GET /api/employee/dashboard
// Bu endpoint giriş yapmış çalışanların izin durumlarını ve bilgilerini döner

import { NextResponse } from 'next/server'; // Next.js API response bileşeni
import jwt from 'jsonwebtoken'; // JWT token doğrulama için

// Statik çalışan veri kaynağı (geçici)
const staticEmployees = [
  {
    id: 1,
    username: 'admin',
    name: 'Yönetici',
    email: 'admin@zena.com',
    phone: '+90 555 000 00 00',
    department: 'Yönetim',
    position: 'Admin',
    hire_date: '2023-01-01',
    total_days: 20,
    used_days: 2,
    remaining_days: 18,
  },
  {
    id: 2,
    username: 'calisan',
    name: 'Zena Çalışan',
    email: 'calisan@zena.com',
    phone: '+90 555 111 11 11',
    department: 'Operasyon',
    position: 'Personel',
    hire_date: '2024-05-10',
    total_days: 14,
    used_days: 5,
    remaining_days: 9,
  }
];

const staticLeaveHistory = {
  1: [
    { id: 101, leave_type: 'Yıllık İzin', days: 2, start_date: '2024-08-01', end_date: '2024-08-02', status: 'Onaylandı', reason: 'Aile ziyareti', created_at: '2024-07-20' }
  ],
  2: [
    { id: 201, leave_type: 'Raporlu', days: 3, start_date: '2025-02-10', end_date: '2025-02-12', status: 'Onaylandı', reason: 'Sağlık', created_at: '2025-02-08' }
  ]
};

export async function GET(request) {
  try {
    // Authorization header'dan token'ı al
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token bulunamadı' },
        { status: 401 }
      );
    }

    // Token'ı çıkar
    const token = authHeader.substring(7);

    try {
      // Token'ı doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'zena-enerji-secret-key');
      
      // Statik çalışan bilgisini al
      const employee = staticEmployees.find(e => e.id === decoded.userId);
      if (!employee) {
        return NextResponse.json(
          { message: 'Çalışan bulunamadı' },
          { status: 404 }
        );
      }
      
      // İzin geçmişini al (statik)
      const leaveHistory = staticLeaveHistory[decoded.userId] || [];

      // Çalışan verilerini hazırla (şifre hariç)
      const employeeData = {
        id: employee.id,
        username: employee.username,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        position: employee.position,
        hireDate: employee.hire_date,
        totalDays: employee.total_days,
        usedDays: employee.used_days,
        remainingDays: employee.remaining_days,
        leaveHistory: leaveHistory.map(leave => ({
          id: leave.id,
          type: leave.leave_type,
          days: leave.days,
          startDate: leave.start_date,
          endDate: leave.end_date,
          status: leave.status,
          reason: leave.reason,
          createdAt: leave.created_at
        }))
      };

      return NextResponse.json(employeeData);

    } catch (jwtError) {
      return NextResponse.json(
        { message: 'Geçersiz token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
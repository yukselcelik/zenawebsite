'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ApiService from '../../lib/api';
import Sidebar from './components/Sidebar';
import Navbar from './components/AdminNavbar';

export default function PanelLayout({ children }) {
  const [userData, setUserData] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingLeaveCount, setPendingLeaveCount] = useState(0);
  const router = useRouter();

  const isManager = userData?.role === 'Manager';

  useEffect(() => {
    let logoutTimerId = null;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('employeeToken');
        if (!token) {
          router.push('/calisan-girisi');
          return;
        }

        // Token süresi dolmuşsa temizle ve yönlendir
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expMs = (payload?.exp || 0) * 1000;
          if (Date.now() >= expMs) {
            localStorage.removeItem('employeeToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            router.push('/calisan-girisi');
            return;
          } else {
            // Otomatik logout için kalan süre kadar timer kur
            const remaining = expMs - Date.now();
            logoutTimerId = setTimeout(() => {
              localStorage.removeItem('employeeToken');
              localStorage.removeItem('userRole');
              localStorage.removeItem('userName');
              router.push('/calisan-girisi');
            }, Math.max(remaining, 0));
          }
        } catch {}

        const profileData = await ApiService.getProfile();
        setUserData(profileData.data);

        // Kullanıcı detaylarını çek
        if (profileData.data?.userId) {
          const detailData = await ApiService.getUserDetail(parseInt(profileData.data.userId)).catch(() => null);
          if (detailData?.data) {
            setUserDetail(detailData.data);
          }
        }

        // Yönetici ise istatistikleri çek
        if (profileData.data?.role === 'Manager') {
          const [personnelData, leaveData, internshipData] = await Promise.all([
            ApiService.getPersonnelList(1, 10).catch(() => ({ data: { totalCount: 0, items: [] } })),
            ApiService.getAllLeaveRequests(1, 100).catch(() => ({ data: { items: [] } })),
            ApiService.getAllInternshipApplications(1, 1000).catch(() => ({ data: { totalCount: 0, items: [] } }))
          ]);

          const pendingLeaves = leaveData.data?.items?.filter(r => r.status === 'Pending').length || 0;
          setPendingLeaveCount(pendingLeaves);

          // Son aydaki staj başvurularını hesapla
          const totalInternshipCount = internshipData.data?.totalCount || 0;
          const internshipItems = internshipData.data?.items || [];
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          
          const lastMonthCount = internshipItems.filter(item => {
            if (!item.createdAt) return false;
            const createdAt = new Date(item.createdAt);
            return createdAt >= oneMonthAgo;
          }).length;

          setStats({
            personnelCount: personnelData.data?.totalCount || 0,
            pendingLeaves: pendingLeaves,
            internshipCount: totalInternshipCount,
            internshipLastMonthCount: lastMonthCount
          });
        } else {
          // Personel için izin taleplerini çek ve pending count'u hesapla
          try {
            const leaveData = await ApiService.getMyLeaveRequests(1, 100).catch(() => ({ data: { items: [] } }));
            const pendingLeaves = leaveData.data?.items?.filter(r => r.status === 'Pending').length || 0;
            setPendingLeaveCount(pendingLeaves);
          } catch (error) {
            console.error('Error fetching leave requests:', error);
          }
        }
      } catch (error) {
        console.error('Data fetch error:', error);
        if (error.message.includes('Geçersiz token') || error.message.includes('401')) {
          localStorage.removeItem('employeeToken');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userName');
          router.push('/calisan-girisi');
        } else {
          setError('Veriler yüklenirken hata oluştu');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      if (logoutTimerId) clearTimeout(logoutTimerId);
    };
  }, [router]);

  // Pending users count for personnel badge
  useEffect(() => {
    if (isManager) {
      ApiService.getPendingUsers(1, 10)
        .then(data => setPendingCount(data.data?.totalCount || 0))
        .catch(() => setPendingCount(0));
    } else {
      setPendingCount(0);
    }
  }, [isManager]);

  const handleLogout = () => {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    router.push('/calisan-girisi');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600"></p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sol Sidebar */}
      <Sidebar 
        isManager={isManager}
        pendingCount={pendingCount}
        pendingLeaveCount={pendingLeaveCount}
      />

      {/* Ana İçerik Alanı */}
      <div className="flex-1 flex flex-col">
        {/* Üst Navbar */}
        <Navbar 
          userData={userData} 
          onLogout={handleLogout} 
          isManager={isManager}
        />

        {/* İçerik */}
        <main className="flex-1 p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}


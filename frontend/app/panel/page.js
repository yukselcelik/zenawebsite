'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ApiService from '../../lib/api';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import UserProfile from './components/user/UserProfile';
import LeaveRequests from './components/leaves/LeaveRequests';
import CreateLeaveRequest from './components/leaves/CreateLeaveRequest';
import PersonnelList from './components/personnel/PersonnelList';
import PersonnelDetail from './components/personnel/PersonnelDetail';
import InternshipApplications from './components/internships/InternshipApplications';
import PendingUsers from './components/pending/PendingUsers';

export default function Panel() {
  const [userData, setUserData] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('panelActiveTab');
      if (savedTab) {
        return savedTab;
      }
      // Personel için default 'profile', Manager için 'dashboard'
      // Bu kontrolü userData yüklendikten sonra yapacağız
      return 'dashboard';
    }
    return 'dashboard';
  });
  const [selectedPersonnelId, setSelectedPersonnelId] = useState(null);
  const [stats, setStats] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingLeaveCount, setPendingLeaveCount] = useState(0);
  const [leaveRequestsRefreshKey, setLeaveRequestsRefreshKey] = useState(0);
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

        // Personel için default tab'ı 'profile' yap (sadece localStorage'da kayıt yoksa)
        if (profileData.data?.role !== 'Manager' && !localStorage.getItem('panelActiveTab')) {
          const defaultTab = 'profile';
          setActiveTab(defaultTab);
          localStorage.setItem('panelActiveTab', defaultTab);
        }

        // Yönetici ise istatistikleri çek
        if (profileData.data?.role === 'Manager') {
          const [personnelData, leaveData, internshipData] = await Promise.all([
            ApiService.getPersonnelList(1, 10).catch(() => ({ data: { totalCount: 0, items: [] } })),
            ApiService.getAllLeaveRequests(1, 100).catch(() => ({ data: { items: [] } })),
            ApiService.getAllInternshipApplications(1, 10).catch(() => ({ data: { totalCount: 0 } }))
          ]);

          const pendingLeaves = leaveData.data?.items?.filter(r => r.status === 'Pending').length || 0;
          setPendingLeaveCount(pendingLeaves);

          setStats({
            personnelCount: personnelData.data?.totalCount || 0,
            pendingLeaves: pendingLeaves,
            internshipCount: internshipData.data?.totalCount || 0
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

  // Pending users count for sidebar badge
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

  const handleUpdateUser = async (userId, updateData) => {
    try {
      await ApiService.updateUser(userId, updateData);
      // Kullanıcı detaylarını yenile
      const detailData = await ApiService.getUserDetail(userId);
      if (detailData?.data) {
        setUserDetail(detailData.data);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sol Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          localStorage.setItem('panelActiveTab', tab);
        }} 
        isManager={isManager}
        pendingCount={pendingCount}
        pendingLeaveCount={pendingLeaveCount}
        onPersonnelTabClick={() => {
          setSelectedPersonnelId(null);
        }}
      />

      {/* Ana İçerik Alanı */}
      <div className="flex-1 flex flex-col">
        {/* Üst Navbar */}
        <Navbar 
          userData={userData} 
          onLogout={handleLogout} 
          activeTab={activeTab}
          isManager={isManager}
        />

        {/* İçerik */}
        <main className="flex-1 p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <Dashboard isManager={isManager} stats={stats} userDetail={userDetail} />
          )}

          {activeTab === 'profile' && (
            <UserProfile 
              userDetail={userDetail} 
              onUpdate={async (userId, updateData) => {
                await handleUpdateUser(userId, updateData);
                // Refresh user detail
                const detailData = await ApiService.getUserDetail(userId);
                if (detailData?.data) {
                  setUserDetail(detailData.data);
                }
              }}
              onUserDetailUpdate={async (updatedDetail) => {
                // Refresh user detail after sub-section update
                const detailData = await ApiService.getUserDetail(userDetail.id);
                if (detailData?.data) {
                  setUserDetail(detailData.data);
                }
              }}
            />
          )}

          {activeTab === 'leaves' && (
            <LeaveRequests 
              key={leaveRequestsRefreshKey}
              isManager={isManager} 
              onLeaveRequestsChange={(count) => setPendingLeaveCount(count)}
              onCreateNew={() => {
                setActiveTab('create-leave');
                localStorage.setItem('panelActiveTab', 'create-leave');
              }}
            />
          )}

          {activeTab === 'create-leave' && !isManager && (
            <CreateLeaveRequest
              onSuccess={async () => {
                // İzin talepleri listesine dön ve yenile
                setActiveTab('leaves');
                localStorage.setItem('panelActiveTab', 'leaves');
                setLeaveRequestsRefreshKey(prev => prev + 1);
              }}
              onCancel={() => {
                setActiveTab('leaves');
                localStorage.setItem('panelActiveTab', 'leaves');
              }}
            />
          )}

          {activeTab === 'personnel' && isManager && !selectedPersonnelId && (
            <PersonnelList onViewDetail={(userId) => {
              setSelectedPersonnelId(userId);
              setActiveTab('personnel-detail');
              localStorage.setItem('panelActiveTab', 'personnel-detail');
            }} />
          )}

          {activeTab === 'personnel-detail' && isManager && selectedPersonnelId && (
            <PersonnelDetail 
              userId={selectedPersonnelId} 
              onBack={() => {
                setSelectedPersonnelId(null);
                setActiveTab('personnel');
                localStorage.setItem('panelActiveTab', 'personnel');
              }}
            />
          )}

          {activeTab === 'internships' && isManager && (
            <InternshipApplications />
          )}

          {activeTab === 'pending-users' && isManager && (
            <PendingUsers />
          )}
        </main>
      </div>
    </div>
  );
}

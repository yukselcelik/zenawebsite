'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ApiService from '../../../lib/api';
import Dashboard from '../components/Dashboard';

export default function DashboardPage() {
  const [userData, setUserData] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await ApiService.getProfile();
        setUserData(profileData.data);

        if (profileData.data?.userId) {
          const detailData = await ApiService.getUserDetail(parseInt(profileData.data.userId)).catch(() => null);
          if (detailData?.data) {
            setUserDetail(detailData.data);
          }
        }

        const isManager = profileData.data?.role === 'Manager';
        if (isManager) {
          const [personnelData, leaveData, internshipData] = await Promise.all([
            ApiService.getPersonnelList(1, 10).catch(() => ({ data: { totalCount: 0, items: [] } })),
            ApiService.getAllLeaveRequests(1, 100).catch(() => ({ data: { items: [] } })),
            ApiService.getAllInternshipApplications(1, 1000).catch(() => ({ data: { totalCount: 0, items: [] } }))
          ]);

          const pendingLeaves = leaveData.data?.items?.filter(r => r.status === 'Pending').length || 0;
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
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const isManager = userData?.role === 'Manager';

  return (
    <Dashboard 
      isManager={isManager} 
      stats={stats} 
      userDetail={userDetail}
      onTabChange={(tab) => {
        const routes = {
          'personnel': '/panel/personeller',
          'leaves': '/panel/izin-talepleri',
          'internships': '/panel/is-basvurulari'
        };
        if (routes[tab]) {
          router.push(routes[tab]);
        }
      }}
    />
  );
}


'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ApiService from '../../../lib/api';
import Dashboard from '../components/Dashboard';

export default function DashboardPage() {
  const [userData, setUserData] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [stats, setStats] = useState(null);
  const [myRequests, setMyRequests] = useState(null);
  const [allRequests, setAllRequests] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
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
        const [personnelData, leaveData, expenseData, meetingData, internshipData] = await Promise.all([
          ApiService.getPersonnelList(1, 10).catch(() => ({ data: { totalCount: 0, items: [] } })),
          ApiService.getAllLeaveRequests(1, 100).catch(() => ({ data: { items: [] } })),
          ApiService.getAllExpenseRequests(1, 100).catch(() => ({ data: { items: [] } })),
          ApiService.getAllMeetingRoomRequests(1, 100).catch(() => ({ data: { items: [] } })),
          ApiService.getAllInternshipApplications(1, 1000).catch(() => ({ data: { totalCount: 0, items: [] } }))
        ]);

        const pendingLeaves = leaveData.data?.items?.filter(r => r.status === 'Pending').length || 0;
        const pendingExpenses = expenseData.data?.items?.filter(r => r.statusName === 'Beklemede').length || 0;
        const pendingMeetingRooms = meetingData.data?.items?.filter(r => r.status === 'Pending').length || 0;
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
          pendingExpenses: pendingExpenses,
          pendingMeetingRooms: pendingMeetingRooms,
          internshipCount: totalInternshipCount,
          internshipLastMonthCount: lastMonthCount
        });

        setAllRequests({
          leave: { items: leaveData.data?.items || [] },
          expense: { items: expenseData.data?.items || [] },
          meetingRoom: { items: meetingData.data?.items || [] }
        });
      } else {
        const [leaveRes, expenseRes, meetingRes] = await Promise.all([
          ApiService.getMyLeaveRequests(1, 50).catch(() => ({ data: { items: [], totalCount: 0 } })),
          ApiService.getMyExpenseRequests(1, 50).catch(() => ({ data: { items: [], totalCount: 0 } })),
          ApiService.getMyMeetingRoomRequests(1, 50).catch(() => ({ data: { items: [], totalCount: 0 } }))
        ]);

        setMyRequests({
          leave: {
            items: leaveRes?.data?.items || [],
            totalCount: leaveRes?.data?.totalCount ?? (leaveRes?.data?.items?.length || 0)
          },
          expense: {
            items: expenseRes?.data?.items || [],
            totalCount: expenseRes?.data?.totalCount ?? (expenseRes?.data?.items?.length || 0)
          },
          meetingRoom: {
            items: meetingRes?.data?.items || [],
            totalCount: meetingRes?.data?.totalCount ?? (meetingRes?.data?.items?.length || 0)
          }
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Yükleniyor...</p>
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
      myRequests={myRequests}
      allRequests={allRequests}
      onRequestsUpdated={fetchData}
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


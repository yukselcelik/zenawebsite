'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ApiService from '../../../lib/api';
import LeaveRequests from '../components/leaves/LeaveRequests';

export default function IzinTalepleriPage() {
  const [userData, setUserData] = useState(null);
  const [pendingLeaveCount, setPendingLeaveCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileData = await ApiService.getProfile();
        setUserData(profileData.data);
        
        // Admin ise "Talepleri İncele" sayfasına yönlendir
        if (profileData.data?.role === 'Manager') {
          router.push('/panel/talepleri-incele');
          return;
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [router]);

  const isManager = userData?.role === 'Manager';

  // Admin ise hiçbir şey render etme (yönlendirme yapıldı)
  if (isManager) {
    return null;
  }

  return (
    <LeaveRequests 
      isManager={isManager} 
      onLeaveRequestsChange={(count) => setPendingLeaveCount(count)}
      onCreateNew={() => {
        router.push('/panel/izin-talepleri/yeni');
      }}
    />
  );
}


'use client';

import { useEffect, useState } from 'react';
import ApiService from '../../../lib/api';
import UserProfile from '../components/user/UserProfile';

export default function ProfilimPage() {
  const [userDetail, setUserDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const profileData = await ApiService.getProfile();
        if (profileData.data?.userId) {
          const detailData = await ApiService.getUserDetail(parseInt(profileData.data.userId));
          if (detailData?.data) {
            setUserDetail(detailData.data);
          }
        }
      } catch (error) {
        console.error('Error fetching user detail:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetail();
  }, []);

  const handleUpdate = async (userId, updateData) => {
    try {
      await ApiService.updateUser(userId, updateData);
      const detailData = await ApiService.getUserDetail(userId);
      if (detailData?.data) {
        setUserDetail(detailData.data);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const handleUserDetailUpdate = async (updatedDetail) => {
    if (typeof updatedDetail === 'number') {
      // userId geldiyse
      const detailData = await ApiService.getUserDetail(updatedDetail);
      if (detailData?.data) {
        setUserDetail(detailData.data);
      }
    } else {
      // updatedDetail objesi geldiyse
      setUserDetail(updatedDetail);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <UserProfile 
      userDetail={userDetail} 
      onUpdate={handleUpdate}
      onUserDetailUpdate={handleUserDetailUpdate}
    />
  );
}


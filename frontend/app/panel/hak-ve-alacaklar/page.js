'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ApiService from '../../../lib/api';
import RightsAndReceivablesSection from '../components/personnel/RightsAndReceivablesSection';
import EmployeeBenefitsSection from '../components/personnel/EmployeeBenefitsSection';

export default function HakVeAlacaklarPage() {
  const [userData, setUserData] = useState(null);
  const [rightsAndReceivables, setRightsAndReceivables] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Kullanıcı profil bilgilerini al
        const profileData = await ApiService.getProfile();
        setUserData(profileData.data);

        // Eğer yönetici ise bu sayfaya erişemez
        if (profileData.data?.role === 'Manager') {
          router.push('/panel/dashboard');
          return;
        }

        // Personelde bu bilgi artık Profilim altında gösteriliyor
        router.replace('/panel/profilim');
        return;

        // Kullanıcının kendi hak ve alacaklarını al
        if (profileData.data?.userId) {
          const userId = parseInt(profileData.data.userId);
          try {
            const rightsData = await ApiService.getRightsAndReceivables(userId);
            if (rightsData?.data) {
              setRightsAndReceivables(rightsData.data);
            }
          } catch (error) {
            console.error('Error fetching rights and receivables:', error);
            // Veri yoksa null olarak kalır, bu normal
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleUpdate = async () => {
    // Görüntüleme modunda olduğu için güncelleme yapılmaz
    // Ancak yine de veriyi yeniden yükleyebiliriz
    if (userData?.userId) {
      try {
        const userId = parseInt(userData.userId);
        const rightsData = await ApiService.getRightsAndReceivables(userId);
        if (rightsData?.data) {
          setRightsAndReceivables(rightsData.data);
        }
      } catch (error) {
        console.error('Error refreshing rights and receivables:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hak ve Alacaklar</h1>
        <p className="text-gray-600 mt-2">
          Yönetici tarafından onaylanmış hak ve alacaklarınızı buradan görüntüleyebilirsiniz.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <RightsAndReceivablesSection
          rightsAndReceivables={rightsAndReceivables}
          userId={userData?.userId ? parseInt(userData.userId) : null}
          userRole={userData?.role || 'Personel'} // Personel rolü ile görüntüleme modunda
          onUpdate={handleUpdate}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <EmployeeBenefitsSection
          userId={userData?.userId ? parseInt(userData.userId) : null}
          userRole={userData?.role || 'Personel'}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}


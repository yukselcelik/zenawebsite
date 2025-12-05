'use client';

import { useParams, useRouter } from 'next/navigation';
import PersonnelDetail from '../../components/personnel/PersonnelDetail';

export default function PersonelDetayPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id ? parseInt(params.id) : null;

  if (!userId) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Geçersiz personel ID</p>
      </div>
    );
  }

  return (
    <PersonnelDetail 
      userId={userId} 
      onBack={() => {
        router.push('/panel/personeller');
      }}
    />
  );
}


'use client';

import { useRouter } from 'next/navigation';
import PersonnelList from '../components/personnel/PersonnelList';

export default function PersonellerPage() {
  const router = useRouter();

  return (
    <PersonnelList 
      onViewDetail={(userId) => {
        router.push(`/panel/personeller/${userId}`);
      }} 
    />
  );
}


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MasrafTaleplerimPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/panel/dashboard');
  }, [router]);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-300">Dashboard'a yönlendiriliyorsunuz...</p>
      </div>
    </div>
  );
}


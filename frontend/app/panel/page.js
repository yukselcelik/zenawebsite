'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PanelPage() {
  const router = useRouter();

  useEffect(() => {
    // Ana panel sayfasına gelindiğinde dashboard'a yönlendir
    router.replace('/panel/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">...</p>
      </div>
    </div>
  );
}

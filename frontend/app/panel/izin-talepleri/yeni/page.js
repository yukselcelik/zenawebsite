'use client';

import { useRouter } from 'next/navigation';
import CreateLeaveRequest from '../../components/leaves/CreateLeaveRequest';

export default function YeniIzinTalebiPage() {
  const router = useRouter();

  return (
    <CreateLeaveRequest
      onSuccess={async () => {
        router.push('/panel/izin-talepleri');
      }}
      onCancel={() => {
        router.push('/panel/izin-talepleri');
      }}
    />
  );
}


'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.first_name}!</p>
      <p>Your email: {user?.email}</p>
    </div>
  );
}

'use client';

import { useAuth } from '@/components/auth-provider';

export default function DashboardPage() {
  const { user} = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.first_name}!</p>
      <p>Your email: {user?.email}</p>
    </div>
  );
}

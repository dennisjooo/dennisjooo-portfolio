"use client";

import { useUser } from '@clerk/nextjs';
import { DashboardHeader, NavigationCards, SystemAnalytics } from '@/components/admin/dashboard';
import { useStatusData } from '@/components/admin/hooks';

export default function AdminDashboard() {
  const { user } = useUser();
  const { statusData, isLoading, error } = useStatusData();

  return (
    <div className="space-y-12">
      <DashboardHeader userName={user?.firstName} />
      <NavigationCards />
      <SystemAnalytics statusData={statusData} isLoading={isLoading} error={error} />
    </div>
  );
}

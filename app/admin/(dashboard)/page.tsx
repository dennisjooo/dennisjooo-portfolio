"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { DashboardHeader, NavigationCards, SystemAnalytics } from '@/components/admin/dashboard';
import { useStatusData } from '@/components/admin/hooks';

export default function AdminDashboard() {
  const { user } = useUser();
  const { statusData, isLoading, error } = useStatusData();
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [blogsRes, certsRes, workRes, contactsRes] = await Promise.all([
          fetch('/api/blogs?limit=1'),
          fetch('/api/certifications?limit=1'),
          fetch('/api/work-experience?limit=1'),
          fetch('/api/contacts?limit=1'),
        ]);

        const results = await Promise.all([
          blogsRes.ok ? blogsRes.json() : null,
          certsRes.ok ? certsRes.json() : null,
          workRes.ok ? workRes.json() : null,
          contactsRes.ok ? contactsRes.json() : null,
        ]);

        setCounts({
          '/admin/blogs': results[0]?.pagination?.total ?? (Array.isArray(results[0]?.data) ? results[0].data.length : 0),
          '/admin/certifications': results[1]?.pagination?.total ?? (Array.isArray(results[1]?.data) ? results[1].data.length : 0),
          '/admin/work-experience': results[2]?.pagination?.total ?? (Array.isArray(results[2]?.data) ? results[2].data.length : 0),
          '/admin/contacts': results[3]?.pagination?.total ?? (Array.isArray(results[3]?.data) ? results[3].data.length : 0),
        });
      } catch {
        // silently fail, counts are non-critical
      }
    }
    fetchCounts();
  }, []);

  return (
    <div className="space-y-12">
      <DashboardHeader userName={user?.firstName} />
      <NavigationCards counts={counts} />
      <SystemAnalytics statusData={statusData} isLoading={isLoading} error={error} />
    </div>
  );
}

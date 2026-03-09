"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import {
  DashboardHeader,
  NavigationCards,
  SystemAnalytics,
  RecentActivity,
  ContentStats,
} from '@/components/admin/dashboard';
import { useStatusData } from '@/components/admin/hooks';
import {
  PlusIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';

const quickActions = [
  { label: 'New Post', href: '/admin/blogs/new', icon: DocumentTextIcon },
  { label: 'New Experience', href: '/admin/work-experience/new', icon: BriefcaseIcon },
  { label: 'New Certification', href: '/admin/certifications/new', icon: AcademicCapIcon },
  { label: 'New Contact', href: '/admin/contacts/new', icon: LinkIcon },
];

const countEndpoints = [
  { key: '/admin/blogs', url: '/api/blogs?limit=1' },
  { key: '/admin/certifications', url: '/api/certifications?limit=1' },
  { key: '/admin/work-experience', url: '/api/work-experience?limit=1' },
  { key: '/admin/contacts', url: '/api/contacts?limit=1' },
];

function extractCount(data: Record<string, unknown> | null): number {
  if (!data) return 0;
  if (data.pagination && typeof (data.pagination as Record<string, unknown>).total === 'number') {
    return (data.pagination as Record<string, unknown>).total as number;
  }
  return Array.isArray(data.data) ? (data.data as unknown[]).length : 0;
}

export default function AdminDashboard() {
  const { user } = useUser();
  const { statusData, isLoading, error } = useStatusData();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [countsLoading, setCountsLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const responses = await Promise.all(
          countEndpoints.map(({ url }) => fetch(url))
        );
        const results = await Promise.all(
          responses.map(r => r.ok ? r.json() : null)
        );
        const next: Record<string, number> = {};
        countEndpoints.forEach(({ key }, i) => {
          next[key] = extractCount(results[i]);
        });
        setCounts(next);
      } catch {
        // counts are non-critical
      } finally {
        setCountsLoading(false);
      }
    }
    fetchCounts();
  }, []);

  return (
    <div className="space-y-10">
      <DashboardHeader userName={user?.firstName} statusData={statusData} statusLoading={isLoading} />

      <div className="flex flex-wrap items-center gap-2">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card/30 hover:bg-card/60 hover:border-accent/40 text-sm font-medium transition-all duration-200 group"
          >
            <PlusIcon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
            <span className="group-hover:text-accent transition-colors">{action.label}</span>
          </Link>
        ))}
      </div>

      <ContentStats />

      <NavigationCards counts={counts} countsLoading={countsLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <SystemAnalytics statusData={statusData} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
}

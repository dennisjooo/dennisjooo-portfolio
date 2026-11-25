"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  DashboardHeader,
  NavigationCards,
  SystemAnalytics,
  RecentActivity,
  ContentStats,
} from "@/components/admin/dashboard";
import { useStatusData } from "@/components/admin/hooks";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  adminCountEndpoints,
  adminCreateActions,
} from "@/lib/constants/adminNav";

function extractCount(data: Record<string, unknown> | null): number {
  if (!data) return 0;
  if (
    data.pagination &&
    typeof (data.pagination as Record<string, unknown>).total === "number"
  ) {
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
          adminCountEndpoints.map(({ url }) => fetch(url)),
        );
        const results = await Promise.all(
          responses.map((r) => (r.ok ? r.json() : null)),
        );
        const next: Record<string, number> = {};
        adminCountEndpoints.forEach(({ key }, i) => {
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
      <DashboardHeader
        userName={user?.firstName}
        statusData={statusData}
        statusLoading={isLoading}
      />

      <ContentStats />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-6 md:gap-x-8 md:gap-y-3">
        {adminCreateActions.map((action, i) => (
          <Fragment key={action.href}>
            {i > 0 && (
              <span className="hidden text-border sm:inline-block">·</span>
            )}
            <Link
              href={action.href}
              className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
            >
              <PlusIcon className="h-3 w-3" />
              {action.label}
            </Link>
          </Fragment>
        ))}
      </div>

      <NavigationCards counts={counts} countsLoading={countsLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivity />
        <SystemAnalytics
          statusData={statusData}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}

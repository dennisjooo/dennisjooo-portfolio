"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DocumentTextIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  LinkIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { formatRelativeTime } from "@/lib/utils/relativeTime";

interface ActivityItem {
  id: string;
  title: string;
  type: "blog" | "project" | "contact" | "work-experience" | "certification";
  href: string;
  updatedAt: string;
  meta?: string;
}

const typeConfig: Record<
  ActivityItem["type"],
  { icon: typeof DocumentTextIcon; label: string; color: string }
> = {
  blog: { icon: DocumentTextIcon, label: "Blog", color: "text-accent" },
  project: { icon: DocumentTextIcon, label: "Project", color: "text-foreground" },
  "work-experience": { icon: BriefcaseIcon, label: "Experience", color: "text-muted-foreground" },
  certification: { icon: AcademicCapIcon, label: "Cert", color: "text-foreground/70" },
  contact: { icon: LinkIcon, label: "Contact", color: "text-accent/80" },
};

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
      <div className="w-8 h-8 rounded-lg bg-muted/40" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 w-3/5 rounded bg-muted/40" />
        <div className="h-2.5 w-2/5 rounded bg-muted/30" />
      </div>
      <div className="h-2.5 w-12 rounded bg-muted/30" />
    </div>
  );
}

export function RecentActivity() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const res = await fetch("/api/admin/recent-activity");
        if (!res.ok) return;
        const data = await res.json();
        setItems(data.data ?? []);
      } catch {
        // non-critical
      } finally {
        setLoading(false);
      }
    }
    fetchActivity();
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card/20 backdrop-blur-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50 flex items-center gap-2">
        <ClockIcon className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Recent Activity
        </h3>
      </div>

        <div className="divide-y divide-border/30 max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-border/40 scrollbar-track-transparent">
        {loading && (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        )}

        {!loading && items.length === 0 && (
          <div className="px-6 py-8 text-center text-sm text-muted-foreground">
            No recent activity
          </div>
        )}

        {!loading &&
          items.map((item) => {
            const config = typeConfig[item.type];
            const Icon = config.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent/5 transition-colors group"
              >
                <div className={`flex-shrink-0 p-1.5 rounded-lg bg-muted/30 ${config.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-accent transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className={config.color}>{config.label}</span>
                    {item.meta && (
                      <>
                        <span className="text-border">·</span>
                        <span>{item.meta}</span>
                      </>
                    )}
                  </p>
                </div>
                <span
                  className="flex-shrink-0 font-mono text-[11px] text-muted-foreground/70"
                  title={new Date(item.updatedAt).toLocaleString()}
                >
                  {formatRelativeTime(item.updatedAt)}
                </span>
              </Link>
            );
          })}
      </div>
    </div>
  );
}

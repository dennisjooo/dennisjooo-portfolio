"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BLOG_STATUSES, type BlogStatus } from "@/lib/types/blog";

type BlogCounts = Record<BlogStatus, number>;

const EMPTY_COUNTS = Object.fromEntries(
  BLOG_STATUSES.map((status) => [status, 0]),
) as BlogCounts;

function StatPill({
  label,
  count,
  href,
  color,
  loading,
}: {
  label: string;
  count: number;
  href: string;
  color: string;
  loading: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-start gap-1 transition-opacity hover:opacity-70"
    >
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
        <span className="font-sans text-3xl font-bold tabular-nums">
          {loading ? (
            <span className="inline-block h-6 w-8 animate-pulse rounded bg-muted/40" />
          ) : (
            count
          )}
        </span>
      </div>
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
    </Link>
  );
}

export function ContentStats() {
  const [counts, setCounts] = useState<BlogCounts>(EMPTY_COUNTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const results = await Promise.all(
          BLOG_STATUSES.map(async (status) => {
            const res = await fetch(`/api/blogs?status=${status}&limit=1`);
            const json = res.ok ? await res.json() : null;
            return [status, json?.pagination?.total ?? 0] as const;
          }),
        );
        setCounts({ ...EMPTY_COUNTS, ...Object.fromEntries(results) });
      } catch {
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  return (
    <div className="space-y-3">
      <h3 className="font-mono text-xs text-muted-foreground">
        01 — Content Pipeline
      </h3>
      <div className="flex flex-wrap items-center gap-6">
        <StatPill
          label="Drafts"
          count={counts.draft}
          href="/admin/blogs?status=draft"
          color="bg-muted-foreground"
          loading={loading}
        />
        <div className="h-8 w-px bg-border/50" />
        <StatPill
          label="Scheduled"
          count={counts.scheduled}
          href="/admin/blogs?status=scheduled"
          color="bg-accent"
          loading={loading}
        />
        <div className="h-8 w-px bg-border/50" />
        <StatPill
          label="Published"
          count={counts.published}
          href="/admin/blogs?status=published"
          color="bg-foreground"
          loading={loading}
        />
      </div>
    </div>
  );
}

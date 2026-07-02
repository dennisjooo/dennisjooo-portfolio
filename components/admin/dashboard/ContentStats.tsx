"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface BlogCounts {
  draft: number;
  scheduled: number;
  published: number;
}

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
      className="group flex items-center gap-2.5 rounded-xl border border-border bg-card/20 px-4 py-3 transition-all hover:border-accent/30 hover:bg-card/40"
    >
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span className="font-sans text-lg font-bold tabular-nums transition-colors group-hover:text-accent">
        {loading ? (
          <span className="inline-block h-5 w-5 animate-pulse rounded bg-muted/40" />
        ) : (
          count
        )}
      </span>
      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </Link>
  );
}

export function ContentStats() {
  const [counts, setCounts] = useState<BlogCounts>({
    draft: 0,
    scheduled: 0,
    published: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [draftRes, scheduledRes, publishedRes] = await Promise.all([
          fetch("/api/blogs?status=draft&limit=1"),
          fetch("/api/blogs?status=scheduled&limit=1"),
          fetch("/api/blogs?status=published&limit=1"),
        ]);
        const [draft, scheduled, published] = await Promise.all([
          draftRes.ok ? draftRes.json() : null,
          scheduledRes.ok ? scheduledRes.json() : null,
          publishedRes.ok ? publishedRes.json() : null,
        ]);
        setCounts({
          draft: draft?.pagination?.total ?? 0,
          scheduled: scheduled?.pagination?.total ?? 0,
          published: published?.pagination?.total ?? 0,
        });
      } catch {
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  return (
    <div className="space-y-3">
      <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Content Pipeline
      </h3>
      <div className="flex flex-wrap gap-3">
        <StatPill
          label="Drafts"
          count={counts.draft}
          href="/admin/blogs?status=draft"
          color="bg-muted-foreground"
          loading={loading}
        />
        <StatPill
          label="Scheduled"
          count={counts.scheduled}
          href="/admin/blogs?status=scheduled"
          color="bg-accent"
          loading={loading}
        />
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

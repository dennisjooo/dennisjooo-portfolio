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
      className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-border bg-card/20 hover:bg-card/40 hover:border-accent/30 transition-all group"
    >
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="font-sans font-bold text-lg tabular-nums group-hover:text-accent transition-colors">
        {loading ? (
          <span className="inline-block w-5 h-5 rounded bg-muted/40 animate-pulse" />
        ) : (
          count
        )}
      </span>
      <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
        {label}
      </span>
    </Link>
  );
}

export function ContentStats() {
  const [counts, setCounts] = useState<BlogCounts>({ draft: 0, scheduled: 0, published: 0 });
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
        // non-critical
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

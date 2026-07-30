"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useUnsavedChanges } from "@/components/admin/hooks";

interface AdminPageHeaderProps {
  title: string;
  titleAccent: string;
  subtitle: string;
  actionHref?: string;
  actionLabel?: string;
  actions?: ReactNode;
  showBack?: boolean;
  backLabel?: string;
}

export function AdminPageHeader({
  title,
  titleAccent,
  subtitle,
  actionHref,
  actionLabel = "Add New",
  actions,
  showBack = false,
  backLabel = "← Back",
}: AdminPageHeaderProps) {
  const router = useRouter();
  const { requestNavigation } = useUnsavedChanges();

  const headerContent = (
    <div>
      <h1 className="font-caslon text-3xl italic text-foreground md:text-4xl">
        {title} {titleAccent}
      </h1>
      <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );

  const actionContent =
    actions ??
    (actionHref ? (
      <Link
        href={actionHref}
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-accent transition-colors hover:text-accent/70"
      >
        <PlusIcon className="h-3.5 w-3.5" />
        {actionLabel}
      </Link>
    ) : null);

  if (showBack) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => requestNavigation(() => router.back())}
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
              aria-label="Go back"
            >
              {backLabel}
            </button>
            {headerContent}
          </div>
          {actionContent}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      {headerContent}
      {actionContent}
    </div>
  );
}

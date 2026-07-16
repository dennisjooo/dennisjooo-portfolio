"use client";

import { useRouter } from "next/navigation";
import { useUnsavedChanges } from "@/components/admin/hooks";

interface AdminFormLayoutProps {
  title: string;
  titleAccent: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AdminFormLayout({
  title,
  titleAccent,
  subtitle,
  children,
}: AdminFormLayoutProps) {
  const router = useRouter();
  const { requestNavigation } = useUnsavedChanges();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => requestNavigation(() => router.back())}
          className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
          aria-label="Go back"
        >
          ← Back
        </button>
        <div>
          <h1 className="font-caslon text-3xl italic text-foreground">
            {title} {titleAccent}
          </h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}

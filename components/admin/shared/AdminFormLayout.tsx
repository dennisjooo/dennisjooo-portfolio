"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
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
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => requestNavigation(() => router.back())}
          className="rounded-full p-2 transition-colors hover:bg-muted/50"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="h-5 w-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="font-caslon text-3xl font-bold italic text-foreground">
            {title} <span className="font-sans not-italic">{titleAccent}</span>
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

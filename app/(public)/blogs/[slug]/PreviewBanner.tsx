"use client";

import { EyeIcon } from "@heroicons/react/24/outline";

const statusLabels: Record<string, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  published: "Published",
};

export function PreviewBanner({ status }: { status: string }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-amber-500/90 px-4 py-2 text-sm font-medium text-black backdrop-blur-sm">
      <EyeIcon className="h-4 w-4" />
      <span>
        Preview mode — this post is currently{" "}
        <strong>{statusLabels[status] ?? status}</strong> and not visible to the
        public.
      </span>
    </div>
  );
}

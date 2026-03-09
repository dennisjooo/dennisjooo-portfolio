"use client";

import { useEffect, useCallback } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import { BLOG_STATUS_LABELS } from "@/lib/constants/blogStatus";

interface PreviewBannerProps {
  status: string;
  slug: string;
}

export function PreviewBanner({ status, slug }: PreviewBannerProps) {
  const isTemporaryPreview = slug.endsWith("-preview");

  const deletePreview = useCallback(() => {
    if (!isTemporaryPreview) return;
    navigator.sendBeacon(
      "/api/blogs/preview/cleanup",
      JSON.stringify({ slug })
    );
  }, [isTemporaryPreview, slug]);

  useEffect(() => {
    if (!isTemporaryPreview) return;

    window.addEventListener("beforeunload", deletePreview);
    return () => {
      window.removeEventListener("beforeunload", deletePreview);
      deletePreview();
    };
  }, [isTemporaryPreview, deletePreview]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-amber-500/90 px-4 py-2 text-sm font-medium text-black backdrop-blur-sm">
      <EyeIcon className="h-4 w-4" />
      <span>
        Preview mode — this post is currently{" "}
        <strong>{BLOG_STATUS_LABELS[status] ?? status}</strong> and not visible to the
        public.
      </span>
    </div>
  );
}

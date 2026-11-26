"use client";

import { useState } from "react";
import { siteToast } from "@/lib/ui/siteToast";
import { TrashIcon } from "@heroicons/react/24/outline";
import { BLOG_STATUS_LABELS } from "@/lib/constants/blogStatus";
import { BLOG_STATUSES } from "@/lib/types/blog";

interface BlogBulkActionsProps {
  selectedIds: Set<string>;
  onBulkDelete: () => void;
  onComplete: () => Promise<void>;
  onClearSelection: () => void;
}

export function BlogBulkActions({
  selectedIds,
  onBulkDelete,
  onComplete,
  onClearSelection,
}: BlogBulkActionsProps) {
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkPublishAt, setBulkPublishAt] = useState("");
  const [bulkUpdating, setBulkUpdating] = useState(false);

  const handleBulkStatusUpdate = async () => {
    if (selectedIds.size === 0) return;
    if (!bulkStatus) {
      siteToast.error("Select a status to apply");
      return;
    }
    if (bulkStatus === "scheduled" && !bulkPublishAt) {
      siteToast.error("Pick a publish date for scheduled posts");
      return;
    }

    setBulkUpdating(true);
    try {
      const payload =
        bulkStatus === "scheduled"
          ? { status: bulkStatus, publishAt: bulkPublishAt }
          : { status: bulkStatus, publishAt: null };

      const updatePromises = Array.from(selectedIds).map((id) =>
        fetch(`/api/blogs/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );

      const results = await Promise.all(updatePromises);
      const successCount = results.filter((r) => r.ok).length;

      if (successCount > 0) {
        siteToast.success(
          `${successCount} blog${successCount > 1 ? "s" : ""} updated`,
        );
        await onComplete();
      }
      if (successCount < selectedIds.size) {
        siteToast.error(`${selectedIds.size - successCount} failed to update`);
      }
    } catch (error) {
      console.error("Bulk status update error:", error);
      siteToast.error("Something went wrong");
    } finally {
      setBulkUpdating(false);
      setBulkStatus("");
      setBulkPublishAt("");
      onClearSelection();
    }
  };

  if (selectedIds.size === 0) return null;

  return (
    <div className="animate-fade-in flex items-center gap-4 rounded-lg border border-border bg-muted/30 px-4 py-2.5">
      <span className="text-sm font-medium">{selectedIds.size} selected</span>
      <div className="flex items-center gap-2">
        <select
          value={bulkStatus}
          onChange={(e) => setBulkStatus(e.target.value)}
          className="rounded-md border border-border bg-background px-2.5 py-1.5 text-xs outline-none transition-colors focus:ring-2 focus:ring-accent/20"
        >
          <option value="">Set status...</option>
          {BLOG_STATUSES.map((status) => (
            <option key={status} value={status}>
              {BLOG_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        {bulkStatus === "scheduled" && (
          <input
            type="datetime-local"
            value={bulkPublishAt}
            onChange={(e) => setBulkPublishAt(e.target.value)}
            className="rounded-md border border-border bg-background px-2.5 py-1.5 text-xs outline-none transition-colors focus:ring-2 focus:ring-accent/20"
          />
        )}
        <button
          type="button"
          onClick={handleBulkStatusUpdate}
          disabled={bulkUpdating}
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/5 disabled:opacity-50"
        >
          {bulkUpdating ? "Updating..." : "Update Status"}
        </button>
      </div>
      <button
        type="button"
        onClick={onBulkDelete}
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
      >
        <TrashIcon className="h-3.5 w-3.5" />
        Delete Selected
      </button>
    </div>
  );
}

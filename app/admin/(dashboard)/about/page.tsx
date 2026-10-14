"use client";

import { useState, useEffect } from "react";
import {
  ArrowPathIcon,
  CheckIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { useSiteConfig } from "@/lib/hooks/data/useSiteConfig";
import { AdminPageHeader, LoadingSpinner } from "@/components/admin/shared";
import { AutoResizeTextarea } from "@/components/admin/shared/AutoResizeTextarea";
import { DragGripHandle } from "@/components/admin/shared/DragGripHandle";
import { formStyles } from "@/components/admin/shared/formStyles";
import { useFormDirty } from "@/components/admin/hooks";
import { useAboutSectionReorder } from "@/components/admin/forms/useAboutSectionReorder";
import { cn } from "@/lib/utils";
import {
  ABOUT_BODY_SOFT_LIMIT,
  ABOUT_SECTION_MAX,
  ABOUT_SECTION_MIN,
  resolveAboutContent,
  type ContentSection,
} from "@/lib/content/aboutContent";

export default function AboutAdminPage() {
  const { config, loading, updateConfig } = useSiteConfig();
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { reset } = useFormDirty(sections, initialized);
  const {
    dragIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  } = useAboutSectionReorder(sections, setSections);

  useEffect(() => {
    if (!loading && config && !initialized) {
      setSections(resolveAboutContent(config.aboutSections));
      setInitialized(true);
    }
  }, [loading, config, initialized]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateConfig({ aboutSections: sections });
      reset(sections);
      setSaved(true);
      toast.success("Changes saved successfully");
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    if (sections.length >= ABOUT_SECTION_MAX) return;
    setSections([
      ...sections,
      { id: crypto.randomUUID(), title: "", body: "" },
    ]);
  };

  const removeSection = (index: number) => {
    if (sections.length <= ABOUT_SECTION_MIN) return;
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, patch: Partial<ContentSection>) => {
    setSections(
      sections.map((section, i) =>
        i === index ? { ...section, ...patch } : section,
      ),
    );
  };

  if (loading) return <LoadingSpinner />;

  const canAdd = sections.length < ABOUT_SECTION_MAX;
  const canRemove = sections.length > ABOUT_SECTION_MIN;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="About"
        titleAccent="Section"
        subtitle="Tell your story"
        actions={
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-accent transition-colors hover:text-accent/70 disabled:opacity-50"
          >
            {saving ? (
              <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
            ) : saved ? (
              <CheckIcon className="h-3.5 w-3.5" />
            ) : null}
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        }
      />

      <div className="flex items-center justify-between gap-4">
        {sections.length > 1 ? (
          <p className="text-xs text-muted-foreground">
            Drag the grip to reorder slides. These become the About scrub
            chapters.
          </p>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={addSection}
          disabled={!canAdd}
          className="inline-flex items-center gap-1 text-xs text-accent transition-colors hover:text-accent/80 disabled:opacity-50"
        >
          <PlusIcon className="h-4 w-4" />
          Add section
        </button>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => {
          const overLimit = section.body.length > ABOUT_BODY_SOFT_LIMIT;
          const isDragging = dragIndex === index;
          const isDragOver =
            dragOverIndex === index &&
            dragIndex !== null &&
            dragIndex !== index;

          return (
            <div
              key={section.id}
              data-about-section-row
              onDragOver={(event) => handleDragOver(event, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
              className={cn(
                "glass-panel rounded-2xl border border-border/50 p-6 transition-all duration-200",
                isDragging && "opacity-50",
                isDragOver && "ring-2 ring-primary",
              )}
            >
              <div className="mb-4 flex items-start gap-3">
                {sections.length > 1 && (
                  <DragGripHandle
                    onDragStart={(event) => handleDragStart(event, index)}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <label className={formStyles.label}>Title</label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(event) =>
                      updateSection(index, { title: event.target.value })
                    }
                    className={formStyles.input}
                    placeholder="Section title"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  disabled={!canRemove}
                  className="mt-6 shrink-0 p-2 text-muted-foreground transition-colors hover:text-destructive disabled:opacity-30"
                  aria-label="Remove section"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              <label className={formStyles.label}>Body</label>
              <AutoResizeTextarea
                value={section.body}
                onValueChange={(value) => updateSection(index, { body: value })}
                className={cn(formStyles.input, "min-h-[7.5rem]")}
                placeholder="Enter content for this slide..."
              />
              <div className="mt-2 flex items-center justify-between gap-4">
                {overLimit ? (
                  <span className="text-xs text-muted-foreground">
                    This may overflow a scrub slide. Aim for{" "}
                    {ABOUT_BODY_SOFT_LIMIT} characters or fewer.
                  </span>
                ) : (
                  <span />
                )}
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {section.body.length} characters
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

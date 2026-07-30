"use client";

import { useState, useEffect } from "react";
import { ArrowPathIcon, CheckIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { useSiteConfig } from "@/lib/hooks/data/useSiteConfig";
import { AdminPageHeader, LoadingSpinner } from "@/components/admin/shared";
import { AutoResizeTextarea } from "@/components/admin/shared/AutoResizeTextarea";
import { formStyles } from "@/components/admin/shared/formStyles";
import { useFormDirty } from "@/components/admin/hooks";
import { cn } from "@/lib/utils";
import {
  ABOUT_SECTIONS,
  type AboutAdminKey,
} from "@/lib/constants/aboutSections";

type SectionKey = AboutAdminKey;

export default function AboutAdminPage() {
  const { config, loading, updateConfig } = useSiteConfig();
  const [content, setContent] = useState<Record<SectionKey, string>>({
    aboutIntro: "",
    aboutExperience: "",
    aboutPersonal: "",
    aboutOutro: "",
  });
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { reset } = useFormDirty(content, initialized);

  useEffect(() => {
    if (!loading && config && !initialized) {
      setContent({
        aboutIntro: config.aboutIntro || "",
        aboutExperience: config.aboutExperience || "",
        aboutPersonal: config.aboutPersonal || "",
        aboutOutro: config.aboutOutro || "",
      });
      setInitialized(true);
    }
  }, [loading, config, initialized]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateConfig(content);
      reset(content);
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

  if (loading) return <LoadingSpinner />;

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

      <div className="space-y-6">
        {ABOUT_SECTIONS.map((section) => (
          <div
            key={section.adminKey}
            className="glass-panel rounded-2xl border border-border/50 p-6"
          >
            <div className="mb-4">
              <h3 className="font-sans text-lg font-bold text-foreground">
                {section.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {section.description}
              </p>
            </div>
            <AutoResizeTextarea
              value={content[section.adminKey]}
              onValueChange={(value) =>
                setContent({ ...content, [section.adminKey]: value })
              }
              className={cn(formStyles.input, "min-h-[7.5rem]")}
              placeholder={`Enter content for ${section.title}...`}
            />
            <div className="mt-2 text-right">
              <span className="font-mono text-xs text-muted-foreground">
                {content[section.adminKey].length} characters
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

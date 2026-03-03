"use client";

import { useState, useEffect } from "react";
import { ArrowPathIcon, CheckIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { useSiteConfig } from "@/lib/hooks/useSiteConfig";
import { LoadingSpinner } from "@/components/admin/shared";
import { formStyles } from "@/components/admin/shared/formStyles";
import { cn } from "@/lib/utils";

const sections = [
  { key: "aboutIntro", title: "The Logic", description: "Introduction - Who you are" },
  { key: "aboutExperience", title: "The Builder", description: "Your work and experience" },
  { key: "aboutPersonal", title: "The Curiosity", description: "Personal interests and hobbies" },
  { key: "aboutOutro", title: "The Connection", description: "Call to action and contact" },
] as const;

type SectionKey = (typeof sections)[number]["key"];

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair italic text-3xl md:text-4xl text-foreground">
            About <span className="not-italic font-sans font-bold">Section</span>
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-2">
            Tell your story
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:opacity-90 transition-all font-urbanist font-medium shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {saving ? (
            <ArrowPathIcon className="w-5 h-5 animate-spin" />
          ) : saved ? (
            <CheckIcon className="w-5 h-5" />
          ) : null}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.key}
            className="glass-panel p-6 rounded-2xl border border-border/50"
          >
            <div className="mb-4">
              <h3 className="text-lg font-bold font-urbanist text-foreground">
                {section.title}
              </h3>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </div>
            <textarea
              value={content[section.key]}
              onChange={(e) =>
                setContent({ ...content, [section.key]: e.target.value })
              }
              rows={5}
              className={cn(formStyles.input, "resize-none")}
              placeholder={`Enter content for ${section.title}...`}
            />
            <div className="mt-2 text-right">
              <span className="text-xs text-muted-foreground font-mono">
                {content[section.key].length} characters
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { ArrowPathIcon, CheckIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

interface AboutContent {
  aboutIntro: string;
  aboutExperience: string;
  aboutPersonal: string;
  aboutOutro: string;
}

const sections = [
  { key: "aboutIntro", title: "The Logic", description: "Introduction - Who you are" },
  { key: "aboutExperience", title: "The Builder", description: "Your work and experience" },
  { key: "aboutPersonal", title: "The Curiosity", description: "Personal interests and hobbies" },
  { key: "aboutOutro", title: "The Connection", description: "Call to action and contact" },
] as const;

export default function AboutAdminPage() {
  const [content, setContent] = useState<AboutContent>({
    aboutIntro: "",
    aboutExperience: "",
    aboutPersonal: "",
    aboutOutro: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/site-config", { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setContent({
          aboutIntro: data.aboutIntro || "",
          aboutExperience: data.aboutExperience || "",
          aboutPersonal: data.aboutPersonal || "",
          aboutOutro: data.aboutOutro || "",
        });
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (res.ok) {
        setSaved(true);
        toast.success("Changes saved successfully");
        setTimeout(() => setSaved(false), 2000);
      } else {
        toast.error("Failed to save");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
              className="w-full p-4 rounded-lg bg-background border border-border focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none resize-none font-urbanist"
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

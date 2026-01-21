"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

interface Contact {
  id?: string;
  label: string;
  href: string;
  icon: string;
  order: number;
}

interface ContactFormProps {
  initialData?: Contact;
  isEditing?: boolean;
}

const iconOptions = [
  { value: "mail", label: "Email" },
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter/X" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "website", label: "Website" },
];

export default function ContactForm({
  initialData,
  isEditing = false,
}: ContactFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Contact>(
    initialData || {
      label: "",
      href: "",
      icon: "mail",
      order: 0,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing
        ? `/api/contacts/${initialData?.id}`
        : "/api/contacts";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save contact");

      toast.success(isEditing ? "Contact updated" : "Contact created");
      router.push("/admin/contacts");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full p-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none";
  const labelClasses = "block text-sm font-medium text-muted-foreground mb-1.5";

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-muted/50 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="font-playfair italic text-3xl font-bold text-foreground">
            {isEditing ? "Edit" : "Add"}{" "}
            <span className="not-italic font-sans">Contact</span>
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-1">
            {isEditing ? "Update existing link" : "Add new social link"}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-panel p-8 rounded-2xl border border-border/50 space-y-6"
      >
        <div className="space-y-4">
          <div>
            <label className={labelClasses}>Label</label>
            <input
              type="text"
              required
              className={inputClasses}
              placeholder="e.g. Email, GitHub, LinkedIn"
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
            />
          </div>

          <div>
            <label className={labelClasses}>URL / Link</label>
            <input
              type="text"
              required
              className={inputClasses}
              placeholder="e.g. mailto:email@example.com or https://github.com/username"
              value={formData.href}
              onChange={(e) =>
                setFormData({ ...formData, href: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Icon</label>
              <select
                required
                className={inputClasses}
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClasses}>Display Order</label>
              <input
                type="number"
                className={inputClasses}
                placeholder="0"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lower numbers appear first
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-border/50 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Saving..." : isEditing ? "Update Contact" : "Create Contact"}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Contact {
  id?: string;
  label: string;
  href: string;
  icon: string;
  order: number;
}

interface ContactFormProps {
  initialData?: Contact;
  onSubmit: (data: Partial<Contact>) => Promise<void>;
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
  onSubmit,
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
      await onSubmit(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full p-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none";
  const labelClasses = "block text-sm font-medium text-muted-foreground mb-1.5";

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel p-8 rounded-2xl border border-border/50 space-y-6 max-w-3xl"
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
          {loading ? "Saving..." : initialData ? "Update Contact" : "Create Contact"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Certification {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  link: string;
}

interface CertificationFormProps {
  initialData?: Certification;
  onSubmit: (data: Partial<Certification>) => Promise<void>;
}

export default function CertificationForm({
  initialData,
  onSubmit,
}: CertificationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Certification>(
    initialData || {
      title: "",
      issuer: "",
      date: new Date().getFullYear().toString(),
      description: "",
      link: "",
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

  const inputClasses = "w-full p-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none";
  const labelClasses = "block text-sm font-medium text-muted-foreground mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl border border-border/50 space-y-6 max-w-3xl">
      <div className="space-y-4">
        <div>
          <label className={labelClasses}>Title</label>
          <input
            type="text"
            required
            className={inputClasses}
            placeholder="e.g. Advanced Machine Learning Specialization"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Issuer</label>
            <input
              type="text"
              required
              className={inputClasses}
              placeholder="e.g. Coursera / Stanford"
              value={formData.issuer}
              onChange={(e) =>
                setFormData({ ...formData, issuer: e.target.value })
              }
            />
          </div>

          <div>
            <label className={labelClasses}>Year</label>
            <input
              type="text"
              required
              className={inputClasses}
              placeholder="YYYY"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className={labelClasses}>Certificate URL</label>
          <input
            type="url"
            required
            className={inputClasses}
            placeholder="https://..."
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClasses}>Description</label>
          <textarea
            required
            rows={4}
            className={inputClasses}
            placeholder="Brief summary of what was covered..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
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
          {loading ? "Saving..." : initialData ? "Update Record" : "Create Record"}
        </button>
      </div>
    </form>
  );
}

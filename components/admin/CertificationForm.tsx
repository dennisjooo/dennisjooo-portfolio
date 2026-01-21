"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

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
  isEditing?: boolean;
}

export default function CertificationForm({
  initialData,
  isEditing = false,
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
      const url = isEditing
        ? `/api/certifications/${initialData?.id}`
        : "/api/certifications";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save certification");

      toast.success(isEditing ? "Certification updated" : "Certification created");
      router.push("/admin/certifications");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full p-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none";
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
            {isEditing ? 'Edit' : 'Add'} <span className="not-italic font-sans">Certification</span>
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-1">
            {isEditing ? 'Update existing record' : 'Register new achievement'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl border border-border/50 space-y-6">
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
            {loading ? "Saving..." : isEditing ? "Update Record" : "Create Record"}
          </button>
        </div>
      </form>
    </div>
  );
}

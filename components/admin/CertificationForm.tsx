"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Certification {
  _id?: string;
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
        ? `/api/certifications/${initialData?._id}`
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

      router.push("/admin/certifications");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <input
          type="text"
          required
          className="w-full p-2 border rounded-md bg-background"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Issuer</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded-md bg-background"
            value={formData.issuer}
            onChange={(e) =>
              setFormData({ ...formData, issuer: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Year</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded-md bg-background"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Link (Certificate URL)</label>
        <input
          type="url"
          required
          className="w-full p-2 border rounded-md bg-background"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          required
          rows={4}
          className="w-full p-2 border rounded-md bg-background"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Saving..." : isEditing ? "Update Certification" : "Create Certification"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border rounded-md hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { formStyles } from "./shared/formStyles";
import { FormActions } from "./shared/FormActions";
import { FormField } from "./shared/FormField";

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

  return (
    <form onSubmit={handleSubmit} className={`${formStyles.panel} space-y-6 max-w-3xl`}>
      <div className="space-y-4">
        <FormField label="Title">
          <input
            type="text"
            required
            className={formStyles.input}
            placeholder="e.g. Advanced Machine Learning Specialization"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Issuer">
            <input
              type="text"
              required
              className={formStyles.input}
              placeholder="e.g. Coursera / Stanford"
              value={formData.issuer}
              onChange={(e) =>
                setFormData({ ...formData, issuer: e.target.value })
              }
            />
          </FormField>

          <FormField label="Year">
            <input
              type="text"
              required
              className={formStyles.input}
              placeholder="YYYY"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </FormField>
        </div>

        <FormField label="Certificate URL">
          <input
            type="url"
            required
            className={formStyles.input}
            placeholder="https://..."
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />
        </FormField>

        <FormField label="Description">
          <textarea
            required
            rows={4}
            className={formStyles.input}
            placeholder="Brief summary of what was covered..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </FormField>
      </div>

      <FormActions loading={loading} submitLabel={initialData ? "Update Record" : "Create Record"} />
    </form>
  );
}

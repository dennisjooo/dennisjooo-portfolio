"use client";

import { useState } from "react";
import { formStyles } from "./shared/formStyles";
import { FormActions } from "./shared/FormActions";
import { FormField } from "./shared/FormField";

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

  return (
    <form
      onSubmit={handleSubmit}
      className={`${formStyles.panel} space-y-6 max-w-3xl`}
    >
      <div className="space-y-4">
        <FormField label="Label">
          <input
            type="text"
            required
            className={formStyles.input}
            placeholder="e.g. Email, GitHub, LinkedIn"
            value={formData.label}
            onChange={(e) =>
              setFormData({ ...formData, label: e.target.value })
            }
          />
        </FormField>

        <FormField label="URL / Link">
          <input
            type="text"
            required
            className={formStyles.input}
            placeholder="e.g. mailto:email@example.com or https://github.com/username"
            value={formData.href}
            onChange={(e) =>
              setFormData({ ...formData, href: e.target.value })
            }
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Icon">
            <select
              required
              className={formStyles.input}
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
          </FormField>

          <FormField label="Display Order" hint="Lower numbers appear first">
            <input
              type="number"
              className={formStyles.input}
              placeholder="0"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
              }
            />
          </FormField>
        </div>
      </div>

      <FormActions
        loading={loading}
        submitLabel={initialData ? "Update Contact" : "Create Contact"}
      />
    </form>
  );
}

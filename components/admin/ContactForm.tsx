"use client";

import { useState } from "react";
import type { Contact } from "@/lib/db";
import { CONTACT_ICON_OPTIONS } from "@/lib/constants/contactIcons";
import { formStyles } from "./shared/formStyles";
import { FormActions } from "./shared/FormActions";
import { FormField } from "./shared/FormField";
import { useFormSubmit } from "./hooks/useFormSubmit";

interface ContactFormProps {
  initialData?: Contact;
  onSubmit: (data: Partial<Contact>) => Promise<void>;
}

export default function ContactForm({
  initialData,
  onSubmit,
}: ContactFormProps) {
  const { loading, handleSubmit } = useFormSubmit();
  const [formData, setFormData] = useState({
    label: initialData?.label ?? "",
    href: initialData?.href ?? "",
    icon: initialData?.icon ?? "mail",
    order: initialData?.order ?? 0,
  });

  return (
    <form
      onSubmit={(e) => handleSubmit(e, () => onSubmit(formData))}
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
              setFormData(prev => ({ ...prev, label: e.target.value }))
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
              setFormData(prev => ({ ...prev, href: e.target.value }))
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
                setFormData(prev => ({ ...prev, icon: e.target.value as typeof formData.icon }))
              }
            >
              {CONTACT_ICON_OPTIONS.map((option) => (
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
                setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))
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

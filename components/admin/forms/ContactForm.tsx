"use client";

import type { Contact } from "@/lib/db";
import { CONTACT_ICON_OPTIONS } from "@/lib/constants/contactIcons";
import { formStyles } from "@/components/admin/shared/formStyles";
import { FormActions } from "@/components/admin/shared/FormActions";
import { FormField } from "@/components/admin/shared/FormField";
import {
  useAdminEntityForm,
  useAdminSubmitHandler,
} from "@/components/admin/hooks";

interface ContactFormProps {
  initialData?: Contact;
  onSubmit: (data: Partial<Contact>) => Promise<void>;
}

const defaultFormState: {
  label: string;
  href: string;
  icon: Contact["icon"];
  order: number;
} = {
  label: "",
  href: "",
  icon: "mail",
  order: 0,
};

export default function ContactForm({
  initialData,
  onSubmit,
}: ContactFormProps) {
  const { formData, setFormData } = useAdminEntityForm(defaultFormState, {
    label: initialData?.label,
    href: initialData?.href,
    icon: initialData?.icon ?? "mail",
    order: initialData?.order ?? 0,
  });
  const { submitting, handleFormSubmit } = useAdminSubmitHandler(onSubmit);

  return (
    <form
      onSubmit={handleFormSubmit(() => formData)}
      className={`${formStyles.panel} max-w-3xl space-y-6`}
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
              setFormData((prev) => ({ ...prev, label: e.target.value }))
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
              setFormData((prev) => ({ ...prev, href: e.target.value }))
            }
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField label="Icon">
            <select
              required
              className={formStyles.input}
              value={formData.icon}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  icon: e.target.value as typeof formData.icon,
                }))
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
                setFormData((prev) => ({
                  ...prev,
                  order: parseInt(e.target.value) || 0,
                }))
              }
            />
          </FormField>
        </div>
      </div>

      <FormActions
        loading={submitting}
        submitLabel={initialData ? "Update Contact" : "Create Contact"}
      />
    </form>
  );
}

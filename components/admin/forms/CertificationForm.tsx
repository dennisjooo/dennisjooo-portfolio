"use client";

import type { Certification } from "@/lib/db";
import { formStyles } from "@/components/admin/shared/formStyles";
import { FormActions } from "@/components/admin/shared/FormActions";
import { FormField } from "@/components/admin/shared/FormField";
import {
  useAdminEntityForm,
  useAdminSubmitHandler,
} from "@/components/admin/hooks";

interface CertificationFormProps {
  initialData?: Certification;
  onSubmit: (data: Partial<Certification>) => Promise<void>;
}

const defaultFormState = {
  title: "",
  issuer: "",
  date: new Date().getFullYear().toString(),
  description: "",
  link: "",
};

export default function CertificationForm({
  initialData,
  onSubmit,
}: CertificationFormProps) {
  const { formData, setFormData } = useAdminEntityForm(defaultFormState, {
    title: initialData?.title,
    issuer: initialData?.issuer,
    date: initialData?.date ?? defaultFormState.date,
    description: initialData?.description,
    link: initialData?.link,
  });
  const { submitting, handleFormSubmit } = useAdminSubmitHandler(onSubmit);

  return (
    <form
      onSubmit={handleFormSubmit(() => formData)}
      className={`${formStyles.panel} max-w-3xl space-y-6`}
    >
      <div className="space-y-4">
        <FormField label="Title">
          <input
            type="text"
            required
            className={formStyles.input}
            placeholder="e.g. Advanced Machine Learning Specialization"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField label="Issuer">
            <input
              type="text"
              required
              className={formStyles.input}
              placeholder="e.g. Coursera / Stanford"
              value={formData.issuer}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, issuer: e.target.value }))
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
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
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
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, link: e.target.value }))
            }
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
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </FormField>
      </div>

      <FormActions
        loading={submitting}
        submitLabel={initialData ? "Update Record" : "Create Record"}
      />
    </form>
  );
}

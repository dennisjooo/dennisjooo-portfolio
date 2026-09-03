"use client";

import { formStyles } from "@/components/admin/shared/formStyles";
import { FormField } from "@/components/admin/shared/FormField";

interface WorkExperienceDetailsFieldsProps {
  title: string;
  company: string;
  date: string;
  order: number;
  onFieldChange: (
    field: "title" | "company" | "date" | "order",
    value: string | number,
  ) => void;
}

export function WorkExperienceDetailsFields({
  title,
  company,
  date,
  order,
  onFieldChange,
}: WorkExperienceDetailsFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Job Title">
          <input
            type="text"
            required
            className={formStyles.input}
            placeholder="e.g. AI/ML Engineer"
            value={title}
            onChange={(e) => onFieldChange("title", e.target.value)}
          />
        </FormField>

        <FormField label="Company">
          <input
            type="text"
            required
            className={formStyles.input}
            placeholder="e.g. Sinar Mas Land"
            value={company}
            onChange={(e) => onFieldChange("company", e.target.value)}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Date Range">
          <input
            type="text"
            required
            className={formStyles.input}
            placeholder="e.g. February 2024 - Now"
            value={date}
            onChange={(e) => onFieldChange("date", e.target.value)}
          />
        </FormField>

        <FormField label="Display Order" hint="Lower numbers appear first">
          <input
            type="number"
            className={formStyles.input}
            placeholder="0"
            value={order}
            onChange={(e) =>
              onFieldChange("order", parseInt(e.target.value) || 0)
            }
          />
        </FormField>
      </div>
    </>
  );
}

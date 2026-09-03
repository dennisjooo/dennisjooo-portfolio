"use client";

import type { WorkExperience } from "@/lib/db";
import { formStyles } from "@/components/admin/shared/formStyles";
import { FormActions } from "@/components/admin/shared/FormActions";
import { useImageUpload } from "@/lib/hooks/domain/useImageUpload";
import {
  useAdminEntityForm,
  useAdminSubmitHandler,
} from "@/components/admin/hooks";
import { cn } from "@/lib/utils";
import { CompanyLogoField } from "./CompanyLogoField";
import { WorkExperienceDetailsFields } from "./WorkExperienceDetailsFields";
import { ResponsibilityList } from "./ResponsibilityList";
import { createResponsibilityHandlers } from "./responsibilityHandlers";

interface WorkExperienceFormProps {
  initialData?: WorkExperience;
  onSubmit: (data: Partial<WorkExperience>) => Promise<void>;
}

const defaultFormState = {
  title: "",
  company: "",
  date: "",
  imageSrc: "",
  responsibilities: [""],
  order: 0,
};

export default function WorkExperienceForm({
  initialData,
  onSubmit,
}: WorkExperienceFormProps) {
  const { formData, setFormData } = useAdminEntityForm(defaultFormState, {
    title: initialData?.title,
    company: initialData?.company,
    date: initialData?.date,
    imageSrc: initialData?.imageSrc,
    responsibilities: initialData?.responsibilities ?? [""],
    order: initialData?.order ?? 0,
  });
  const { submitting, handleFormSubmit } = useAdminSubmitHandler(onSubmit);

  const { uploading, upload } = useImageUpload({
    folder: "work",
    onSuccess: (url) => setFormData((prev) => ({ ...prev, imageSrc: url })),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    await upload(e.target.files[0]);
  };

  const getSubmitData = () => ({
    ...formData,
    responsibilities: formData.responsibilities.filter((r) => r.trim() !== ""),
  });

  const {
    addResponsibility,
    removeResponsibility,
    updateResponsibility,
    reorderResponsibilities,
  } = createResponsibilityHandlers(setFormData);

  const handleFieldChange = (
    field: "title" | "company" | "date" | "order",
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form
      onSubmit={handleFormSubmit(getSubmitData)}
      className={cn(formStyles.panel, "max-w-3xl space-y-6")}
    >
      <CompanyLogoField
        imageSrc={formData.imageSrc}
        uploading={uploading}
        onUpload={handleUpload}
        onUrlChange={(url) =>
          setFormData((prev) => ({ ...prev, imageSrc: url }))
        }
      />

      <WorkExperienceDetailsFields
        title={formData.title}
        company={formData.company}
        date={formData.date}
        order={formData.order}
        onFieldChange={handleFieldChange}
      />

      <ResponsibilityList
        responsibilities={formData.responsibilities}
        onAdd={addResponsibility}
        onRemove={removeResponsibility}
        onUpdate={updateResponsibility}
        onReorder={reorderResponsibilities}
      />

      <FormActions
        loading={submitting}
        submitLabel={initialData ? "Update Record" : "Create Record"}
      />
    </form>
  );
}

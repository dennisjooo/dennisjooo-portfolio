"use client";

import WorkExperienceForm from "@/components/admin/WorkExperienceForm";
import { AdminFormLayout } from "@/components/admin/shared";
import { useAdminForm } from "@/components/admin/hooks";

interface WorkExperience {
  id?: string;
  title: string;
  company: string;
  date: string;
  imageSrc: string;
  responsibilities: string[];
  order: number;
}

export default function NewWorkExperiencePage() {
  const { handleSubmit } = useAdminForm<WorkExperience>({
    endpoint: '/api/work-experience',
    redirectTo: '/admin/work-experience',
    itemName: 'work experience',
  });

  return (
    <AdminFormLayout
      title="New"
      titleAccent="Experience"
      subtitle="Add a new position or education entry"
    >
      <WorkExperienceForm onSubmit={handleSubmit} />
    </AdminFormLayout>
  );
}

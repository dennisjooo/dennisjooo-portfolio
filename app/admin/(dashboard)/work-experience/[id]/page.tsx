"use client";

import WorkExperienceForm from "@/components/admin/WorkExperienceForm";
import { AdminFormLayout, LoadingSpinner } from "@/components/admin/shared";
import { useAdminForm } from "@/components/admin/hooks";
import { useParams } from "next/navigation";

interface WorkExperience {
  id: string;
  title: string;
  company: string;
  date: string;
  imageSrc: string;
  responsibilities: string[];
  order: number;
}

export default function EditWorkExperiencePage() {
  const params = useParams();
  const id = params.id as string;

  const { data, loading, handleSubmit } = useAdminForm<WorkExperience>({
    endpoint: '/api/work-experience',
    id,
    redirectTo: '/admin/work-experience',
    itemName: 'work experience',
  });

  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  return (
    <AdminFormLayout
      title="Edit"
      titleAccent="Experience"
      subtitle="Update position details"
    >
      <WorkExperienceForm initialData={data} onSubmit={handleSubmit} />
    </AdminFormLayout>
  );
}

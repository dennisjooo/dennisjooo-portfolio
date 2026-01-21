"use client";

import WorkExperienceForm from "@/components/admin/WorkExperienceForm";
import { AdminFormLayout } from "@/components/admin/shared";

export default function NewWorkExperiencePage() {
  return (
    <AdminFormLayout
      title="New"
      titleAccent="Experience"
      subtitle="Add a new position or education entry"
    >
      <WorkExperienceForm />
    </AdminFormLayout>
  );
}

"use client";

import CertificationForm from "@/components/admin/CertificationForm";
import { AdminFormLayout } from "@/components/admin/shared";
import { useAdminForm } from "@/components/admin/hooks";
import type { Certification } from "@/lib/db/schema";

export default function NewCertificationPage() {
  const { handleSubmit } = useAdminForm<Partial<Certification>>({
    endpoint: '/api/certifications',
    redirectTo: '/admin/certifications',
    itemName: 'certification',
  });

  return (
    <AdminFormLayout
      title="New"
      titleAccent="Certification"
      subtitle="Add a new credential or achievement"
    >
      <CertificationForm onSubmit={handleSubmit} />
    </AdminFormLayout>
  );
}

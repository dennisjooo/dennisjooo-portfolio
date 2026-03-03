"use client";

import CertificationForm from "@/components/admin/CertificationForm";
import { AdminFormLayout, LoadingSpinner } from "@/components/admin/shared";
import { useAdminForm } from "@/components/admin/hooks";
import { useParams } from "next/navigation";
import type { Certification } from "@/lib/db";

export default function EditCertificationPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { data: cert, loading, handleSubmit } = useAdminForm<Certification>({
    endpoint: '/api/certifications',
    id,
    redirectTo: '/admin/certifications',
    itemName: 'certification',
  });

  if (loading) return <LoadingSpinner />;
  if (!cert) return null;

  return (
    <AdminFormLayout
      title="Edit"
      titleAccent="Certification"
      subtitle="Update credential details"
    >
      <CertificationForm initialData={cert} onSubmit={handleSubmit} />
    </AdminFormLayout>
  );
}

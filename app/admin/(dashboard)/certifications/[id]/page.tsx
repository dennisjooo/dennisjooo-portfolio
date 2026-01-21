"use client";

import CertificationForm from "@/components/admin/CertificationForm";
import { AdminFormLayout, LoadingSpinner } from "@/components/admin/shared";
import { useAdminForm } from "@/components/admin/hooks";
import { useParams } from "next/navigation";

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  link: string;
}

export default function EditCertificationPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { data: cert, loading } = useAdminForm<Certification>({
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
      <CertificationForm initialData={cert} isEditing />
    </AdminFormLayout>
  );
}

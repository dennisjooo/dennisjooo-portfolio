"use client";

import CertificationForm from "@/components/admin/CertificationForm";
import { AdminFormLayout } from "@/components/admin/shared";

export default function NewCertificationPage() {
  return (
    <AdminFormLayout
      title="New"
      titleAccent="Certification"
      subtitle="Add a new credential or achievement"
    >
      <CertificationForm />
    </AdminFormLayout>
  );
}

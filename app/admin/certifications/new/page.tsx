"use client";

import CertificationForm from "@/components/admin/CertificationForm";

export default function NewCertificationPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Add New Certification</h1>
      <CertificationForm />
    </div>
  );
}

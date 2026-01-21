"use client";

import ContactForm from "@/components/admin/ContactForm";
import { AdminFormLayout, LoadingSpinner } from "@/components/admin/shared";
import { useAdminForm } from "@/components/admin/hooks";
import { useParams } from "next/navigation";

interface Contact {
  id: string;
  label: string;
  href: string;
  icon: string;
  order: number;
}

export default function EditContactPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: contact, loading, handleSubmit } = useAdminForm<Contact>({
    endpoint: '/api/contacts',
    id,
    redirectTo: '/admin/contacts',
    itemName: 'contact',
  });

  if (loading) return <LoadingSpinner />;
  if (!contact) return null;

  return (
    <AdminFormLayout
      title="Edit"
      titleAccent="Contact"
      subtitle="Update contact details"
    >
      <ContactForm initialData={contact} onSubmit={handleSubmit} />
    </AdminFormLayout>
  );
}

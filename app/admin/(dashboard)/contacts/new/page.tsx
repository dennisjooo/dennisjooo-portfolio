"use client";

import ContactForm from "@/components/admin/ContactForm";
import { AdminFormLayout } from "@/components/admin/shared";
import { useAdminForm } from "@/components/admin/hooks";

interface Contact {
  id?: string;
  label: string;
  href: string;
  icon: string;
  order: number;
}

export default function NewContactPage() {
  const { handleSubmit } = useAdminForm<Contact>({
    endpoint: '/api/contacts',
    redirectTo: '/admin/contacts',
    itemName: 'contact',
  });

  return (
    <AdminFormLayout
      title="New"
      titleAccent="Contact"
      subtitle="Add a new contact link or social profile"
    >
      <ContactForm onSubmit={handleSubmit} />
    </AdminFormLayout>
  );
}

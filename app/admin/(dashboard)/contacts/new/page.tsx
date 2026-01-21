"use client";

import ContactForm from "@/components/admin/ContactForm";
import { AdminFormLayout } from "@/components/admin/shared";

export default function NewContactPage() {
  return (
    <AdminFormLayout
      title="New"
      titleAccent="Contact"
      subtitle="Add a new contact link or social profile"
    >
      <ContactForm />
    </AdminFormLayout>
  );
}

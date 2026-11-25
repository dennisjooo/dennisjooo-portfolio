"use client";

import ContactForm from "@/components/admin/forms/ContactForm";
import { createAdminEditPage } from "@/components/admin/factories";
import type { Contact } from "@/lib/db/schema";

export default createAdminEditPage<Contact>({
  endpoint: "/api/contacts",
  redirectTo: "/admin/contacts",
  itemName: "contact",
  FormComponent: ContactForm,
  title: { accent: "Contact", subtitle: "Update contact details" },
});

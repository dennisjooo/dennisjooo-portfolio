"use client";

import ContactForm from "@/components/admin/forms/ContactForm";
import { createAdminNewPage } from "@/components/admin/factories";
import type { Contact } from "@/lib/db/schema";

export default createAdminNewPage<Contact>({
  endpoint: "/api/contacts",
  redirectTo: "/admin/contacts",
  itemName: "contact",
  FormComponent: ContactForm,
  title: {
    accent: "Contact",
    subtitle: "Add a new contact link or social profile",
  },
});

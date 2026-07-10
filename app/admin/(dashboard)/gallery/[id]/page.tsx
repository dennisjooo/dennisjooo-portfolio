"use client";

import GalleryForm from "@/components/admin/forms/GalleryForm";
import { createAdminEditPage } from "@/components/admin/factories";
import type { GalleryImage } from "@/lib/db";

export default createAdminEditPage<GalleryImage>({
  endpoint: "/api/gallery",
  redirectTo: "/admin/gallery",
  itemName: "gallery image",
  FormComponent: GalleryForm,
  title: {
    accent: "Image",
    subtitle: "Edit gallery photograph and metadata",
  },
});

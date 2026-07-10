"use client";

import GalleryForm from "@/components/admin/forms/GalleryForm";
import { createAdminNewPage } from "@/components/admin/factories";
import type { GalleryImage } from "@/lib/db";

export default createAdminNewPage<GalleryImage>({
  endpoint: "/api/gallery",
  redirectTo: "/admin/gallery",
  itemName: "gallery image",
  FormComponent: GalleryForm,
  title: {
    accent: "Image",
    subtitle: "Upload a new gallery photograph",
  },
});

"use client";

import { createAdminListPage } from "@/components/admin/factories/createAdminListPage";
import { createGalleryColumns } from "@/components/admin/columns/galleryColumns";
import type { GalleryImage } from "@/lib/db";

export default createAdminListPage<GalleryImage>({
  endpoint: "/api/gallery",
  itemName: "gallery image",
  deleteSuccessMessage: "Image deleted successfully",
  disablePagination: true,
  header: {
    title: "Photo",
    titleAccent: "Gallery",
    subtitle: "Manage gallery images and metadata",
    actionHref: "/admin/gallery/new",
    actionLabel: "Add Image",
  },
  deleteDialog: {
    title: "Delete Gallery Image",
    description:
      "Are you sure you want to delete this image? Associated blob files will also be removed.",
  },
  createColumns: createGalleryColumns,
});

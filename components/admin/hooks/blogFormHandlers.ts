import type { Blog } from "@/lib/db";
import type { RefObject } from "react";
import { createUrlSlug } from "@/lib/utils/urlHelpers";

export function createBlogFormChangeHandler(
  setFormData: React.Dispatch<React.SetStateAction<Partial<Blog>>>,
  slugManuallyEdited: RefObject<boolean>,
) {
  return (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "slug") {
      if (value.length === 0) {
        slugManuallyEdited.current = false;
        setFormData((prev) => ({
          ...prev,
          slug: createUrlSlug(prev.title || ""),
        }));
      } else {
        slugManuallyEdited.current = true;
        setFormData((prev) => ({ ...prev, slug: value }));
      }
      return;
    }

    if (name === "title" && !slugManuallyEdited.current) {
      setFormData((prev) => ({
        ...prev,
        title: value,
        slug: createUrlSlug(value),
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
}

export function createBlogFormLinkHandlers(
  setFormData: React.Dispatch<React.SetStateAction<Partial<Blog>>>,
) {
  return {
    addLink: (link: { text: string; url: string }) => {
      setFormData((prev) => ({
        ...prev,
        links: [...(prev.links || []), link],
      }));
    },
    removeLink: (index: number) => {
      setFormData((prev) => ({
        ...prev,
        links: prev.links?.filter((_, i) => i !== index),
      }));
    },
    updateLink: (index: number, link: { text: string; url: string }) => {
      setFormData((prev) => {
        const next = [...(prev.links || [])];
        next[index] = link;
        return { ...prev, links: next };
      });
    },
    reorderLinks: (links: { text: string; url: string }[]) => {
      setFormData((prev) => ({ ...prev, links }));
    },
  };
}

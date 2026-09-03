"use client";

import * as React from "react";
import {
  processedProjects,
  setProcessedProjects,
  processedWorkExperience,
  setProcessedWorkExperience,
} from "@/lib/command-palette/utils";

export function useCommandPaletteSearchIndex(open: boolean) {
  React.useEffect(() => {
    if (open) {
      if (
        processedProjects.length === 0 ||
        processedWorkExperience.length === 0
      ) {
        fetch("/api/search-index")
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setProcessedProjects(data.data.projects);
              setProcessedWorkExperience(data.data.workExperience);
              return;
            }
            throw new Error("Search index payload missing success flag");
          })
          .catch((err) => {
            console.error(
              "Failed to fetch search index for command palette",
              err,
            );
            Promise.all([
              fetch("/api/blogs").then((res) => res.json()),
              fetch("/api/work-experience").then((res) => res.json()),
            ])
              .then(([blogsData, workData]) => {
                if (blogsData?.data) {
                  setProcessedProjects(blogsData.data);
                }
                if (workData?.success && workData?.data) {
                  setProcessedWorkExperience(workData.data);
                }
              })
              .catch((fallbackError) => {
                console.error(
                  "Failed to fetch fallback command palette data",
                  fallbackError,
                );
              });
          });
      }
    }
  }, [open]);
}

export function useCommandPaletteShortcut(
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
) {
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    const openPalette = () => setOpen(true);

    document.addEventListener("keydown", down);
    document.addEventListener("openCommandPalette", openPalette);
    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("openCommandPalette", openPalette);
    };
  }, [setOpen]);
}

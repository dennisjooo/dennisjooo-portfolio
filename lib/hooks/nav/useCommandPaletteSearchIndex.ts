"use client";

import * as React from "react";
import {
  processProjects,
  processWorkExperience,
  type ProcessedProject,
  type ProcessedWorkExperience,
} from "@/lib/command-palette/utils";

export function useCommandPaletteSearchIndex(open: boolean) {
  const [projects, setProjects] = React.useState<ProcessedProject[]>([]);
  const [workExperience, setWorkExperience] = React.useState<
    ProcessedWorkExperience[]
  >([]);
  const loadAttempted = React.useRef(false);

  React.useEffect(() => {
    if (!open || loadAttempted.current) {
      return;
    }
    loadAttempted.current = true;

    fetch("/api/search-index")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProjects(processProjects(data.data.projects));
          setWorkExperience(processWorkExperience(data.data.workExperience));
          return;
        }
        throw new Error("Search index payload missing success flag");
      })
      .catch((err) => {
        console.error("Failed to fetch search index for command palette", err);
        Promise.all([
          fetch("/api/blogs").then((res) => res.json()),
          fetch("/api/work-experience").then((res) => res.json()),
        ])
          .then(([blogsData, workData]) => {
            if (blogsData?.data) {
              setProjects(processProjects(blogsData.data));
            }
            if (workData?.success && workData?.data) {
              setWorkExperience(processWorkExperience(workData.data));
            }
          })
          .catch((fallbackError) => {
            console.error(
              "Failed to fetch fallback command palette data",
              fallbackError,
            );
          });
      });
  }, [open]);

  return { projects, workExperience };
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

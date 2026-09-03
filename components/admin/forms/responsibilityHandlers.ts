"use client";

import type { Dispatch, SetStateAction } from "react";

interface ResponsibilityFormState {
  responsibilities: string[];
}

export function createResponsibilityHandlers<T extends ResponsibilityFormState>(
  setFormData: Dispatch<SetStateAction<T>>,
) {
  return {
    addResponsibility: () => {
      setFormData((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, ""],
      }));
    },
    removeResponsibility: (index: number) => {
      setFormData((prev) => ({
        ...prev,
        responsibilities: prev.responsibilities.filter((_, i) => i !== index),
      }));
    },
    updateResponsibility: (index: number, value: string) => {
      setFormData((prev) => {
        const updated = [...prev.responsibilities];
        updated[index] = value;
        return { ...prev, responsibilities: updated };
      });
    },
    reorderResponsibilities: (fromIndex: number, toIndex: number) => {
      setFormData((prev) => {
        const next = [...prev.responsibilities];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        return { ...prev, responsibilities: next };
      });
    },
  };
}

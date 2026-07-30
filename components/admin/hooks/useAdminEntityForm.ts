"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useFormDirty, useUnsavedChanges } from "./useUnsavedChanges";

export function useAdminEntityForm<T extends Record<string, unknown>>(
  initialState: T,
  initialData?: Partial<T>,
) {
  const router = useRouter();
  const { requestNavigation } = useUnsavedChanges();
  const [formData, setFormData] = useState<T>(() => ({
    ...initialState,
    ...initialData,
  }));

  useFormDirty(formData);

  const requestCancel = useCallback(
    () => requestNavigation(() => router.back()),
    [requestNavigation, router],
  );

  return { formData, setFormData, requestCancel };
}

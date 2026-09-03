"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { UnsavedChangesDialog } from "@/components/admin/shared/UnsavedChangesDialog";
import {
  UnsavedChangesContext,
  type NavigationRequest,
} from "./unsavedChangesContext";
import { useUnsavedChangesNavigationGuard } from "./useFormDirty";

export { serializeFormState } from "./formStateSerialization";
export { useFormDirty } from "./useFormDirty";
export { useUnsavedChanges } from "./unsavedChangesContext";

export function UnsavedChangesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDirty, setIsDirty] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const pendingNavigation = useRef<NavigationRequest | null>(null);

  const requestNavigation = useCallback(
    (navigate: NavigationRequest) => {
      if (!isDirty) {
        navigate();
        return;
      }
      pendingNavigation.current = navigate;
      setDialogOpen(true);
    },
    [isDirty],
  );

  const confirmLeave = useCallback(() => {
    setDialogOpen(false);
    setIsDirty(false);
    const navigate = pendingNavigation.current;
    pendingNavigation.current = null;
    if (navigate) {
      navigate();
    }
  }, []);

  const cancelLeave = useCallback(() => {
    setDialogOpen(false);
    pendingNavigation.current = null;
  }, []);

  useUnsavedChangesNavigationGuard(isDirty, requestNavigation);

  const value = useMemo(
    () => ({
      setDirty: setIsDirty,
      requestNavigation,
    }),
    [requestNavigation],
  );

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}
      <UnsavedChangesDialog
        open={dialogOpen}
        onConfirm={confirmLeave}
        onCancel={cancelLeave}
      />
    </UnsavedChangesContext.Provider>
  );
}

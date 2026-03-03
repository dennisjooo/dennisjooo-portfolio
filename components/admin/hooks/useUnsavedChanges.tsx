"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UnsavedChangesDialog } from "@/components/admin/shared/UnsavedChangesDialog";

type NavigationRequest = () => void;

interface UnsavedChangesContextValue {
  setDirty: (dirty: boolean) => void;
  requestNavigation: (navigate: NavigationRequest) => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextValue>({
  setDirty: () => {},
  requestNavigation: (navigate) => navigate(),
});

function normalizeFormValue(value: unknown): unknown {
  if (value === undefined || value === null) return null;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(normalizeFormValue);
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
    const normalized: Record<string, unknown> = {};
    for (const [key, val] of entries) {
      normalized[key] = normalizeFormValue(val);
    }
    return normalized;
  }
  return value;
}

export function serializeFormState(value: unknown): string {
  return JSON.stringify(normalizeFormValue(value));
}

export function useFormDirty<T>(value: T, enabled = true) {
  const { setDirty } = useUnsavedChanges();
  const initialSnapshot = useRef<string | null>(null);
  const serializedValue = useMemo(() => serializeFormState(value), [value]);

  const reset = useCallback(
    (nextValue?: T) => {
      const snapshot = serializeFormState(nextValue ?? value);
      initialSnapshot.current = snapshot;
      setDirty(false);
    },
    [setDirty, value]
  );

  useEffect(() => {
    if (!enabled) return;
    if (initialSnapshot.current === null) {
      initialSnapshot.current = serializedValue;
    }
    setDirty(initialSnapshot.current !== serializedValue);
  }, [enabled, serializedValue, setDirty]);

  useEffect(() => {
    return () => setDirty(false);
  }, [setDirty]);

  return { reset };
}

export function UnsavedChangesProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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
    [isDirty]
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

  useEffect(() => {
    if (!isDirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!isDirty) return;
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;
      if (anchor.hasAttribute("data-bypass-unsaved")) return;
      if (anchor.getAttribute("target") === "_blank") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      const current = new URL(window.location.href);
      if (url.pathname === current.pathname && url.search === current.search) return;

      event.preventDefault();
      requestNavigation(() => router.push(`${url.pathname}${url.search}${url.hash}`));
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [isDirty, requestNavigation, router]);

  const value = useMemo(
    () => ({
      setDirty: setIsDirty,
      requestNavigation,
    }),
    [requestNavigation]
  );

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}
      <UnsavedChangesDialog open={dialogOpen} onConfirm={confirmLeave} onCancel={cancelLeave} />
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChanges() {
  return useContext(UnsavedChangesContext);
}

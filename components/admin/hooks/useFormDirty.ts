"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { serializeFormState } from "./formStateSerialization";
import { useUnsavedChanges } from "./unsavedChangesContext";

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
    [setDirty, value],
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

type NavigationRequest = () => void;

export function useUnsavedChangesNavigationGuard(
  isDirty: boolean,
  requestNavigation: (navigate: NavigationRequest) => void,
) {
  const router = useRouter();

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
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

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
      if (url.pathname === current.pathname && url.search === current.search)
        return;

      event.preventDefault();
      requestNavigation(() =>
        router.push(`${url.pathname}${url.search}${url.hash}`),
      );
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [isDirty, requestNavigation, router]);
}

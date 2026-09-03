"use client";

import { createContext, useContext } from "react";

type NavigationRequest = () => void;

export interface UnsavedChangesContextValue {
  setDirty: (dirty: boolean) => void;
  requestNavigation: (navigate: NavigationRequest) => void;
}

export const UnsavedChangesContext = createContext<UnsavedChangesContextValue>({
  setDirty: () => {},
  requestNavigation: (navigate) => navigate(),
});

export function useUnsavedChanges() {
  return useContext(UnsavedChangesContext);
}

export type { NavigationRequest };

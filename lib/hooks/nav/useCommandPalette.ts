"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useCopyToClipboard } from "@/lib/hooks/domain/useCopyToClipboard";
import { EASTER_EGG_FOUND_EVENT } from "@/lib/easter-eggs/constants";
import { matchSecrets } from "@/lib/easter-eggs/matchSecrets";
import { PALETTE_SECRETS } from "@/lib/easter-eggs/secrets";
import type { SecretDefinition } from "@/lib/easter-eggs/types";
import {
  useCommandPaletteSearchIndex,
  useCommandPaletteShortcut,
} from "./useCommandPaletteSearchIndex";
import {
  useCommandPaletteFiltering,
  type FilteredProject,
  type FilteredWorkExperience,
  type SearchScope,
} from "./useCommandPaletteFiltering";

export type { FilteredProject, FilteredWorkExperience, SearchScope };

export interface UseCommandPaletteReturn {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  copied: boolean;
  exactMatch: boolean;
  setExactMatch: React.Dispatch<React.SetStateAction<boolean>>;
  caseSensitive: boolean;
  setCaseSensitive: React.Dispatch<React.SetStateAction<boolean>>;
  searchScope: SearchScope;
  setSearchScope: React.Dispatch<React.SetStateAction<SearchScope>>;
  matchedSecrets: SecretDefinition[];
  filteredProjects: FilteredProject[];
  filteredWorkExperience: FilteredWorkExperience[];
  runCommand: (command: () => unknown) => void;
  runSecretCommand: (command: () => unknown, closePalette?: boolean) => void;
  pendingSecretsFocus: boolean;
  clearPendingSecretsFocus: () => void;
  copyUrl: () => void;
  router: ReturnType<typeof useRouter>;
}

export function useCommandPalette(): UseCommandPaletteReturn {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [exactMatch, setExactMatch] = React.useState(false);
  const [caseSensitive, setCaseSensitive] = React.useState(false);
  const [searchScope, setSearchScope] = React.useState<SearchScope>("all");
  const [pendingSecretsFocus, setPendingSecretsFocus] = React.useState(false);
  const router = useRouter();
  const { copied, copyToClipboard } = useCopyToClipboard();

  useCommandPaletteSearchIndex(open);
  useCommandPaletteShortcut(setOpen);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  const clearPendingSecretsFocus = React.useCallback(() => {
    setPendingSecretsFocus(false);
  }, []);

  const runSecretCommand = React.useCallback(
    (command: () => unknown, closePalette = false) => {
      setSearch("");
      setPendingSecretsFocus(true);
      if (closePalette) {
        setOpen(false);
      }
      command();
    },
    [],
  );

  React.useEffect(() => {
    const onSecretFound = () => {
      setSearch("");
      setPendingSecretsFocus(true);
    };
    window.addEventListener(EASTER_EGG_FOUND_EVENT, onSecretFound);
    return () =>
      window.removeEventListener(EASTER_EGG_FOUND_EVENT, onSecretFound);
  }, []);

  const matchedSecrets = React.useMemo(
    () => matchSecrets(search, PALETTE_SECRETS),
    [search],
  );

  const copyUrl = React.useCallback(() => {
    if (typeof window !== "undefined") {
      copyToClipboard(window.location.href);
      runCommand(() => {});
    }
  }, [copyToClipboard, runCommand]);

  const searchOptions = React.useMemo(
    () => ({ caseSensitive, exactMatch }),
    [caseSensitive, exactMatch],
  );

  const { filteredProjects, filteredWorkExperience } =
    useCommandPaletteFiltering(search, searchScope, searchOptions);

  return {
    open,
    setOpen,
    search,
    setSearch,
    copied,
    exactMatch,
    setExactMatch,
    caseSensitive,
    setCaseSensitive,
    searchScope,
    setSearchScope,
    matchedSecrets,
    filteredProjects,
    filteredWorkExperience,
    runCommand,
    runSecretCommand,
    pendingSecretsFocus,
    clearPendingSecretsFocus,
    copyUrl,
    router,
  };
}

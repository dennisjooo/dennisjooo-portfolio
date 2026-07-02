import type { LucideIcon } from "lucide-react";

export type SecretAction =
  | { type: "openUrl"; url: string }
  | { type: "toast"; message: string }
  | { type: "copy"; text: string; toastMessage?: string };

export interface SecretDefinition {
  id: string;
  triggers: string[];
  label: string;
  searchValue: string;
  icon: LucideIcon;
  action: SecretAction;
}

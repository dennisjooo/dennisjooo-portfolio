import { toast } from "sonner";
import type { SecretAction } from "./types";

export async function executeSecretAction(action: SecretAction): Promise<void> {
  switch (action.type) {
    case "openUrl":
      window.open(action.url, "_blank", "noopener,noreferrer");
      break;
    case "toast":
      toast(action.message);
      break;
    case "copy":
      try {
        await navigator.clipboard.writeText(action.text);
        toast(action.toastMessage ?? "Copied to clipboard");
      } catch {
        toast.error("Failed to copy to clipboard");
      }
      break;
  }
}

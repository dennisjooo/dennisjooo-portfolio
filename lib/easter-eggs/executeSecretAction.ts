import { siteToast } from "@/lib/ui/siteToast";
import type { SecretAction } from "./types";

export async function executeSecretAction(action: SecretAction): Promise<void> {
  switch (action.type) {
    case "openUrl":
      window.open(action.url, "_blank", "noopener,noreferrer");
      break;
    case "toast":
      siteToast.playful(action.message);
      break;
    case "copy":
      try {
        await navigator.clipboard.writeText(action.text);
        siteToast.copied(action.toastMessage ?? "Copied to clipboard");
      } catch {
        siteToast.error("Failed to copy to clipboard");
      }
      break;
  }
}

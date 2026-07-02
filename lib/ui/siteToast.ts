import { toast, type ExternalToast } from "sonner";

type SiteToastOptions = ExternalToast & {
  label?: string;
  playful?: boolean;
};

const EDITORIAL_CLASS = "site-toast--editorial";

function editorialToast(
  message: string,
  variant: "default" | "success" | "error",
  options?: SiteToastOptions,
) {
  const label =
    options?.label ??
    (variant === "success"
      ? "SAVED"
      : variant === "error"
        ? "FAILED"
        : "NOTICE");

  const className = [
    EDITORIAL_CLASS,
    options?.playful ? "site-toast--playful" : "",
    options?.className,
  ]
    .filter(Boolean)
    .join(" ");

  const data: ExternalToast = {
    ...options,
    description: message,
    className,
    duration: options?.duration ?? (variant === "error" ? 4500 : 3000),
  };

  if (variant === "success") return toast.success(label, data);
  if (variant === "error") return toast.error(label, data);
  return toast(label, data);
}

export const siteToast = {
  message: (message: string, options?: SiteToastOptions) =>
    editorialToast(message, "default", options),

  success: (message: string, options?: SiteToastOptions) =>
    editorialToast(message, "success", { label: "SAVED", ...options }),

  error: (message: string, options?: SiteToastOptions) =>
    editorialToast(message, "error", { label: "FAILED", ...options }),

  playful: (message: string, options?: SiteToastOptions) =>
    editorialToast(message, "default", {
      playful: true,
      label: options?.label ?? "NOTICE",
      ...options,
    }),

  copied: (message: string, options?: SiteToastOptions) =>
    editorialToast(message, "success", { label: "COPIED", ...options }),
};

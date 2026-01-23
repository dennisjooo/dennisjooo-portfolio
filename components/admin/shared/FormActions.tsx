"use client";

import { useRouter } from "next/navigation";
import { formStyles } from "./formStyles";

interface FormActionsProps {
  loading: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

export function FormActions({
  loading,
  submitLabel = "Save",
  onCancel,
}: FormActionsProps) {
  const router = useRouter();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <div className="flex justify-end gap-4 pt-6">
      <button
        type="button"
        onClick={handleCancel}
        className={formStyles.cancelButton}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className={formStyles.submitButton}
      >
        {loading ? "Saving..." : submitLabel}
      </button>
    </div>
  );
}

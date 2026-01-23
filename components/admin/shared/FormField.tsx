import { ReactNode } from "react";
import { formStyles } from "./formStyles";

interface FormFieldProps {
  label: string;
  children: ReactNode;
  hint?: string;
}

export function FormField({ label, children, hint }: FormFieldProps) {
  return (
    <div>
      <label className={formStyles.label}>{label}</label>
      {children}
      {hint && (
        <p className="mt-1.5 text-xs text-muted-foreground/70">{hint}</p>
      )}
    </div>
  );
}

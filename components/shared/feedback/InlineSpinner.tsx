interface InlineSpinnerProps {
  className?: string;
  label?: string;
}

export function InlineSpinner({
  className = "py-6",
  label = "Loading",
}: InlineSpinnerProps) {
  return (
    <div
      className={`flex justify-center ${className}`}
      aria-busy="true"
      aria-label={label}
    >
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
    </div>
  );
}

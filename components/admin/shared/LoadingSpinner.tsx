interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className = "h-64" }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      className={`flex w-full items-center justify-center ${className}`}
    >
      <div
        className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"
        aria-hidden="true"
      ></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

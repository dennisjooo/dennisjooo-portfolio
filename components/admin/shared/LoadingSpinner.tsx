interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className = "h-64" }: LoadingSpinnerProps) {
  return (
    <div role="status" className={`w-full flex items-center justify-center ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" aria-hidden="true"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

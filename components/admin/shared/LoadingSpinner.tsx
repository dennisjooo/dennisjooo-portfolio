interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className = "h-64" }: LoadingSpinnerProps) {
  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

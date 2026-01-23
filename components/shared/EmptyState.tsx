interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 text-center">
      <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
        {message}
      </p>
    </div>
  );
}

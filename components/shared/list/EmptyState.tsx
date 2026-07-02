interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center py-20 text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
        {message}
      </p>
    </div>
  );
}

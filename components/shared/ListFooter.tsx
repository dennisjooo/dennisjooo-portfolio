interface ListFooterProps {
  total: number;
  itemName?: string;
  pluralName?: string;
}

export function ListFooter({
  total,
  itemName = "item",
  pluralName,
}: ListFooterProps) {
  const plural = pluralName ?? `${itemName}s`;
  const label = total === 1 ? itemName : plural;

  return (
    <div className="w-full flex justify-center py-8">
      <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
        Showing all {total} {label}
      </p>
    </div>
  );
}

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
    <div className="flex w-full justify-center py-8">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Showing all {total} {label}
      </p>
    </div>
  );
}

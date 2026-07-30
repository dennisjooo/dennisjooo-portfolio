export function deleteDialogDescription(entityName: string): string {
  return `Are you sure you want to delete this ${entityName}? This action cannot be undone.`;
}

export function bulkDeleteDialogDescription(
  count: number,
  entityName: string,
): string {
  const plural = count > 1 ? "s" : "";
  return `Are you sure you want to delete ${count} ${entityName}${plural}? This action cannot be undone.`;
}

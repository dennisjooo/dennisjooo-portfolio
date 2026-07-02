import Link from "next/link";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

interface AdminActionCellProps {
  editHref: string;
  onDelete: () => void;
}

export function AdminActionCell({ editHref, onDelete }: AdminActionCellProps) {
  return (
    <div className="flex items-center justify-end gap-3">
      <Link
        href={editHref}
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
        aria-label="Edit"
      >
        <PencilSquareIcon className="h-4 w-4" />
      </Link>
      <button
        type="button"
        onClick={onDelete}
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        aria-label="Delete"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

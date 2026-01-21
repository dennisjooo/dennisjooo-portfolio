import Link from 'next/link';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

interface AdminActionCellProps {
  editHref: string;
  onDelete: () => void;
}

export function AdminActionCell({ editHref, onDelete }: AdminActionCellProps) {
  return (
    <div className="flex items-center justify-end gap-3">
      <Link
        href={editHref}
        className="p-2 rounded-md hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
        title="Edit"
      >
        <PencilSquareIcon className="w-4 h-4" />
      </Link>
      <button
        onClick={onDelete}
        className="p-2 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
        title="Delete"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

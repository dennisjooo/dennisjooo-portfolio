import { ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface Column {
  header: string;
  accessorKey?: string;
  cell?: (row: any) => ReactNode;
  className?: string;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function AdminTable({
  columns,
  data,
  isLoading,
  currentPage,
  totalPages,
  onPageChange
}: AdminTableProps) {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center rounded-xl border border-border bg-card/30 backdrop-blur-sm animate-pulse">
        <div className="font-mono text-sm text-muted-foreground">Loading Data stream...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-40 flex items-center justify-center rounded-xl border border-border bg-card/30 backdrop-blur-sm">
        <div className="font-mono text-sm text-muted-foreground">No records found in database.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card/30 backdrop-blur-sm shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`px-6 py-4 text-xs font-mono uppercase tracking-widest text-muted-foreground ${col.className || ''}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {data.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  className="group hover:bg-muted/30 transition-colors duration-200"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 text-sm font-urbanist text-foreground">
                      {col.cell ? col.cell(row) : (col.accessorKey ? row[col.accessorKey] : '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground font-mono">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-border bg-card/50 hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-border bg-card/50 hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

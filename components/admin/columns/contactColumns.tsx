import { Column } from "@/components/admin/layout/AdminTable";
import type { Contact } from "@/lib/db";
import { CONTACT_ICON_MAP } from "@/lib/constants/contactIcons";
import { Globe } from "lucide-react";
import { createActionsColumn } from "./createActionsColumn";

export function createContactColumns(
  handleDelete: (id: string) => void,
): Column<Contact>[] {
  return [
    {
      header: "Icon",
      cell: (row: Contact) => {
        const IconComponent = CONTACT_ICON_MAP[row.icon] || Globe;
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50">
            <IconComponent className="w-4 h-4" />
          </div>
        );
      },
    },
    {
      header: "Label",
      primary: true,
      cell: (row: Contact) => (
        <span className="font-semibold text-foreground">{row.label}</span>
      ),
    },
    {
      header: "Link",
      cell: (row: Contact) => (
        <a
          href={row.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-accent truncate max-w-[200px] block"
        >
          {row.href}
        </a>
      ),
    },
    createActionsColumn<Contact>("/admin/contacts", handleDelete),
  ];
}

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { AdminTable } from "@/components/admin/AdminTable";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Globe,
} from "lucide-react";

interface Contact {
  id: string;
  label: string;
  href: string;
  icon: string;
  order: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  mail: Mail,
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  website: Globe,
};

export default function AdminContactsList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const fetchContacts = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/contacts?page=${page}&limit=${pageSize}`, {
          cache: 'no-store'
        });
        const data = await res.json();
        if (data.success) {
          setContacts(data.data);
          if (data.pagination) {
            setTotalPages(data.pagination.totalPages);
            setCurrentPage(data.pagination.page);
          }
        }
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    fetchContacts(1);
  }, [fetchContacts]);

  const handlePageChange = (page: number) => {
    fetchContacts(page);
  };

  const deleteContact = async (id: string) => {
    toast("Are you sure you want to delete this contact?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const res = await fetch(`/api/contacts/${id}`, {
              method: "DELETE",
            });

            if (res.ok) {
              fetchContacts(currentPage);
              toast.success("Contact deleted successfully");
            } else {
              toast.error("Failed to delete");
            }
          } catch (error) {
            console.error("Error deleting:", error);
            toast.error("Something went wrong");
          }
        },
      },
    });
  };

  const columns = [
    {
      header: "Icon",
      cell: (row: Contact) => {
        const IconComponent = iconMap[row.icon] || Globe;
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50">
            <IconComponent className="w-4 h-4" />
          </div>
        );
      },
    },
    {
      header: "Label",
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
    {
      header: "Order",
      cell: (row: Contact) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {row.order}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row: Contact) => (
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/admin/contacts/${row.id}`}
            className="p-2 rounded-md hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
            title="Edit"
          >
            <PencilSquareIcon className="w-4 h-4" />
          </Link>
          <button
            onClick={() => deleteContact(row.id)}
            className="p-2 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
            title="Delete"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair italic text-3xl md:text-4xl text-foreground">
            Contacts{" "}
            <span className="not-italic font-sans font-bold">& Socials</span>
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-2">
            Manage your contact links and social profiles
          </p>
        </div>

        <Link
          href="/admin/contacts/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity font-urbanist font-medium shadow-lg shadow-primary/20"
        >
          <PlusIcon className="w-5 h-5" />
          Add New
        </Link>
      </div>

      <AdminTable
        columns={columns}
        data={contacts}
        isLoading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

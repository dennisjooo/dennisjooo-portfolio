"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { AdminTable } from "@/components/admin/AdminTable";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

interface WorkExperience {
  _id: string;
  title: string;
  company: string;
  date: string;
  imageSrc: string;
  order: number;
}

export default function AdminWorkExperienceList() {
  const [items, setItems] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/work-experience");
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch work experiences:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this work experience?"))
      return;

    try {
      const res = await fetch(`/api/work-experience/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchItems();
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const columns = [
    {
      header: "Logo",
      cell: (row: WorkExperience) => (
        <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-muted/30 border border-border/50">
          {row.imageSrc && (
            <Image
              src={row.imageSrc}
              alt={row.company}
              fill
              className="object-contain p-1"
              unoptimized={row.imageSrc.startsWith("http")}
            />
          )}
        </div>
      ),
    },
    {
      header: "Position",
      cell: (row: WorkExperience) => (
        <div>
          <span className="font-semibold text-foreground block">
            {row.title}
          </span>
          <span className="text-muted-foreground text-xs">{row.company}</span>
        </div>
      ),
    },
    {
      header: "Period",
      cell: (row: WorkExperience) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {row.date}
        </span>
      ),
    },
    {
      header: "Order",
      cell: (row: WorkExperience) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.order}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row: WorkExperience) => (
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/admin/work-experience/${row._id}`}
            className="p-2 rounded-md hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
            title="Edit"
          >
            <PencilSquareIcon className="w-4 h-4" />
          </Link>
          <button
            onClick={() => deleteItem(row._id)}
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
            Work <span className="not-italic font-sans font-bold">Experience</span>
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-2">
            Career timeline and education
          </p>
        </div>

        <Link
          href="/admin/work-experience/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity font-urbanist font-medium shadow-lg shadow-primary/20"
        >
          <PlusIcon className="w-5 h-5" />
          Add New
        </Link>
      </div>

      <AdminTable
        columns={columns}
        data={items}
        isLoading={loading}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    </div>
  );
}

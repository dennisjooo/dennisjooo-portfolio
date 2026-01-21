"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { AdminTable } from '@/components/admin/AdminTable';
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

interface Certification {
  _id: string;
  title: string;
  issuer: string;
  date: string;
}

export default function AdminCertificationsList() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const fetchCerts = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/certifications?page=${page}&limit=${pageSize}`);
      const data = await res.json();
      if (data.success) {
        setCerts(data.data);
        if (data.pagination) {
            setTotalPages(data.pagination.totalPages);
            setCurrentPage(data.pagination.page);
        }
      }
    } catch (error) {
      console.error('Failed to fetch certifications:', error);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchCerts(1);
  }, [fetchCerts]);

  const handlePageChange = (page: number) => {
    fetchCerts(page);
  };

  const deleteCert = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    
    try {
      const res = await fetch(`/api/certifications/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        fetchCerts(currentPage); // Refresh list
      } else {
        alert('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const columns = [
    {
      header: "Title",
      cell: (row: Certification) => <span className="font-semibold text-foreground">{row.title}</span>
    },
    {
      header: "Issuer",
      accessorKey: "issuer"
    },
    {
      header: "Year",
      cell: (row: Certification) => <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{row.date}</span>
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row: Certification) => (
        <div className="flex items-center justify-end gap-3">
          <Link 
            href={`/admin/certifications/${row._id}`}
            className="p-2 rounded-md hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
            title="Edit"
          >
            <PencilSquareIcon className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => deleteCert(row._id)}
            className="p-2 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
            title="Delete"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="font-playfair italic text-3xl md:text-4xl text-foreground">
            Certifications <span className="not-italic font-sans font-bold">& Licenses</span>
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-2">
            Academic and professional milestones
          </p>
        </div>
       
        <Link 
          href="/admin/certifications/new" 
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity font-urbanist font-medium shadow-lg shadow-primary/20"
        >
          <PlusIcon className="w-5 h-5" />
          Add New
        </Link>
      </div>

      <AdminTable 
        columns={columns} 
        data={certs} 
        isLoading={loading} 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

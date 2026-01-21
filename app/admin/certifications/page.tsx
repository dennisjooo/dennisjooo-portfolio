"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Certification {
  _id: string;
  title: string;
  issuer: string;
  date: string;
}

export default function AdminCertificationsList() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    try {
      const res = await fetch('/api/certifications');
      const data = await res.json();
      if (data.success) {
        setCerts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCert = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    
    try {
      const res = await fetch(`/api/certifications/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        fetchCerts(); // Refresh list
      } else {
        alert('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Certifications</h1>
        <div className="flex gap-4">
           <Link 
            href="/admin" 
            className="px-4 py-2 border rounded-md hover:bg-muted"
          >
            Back to Dashboard
          </Link>
          <Link 
            href="/admin/certifications/new" 
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Add New
          </Link>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Issuer</th>
              <th className="p-4 font-medium">Year</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {certs.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No certifications found. Create one to get started.
                </td>
              </tr>
            )}
            {certs.map((cert) => (
              <tr key={cert._id} className="hover:bg-muted/50">
                <td className="p-4 font-medium">{cert.title}</td>
                <td className="p-4">{cert.issuer}</td>
                <td className="p-4">{cert.date}</td>
                <td className="p-4 space-x-2">
                  <Link 
                    href={`/admin/certifications/${cert._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => deleteCert(cert._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

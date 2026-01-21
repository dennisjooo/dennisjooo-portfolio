"use client";

import CertificationForm from "@/components/admin/CertificationForm";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditCertificationPage() {
  const params = useParams();
  const router = useRouter();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const res = await fetch(`/api/certifications/${params.id}`, {
          cache: 'no-store'
        });
        if (!res.ok) {
           throw new Error("Failed to fetch certification");
        }
        const data = await res.json();
        if (data.success) {
          setCert(data.data);
        } else {
           throw new Error(data.error);
        }
      } catch (error) {
        console.error(error);
        router.push("/admin/certifications");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCert();
    }
  }, [params.id, router]);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Edit Certification</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        cert && <CertificationForm initialData={cert} isEditing />
      )}
    </div>
  );
}

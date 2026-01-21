"use client";

import WorkExperienceForm from "@/components/admin/WorkExperienceForm";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditWorkExperiencePage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/work-experience/${params.id}`, {
          cache: 'no-store'
        });
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error(error);
        router.push("/admin/work-experience");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return data ? <WorkExperienceForm initialData={data} isEditing /> : null;
}

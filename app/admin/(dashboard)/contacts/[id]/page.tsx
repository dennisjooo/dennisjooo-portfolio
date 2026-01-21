"use client";

import ContactForm from "@/components/admin/ContactForm";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditContactPage() {
  const params = useParams();
  const router = useRouter();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch(`/api/contacts/${params.id}`, {
          cache: 'no-store'
        });
        if (!res.ok) {
          throw new Error("Failed to fetch contact");
        }
        const data = await res.json();
        if (data.success) {
          setContact(data.data);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error(error);
        router.push("/admin/contacts");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchContact();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return contact && <ContactForm initialData={contact} isEditing />;
}

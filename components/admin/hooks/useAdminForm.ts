"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface UseAdminFormOptions<T> {
  endpoint: string;
  id?: string;
  redirectTo: string;
  itemName?: string;
  onSuccess?: (data: T) => void;
}

interface UseAdminFormReturn<T> {
  data: T | null;
  loading: boolean;
  submitting: boolean;
  handleSubmit: (formData: Partial<T>) => Promise<void>;
}

export function useAdminForm<T>({
  endpoint,
  id,
  redirectTo,
  itemName = 'item',
  onSuccess,
}: UseAdminFormOptions<T>): UseAdminFormReturn<T> {
  const router = useRouter();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const res = await fetch(`${endpoint}/${id}`, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(`Failed to fetch ${itemName}`);
        }
        const result = await res.json();
        
        // Handle both {data: ...} and direct object responses
        if (result.success === false) {
          throw new Error(result.error || `${itemName} not found`);
        }
        
        const itemData = result.data ?? result;
        setData(itemData);
      } catch (error) {
        console.error(error);
        toast.error(`${itemName.charAt(0).toUpperCase() + itemName.slice(1)} not found`);
        router.push(redirectTo);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, endpoint, redirectTo, itemName, router]);

  const handleSubmit = useCallback(
    async (formData: Partial<T>) => {
      setSubmitting(true);
      try {
        const isEditing = !!id;
        const url = isEditing ? `${endpoint}/${id}` : endpoint;
        const method = isEditing ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          throw new Error(`Failed to ${isEditing ? 'update' : 'create'} ${itemName}`);
        }

        const result = await res.json();
        const successMsg = `${itemName.charAt(0).toUpperCase() + itemName.slice(1)} ${isEditing ? 'updated' : 'created'} successfully`;
        toast.success(successMsg);

        if (onSuccess) {
          onSuccess(result.data ?? result);
        }

        router.push(redirectTo);
        router.refresh();
      } catch (error) {
        console.error('Error:', error);
        toast.error(`Failed to save ${itemName}`);
      } finally {
        setSubmitting(false);
      }
    },
    [id, endpoint, redirectTo, itemName, router, onSuccess]
  );

  return {
    data,
    loading,
    submitting,
    handleSubmit,
  };
}

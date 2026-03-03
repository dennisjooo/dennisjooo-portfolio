"use client";

import { use } from 'react';
import { AdminFormLayout, LoadingSpinner } from '@/components/admin/shared';
import { useAdminForm } from '@/components/admin/hooks';

interface EditPageConfig<T> {
  endpoint: string;
  redirectTo: string;
  itemName: string;
  FormComponent: React.ComponentType<{ initialData: T; onSubmit: (data: Partial<T>) => Promise<void> }>;
  title: { accent: string; subtitle: string };
}

export function createAdminEditPage<T>(config: EditPageConfig<T>) {
  const { endpoint, redirectTo, itemName, FormComponent, title } = config;

  return function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data, loading, handleSubmit } = useAdminForm<T>({
      endpoint,
      id,
      redirectTo,
      itemName,
    });

    if (loading) return <LoadingSpinner />;
    if (!data) return null;

    return (
      <AdminFormLayout title="Edit" titleAccent={title.accent} subtitle={title.subtitle}>
        <FormComponent initialData={data} onSubmit={handleSubmit} />
      </AdminFormLayout>
    );
  };
}

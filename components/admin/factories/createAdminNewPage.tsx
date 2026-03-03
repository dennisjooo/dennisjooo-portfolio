"use client";

import { AdminFormLayout } from '@/components/admin/shared';
import { useAdminForm } from '@/components/admin/hooks';

interface NewPageConfig<T> {
  endpoint: string;
  redirectTo: string;
  itemName: string;
  FormComponent: React.ComponentType<{ onSubmit: (data: Partial<T>) => Promise<void> }>;
  title: { accent: string; subtitle: string };
}

export function createAdminNewPage<T>(config: NewPageConfig<T>) {
  const { endpoint, redirectTo, itemName, FormComponent, title } = config;

  return function NewPage() {
    const { handleSubmit } = useAdminForm<T>({
      endpoint,
      redirectTo,
      itemName,
    });

    return (
      <AdminFormLayout title="New" titleAccent={title.accent} subtitle={title.subtitle}>
        <FormComponent onSubmit={handleSubmit} />
      </AdminFormLayout>
    );
  };
}

"use client";

import { AdminPageHeader } from "./AdminPageHeader";

interface AdminFormLayoutProps {
  title: string;
  titleAccent: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AdminFormLayout({
  title,
  titleAccent,
  subtitle,
  children,
}: AdminFormLayoutProps) {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={title}
        titleAccent={titleAccent}
        subtitle={subtitle}
        showBack
      />
      {children}
    </div>
  );
}

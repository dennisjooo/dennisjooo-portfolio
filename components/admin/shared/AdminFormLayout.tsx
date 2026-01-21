"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

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
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-muted/50 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="font-playfair italic text-3xl font-bold text-foreground">
            {title} <span className="not-italic font-sans">{titleAccent}</span>
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-1">
            {subtitle}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}

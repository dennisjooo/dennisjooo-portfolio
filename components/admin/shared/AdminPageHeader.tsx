import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

interface AdminPageHeaderProps {
  title: string;
  titleAccent: string;
  subtitle: string;
  actionHref?: string;
  actionLabel?: string;
}

export function AdminPageHeader({
  title,
  titleAccent,
  subtitle,
  actionHref,
  actionLabel = 'Add New',
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="font-playfair italic text-3xl md:text-4xl text-foreground">
          {title} <span className="not-italic font-sans font-bold">{titleAccent}</span>
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-2">
          {subtitle}
        </p>
      </div>

      {actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity font-urbanist font-medium shadow-lg shadow-primary/20"
        >
          <PlusIcon className="w-5 h-5" />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

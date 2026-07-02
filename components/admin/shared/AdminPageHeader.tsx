import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

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
  actionLabel = "Add New",
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="font-caslon text-3xl italic text-foreground md:text-4xl">
          {title}{" "}
          <span className="font-sans font-bold not-italic">{titleAccent}</span>
        </h1>
        <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {subtitle}
        </p>
      </div>

      {actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-sans font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-opacity hover:opacity-90"
        >
          <PlusIcon className="h-5 w-5" />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

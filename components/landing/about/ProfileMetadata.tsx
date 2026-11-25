import { cn } from "@/lib/utils";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants/site";

interface ProfileMetadataProps {
  className?: string;
  nameClassName?: string;
}

export function ProfileMetadata({
  className,
  nameClassName = "text-3xl",
}: ProfileMetadataProps) {
  return (
    <div
      className={cn("animate-fade-in space-y-2 text-center", className)}
      style={{ animationDelay: "0.6s" }}
    >
      <p className={cn("font-serif text-foreground", nameClassName)}>
        {SITE_NAME}
      </p>
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {SITE_TAGLINE}
      </p>
    </div>
  );
}

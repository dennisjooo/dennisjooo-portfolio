import { ADMIN_CONSOLE_LABEL } from "@/lib/constants/adminNav";
import { SITE_MARK, SITE_NAME } from "@/lib/constants/site";

interface AdminSidebarBrandProps {
  isCollapsed: boolean;
}

export function AdminSidebarBrand({ isCollapsed }: AdminSidebarBrandProps) {
  return (
    <div className="relative border-b border-border py-4">
      <div
        className={`flex h-full items-center justify-center transition-opacity duration-200 ${
          isCollapsed
            ? "opacity-100"
            : "pointer-events-none absolute inset-0 opacity-0"
        }`}
      >
        <h1 className="font-serif text-lg">{SITE_MARK}</h1>
      </div>
      <div
        className={`pl-[22px] transition-opacity duration-200 ${
          isCollapsed ? "opacity-0" : "opacity-100"
        }`}
      >
        <h1 className="whitespace-nowrap font-serif text-lg">{SITE_NAME}</h1>
        <p className="whitespace-nowrap font-sans text-xs text-muted-foreground/60">
          {ADMIN_CONSOLE_LABEL}
        </p>
      </div>
    </div>
  );
}

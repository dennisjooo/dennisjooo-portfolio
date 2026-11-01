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
        <h1 className="font-serif text-lg">DJ</h1>
      </div>
      <div
        className={`pl-[22px] transition-opacity duration-200 ${
          isCollapsed ? "opacity-0" : "opacity-100"
        }`}
      >
        <h1 className="whitespace-nowrap font-serif text-lg">
          Dennis Jonathan
        </h1>
        <p className="whitespace-nowrap font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60">
          Mission Control
        </p>
      </div>
    </div>
  );
}

interface DashboardHeaderProps {
  userName?: string | null;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="font-playfair italic text-4xl md:text-5xl lg:text-6xl text-foreground">
        Welcome back,{' '}
        <span className="not-italic font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-600">
          {userName || 'Admin'}.
        </span>
      </h1>
      <p className="font-mono text-muted-foreground text-sm uppercase tracking-widest max-w-xl">
        System Status: Operational {/* Ready for content injection */}
      </p>
    </div>
  );
}

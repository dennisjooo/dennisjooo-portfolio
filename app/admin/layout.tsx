// This is a minimal layout for all /admin routes
// The authenticated dashboard layout with sidebar is in (dashboard)/layout.tsx
// The login page bypasses the dashboard layout

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

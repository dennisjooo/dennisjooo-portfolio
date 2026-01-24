import { ClerkProvider } from '@clerk/nextjs';

// This is a minimal layout for all /admin routes
// The authenticated dashboard layout with sidebar is in (dashboard)/layout.tsx
// The login page bypasses the dashboard layout
// ClerkProvider is scoped to admin routes only to avoid blocking public pages

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkProvider>{children}</ClerkProvider>;
}

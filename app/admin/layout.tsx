import { ClerkProvider } from '@clerk/nextjs';
import dynamic from 'next/dynamic';

// MotionProvider wraps content that needs framer-motion
// SSR enabled for consistent hydration, but LazyMotion defers feature loading
const MotionProvider = dynamic(
  () => import("@/components/motion/MotionProvider").then(m => ({ default: m.MotionProvider }))
);

// This is a minimal layout for all /admin routes
// The authenticated dashboard layout with sidebar is in (dashboard)/layout.tsx
// The login page bypasses the dashboard layout
// ClerkProvider is scoped to admin routes only to avoid blocking public pages

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <MotionProvider>{children}</MotionProvider>
    </ClerkProvider>
  );
}

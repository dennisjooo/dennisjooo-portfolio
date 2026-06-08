import { ClerkProvider } from '@clerk/nextjs';
import { SSRCoverDismiss } from '@/components/loader/SSRCoverDismiss';
import dynamic from 'next/dynamic';

const MotionProvider = dynamic(
  () => import("@/components/motion/MotionProvider").then(m => ({ default: m.MotionProvider }))
);

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <SSRCoverDismiss />
      <MotionProvider>{children}</MotionProvider>
    </ClerkProvider>
  );
}

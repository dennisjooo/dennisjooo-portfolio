import { ClerkProvider } from '@clerk/nextjs';
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
      <MotionProvider>{children}</MotionProvider>
    </ClerkProvider>
  );
}

import { AdminCommandPalette } from "@/components/admin/layout/AdminCommandPalette";
import { AdminMobileMenu } from "@/components/admin/layout/AdminMobileMenu";
import { SidebarLayout } from "@/components/admin/layout/SidebarLayout";
import { UnsavedChangesProvider } from "@/components/admin/hooks";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  // Redirect to login if not authenticated
  if (!userId) {
    redirect("/admin/login");
  }

  return (
    <UnsavedChangesProvider>
      <div className="bg-noise relative flex min-h-screen overflow-x-hidden bg-background text-foreground">
        <AdminCommandPalette />
        <SidebarLayout>
          <div className="animate-fade-in mx-auto w-full max-w-5xl space-y-8">
            <AdminMobileMenu />
            {children}
          </div>
        </SidebarLayout>
      </div>
    </UnsavedChangesProvider>
  );
}

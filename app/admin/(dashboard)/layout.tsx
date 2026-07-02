import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminCommandPalette } from "@/components/admin/layout/AdminCommandPalette";
import { AdminMobileMenu } from "@/components/admin/layout/AdminMobileMenu";
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
        <AdminSidebar />
        <AdminCommandPalette />
        <main className="relative z-10 min-h-screen min-w-0 flex-1 p-4 md:p-8 lg:ml-64 lg:p-12">
          <div className="animate-fade-in mx-auto w-full max-w-6xl space-y-8">
            <AdminMobileMenu />

            {children}
          </div>
        </main>
      </div>
    </UnsavedChangesProvider>
  );
}

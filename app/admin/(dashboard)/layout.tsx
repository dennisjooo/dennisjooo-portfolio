import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileMenu } from "@/components/admin/AdminMobileMenu";
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
    <div className="min-h-screen bg-background text-foreground bg-noise relative flex overflow-x-hidden">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 relative z-10 p-4 md:p-8 lg:p-12 min-h-screen min-w-0">
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in w-full">
          <AdminMobileMenu />

          {children}
        </div>
      </main>
    </div>
  );
}

import { AdminSidebar } from "@/components/admin/AdminSidebar";
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
    <div className="min-h-screen bg-background text-foreground bg-noise relative flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 relative z-10 p-8 md:p-12 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
          {/* Mobile Header (visible only on small screens) */}
          <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-border">
            <h1 className="font-playfair italic text-xl">Mission Control</h1>
            {/* Add mobile menu toggle here if needed, for now keeping it simple */}
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}

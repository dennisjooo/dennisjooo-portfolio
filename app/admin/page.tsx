import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/admin/blogs" 
          className="p-6 border rounded-lg hover:bg-accent transition-colors block"
        >
          <h2 className="text-2xl font-semibold mb-2">Manage Blogs</h2>
          <p className="text-muted-foreground">Create, edit, and delete blog posts and projects.</p>
        </Link>
        
        <Link 
          href="/admin/profile" 
          className="p-6 border rounded-lg hover:bg-accent transition-colors block"
        >
          <h2 className="text-2xl font-semibold mb-2">Profile Settings</h2>
          <p className="text-muted-foreground">Update profile picture and site configuration.</p>
        </Link>
      </div>
    </div>
  );
}

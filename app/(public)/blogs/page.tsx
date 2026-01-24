import type { Metadata } from 'next';
import { BackToTop } from '@/components/shared';
import { BlogsTabs } from '@/components/blogs/list/BlogsTabs';
import { getBlogs } from '@/lib/data/blogs';

// Enable ISR for blogs listing
export const revalidate = 60;

export const metadata: Metadata = {
    title: "Blog & Certifications | Dennis' Portfolio",
    description: "Explore Dennis' projects, blog posts, and professional certifications.",
};

export default async function ProjectsAndCertificationsPage() {
    // Fetch initial blog data server-side for faster initial load
    const initialBlogsData = await getBlogs(1, 9, 'all');

    return (
        <main className="min-h-screen bg-background text-foreground">
            <section
                id='projects-and-certifications'
                className='flex flex-col py-8 md:py-12'
            >
                <BlogsTabs 
                    initialProjects={initialBlogsData.data}
                    initialPagination={initialBlogsData.pagination}
                />
            </section>
            
            <BackToTop />
        </main>
    );
}

import type { Metadata } from 'next';
import { BackToTop } from '@/components/shared';
import { BlogsTabs } from '@/components/blogs/list/BlogsTabs';

export const metadata: Metadata = {
    title: "Blog & Certifications | Dennis' Portfolio",
    description: "Explore Dennis' projects, blog posts, and professional certifications.",
};

export default function ProjectsAndCertificationsPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <section
                id='projects-and-certifications'
                className='flex flex-col py-8 md:py-12'
            >
                <BlogsTabs />
            </section>
            
            <BackToTop />
        </main>
    );
}

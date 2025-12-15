import type { Metadata } from 'next';
import { BackToTop } from '@/components/shared';
import { BlogsTabs } from '@/components/projects/BlogsTabs';

export const metadata: Metadata = {
    title: "Blog & Certifications | Dennis' Portfolio",
    description: "Explore Dennis' projects, blog posts, and professional certifications.",
};

export default function ProjectsAndCertificationsPage() {
    return (
        <section
            id='projects-and-certifications'
            className='flex flex-col min-h-screen py-16 text-gray-900 dark:text-white'
        >
            <BlogsTabs />
            <BackToTop />
        </section>
    );
}

import { IBlog } from '@/models/Blog';
import { createUrlSlug } from '@/lib/utils/urlHelpers';
import { formatProjectDate } from '@/lib/utils/projectFormatting';
import { ContentCard } from '@/components/shared';
import { useEffect, useState } from 'react';

// interface Project extends IBlog {
//     _id: string;
// }

export default function ProjectsList({ type = 'project' }: { type?: 'project' | 'blog' | 'all' }) {
    const [projects, setProjects] = useState<IBlog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/blogs');
                const data = await res.json();
                setProjects(data);
            } catch (error) {
                console.error('Failed to fetch projects', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const filteredProjects = projects.filter((project) => {
        if (type === 'all') return true;
        return project.type === type;
    });

    if (loading) {
        return (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-96 bg-muted/20 animate-pulse rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredProjects.map(({ title, description, date, imageUrl, blogPost, type: itemType }, index) => (
                <ContentCard
                    key={`${title}_${date}`}
                    title={title}
                    description={description}
                    slug={createUrlSlug(title)}
                    date={formatProjectDate(date, true)}
                    imageUrl={imageUrl}
                    index={index}
                    type={itemType}
                    readTime={`${Math.ceil(blogPost.split(/\s+/).length / 200)} min`}
                    variant="standard"
                />
            ))}
        </div>
    );
}

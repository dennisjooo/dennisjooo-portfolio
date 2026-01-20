import { Blog, projects } from '@/data/blogs';
import { createUrlSlug } from '@/lib/utils/urlHelpers';
import { formatProjectDate } from '@/lib/utils/projectFormatting';
import { ContentCard } from '@/components/shared';

const allProjects = [...projects].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export default function ProjectsList({ type = 'project' }: { type?: 'project' | 'blog' | 'all' }) {
    const filteredProjects = type === 'all'
        ? allProjects
        : allProjects.filter((project) => project.type === type);

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredProjects.map(({ title, description, date, imageUrl, blogPost, type: itemType }: Blog, index) => (
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

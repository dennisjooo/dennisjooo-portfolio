import ReactMarkdown from 'react-markdown';
import 'katex/dist/katex.min.css';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import { markdownComponents } from './Markdown/MarkdownComponents';

function preprocessImageSizes(markdown: string): string {
    return markdown.replace(
        /!\[([^\]]*)\]\((\S+)\s+=(\d*)x(\d*)(?:\s+"([^"]*)")?\)/g,
        (_, alt, url, w, h, title) => {
            const dim = `#dim=${w || ''}x${h || ''}`;
            const titlePart = title ? ` "${title}"` : '';
            return `![${alt}](${url}${dim}${titlePart})`;
        }
    );
}

interface ProjectContentProps {
    content: string;
}

export default function ProjectContent({ content }: ProjectContentProps) {
    const processed = preprocessImageSizes(content);

    return (
        <article className="prose prose-sm sm:prose-base md:prose-lg max-w-none prose-gray dark:prose-invert">
            <ReactMarkdown
                components={markdownComponents}
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeSlug, rehypeKatex]}
            >
                {processed}
            </ReactMarkdown>
        </article>
    );
}

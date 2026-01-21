import ReactMarkdown from 'react-markdown';
import 'katex/dist/katex.min.css';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import { markdownComponents } from './Markdown/MarkdownComponents';

interface ProjectContentProps {
    content: string;
}

export default function ProjectContent({ content }: ProjectContentProps) {
    return (
        <article className="prose prose-sm sm:prose-base md:prose-lg max-w-none prose-gray dark:prose-invert">
            <ReactMarkdown
                components={markdownComponents}
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeSlug, rehypeKatex]}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}

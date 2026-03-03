import GithubSlugger from 'github-slugger';

export interface Heading {
    id: string;
    text: string;
    level: number;
}

/**
 * Extracts headings from markdown content
 */
export function extractHeadings(markdown: string): Heading[] {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: Heading[] = [];
    const slugger = new GithubSlugger();
    let match;

    while ((match = headingRegex.exec(markdown)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = slugger.slug(text);

        headings.push({ id, text, level });
    }

    return headings;
}

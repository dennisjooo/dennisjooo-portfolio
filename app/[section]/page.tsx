import { notFound } from 'next/navigation';
import SectionRedirectClient from './SectionRedirect';

// All valid route aliases -> target section hash
const SECTION_ROUTES = [
    'about',
    'work', 'experience',           // /work or /experience -> #work
    'projects', 'project',          // /projects or /project -> #projects
    'skills', 'skill',              // /skills or /skill -> #skills
    'contact', 'contacts',          // /contact or /contacts -> #contact
];

export function generateStaticParams() {
    return SECTION_ROUTES.map((section) => ({ section }));
}

export default async function SectionRedirect({ params }: { params: Promise<{ section: string }> }) {
    const { section } = await params;

    if (!SECTION_ROUTES.includes(section)) {
        notFound();
    }

    return <SectionRedirectClient section={section} />;
}

'use client';

import { useEffect } from 'react';

// Map route aliases to their target section hash
const SECTION_ROUTES: Record<string, string> = {
    about: 'about',
    work: 'work',
    experience: 'work',      // alias
    projects: 'projects',
    project: 'projects',     // alias
    skills: 'skills',
    skill: 'skills',         // alias
    contact: 'contact',
    contacts: 'contact',     // alias
};

export default function SectionRedirectClient({ section }: { section: string }) {
    useEffect(() => {
        const hash = SECTION_ROUTES[section];
        if (hash) {
            window.location.replace(`/#${hash}`);
        }
    }, [section]);

    return null;
}


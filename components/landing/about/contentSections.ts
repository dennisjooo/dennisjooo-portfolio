import { aboutContent } from '@/data/aboutContent';

export interface ContentSection {
    title: string;
    body: string;
    id: string;
}

export const contentSections: ContentSection[] = [
    { title: "The Logic", body: aboutContent.intro, id: "intro" },
    { title: "The Builder", body: aboutContent.experience, id: "exp" },
    { title: "The Curiosity", body: aboutContent.personal, id: "pers" },
    { title: "The Connection", body: aboutContent.outro, id: "outro" }
];

import { IBlog } from "@/models/Blog";

export const sortProjectsByDate = (projects: IBlog[]): IBlog[] =>
    [...projects].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );


function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

export const formatProjectDate = (dateString: string, shortFormat?: boolean): string =>
    {
        const date = new Date(dateString);
        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
        const month = date.toLocaleDateString('en-US', { month: 'long' });
        const day = date.getDate();
        const year = date.getFullYear();
        const ordinal = getOrdinalSuffix(day);
        if (shortFormat) {
            return `${ day } ${ month } ${ year } `;
        } else {
            return `${ weekday }, ${ month } ${ day }${ ordinal }, ${ year } `;
        }
    }

export const truncateProjectDescription = (description: string, maxLength = 120): string =>
    description.length <= maxLength
        ? description
        : `${ description.slice(0, maxLength).trim() }...`;

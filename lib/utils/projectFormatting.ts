function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

export function calculateReadTime(text: string): number {
    return Math.ceil(text.split(/\s+/).length / 200);
}

export function getBlogTypeLabel(type: string): string {
    return type === 'project' ? 'Project' : 'Article';
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
            return `${day} ${month} ${year}`;
        } else {
            return `${weekday}, ${month} ${day}${ordinal}, ${year}`;
        }
    }

import { Heading } from '@/lib/utils/markdownHelpers';
import { scrollToCentered } from '@/lib/utils/scrollHelpers';

export function getDisplayActiveId(
    activeId: string,
    headings: Heading[],
    isHovered: boolean
): string {
    if (!activeId) return '';

    if (isHovered) return activeId;

    const activeHeading = headings.find(h => h.id === activeId);
    if (!activeHeading) return activeId;

    const minLevel = Math.min(...headings.map(h => h.level));

    if (activeHeading.level === minLevel) return activeId;

    const activeIndex = headings.findIndex(h => h.id === activeId);
    for (let i = activeIndex - 1; i >= 0; i--) {
        if (headings[i].level === minLevel) {
            return headings[i].id;
        }
    }

    return activeId;
}

export function handleTocClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
    setActiveId: (id: string) => void
): void {
    e.preventDefault();
    e.stopPropagation();

    setActiveId(id);

    const element = document.getElementById(id);
    if (!element) {
        return;
    }

    scrollToCentered(element);
}

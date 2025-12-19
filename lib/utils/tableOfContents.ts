import { Heading } from '@/lib/utils/markdownHelpers';
import { scrollToCentered } from '@/lib/utils/scrollHelpers';

/**
 * Get the display active ID based on hover state and heading hierarchy.
 * When not hovering, if active heading is a child, highlight its parent instead.
 */
export function getDisplayActiveId(
    activeId: string,
    headings: Heading[],
    isHovered: boolean
): string {
    if (!activeId) return '';

    // If we're hovering, show the actual active ID
    if (isHovered) return activeId;

    // Find the active heading
    const activeHeading = headings.find(h => h.id === activeId);
    if (!activeHeading) return activeId;

    // Get the minimum heading level
    const minLevel = Math.min(...headings.map(h => h.level));

    // If it's already a top-level heading, use it
    if (activeHeading.level === minLevel) return activeId;

    // Find the parent (previous heading with lower level)
    const activeIndex = headings.findIndex(h => h.id === activeId);
    for (let i = activeIndex - 1; i >= 0; i--) {
        if (headings[i].level === minLevel) {
            return headings[i].id;
        }
    }

    return activeId;
}

/**
 * Handle click on table of contents item with smooth scrolling and URL update
 */
export function handleTocClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
    setActiveId: (id: string) => void
): void {
    e.preventDefault();
    e.stopPropagation();

    // Immediately update the active ID when clicked
    setActiveId(id);

    const element = document.getElementById(id);
    if (!element) {
        return;
    }

    // Use shared scroll utility for consistent centering
    scrollToCentered(element);

    // Update hash after a short delay
    setTimeout(() => {
        window.history.replaceState({}, '', `#${id}`);
    }, 10);
}

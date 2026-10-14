const ABOUT_SCROLL_MOBILE_PER_SECTION = 375;
const ABOUT_SCROLL_DESKTOP_PER_TRANSITION = 400;

export function aboutMobileScrollDistance(sectionCount: number): number {
  return ABOUT_SCROLL_MOBILE_PER_SECTION * Math.max(sectionCount, 1);
}

export function aboutDesktopScrollDistance(sectionCount: number): number {
  return ABOUT_SCROLL_DESKTOP_PER_TRANSITION * Math.max(sectionCount - 1, 1);
}

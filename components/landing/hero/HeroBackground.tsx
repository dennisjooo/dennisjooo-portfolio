/**
 * Hero background with CSS-only dithered gradient
 * Animates once on load, no WebGL or runtime JS
 */
export function HeroBackground() {
    return <div className="absolute inset-0 z-0 hero-dithered-gradient" />;
}

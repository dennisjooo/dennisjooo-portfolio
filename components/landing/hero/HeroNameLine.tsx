const HERO_NAME_BASE =
    'relative z-10 font-playfair italic font-normal text-foreground leading-[0.85] tracking-tight mix-blend-overlay dark:mix-blend-screen';

type HeroNameLineProps = {
    text: string;
    className?: string;
    ariaLabel: string;
    startDelay?: number;
};

export function HeroNameLine({ text, className, ariaLabel, startDelay = 0 }: HeroNameLineProps) {
    return (
        <h1 className={className ? `${HERO_NAME_BASE} ${className}` : HERO_NAME_BASE} aria-label={ariaLabel}>
            {text.split('').map((char, i) => (
                <span
                    key={`${char}-${i}`}
                    className="animate-letter-reveal shrink-0"
                    style={{ animationDelay: `${startDelay + i * 30}ms` }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </h1>
    );
}

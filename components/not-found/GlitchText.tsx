export function GlitchText({ children }: { children: string }) {
    return (
        <span className="glitch-wrapper group relative inline-block">
            <span
                className="glitch-text relative inline-block"
                data-text={children}
            >
                {children}
            </span>
        </span>
    );
}

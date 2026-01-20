/**
 * Footer component - simplified for better performance
 * Uses CSS animations instead of framer-motion to reduce JS bundle
 */
const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative w-full py-8 px-8 bg-background overflow-hidden border-t border-border z-40 bg-noise flex justify-center items-center">
            {/* Gradient Glow Interpretation - Ambient Bottom Light */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[200px] bg-gradient-accent opacity-15 blur-[80px] rounded-full pointer-events-none mix-blend-screen" />
            
            <div 
                className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-widest relative z-10 animate-fade-in-up"
                style={{ animationDelay: '100ms' }}
            >
                {currentYear} Dennis Jonathan
            </div>
        </footer>
    );
};

export default Footer;

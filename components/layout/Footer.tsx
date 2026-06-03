const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-40 w-full overflow-hidden border-t border-border bg-background bg-noise">
            <div className="absolute inset-x-0 top-0 h-px bg-border opacity-50" />

            <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-3 px-6 py-8 text-center sm:px-8">
                <p className="text-[11px] font-mono uppercase tracking-widest text-foreground">
                    <a href="https://dennisjooo.vercel.app" target="_blank" rel="noopener noreferrer">
                        <span className="hover:text-accent transition-colors duration-300">
                            © {currentYear} Dennis Jonathan
                        </span>
                    </a>
                </p>
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Human Being · Jakarta
                </p>
            </div>
        </footer>
    );
};

export default Footer;

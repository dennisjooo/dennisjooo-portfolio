export const FeaturedProjectsHeader = () => (
  <div className="mb-16 md:mb-10">
    <div className="relative w-full flex justify-between items-end border-b border-border pb-4 mb-6">
      <span className="font-caslon italic text-3xl md:text-4xl text-foreground">
        04.
      </span>
      <span className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-70 text-muted-foreground">
        Featured Projects
      </span>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-accent" />
    </div>

    <div className="relative w-full select-none pt-6">
      <h2 className="font-caslon italic text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-foreground mb-4">
        Selected Work
      </h2>
      <p className="font-sans text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
        Things I&apos;ve built that mostly still work.
      </p>
    </div>
  </div>
);

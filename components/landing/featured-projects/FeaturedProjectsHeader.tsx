export const FeaturedProjectsHeader = () => (
    <div className="mb-16 md:mb-10">
        <div className="relative w-full flex justify-between items-end border-b border-border pb-4 mb-6">
            <span className="font-playfair italic text-3xl md:text-4xl text-foreground">04.</span>
            <span className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-70 text-muted-foreground">
                Featured Projects
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-accent" />
        </div>

        <div className="relative w-full select-none pt-6">
            <div className="flex flex-col w-full items-start">
                <span className="font-playfair italic relative z-20 text-foreground text-7xl md:text-7xl ml-2 md:ml-12 mb-[-3vw] md:mb-[-2vw]">
                    Selected
                </span>
                <h2>
                    <span className="font-sans font-black leading-[0.8] tracking-tighter text-background-layer z-10 select-none block text-[15vw] md:text-[8vw]">
                        WORK
                    </span>
                </h2>
            </div>
        </div>
    </div>
);

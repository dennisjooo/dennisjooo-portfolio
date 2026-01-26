import { HeroBackground } from './HeroBackground';
import { HeroTypingRole } from './HeroTypingRole';
import { HeroScrollEffect } from './HeroScrollEffect';

/**
 * Hero section - Server component for optimal LCP
 * The main heading text renders immediately without JavaScript
 * Client components (HeroBackground, HeroTypingRole, HeroScrollEffect) 
 * hydrate after initial paint
 */
const Hero: React.FC = () => {
    return (
        <section
            id="home"
            className="h-screen w-full relative overflow-hidden bg-gradient-primary bg-noise"
        >
            {/* Background effect - client component, deferred loading */}
            <HeroBackground />
            
            {/* Scroll effect tracker - client component */}
            <HeroScrollEffect />
            
            {/* Main content - Server-rendered for fast LCP */}
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-12 lg:p-16 pointer-events-none">
                
                {/* Top Meta Bar */}
                <div className="flex justify-between items-start text-[10px] md:text-sm lg:text-base font-mono tracking-widest uppercase opacity-60 mt-16">
                    <div className="animate-fade-in-down" style={{ animationDelay: '200ms' }}>
                        A Portfolio 
                    </div>
                    <div className="text-right animate-fade-in-down" style={{ animationDelay: '400ms' }}>
                        Jakarta, Indonesia
                    </div>
                </div>

                {/* Main Typography - LCP Element - Server rendered, no JS needed */}
                <div className="flex flex-col justify-center flex-grow relative w-full -mt-10 md:mt-0">
                    <h1
                        className="relative z-10 text-[18vw] md:text-[12vw] leading-[0.85] font-playfair italic font-normal text-foreground mix-blend-overlay dark:mix-blend-screen"
                    >
                        Dennis
                    </h1>
                    <h1
                        className="relative z-10 text-[18vw] md:text-[12vw] leading-[0.85] font-bold tracking-tighter text-foreground self-end text-right w-full"
                    >
                        JONATHAN
                    </h1>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 md:pb-0">
                    {/* Typing effect - client component */}
                    <HeroTypingRole />

                    <div
                        className="hidden md:block font-mono text-xs lg:text-sm tracking-widest uppercase opacity-60 animate-fade-in"
                        style={{ writingMode: 'vertical-rl', animationDelay: '1200ms' }}
                    >
                        Scroll to Explore
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

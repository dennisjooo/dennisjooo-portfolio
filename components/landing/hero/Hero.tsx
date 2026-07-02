import { HeroBackground } from "./HeroBackground";
import { HeroNameLine } from "./HeroNameLine";
import { HeroTypingRole } from "./HeroTypingRole";
import { HeroScrollEffect } from "./HeroScrollEffect";
import { HeroScrollCue } from "./HeroScrollCue";

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      <HeroBackground />
      <HeroScrollEffect />

      <div
        id="home-hero-foreground"
        className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-12 lg:p-16"
      >
        <div className="mt-16 flex items-start justify-between font-mono text-[10px] uppercase tracking-widest opacity-60 md:text-sm lg:text-base">
          <div
            className="animate-fade-in-down"
            style={{ animationDelay: "200ms" }}
          >
            A Portfolio
          </div>
          <div
            className="animate-fade-in-down text-right"
            style={{ animationDelay: "400ms" }}
          >
            Jakarta, Indonesia
          </div>
        </div>

        <div className="relative -mt-10 flex w-full flex-grow flex-col items-center justify-center overflow-hidden md:mt-0">
          <div className="flex w-full flex-col items-center md:hidden">
            <HeroNameLine
              text="Dennis"
              ariaLabel="Dennis"
              className="flex max-w-full flex-nowrap justify-center text-center text-[18vw]"
            />
            <HeroNameLine
              text="Jonathan"
              ariaLabel="Jonathan"
              startDelay={100}
              className="flex w-full max-w-full flex-nowrap justify-center text-center text-[18vw]"
            />
          </div>

          <HeroNameLine
            text="Dennis Jonathan"
            ariaLabel="Dennis Jonathan"
            className="hidden w-full max-w-full flex-nowrap justify-center text-center text-[9vw] md:flex lg:text-[8vw]"
          />
        </div>

        <div className="relative flex w-full flex-row items-end justify-between gap-4 pb-8 md:gap-8 md:pb-0">
          <HeroTypingRole />

          <HeroScrollCue />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
    </section>
  );
};

export default Hero;

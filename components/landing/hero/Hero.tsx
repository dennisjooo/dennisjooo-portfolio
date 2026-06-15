import { HeroBackground } from "./HeroBackground";
import { HeroNameLine } from "./HeroNameLine";
import { HeroTypingRole } from "./HeroTypingRole";
import { HeroScrollEffect } from "./HeroScrollEffect";
import { HeroScrollCue } from "./HeroScrollCue";

const Hero: React.FC = () => {
  return (
    <section id="home" className="h-screen w-full relative overflow-hidden">
      <HeroBackground />
      <HeroScrollEffect />

      <div
        id="home-hero-foreground"
        className="absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-12 lg:p-16 pointer-events-none"
      >
        <div className="flex justify-between items-start text-[10px] md:text-sm lg:text-base font-mono tracking-widest uppercase opacity-60 mt-16">
          <div
            className="animate-fade-in-down"
            style={{ animationDelay: "200ms" }}
          >
            A Portfolio
          </div>
          <div
            className="text-right animate-fade-in-down"
            style={{ animationDelay: "400ms" }}
          >
            Jakarta, Indonesia
          </div>
        </div>

        <div className="flex flex-col items-center justify-center flex-grow relative w-full -mt-10 md:mt-0 overflow-hidden">
          <div className="flex w-full flex-col items-center md:hidden">
            <HeroNameLine
              text="Dennis"
              ariaLabel="Dennis"
              className="text-[18vw] flex flex-nowrap justify-center text-center max-w-full"
            />
            <HeroNameLine
              text="Jonathan"
              ariaLabel="Jonathan"
              startDelay={100}
              className="text-[18vw] w-full flex flex-nowrap justify-center text-center max-w-full"
            />
          </div>

          <HeroNameLine
            text="Dennis Jonathan"
            ariaLabel="Dennis Jonathan"
            className="hidden md:flex text-[9vw] lg:text-[8vw] w-full flex-nowrap justify-center text-center max-w-full"
          />
        </div>

        <div className="relative flex w-full flex-row items-end justify-between gap-4 pb-8 md:gap-8 md:pb-0">
          <HeroTypingRole />

          <HeroScrollCue />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent z-20" />
    </section>
  );
};

export default Hero;

import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants/site";

const Hero: React.FC = () => {
  const [first, ...rest] = SITE_NAME.split(" ");

  return (
    <section
      id="home"
      className="relative flex min-h-dvh w-full flex-col justify-end bg-background"
    >
      <div
        id="home-hero-foreground"
        className="mx-auto w-full max-w-7xl px-6 pb-16 pt-24 md:pb-20"
      >
        <h1 className="max-w-none font-serif text-7xl font-semibold leading-[1] tracking-tight text-foreground sm:text-8xl md:text-9xl">
          <span className="block">{first}</span>
          <span className="block">{rest.join(" ")}</span>
        </h1>
        <div className="mt-10 flex items-baseline justify-between gap-6 border-t border-border pt-4 text-sm text-muted-foreground md:mt-14 md:text-base">
          <p className="font-mono text-xs md:text-sm">{SITE_TAGLINE}</p>
          <p className="font-mono text-xs md:text-sm">Jakarta, Indonesia</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;

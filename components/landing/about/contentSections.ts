export interface ContentSection {
    title: string;
    body: string;
    id: string;
}

export interface AboutContent {
    intro: string;
    experience: string;
    personal: string;
    outro: string;
}

export const defaultAboutContent: AboutContent = {
    intro: `Hey, I'm Dennis. I like taking ideas apart, figuring out how they tick, and putting them back together in a way that feels a little smarter. I studied Business Mathematics, but these days my curiosity leans more toward data, AI, and building systems that make life flow a bit smoother. I like when logic meets intuition, when something just clicks and works better than it has any right to.`,
    experience: `I've built and shipped ML apps, orchestrated chatbots, and pieced together tools that turn chaos into clarity. I'm drawn to projects that live in the messy space between idea and execution, where a rough sketch becomes something people actually use. I care less about chasing hype and more about quiet, useful progress: automations that save time, systems that scale well, and ideas that grow legs on their own.`,
    personal: `Outside of work, I'm usually buried in ML papers I only half understand (for now), sketching side projects that may or may not see daylight, or running laps in a sim rig like there's a trophy at stake. I love comics, science books, and strange ideas that don't fit anywhere yet. For me, building isn't just about utility, it's about curiosity, rhythm, and play.`,
    outro: `If you're into AI, design, or building things that make people pause and go "oh, that's clever," let's talk. I'm always down to share ideas, trade experiments, or spin up something new, half for the fun of it, half to see what it might become.`,
};

export function createContentSections(content: AboutContent): ContentSection[] {
    return [
        { title: "The Logic", body: content.intro, id: "intro" },
        { title: "The Builder", body: content.experience, id: "exp" },
        { title: "The Curiosity", body: content.personal, id: "pers" },
        { title: "The Connection", body: content.outro, id: "outro" }
    ];
}

// Default export for backwards compatibility
export const contentSections = createContentSections(defaultAboutContent);

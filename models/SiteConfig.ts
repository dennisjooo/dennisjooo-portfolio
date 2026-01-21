import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteConfig extends Document {
  profileImageUrl: string;
  // About section content
  aboutIntro: string;
  aboutExperience: string;
  aboutPersonal: string;
  aboutOutro: string;
}

const defaultAboutContent = {
  intro: `Hey, I'm Dennis. I like taking ideas apart, figuring out how they tick, and putting them back together in a way that feels a little smarter. I studied Business Mathematics, but these days my curiosity leans more toward data, AI, and building systems that make life flow a bit smoother. I like when logic meets intuition, when something just clicks and works better than it has any right to.`,
  experience: `I've built and shipped ML apps, orchestrated chatbots, and pieced together tools that turn chaos into clarity. I'm drawn to projects that live in the messy space between idea and execution, where a rough sketch becomes something people actually use. I care less about chasing hype and more about quiet, useful progress: automations that save time, systems that scale well, and ideas that grow legs on their own.`,
  personal: `Outside of work, I'm usually buried in ML papers I only half understand (for now), sketching side projects that may or may not see daylight, or running laps in a sim rig like there's a trophy at stake. I love comics, science books, and strange ideas that don't fit anywhere yet. For me, building isn't just about utility, it's about curiosity, rhythm, and play.`,
  outro: `If you're into AI, design, or building things that make people pause and go "oh, that's clever," let's talk. I'm always down to share ideas, trade experiments, or spin up something new, half for the fun of it, half to see what it might become.`,
};

const SiteConfigSchema: Schema = new Schema(
  {
    profileImageUrl: { type: String, default: '/images/profile.webp' },
    aboutIntro: { type: String, default: defaultAboutContent.intro },
    aboutExperience: { type: String, default: defaultAboutContent.experience },
    aboutPersonal: { type: String, default: defaultAboutContent.personal },
    aboutOutro: { type: String, default: defaultAboutContent.outro },
  },
  {
    timestamps: true,
  }
);

const SiteConfig: Model<ISiteConfig> = mongoose.models.SiteConfig || mongoose.model<ISiteConfig>('SiteConfig', SiteConfigSchema);

export default SiteConfig;

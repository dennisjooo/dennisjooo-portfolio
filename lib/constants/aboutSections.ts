export const ABOUT_SECTIONS = [
  {
    key: "intro",
    adminKey: "aboutIntro",
    title: "The Logic",
    description: "Introduction - Who you are",
    sectionId: "intro",
  },
  {
    key: "experience",
    adminKey: "aboutExperience",
    title: "The Builder",
    description: "Your work and experience",
    sectionId: "exp",
  },
  {
    key: "personal",
    adminKey: "aboutPersonal",
    title: "The Curiosity",
    description: "Personal interests and hobbies",
    sectionId: "pers",
  },
  {
    key: "outro",
    adminKey: "aboutOutro",
    title: "The Connection",
    description: "Call to action and contact",
    sectionId: "outro",
  },
] as const;

export type AboutAdminKey = (typeof ABOUT_SECTIONS)[number]["adminKey"];

export const getIconSlug = (skill: string) => {
  const map: Record<string, string> = {
    "C++": "cplusplus",
    "Scikit-learn": "scikitlearn",
    "Next.js": "nextdotjs",
    "Tailwind CSS": "tailwindcss",
    "shadcn/ui": "shadcnui",
    PostgreSQL: "postgresql",
    MongoDB: "mongodb",
    LangChain: "langchain",
    "Hugging Face": "huggingface",
    "PyTorch Lightning": "lightning",
  };
  return map[skill] || skill.toLowerCase().replace(".", "").replace(" ", "");
};

export const getIconSlug = (skill: string) => {
    const map: Record<string, string> = {
        "C++": "cplusplus",
        "HTML5": "html5",
        "Scikit-learn": "scikitlearn",
        "Next.js": "nextdotjs",
        "TailwindCSS": "tailwindcss",
        "ShadcnUI": "shadcnui",
        "PostgreSQL": "postgresql",
        "MongoDB": "mongodb",
        "GitHub": "github",
        "OpenAI": "openai",
        "LangChain": "langchain",
        "HuggingFace": "huggingface",
    };
    return map[skill] || skill.toLowerCase().replace('.', '').replace(' ', '');
};

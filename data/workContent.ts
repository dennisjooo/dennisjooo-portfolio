import type { TimelineItemData } from '@/components/landing/work-experience/WorkExperience';

export const workExperienceData: TimelineItemData[] = [
    {
        id: "sinarmas-staff",
        date: "February 2024 - Now",
        title: "AI/ML Engineer",
        company: "Sinar Mas Land",
        imageSrc: "/images/work/sinarmas.svg",
        responsibilities: [
            "Spearheaded optimization of OCR pipelines and developed self-service AI platform, achieving high-accuracy document processing for 2,000+ daily requests.",
            "Architected and deployed an AI-powered document summarization system for sales letters using Generative AI and OCR, significantly reducing review time.",
            "Developed and seamlessly integrated automated OCR services for invoices and tax documents, achieving high-accuracy document processing at a significant scale.",
            "Experimented with and implemented cutting-edge AI models for document processing, including OCR, LLMs, and RAG, to enhance the company's data extraction and analysis capabilities.", 
            "Engineered a robust enterprise agentic chatbot utilizing LangChain and OpenAI, effectively streamlining internal communications across diverse departments. It uses RAG and ReAct to provide accurate and up-to-date information to employees.",
        ],
    },
    {
        id: "sinarmas-intern",
        date: "November 2023 - January 2024",
        title: "AI/ML Developer Intern",
        company: "Sinar Mas Land",
        imageSrc: "/images/work/sinarmas.svg",
        responsibilities: [
            "Actively contributed to the maintenance and advancement of the company's proprietary machine learning pipelines, with a primary focus on OCR systems for document information detection and extraction.",
            "Collaborated in the creation of novel OCR pipelines specifically designed for Vehicle Registration Number (VRN) detection and extraction.",
        ],
    },
    {
        id: "vidio-intern",
        date: "August - December 2022",
        title: "Business Intelligence Intern",
        company: "Vidio.com",
        imageSrc: "/images/work/vidio.svg",
        responsibilities: [
            "Played a key role in generating actionable insights and fostering a deeper understanding of platform user behaviors and product analytics through SQL and advanced visualization tools.",
            "Conducted in-depth research on user funneling progression, customer retention strategies, and cancellation patterns.",
        ],
    },
    {
        id: "prasmul-marketing-intern",
        date: "January - February 2020",
        title: "Marketing Research Intern",
        company: "Universitas Prasetiya Mulya",
        imageSrc: "/images/work/prasmul.svg",
        responsibilities: [
            "Assisted in identifying and evaluating potential strategic partners for the successful launch of Universitas Prasetiya Mulya's Master's program in Business Analytics.",
            "Performed comprehensive competitor research to pinpoint opportunities for enhancing and optimizing marketing initiatives.",
        ],
    },
    {
        id: "prasmul-bachelor-math",
        date: "August 2019 - August 2023",
        title: "Bachelor of Mathematics",
        company: "Universitas Prasetiya Mulya",
        imageSrc: "/images/work/prasmul.svg",
        responsibilities: [
            "Graduated with a distinguished GPA of 3.88.",
            "Authored a thesis on \"Predictive Modelling of Changes in GOTO Stock Prices using Historical and Exogenous Data with LSTM and SARIMAX\".",
            "Honored as a beneficiary of the prestigious Young Scholar Indonesia Scholarship.",
        ],
    },
];

import { Mail, Github, Linkedin } from "lucide-react";
import type { ReactNode } from "react";

export interface ContactLink {
    href: string;
    ariaLabel: string;
    icon: ReactNode;
}

export const contactLinks: ContactLink[] = [
    { href: "mailto:dennisjonathan78@gmail.com", ariaLabel: "Email", icon: <Mail className="size-6" /> },
    { href: "https://github.com/dennisjooo", ariaLabel: "GitHub", icon: <Github className="size-6" /> },
    { href: "https://www.linkedin.com/in/dennisjooo/", ariaLabel: "LinkedIn", icon: <Linkedin className="size-6" /> },
];
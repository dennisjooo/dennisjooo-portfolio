import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "react-photo-view/dist/react-photo-view.css";

export const metadata: Metadata = {
    title: "Blog & Certifications | Dennis' Portfolio",
};

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
} 
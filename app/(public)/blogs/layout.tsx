import type { Metadata } from "next";

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
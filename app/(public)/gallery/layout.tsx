import type { Metadata } from "next";
import "react-photo-view/dist/react-photo-view.css";

export const metadata: Metadata = {
  title: "Gallery | Dennis' Portfolio",
  description: "Photography and visual work by Dennis Jonathan.",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

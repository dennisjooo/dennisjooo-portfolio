"use client";

import { useEffect } from "react";

/**
 * Console Easter Egg - Shows ASCII art and a message when developers open the console
 */
export function useConsoleEasterEgg() {
    useEffect(() => {
        // Only run in browser
        if (typeof window === "undefined") return;

        const asciiArt = `
%c██████╗ ███████╗███╗   ██╗███╗   ██╗██╗███████╗
██╔══██╗██╔════╝████╗  ██║████╗  ██║██║██╔════╝
██║  ██║█████╗  ██╔██╗ ██║██╔██╗ ██║██║███████╗
██║  ██║██╔══╝  ██║╚██╗██║██║╚██╗██║██║╚════██║
██████╔╝███████╗██║ ╚████║██║ ╚████║██║███████║
╚═════╝ ╚══════╝╚═╝  ╚═══╝╚═╝  ╚═══╝╚═╝╚══════╝
`;

        const welcomeMessage = `
%c╭─────────────────────────────────────────────────────╮
│  Hey there, curious developer!                      │
│                                                     │
│  You found the secret console!                      │
│                                                     │
│  Since you're here, let me share a few things:      │
│  → This site is built with Next.js + TypeScript     │
│  → Try pressing Ctrl+K for a surprise               │
│  → The source code is on GitHub (it's open!)        │
│                                                     │
│  Questions? Let's connect!                          │
│  github.com/dennisjooo                              │
╰─────────────────────────────────────────────────────╯
`;

        const coffeeTip = `
%c   ( (
    ) )
  ........
  |      |]
  \\      /
   \`----'  

%cTip: This site runs best with coffee ☕
`;

        // Log ASCII art with gradient-like styling
        console.log(
            asciiArt,
            "background: linear-gradient(90deg, #7c3aed, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 10px; font-weight: bold; font-family: monospace;"
        );

        // Log welcome message
        console.log(
            welcomeMessage,
            "color: #a855f7; font-size: 12px; font-family: monospace; line-height: 1.5;"
        );

        // Log coffee art
        console.log(
            coffeeTip,
            "color: #c4b5a0; font-size: 10px; font-family: monospace;",
            "color: #888; font-style: italic; font-size: 11px;"
        );
    }, []);
}

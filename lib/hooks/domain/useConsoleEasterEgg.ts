"use client";

import { useEffect } from "react";

export function useConsoleEasterEgg() {
  useEffect(() => {
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

    console.log(
      asciiArt,
      "background: linear-gradient(90deg, #888888, #666666); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 10px; font-weight: bold; font-family: monospace;",
    );

    console.log(
      welcomeMessage,
      "color: #888888; font-size: 12px; font-family: monospace; line-height: 1.5;",
    );

    console.log(
      coffeeTip,
      "color: #c4b5a0; font-size: 10px; font-family: monospace;",
      "color: #888; font-style: italic; font-size: 11px;",
    );

    const version = process.env.NEXT_PUBLIC_BUILD_VERSION;
    if (version) {
      console.log(
        `%cv${version}`,
        "color: #555; font-size: 10px; font-family: monospace; font-style: italic;",
      );
    }
  }, []);
}

import { getFoundSecretCount, getTotalSecretCount } from "./unlock";

const ASCII_ART = `
%c██████╗ ███████╗███╗   ██╗███╗   ██╗██╗███████╗
██╔══██╗██╔════╝████╗  ██║████╗  ██║██║██╔════╝
██║  ██║█████╗  ██╔██╗ ██║██╔██╗ ██║██║███████╗
██║  ██║██╔══╝  ██║╚██╗██║██║╚██╗██║██║╚════██║
██████╔╝███████╗██║ ╚████║██║ ╚████║██║███████║
╚═════╝ ╚══════╝╚═╝  ╚═══╝╚═╝  ╚═══╝╚═╝╚══════╝
`;

const WELCOME_MESSAGE = `
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

const COFFEE_TIP = `
%c   ( (
    ) )
  ........
  |      |]
  \\      /
   \`----'  

%cTip: This site runs best with coffee ☕
`;

const ROTATING_HINTS = [
  "Try Ctrl+K → type 'sudo'",
  "Try Ctrl+K → type '404'",
  "Try Ctrl+K → type 'coffee'",
  "Shift+click the footer copyright. Trust me.",
];

const MONO_STYLE =
  "color: #888888; font-size: 12px; font-family: monospace; line-height: 1.5;";
const ASCII_STYLE =
  "background: linear-gradient(90deg, #888888, #666666); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 10px; font-weight: bold; font-family: monospace;";
const HINT_STYLE =
  "color: #777; font-size: 11px; font-family: monospace; font-style: italic;";

function pickRotatingHint(): string {
  const version = process.env.NEXT_PUBLIC_BUILD_VERSION;
  const pool = version
    ? [...ROTATING_HINTS, `Build: v${version}`]
    : ROTATING_HINTS;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

export function logConsoleEasterEggs(): void {
  console.log(ASCII_ART, ASCII_STYLE);
  console.log(WELCOME_MESSAGE, MONO_STYLE);
  console.log(
    COFFEE_TIP,
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

  console.log(`%c${pickRotatingHint()}`, HINT_STYLE);

  const found = getFoundSecretCount();
  if (found > 0) {
    console.log(
      `%cYou've found ${found}/${getTotalSecretCount()} secrets. Keep digging.`,
      HINT_STYLE,
    );
  }
}

# Design: Dennis Jonathan Portfolio

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System

- Genre: editorial
- Shape of the first page: Peel stack (sticky hero, content slides over)
- Theme: brand (vibe: "cool ink on paper")
- Axes: light/roman-serif/neutral · posture: restrained

## Tokens

`app/styles/tokens.css` is the source of truth. Tailwind utilities keep the existing names (`bg-background`, `text-foreground`). Hallmark roles map onto them:

```css
:root {
  --color-paper: oklch(98.2% 0 0);
  --color-paper-2: oklch(94.5% 0 0);
  --color-paper-3: oklch(90% 0 0);
  --color-ink: oklch(0% 0 0);
  --color-ink-2: oklch(32% 0 0);
  --color-muted: oklch(45% 0 0);
  --color-rule: oklch(86% 0 0);
  --color-accent: oklch(32% 0 0);
  --color-accent-ink: oklch(100% 0 0);
  --color-focus: oklch(40% 0 0);
  --font-display: var(--font-geist-serif), ui-serif, Georgia, serif;
  --font-body: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-outlier: var(--font-geist-mono), ui-monospace, monospace;
  --radius-card: 2px;
  --radius-pill: 2px;
  --rule-hair: 1px;
  --shadow-card: none;
}
```

The spacing scale, the type scale, the easings and the durations live in `tokens.css`.

## Controls

- Primary: ink fill, paper type · 2px radius · 40px (app) / 48px (public)
- Secondary: 1px rule · same radius and height

## Motion

- Character: still on the first screen; peel and About pin stay as scroll stories; under reduced motion everything ends at once.

## Exports

`app/styles/tokens.css` in this project. Hallmark roles alias the HSL `--background` / `--foreground` sheet Tailwind already uses.

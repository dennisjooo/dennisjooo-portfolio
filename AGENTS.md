# Design System & Project Guidelines

This document is the source of truth for design direction, technical patterns, and durable agent memory for the Dennis Jonathan Portfolio.

## 1. Core Aesthetic: "The Hipster Designer"

The site embodies a high-end, editorial, and slightly "brutalist" design language. It moves away from standard "SaaS" layouts into something more tactile and poster-like.

- **Keywords:** Editorial, Kinetic, Tactile, Bold, Contrast.
- **Vibe:** "Available for Work, Based in The Internet" (Modern, Digital-Native but textured).
- **Texture:** Subtle noise overlays (`bg-noise`) are used globally to prevent the site from feeling too "flat" or sterile.
- **Direction:** Greyscale aesthetic targeting godly.website-level polish.

## 2. Typography Strategy

The typography relies on extreme contrast between Serif and Sans-Serif, and size variation.

### Primary Pairing

- **Name / Headlines:** *Libre Caslon Text* (Italic, via `font-caslon`) vs **Urbanist** (Bold/Black, Weight: 700+).
  - *Usage:* The hero name lockup uses Caslon italic with mix-blend modes over the gradient background.
  - *Scale:* Hero name uses `vw` units (`18vw` mobile, `8–9vw` desktop) for impact. Reserve `vw` typography for the hero only; all other display headings use rem-based scale (`text-4xl`–`text-6xl`).
- **Body / UI:** *Urbanist* (clean, geometric sans-serif).
- **Metadata / Tech:** *Roboto Mono* (technical, code-like).
  - *Usage:* Copyright dates, locations, section titles, "Scroll to Explore" indicators.

### Styling Rules

- **Mix Blend Modes:** Use `mix-blend-overlay` or `mix-blend-screen` on large hero typography to allow backgrounds (gradients/iridescence) to interact with the text.
- **Display text utility:** Use `text-display` for emphasized headings (maps to `text-foreground`).
- **Alignment:** Mix centered elements with extreme corner anchors (Bottom-Left for descriptions, Top-Right for metadata) to create a "Poster" composition.

## 3. Layout & Motion Patterns

### SectionShell

All landing sections (except About's scroll container) use `SectionShell` from `components/shared/layout/SectionShell.tsx`:

- **Default spacing:** `py-24 md:py-32`
- **Compact spacing:** `py-24` (Skills, Contact)
- **Inner container:** `container mx-auto px-6 max-w-7xl`
- **Full bleed:** Skills marquee rows break out via `fullBleed` + `SectionShellHeader`

About keeps its GSAP pin/scrub outer wrapper but uses the same inner container classes via `sectionInnerClasses`.

### The "Peel" Effect

The site uses a vertical stacking context to create depth.

1. **Sticky Hero:** The Hero section is `position: sticky; top: 0; z-index: 0;`.
2. **Content Stack:** The main content container is `relative; z-index: 10;` with `bg-background`.
3. **The Reveal:** As users scroll, the content slides *over* the Hero (like a card deck).
4. **Parallax:** The Hero undergoes a subtle GSAP transformation (Scale Down + Blur) as it is covered.

### Smooth Scrolling

- **Engine:** `Lenis` is used for momentum-based smooth scrolling.
- **Integration:** GSAP `ScrollTrigger` is synced with Lenis to ensure animation frames match the scroll position perfectly.

### Animation Policy

- **CSS keyframes:** Hero LCP animations only (`animate-fade-in`, `animate-letter-reveal`) — run before JS hydration.
- **Framer Motion:** Section entrances, card hovers, and micro-interactions. Shared variants live in `components/motion/variants.ts`.
- **GSAP:** Scroll-driven effects only (hero peel, About pin/scrub). Scroll distances are tunable via `lib/constants/aboutScroll.ts`.
- **Page transitions:** Smooth transitions; avoid wipe-up plus fade combinations.

## 4. Component Guidelines

### Navbar

- **Floating Pill:** The navbar is a floating glass-morphism pill.
- **Spacing:** Ensure `HeroContent` has significant top padding (`pt-36` mobile, `pt-32` desktop) or margins (`mt-28`) to prevent visual collision with the navbar.

### Section Headers

- **About:** Static header (`animated={false}`) — GSAP controls the section.
- **All other landing sections:** Animated header (default `animated={true}`).
- **Pattern:** Caslon italic number (left) + mono uppercase title (right) + gradient accent underline.

### Mobile Considerations

- **Alignment:** Text alignments often switch from `text-right` (desktop) to `text-left` (mobile) to accommodate reading patterns and prevent layout jitter during animations (e.g., typing effects).
- **Scale:** Hero typography scale is aggressive on mobile (`18vw`) to ensure the design intention remains clear on small screens.

### Scroll Components

- `ScrollToTop` — Resets scroll on Next.js route change
- `BackToTop` — Floating button shown after scrolling 300px

## 5. Technical Stack

- **Framework:** Next.js 16 (App Router)
- **Package / folder:** npm name `profile-page`, workspace folder `portfolio`
- **Styling:** Tailwind CSS with semantic tokens (`bg-background`, `text-foreground`, etc.)
- **Motion:** GSAP + Framer Motion + Lenis
- **Fonts:** `next/font/google` (Urbanist, Roboto Mono, Libre Caslon Text)
- **Auth / data:** Clerk, Neon Postgres, Drizzle ORM, Vercel Blob for media
- **Blob paths:** `blog/{slug}/`
- **Build pipeline:** `bump-version.mjs` → `generate-site-files` → `next build`; date-based versioning
- **Hygiene:** `npm run check` runs lint, format:check, and knip
- **Analytics:** Vercel Analytics and Speed Insights gated on `VERCEL=1`

## 6. Domain Vocabulary

The same content entity uses different names by layer. Use this table when naming files, routes, or UI copy:

| Layer | Term | Notes |
|-------|------|-------|
| Database / API | `blogs` | Table name and REST endpoints |
| Type field | `type: "project" \| "blog"` | Discriminator on each row |
| Public URL | `/blogs`, `/blogs/[slug]` | Route path |
| Nav section id | `"projects"` | Homepage anchor for featured work |
| Component prefix | `Project*` | Historical naming (`ProjectContent`, `ProjectPageClient`) |
| Admin UI label | "Blogs & Projects" | Display copy only |

**Rule:** DB entity is always `blogs`. Display label varies by `type` field. Do not rename the table or URL without a migration plan.

## 7. Content & Data Layers

| Directory | Purpose |
|-----------|---------|
| `lib/content/` | Static marketing fallbacks (hero, nav, skills, about defaults, contact links) |
| `lib/constants/` | Infra config (cache, site URL, blog status, scroll tuning, icons) |
| `lib/data/` | Server-only DB fetchers with caching (`blogs.ts`, `site.ts`) |

## 8. Icon Libraries

- `@heroicons/react` — Admin UI
- `lucide-react` — Command palette, theme toggle, shared components
- `react-icons` — Contact dock (via `lib/constants/contactIcons.ts`)

## 9. Admin & Code Organization

- Admin CMS uses factory patterns for list/edit pages; shared column builders in `components/admin/columns/`
- Motion variants and spring configs live in `components/motion/`
- Landing uses shared `SectionShell` layout primitive

## Learned User Preferences

- Plan multi-step work before implementing; execute full plans without editing attached plan files
- Split substantial changes into smaller, logical commits when asked
- Extend existing UI patterns rather than wholesale redesigns; revert or iterate when a design direction is rejected
- Deslop branches: remove AI comments, defensive code, and style drift
- Run `npm run check` as ongoing hygiene before commits
- Unified SSR flashing loader for initial page load, not a separate 0→100% client progress bar
- Only create git commits when explicitly asked
- Keep code diffs minimal and focused; do not add unrelated changes

## Learned Workspace Facts

- This file (`AGENTS.md`) is the single design and agent-memory reference for the project

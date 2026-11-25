# Design System & Project Guidelines

This document is the source of truth for design direction, technical patterns, and durable agent memory for the Dennis Jonathan Portfolio.

## 1. Core Aesthetic: Cool ink on paper

The site is austere editorial greyscale: type and hairlines on paper, not posters, glass, or shaders. Locked in [`design.md`](design.md) and [`app/styles/tokens.css`](app/styles/tokens.css).

- **Keywords:** Editorial, austere, greyscale, hairline, restrained.
- **Vibe:** Cool ink on paper.
- **Texture:** None. No noise overlays, grain, mix-blend, glow, or glass.
- **Direction:** Geist on near-white paper; light-mode ink is true black (`#000`). Admin shares the same tokens at higher density.

## 2. Typography Strategy

Contrast comes from size and face, not decoration.

### Primary Pairing

- **Name / Headlines:** _Geist Serif_ (upright, via `font-serif`; it ships no italic, so never add `italic` to it).
  - _Usage:_ Hero name lockup and section titles. Solid `text-foreground`, no mix-blend.
  - _Scale:_ Rem / clamp (`--text-display`, `text-4xl`–`text-6xl`). Never `vw` type.
- **Body / UI / labels:** _Geist Sans_ (via `font-sans`). Labels are sentence case, untracked, one step smaller than body.
- **Code / figures:** _Geist Mono_ (via `font-mono`). Section numbers, dates, place lines, kbd, skill names, and other figures. Not body copy or section titles.

### Styling Rules

- **Display text utility:** Use `text-display` for emphasized headings (maps to `text-foreground`).
- **Alignment:** Edge-aligned type. Hero is settled: the name, then one sentence. No typing, marquee, or scroll cue.

## 3. Layout & Motion Patterns

### SectionShell

All landing sections (except About's scroll container) use `SectionShell` from `components/shared/layout/SectionShell.tsx`:

- **Default spacing:** `py-24 md:py-32`
- **Compact spacing:** `py-24` (Skills, Contact). Contact is a centered lockup with an icon row.
- **Inner container:** `container mx-auto px-6 max-w-7xl`
- **Full bleed:** Avoid. Skills is a typed list inside the container.

About keeps its GSAP pin/scrub outer wrapper but uses the same inner container classes via `sectionInnerClasses`. Slides come from `site_config.about_sections` JSON (title + body, 1–6 items), edited at `/admin/about`.

### The "Peel" Effect

The site uses a vertical stacking context to create depth.

1. **Sticky Hero:** The Hero section is `position: sticky; top: 0; z-index: 0;`.
2. **Content Stack:** The main content container is `relative; z-index: 10;` with `bg-background`.
3. **The Reveal:** As users scroll, the content slides _over_ the Hero (like a card deck).
4. **Parallax:** The Hero undergoes a subtle GSAP transformation (Scale Down + Blur) as it is covered.

### Smooth Scrolling

- **Engine:** `Lenis` is used for momentum-based smooth scrolling.
- **Integration:** GSAP `ScrollTrigger` is synced with Lenis to ensure animation frames match the scroll position perfectly.

### Animation Policy

- **CSS keyframes:** Optional LCP fades (`animate-fade-in`). The hero itself stays still.
- **Framer Motion:** Section entrances, card hovers, and micro-interactions. Shared variants live in `components/motion/variants.ts`.
- **GSAP:** Scroll-driven effects only (hero peel, About pin/scrub). About scroll distance scales with CMS section count via `lib/constants/aboutScroll.ts`.
- **Page transitions:** Smooth transitions; avoid wipe-up plus fade combinations.

## 4. Component Guidelines

### Navbar

- **Floating paper bar:** Centered compact bar (`top-4`), DJ mark, command trigger, theme toggle. No glass, no noise, no section-link row (palette + mobile menu cover that).
- **States:** Transparent on the hero; hairline + paper fill after scroll. DJ disc fills with ink when the bar is filled.

### Section Headers

- **About:** Static header (`animated={false}`) — GSAP controls the section.
- **All other landing sections:** Animated header (default `animated={true}`).
- **Pattern:** Geist Serif title, sentence case. Quiet section number in mono. Hairline rule, not a gradient underline.

### Footer

- Centered, compact, sentence-case sans. Hairline on top. Keep the shift-click copyright easter egg.

### Mobile Considerations

- **Alignment:** Prefer left-aligned type on small screens.
- **Scale:** Hero type stays on the rem/clamp scale; do not reintroduce `vw`.

### Scroll Components

- `ScrollToTop` — Resets scroll on Next.js route change
- `BackToTop` — Floating button shown after scrolling 300px

## 5. Technical Stack

- **Framework:** Next.js 16 (App Router)
- **Package / folder:** npm name `profile-page`, workspace folder `portfolio`
- **Styling:** Tailwind CSS with semantic tokens (`bg-background`, `text-foreground`, etc.)
- **Motion:** GSAP + Framer Motion + Lenis
- **Fonts:** the `geist` package via `app/fonts.ts` (Geist Sans, Geist Mono, Geist Serif; Serif is not on Google Fonts). Tailwind maps `font-sans` / `font-mono` / `font-serif` to `--font-geist-sans` / `--font-geist-mono` / `--font-geist-serif`. The favicon, apple icon and OG images use Geist Serif too, from a TTF copy in `lib/og/fonts/` loaded by `lib/og/serifFont.ts` (next/og cannot read woff2)
- **Auth / data:** Clerk, Neon Postgres, Drizzle ORM, Vercel Blob for media
- **Blob paths:** `blog/{slug}/`
- **Build pipeline:** `bump-version.mjs` → `generate-site-files` → `next build`; date-based versioning
- **Hygiene:** `npm run check` runs lint, format:check, and knip
- **Analytics:** Vercel Analytics and Speed Insights gated on `VERCEL=1`

## 6. Domain Vocabulary

The same content entity uses different names by layer. Use this table when naming files, routes, or UI copy:

| Layer            | Term                        | Notes                                                         |
| ---------------- | --------------------------- | ------------------------------------------------------------- |
| Database / API   | `blogs`                     | Table name and REST endpoints                                 |
| Type field       | `type: "project" \| "blog"` | Discriminator on each row                                     |
| Public URL       | `/blogs`, `/blogs/[slug]`   | Route path                                                    |
| Nav section id   | `"projects"`                | Homepage anchor for featured work                             |
| Component prefix | `Article*`                  | Public article chrome (`ArticleContent`, `ArticlePageClient`) |
| Admin UI label   | "Blogs & Projects"          | Display copy only                                             |

**Rule:** DB entity is always `blogs`. Display label varies by `type` field. Do not rename the table or URL without a migration plan.

## 7. Content & Data Layers

| Directory        | Purpose                                                                       |
| ---------------- | ----------------------------------------------------------------------------- |
| `lib/content/`   | Static marketing fallbacks (hero, nav, skills, about defaults, contact links) |
| `lib/constants/` | Infra config (cache, site URL, blog status, scroll tuning, icons)             |
| `lib/data/`      | Server-only DB fetchers with caching (`blogs.ts`, `site.ts`)                  |

## 8. Icon Libraries

- `@heroicons/react` — Admin UI
- `lucide-react` — Command palette, theme toggle, shared components
- `react-icons` — Contact links (via `lib/constants/contactIcons.ts`)

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
- Easter eggs should be subtle and discoverable (console hints, command palette, hidden copy)—not flashy overlays or Konami effects
- Toast editorial labels use Geist Sans semibold sentence case, not mono or tracked caps; body uses sans or Geist Serif for playful; top-right placement with clear label/body hierarchy
- Command palette should keep stable height while typing/filtering; overlay may blur, panels stay solid paper
- Use `:focus-visible` on controls; do not leave a persistent ring after mouse click (`:focus` without `:focus-visible`)

## Learned Workspace Facts

- `design.md` is the locked visual system; this file (`AGENTS.md`) holds agent memory and technical patterns
- Site toasts use `SiteToaster` + `siteToast` (`components/shared/feedback/SiteToaster.tsx`, `lib/ui/siteToast.ts`); greyscale paper, no Sonner `richColors`
- Easter egg secrets live in `lib/easter-eggs/` registry with `localStorage` unlock tracking
- Sonner `theme` must sync with next-themes `resolvedTheme`; avoid `::before`/`::after` on toast shells (use inset box-shadow, `expand={false}`)
- SSR loader critical CSS in `app/ssrLoaderAssets.ts` must use `var(--font-geist-serif)` so the mark matches the hero's Geist Serif
- About landing slides are CMS JSON on `site_config.about_sections` (not four named columns); public fallback is Hello / Craft / Play in `lib/content/aboutContent.ts`
- Prettier uses `prettier-plugin-tailwindcss` and `prettier-plugin-packagejson` (see `.prettierrc`)

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

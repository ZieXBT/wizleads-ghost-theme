# Folio — Editorial Ghost Theme Design Spec

An original editorial/magazine Ghost 5.x theme. Writing-first, image-confident, typography-forward. Built with modern CSS (view transitions, container queries, scroll-driven animations, `light-dark()`, subgrid, fluid clamps) and a strict performance budget.

---

## 1. Theme Identity

- **Name:** Folio
- **Category:** Editorial magazine / longform publication
- **Personality:** Confident, literary, quiet. Reads like an object, not a feed.
- **Target reader:** Someone who wants to sit and read, not graze.

## 2. Type System

**Families (system-safe stack, can be swapped for self-hosted variable WOFF2 later):**

- `--font-serif` → `"Source Serif 4", "Iowan Old Style", "Palatino", Georgia, serif`
- `--font-sans` → `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`
- `--font-mono` → `"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace`

**Role assignment:**

- Serif → post titles, article body, pull-quotes, author names in large displays
- Sans → UI, nav, metadata, buttons, cards, forms
- Mono → kickers (small-caps labels), dates, read-time, code

**Fluid type scale (clamp-based, no breakpoint jumps):**

| Token | Size | Use |
|---|---|---|
| `--fs-xs` | `clamp(0.75rem, 0.72rem + 0.15vw, 0.8125rem)` | meta, kickers |
| `--fs-sm` | `clamp(0.875rem, 0.84rem + 0.18vw, 0.9375rem)` | small ui |
| `--fs-base` | `clamp(1rem, 0.96rem + 0.2vw, 1.125rem)` | body (sans) |
| `--fs-md` | `clamp(1.125rem, 1.06rem + 0.3vw, 1.25rem)` | card title |
| `--fs-lg` | `clamp(1.375rem, 1.25rem + 0.6vw, 1.625rem)` | small hero |
| `--fs-xl` | `clamp(1.75rem, 1.5rem + 1.2vw, 2.25rem)` | H2 |
| `--fs-2xl` | `clamp(2.25rem, 1.8rem + 2.2vw, 3.25rem)` | featured card title |
| `--fs-3xl` | `clamp(2.75rem, 2rem + 3.6vw, 4.5rem)` | article H1 |
| `--fs-4xl` | `clamp(3.5rem, 2.2rem + 6vw, 6rem)` | homepage hero |

**Measure:** `--measure: 68ch;` for article body.
**Leading:** body `1.65`, headings `1.15`, UI `1.35`.
**Weights:** serif 400, 600, 700; sans 400, 500, 600. No thin, no black.

## 3. Color System

Warm-paper light mode, desaturated near-black dark mode. Single accent used with discipline.

```css
:root {
  color-scheme: light dark;

  --ink:        light-dark(oklch(18% 0.01 80),  oklch(96% 0.005 80));
  --ink-muted:  light-dark(oklch(42% 0.01 80),  oklch(72% 0.008 80));
  --ink-soft:   light-dark(oklch(60% 0.008 80), oklch(55% 0.006 80));
  --paper:      light-dark(oklch(98.5% 0.008 80), oklch(15% 0.008 80));
  --paper-alt:  light-dark(oklch(96% 0.01 80),    oklch(19% 0.008 80));
  --rule:       light-dark(oklch(88% 0.006 80),   oklch(28% 0.008 80));

  --accent:     light-dark(oklch(52% 0.18 28),    oklch(72% 0.19 28));
  --accent-ink: light-dark(oklch(98% 0 0),        oklch(12% 0 0));

  /* Derived via color-mix */
  --accent-soft: color-mix(in oklch, var(--accent) 12%, var(--paper));
  --ink-10:      color-mix(in oklch, var(--ink) 10%, var(--paper));
  --ink-20:      color-mix(in oklch, var(--ink) 20%, var(--paper));
}
```

Accent is a warm terracotta — original choice. Used on: links (underline), active nav, subscribe button, kicker accent rule, paywall CTA. Never on large flat backgrounds.

## 4. Spacing & Rhythm

Single scale, geometric-ish progression. All spacing snaps to this:

```css
--s-0:  0.25rem;
--s-1:  0.5rem;
--s-2:  0.75rem;
--s-3:  1rem;
--s-4:  1.5rem;
--s-5:  2rem;
--s-6:  3rem;
--s-7:  4rem;
--s-8:  6rem;
--s-9:  8rem;
```

**Vertical rhythm:** paragraph bottom margin = `--s-4`. H2 top = `--s-7`, H2 bottom = `--s-3`. H3 top = `--s-5`, H3 bottom = `--s-2`. Block elements (figures, quotes, cards) top/bottom = `--s-5`.

**Container widths:**
- `--w-text:   min(100% - 2rem, 68ch)` — article measure
- `--w-wide:   min(100% - 2rem, 80rem)` — page container
- `--w-narrow: min(100% - 2rem, 42rem)` — forms, CTAs
- `--w-full:   100%` — hero bleed

## 5. Grid & Layout Primitives

- **Site grid:** full-width header/footer, centered max-width `--w-wide` for content.
- **Homepage grid:** CSS grid with `grid-template-columns: repeat(12, 1fr)`, subgrid on cards.
- **Article grid:** single centered column (`--w-text`), figures can bleed to `--w-wide` with a `data-width="wide"` attribute.
- **Card alignment:** subgrid ensures headlines, deks, and meta rows line up across a row.

**Breakpoints (design-time, not used in CSS — containers drive layout):**
- Touch: ≤ 640px
- Small: 641–960px
- Desktop: 961px+

Most layouts are `grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr))` — no media queries needed.

## 6. Page Layouts

### Homepage (`index.hbs`)
1. **Top shelf** (optional, toggleable via `@custom.show_top_shelf`) — one-line announcement, closeable.
2. **Header** — centered wordmark + horizontal nav + utility cluster (search `⌘K`, theme toggle, subscribe button).
3. **Hero featured post** — first post in feed, full-bleed within `--w-wide`, large serif title, kicker tag, dek (excerpt), author+date meta, hero image on the right (60/40 split ≥961px; stacked on touch). View transition target.
4. **Section divider** — thin rule with a small-caps label "Latest" on the left.
5. **Main feed grid** — 3-column desktop, 2-col small, 1-col touch. Cards use:
   - kicker (primary tag, small caps + mono)
   - large serif headline (2 lines max with `line-clamp`)
   - dek (3 lines max)
   - author + date
   - image on top with 16:10 ratio, lazy, rounded-none
6. **Inline newsletter CTA** — placed after the 6th card, warm background block, single-field email form, privacy note.
7. **Tag rail** (optional) — horizontal list of top tags as kicker chips linking to archives.
8. **Continue feed** — grid continues.
9. **Pagination** — "Older posts" / "Newer posts" text links, no numbered pager.
10. **Footer** — 4 columns: about blurb, sections (nav), social, legal. Big wordmark top-right.

### Single Post (`post.hbs`)
1. **Header** (shared, compact variant with `data-variant="compact"`).
2. **Article shell** — centered `--w-text`, two margin rails on desktop (wide screens only) for:
   - Left rail: sticky TOC (auto-generated from H2/H3)
   - Right rail: share buttons (copy, X, LinkedIn) + reading progress
3. **Kicker** — primary tag, small caps + mono, with a short color rule.
4. **Title** — serif, `--fs-3xl`, max 3 lines, generous leading.
5. **Dek** — excerpt, serif italic, `--fs-lg`, `--ink-muted`.
6. **Meta row** — avatar + "by Name", `·`, date, `·`, read time. All sans small-caps.
7. **Hero image** — constrained to `--w-text` by default, can bleed wide or full. Rounded none. Figcaption italic sans.
8. **Body content** — Ghost's `{{content}}`. Koenig cards styled (callout, bookmark, button, gallery, toggle, audio, video, file, product, header card, signup, paywall).
9. **Dropcap** — on first paragraph, toggleable per post via `@custom.dropcap` default on.
10. **End block** — horizontal rule + author bio card (avatar, name linking to author page, 2-line bio, external link).
11. **Paywall block** — for members-only posts, shows teaser → fade-to-paper gradient → subscribe CTA.
12. **Related posts** — 3 cards under the article, by primary tag with recency fallback.
13. **Inline newsletter CTA** — final prompt before comments.
14. **Comments** — Ghost native comments container, conditionally rendered if enabled on site.
15. **Footer** (shared).

### Page (`page.hbs`)
Simpler variant of post.hbs — no kicker, no meta row, no related, no paywall, no comments. Same typography, same hero treatment. Used for About, Subscribe, Policies.

### Tag archive (`tag.hbs`)
1. Header.
2. **Tag masthead** — large kicker "Section" label, big serif tag name, description, post count. Accent color rule.
3. **Grid** — same card grid as homepage, sans the hero.
4. Pagination.
5. Footer.

### Author page (`author.hbs`)
1. Header.
2. **Author masthead** — circular avatar (rounded-full), name (serif), bio, location, links (website, Twitter). Post count.
3. **Grid** — author's posts only.
4. Pagination.
5. Footer.

### Error (`error.hbs`)
Centered layout. Large serif "404 — Not here.", short dek, back-to-home button, search prompt.

### AMP (`amp.hbs`)
Skipping. Ghost supports non-AMP in 2026 — AMP is deprecated by Google. Set `"amp": false` in `package.json` config.

## 7. Components (detailed)

### Header
- Height: `4rem` default, `3.25rem` on post pages (`[data-variant="compact"]`).
- Layout: `grid-template-columns: 1fr auto 1fr; align-items: center;`
- Left: nav (primary, max 5 items)
- Center: wordmark (text-only, serif `--fs-lg`, 600 weight, accent underline on hover)
- Right: utility cluster — search button (`⌘K` glyph hint), theme toggle (sun/moon SVG), subscribe button (accent filled, small)
- Sticky on scroll with a subtle shadow after `scroll-y > 0`. Uses `position: sticky; top: 0; backdrop-filter: blur(8px)`.
- Mobile: wordmark center, hamburger left, subscribe right. Search + theme toggle move inside the drawer.

### Post card (`partials/post-card.hbs`)
Variants via `class="post-card post-card--{{variant}}"`:
- `default`: image top, kicker, headline (2 lines), dek (3 lines), meta
- `hero`: horizontal on desktop (image right), headline `--fs-2xl`, dek visible
- `compact`: no image, kicker + headline + meta only
- `index`: single row — date • headline • author

### Kicker
- Small-caps (`font-variant-caps: all-small-caps; letter-spacing: 0.08em;`)
- Mono for date/read-time parts, sans for tag name
- Color rule: `::before` pseudo — 1.5rem horizontal line in `--accent`
- Size: `--fs-xs`

### Search modal (`partials/search-modal.hbs`)
- `<dialog>` element, native ESC-close, focus trap via `inert`
- Trigger: header button or `⌘K` / `/` keyboard
- Body: full-width input, live results as you type (via Ghost Content API + minisearch)
- Result items: kicker, title, dek, with arrow-key nav and enter to open
- Empty state: recent posts suggestions

### Theme toggle
- Sun/moon icon button
- States: system (default), light, dark (3-state cycle)
- Persists to `localStorage` under `folio:theme`
- Respects `prefers-color-scheme` when in system mode
- Attribute on `<html data-theme="...">`; CSS uses `light-dark()` with `color-scheme`

### Reading progress bar
- Thin (`2px`) fixed bar at top of article pages only
- Driven by CSS scroll-driven animations (no JS)
- Color: `--accent`
- Respects `prefers-reduced-motion`

```css
@supports (animation-timeline: scroll()) {
  .reading-progress {
    animation: progress linear;
    animation-timeline: scroll(root);
  }
  @keyframes progress { from { width: 0 } to { width: 100% } }
}
```

### Table of contents (`partials/toc.hbs`)
- Auto-generated client-side from the article's `h2, h3` elements
- Desktop: sticky left rail (`position: sticky; top: 5rem`), `max-width: 12rem`
- Mobile: collapsed `<details>` block at the top of the article
- Active section highlighted via `IntersectionObserver`

### Newsletter CTA (`partials/subscribe.hbs`)
- Variants: `inline` (in-article), `hero` (home), `footer`
- Form: single email field + submit, Ghost member signup via Portal (`#/portal/signup`)
- Copy: kicker ("Newsletter"), headline, dek, privacy microcopy under form
- Success state handled by Portal

### Paywall block
- Rendered conditionally via `{{#unless @member}}` in post.hbs
- Teaser: first ~300 words visible, then `linear-gradient(transparent, var(--paper))` fade
- CTA block: kicker, headline ("Continue reading"), sign-in link, subscribe button
- Tier pricing pulled from `{{@site.tiers}}` if present

### Post cards grid (`partials/feed.hbs`)
- CSS subgrid for alignment
- `@container` query based on grid width (not viewport)

## 8. Koenig Card Styling

All Koenig cards styled to match editorial aesthetic:
- `.kg-callout-card` — warm background, accent left rule, icon space
- `.kg-bookmark-card` — horizontal card with image, title, dek, URL, publisher — matches post card look
- `.kg-button-card` — accent-filled button, sans, small caps
- `.kg-gallery-card` — grid using CSS subgrid, lightbox via `<dialog>`
- `.kg-toggle-card` — `<details>` styled, chevron rotates on open
- `.kg-header-card` — full-bleed section break with background image + overlay text
- `.kg-audio-card` / `.kg-video-card` — rounded-none, `aspect-ratio` reserved
- `.kg-file-card` — horizontal with filename, size, download icon
- `.kg-product-card` — bordered, image+text+button
- `.kg-signup-card` — inherits the newsletter CTA styles
- `.kg-email-cta-card` — inherits button styles
- `.kg-nft-card` — minimal wrapper (low priority)

Image alignment classes: `.kg-width-wide`, `.kg-width-full`, default (inline with text column).

## 9. Motion & Transitions

- **View Transitions API** — `@view-transition { navigation: auto }` for cross-document transitions. Hero image of the active card becomes the hero of the article via `view-transition-name: post-{{id}}` on both source and destination.
- **Scroll-driven animations** — reading progress bar, hero image subtle parallax on large screens (disabled on reduced motion).
- **Hover transitions** — `150ms ease-out` on links, cards, buttons. Card image `transform: scale(1.02)` on hover.
- **Card entrance** — subtle fade + 8px translate-up on first scroll, only above-fold cards get it to avoid INP hit.
- **Reduced motion** — all animations disabled via `@media (prefers-reduced-motion: reduce)`.

## 10. Custom Theme Settings (package.json `config.custom`)

```json
{
  "custom": {
    "navigation_layout": {
      "type": "select",
      "options": ["Left aligned", "Center aligned"],
      "default": "Center aligned"
    },
    "show_top_shelf": {
      "type": "boolean",
      "default": false
    },
    "top_shelf_text": {
      "type": "text",
      "default": "New: Subscribe for weekly essays"
    },
    "top_shelf_url": {
      "type": "text",
      "default": "#/portal/signup"
    },
    "feed_layout": {
      "type": "select",
      "options": ["Hero + grid", "Grid only", "Index list"],
      "default": "Hero + grid"
    },
    "post_dropcap": {
      "type": "boolean",
      "default": true
    },
    "show_reading_progress": {
      "type": "boolean",
      "default": true
    },
    "show_toc": {
      "type": "boolean",
      "default": true
    },
    "show_related": {
      "type": "boolean",
      "default": true
    },
    "footer_tagline": {
      "type": "text",
      "default": "An independent publication."
    }
  }
}
```

## 11. Routes & Collections (`routes.yaml`)

```yaml
routes:
  /about/:
    template: page
    data: page.about

collections:
  /:
    permalink: /{slug}/
    template: index
    filter: tag:-hash-

taxonomies:
  tag: /tag/{slug}/
  author: /author/{slug}/
```

Simple default collection + tag/author archives. No custom channels at launch.

## 12. Performance Budgets

Per SEO spec:
- HTML ≤ 50KB
- Critical CSS (inline) ≤ 14KB
- CSS total ≤ 100KB
- JS total ≤ 30KB
- Fonts total ≤ 100KB (system stack by default = 0KB)
- LCP ≤ 2.0s, INP ≤ 200ms, CLS ≤ 0.05
- Lighthouse: ≥ 95 performance, 100 a11y, 100 SEO, 100 best practices

## 13. Accessibility Baseline

- Single `<h1>` per page (post title or page name)
- Skip link to `#main`
- All interactive elements are `<button>` or `<a>`
- Focus rings visible, keyboard nav works throughout
- Color contrast: ≥ 4.5:1 body, ≥ 3:1 large text (both themes verified)
- All images have meaningful alt (fallback to title)
- Reduced-motion media query respected
- `aria-current="page"` on active nav
- Search modal traps focus, ESC closes, returns focus to trigger
- Theme toggle announces state change via `aria-live`

## 14. SEO Implementation

Per SEO spec — direct integration:
- All schema additions (BreadcrumbList, SearchAction, Organization, Person, FAQPage-ready) via JSON-LD blocks after `{{ghost_head}}`
- Preload hero + key fonts
- Response image `srcset` on all `{{img_url}}`
- `robots.txt` with AI crawler opt-in
- `llms.txt` template shipped in theme root
- `theme-color` meta (light + dark variants)
- Manifest file

## 15. File Manifest

```
folio/
├── package.json
├── routes.yaml
├── default.hbs
├── index.hbs
├── post.hbs
├── page.hbs
├── tag.hbs
├── author.hbs
├── error.hbs
├── robots.txt
├── llms.txt
├── assets/
│   ├── css/
│   │   ├── screen.css      (main compiled output)
│   │   └── src/
│   │       ├── tokens.css
│   │       ├── reset.css
│   │       ├── typography.css
│   │       ├── layout.css
│   │       ├── components.css
│   │       ├── koenig.css
│   │       ├── pages.css
│   │       └── motion.css
│   ├── js/
│   │   └── theme.js
│   ├── icons/
│   │   ├── logo.svg
│   │   ├── search.svg
│   │   ├── moon.svg
│   │   └── sun.svg
│   └── images/
│       └── placeholder.svg
├── partials/
│   ├── header.hbs
│   ├── footer.hbs
│   ├── post-card.hbs
│   ├── feed.hbs
│   ├── kicker.hbs
│   ├── meta.hbs
│   ├── search-modal.hbs
│   ├── toc.hbs
│   ├── subscribe.hbs
│   ├── author-card.hbs
│   ├── paywall.hbs
│   ├── related.hbs
│   ├── schema-article.hbs
│   ├── schema-breadcrumbs.hbs
│   ├── schema-organization.hbs
│   ├── schema-person.hbs
│   └── schema-website.hbs
└── locales/
    └── en.json
```

## 16. Build Process

No bundler at launch — ship raw CSS/JS. Optional optimization later:
- PostCSS via a simple script: nesting, autoprefixer, minify
- CSS source files concatenated into `screen.css`
- Single `theme.js` file (no modules at runtime, bundled manually if needed)

Dev loop: symlink theme into Ghost local install → Ghost hot-reloads on file change.

## 17. Out of Scope (v1)

- AMP (deprecated)
- Multi-language per-instance (single-locale at launch)
- Third-party comment systems
- Podcast episode template (can be added via Koenig audio)
- E-commerce integration beyond product card

# Root Labs — Project Context

## Overview
Root Labs is an AI-powered website redesign agency site. It is a single-page React app deployed on GitHub Pages at `https://electroworks-store.github.io/Root-Labs/`.

**Stack:** React 18 · Vite 6 · Tailwind CSS v4 · GSAP 3 · Lucide React  
**Deploy:** `npm run deploy` → gh-pages → `dist/`  
**Dev server:** `npm run dev` → http://localhost:3000  

---

## File Structure

```
/
├── src/
│   ├── App.jsx               ← All page components + router (monolithic)
│   ├── main.jsx              ← React entry point
│   ├── gsap-config.js        ← GSAP + plugins setup (ScrollTrigger, Observer, TextPlugin, MotionPathPlugin)
│   ├── tailwind.css          ← Tailwind v4 entry + @source directives
│   └── components/
│       ├── Hero2Section.jsx  ← Primary hero (sakura/petals, physics engine, ROOTS lettering)
│       ├── HeroWipe.jsx      ← Wipe-transition hero variant
│       ├── WhyUs.jsx         ← Sticky scroll cards (3-card sequence, 400vh zone)
│       ├── WhatYouGet.jsx    ← Floating image gallery with hover text reveal
│       ├── WebsitesProcess.jsx ← 3-step design process showcase (Websites page)
│       ├── HorizontalProcess.jsx ← Horizontal scroll process steps
│       ├── FlipCardStack.jsx ← Flip card deck animation
│       ├── Masonry.jsx       ← Masonry image grid
│       ├── Carousel3D.jsx    ← 3D rotating carousel
│       └── AIAgentsPage.jsx  ← AI Agents service page
│   └── showcase/
│       ├── Gardener.jsx      ← Mock gardener client website
│       ├── Restaurant.jsx    ← Mock restaurant client website
│       └── TechStore.jsx     ← Mock tech store client website
├── styles.css                ← Global CSS variables, glass styles, nav, pricing cards
├── index.html                ← HTML shell + nav-data / hero-data JSON injection
├── vite.config.js            ← base: "./" for GH Pages
└── public/
    ├── CNAME
    ├── fonts/
    ├── img/
    └── socialmedia/
```

---

## Routing
Hash-based client-side router inside `App.jsx` → `Router` component:

| Path | Component |
|---|---|
| `/` | `HomePage` |
| `/websites` | `WebsitesPage` |
| `/social` | `SocialPage` |
| `/showcase/gardener` | `GardenerWebsite` |
| `/showcase/techstore` | `TechStore` |
| `/showcase/restaurant` | `Restaurant` |

Navigation uses `window.location.hash = path` (supports both `file://` and `http://`). Section anchors like `#about` are handled separately via `scrollIntoView`.

---

## Design Tokens (CSS Variables in `styles.css`)

```css
--bg:           #F7F6F4   /* warm off-white background */
--text:         #222121   /* near-black body text */
--muted:        #6B6563   /* grey secondary text */
--primary:      #8A3DE6   /* vibrant purple — main brand colour */
--primary-600:  #6E2EC3   /* darker purple for borders / accents */
```

Utility class `.glass-premium` — frosted glass card style used for nav bubbles and cards.

---

## Typography
- **Global body:** system-ui / `-apple-system` stack (set in `styles.css`)
- **Hero (`Hero2Section`):** `"Helvetica Now", "Helvetica Neue", Helvetica, Arial, sans-serif` — applied to `.h2-hero`, `.h2-eyebrow`, `.h2-roots`, `.h2-module-tag`, `.h2-lede`
- **WhyUs cards:** `'Inter', system-ui, sans-serif`
- **Old Hero (`Hero` in App.jsx):** `'Helvetica Neue', Helvetica, Arial, sans-serif` for the h1; `'Geist', sans-serif` for the subtitle

---

## Key Components

### `Hero2Section.jsx`
- Warm paper-grain background (`#f5f0e8`)
- Sakura branch illustration (`.h2-tree`) — positioned top-right, CSS fade-in
- Giant staggered letter-by-letter `ROOTS` heading (`.h2-roots`)
- Physics petal engine via `window.Matter` (Matter.js loaded externally); falls back gracefully if not present
- Bottom footer row with module tag + lede copy
- All styles scoped under `.h2-` prefix injected via `<style>` tag

### `WhyUs.jsx`
- 3 sticky scroll cards, each occupying 100vh of a 400vh scroll zone
- Cards slide in from the right (`translateX`) and stack/scale down as progress advances
- Comparison bar ("26× faster") fades in after all cards land
- Mobile / `prefers-reduced-motion` fallback: simple vertical stack

### `WebsitesProcess.jsx`
- 3-step process: Vibe Picker → Colour Bubbles → Font Carousel
- Intersection Observer scroll-triggered fade-ins
- Parallax on colour bubbles (disabled with `prefers-reduced-motion`)

### Showcase Pages (`src/showcase/`)
Self-contained mock client websites embedded inside the main app. Used to demonstrate design output.

---

## GSAP Setup (`src/gsap-config.js`)
Registers: `ScrollTrigger`, `Observer`, `TextPlugin`, `MotionPathPlugin`.  
Import as: `import gsap from '../gsap-config'` or `import { gsap, ScrollTrigger } from '../gsap-config'`.

---

## Data Injection Pattern
`index.html` passes content to components via hidden `<div>` elements with `data-*` attributes:

```html
<div id="nav-data" data-brand="Root Labs" data-items='["Home","Websites","Social","Contact"]' hidden></div>
<div id="hero-data" data-title1="We build your" data-title2="digital roots." ... hidden></div>
```

Components read these with `document.getElementById('nav-data')?.dataset.*`.

---

## Conventions & Gotchas
- `App.jsx` is intentionally monolithic — most page-level components live inside it.
- Component-scoped CSS is injected as a `<style>` tag string (e.g. `HERO2_STYLES`) to avoid class collisions.
- Tailwind v4 is used for utility classes; custom design system logic uses plain CSS variables.
- `vite.config.js` uses `base: "./"` for GH Pages relative asset paths — don't change this.
- The `Hero` component in `App.jsx` (old hero) is separate from `Hero2Section` (the primary hero). Only `Hero2Section` is used on the live homepage.
- Matter.js (physics engine for petals) is loaded externally — not in `package.json`.

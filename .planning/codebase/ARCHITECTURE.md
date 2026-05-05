<!-- refreshed: 2026-05-05 -->
# Architecture

**Analysis Date:** 2026-05-05

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    React SPA Layer                           │
│                    `src/App.jsx`                             │
├──────────────────┬──────────────────┬───────────────────────┤
│   Hero Sections  │   Process/Flow    │    Showcase Pages     │
│  `Hero2Section`  │ `WebsitesProcess` │   `Gardener`          │
│  `HeroWipe`      │ `HorizontalProcess`│  `TechStore`         │
│  `WhyUs`         │ `WhatYouGet`      │   `Restaurant`        │
│  `FlipCardStack` │ `Carousel3D`      │                       │
│  `Masonry`       │                   │                       │
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Animation & Interaction Layer                   │
│         `src/gsap-config.js`, `src/hooks/`                 │
│  GSAP plugins, ScrollTrigger, SplitText, custom hooks       │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              Scroll & Smoothing Layer                        │
│         `SmoothScroll.jsx` (Lenis integration)              │
│  Unified scroll event for GSAP ScrollTrigger & animations   │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              DOM & Styling                                   │
│   Tailwind CSS + component-scoped CSS                       │
│   `styles.css`, component `.css` files                      │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| App | Main page layout, route management, lead form submission | `src/App.jsx` |
| Hero2Section | Premium hero with sakura imagery and typography | `src/components/Hero2Section.jsx` |
| HeroWipe | Animated hero section with wipe transition | `src/components/HeroWipe.jsx` |
| WhyUs | Three-column card layout with stacked animation | `src/components/WhyUs.jsx` |
| WebsitesProcess | Step-by-step process flow with timeline | `src/components/WebsitesProcess.jsx` |
| HorizontalProcess | Horizontal scroll-driven process visualization | `src/components/HorizontalProcess.jsx` |
| WhatYouGet | Deliverables showcase with animated reveals | `src/components/WhatYouGet.jsx` |
| Masonry | Responsive image grid with lazy loading | `src/components/Masonry.jsx` |
| FlipCardStack | Card stack with auto-flip and click interaction | `src/components/FlipCardStack.jsx` |
| Carousel3D | 3D carousel component (minimal usage) | `src/components/Carousel3D.jsx` |
| SmoothScroll | Global Lenis smooth scroll setup | `src/components/SmoothScroll.jsx` |
| AIAgentsPage | Dedicated AI agents informational page | `src/components/AIAgentsPage.jsx` |
| GardenerWebsite | Showcase: gardening business example | `src/showcase/Gardener.jsx` |
| TechStore | Showcase: tech store example | `src/showcase/TechStore.jsx` |
| Restaurant | Showcase: restaurant example | `src/showcase/Restaurant.jsx` |

## Pattern Overview

**Overall:** Component-driven animation-first SPA with scroll-triggered parallax, GSAP-based animations, and Tailwind styling.

**Key Characteristics:**
- Animation-heavy: Every major section has parallax, stagger, or scroll-trigger effects
- Scroll-synchronized: Lenis smooth scroll feeds ScrollTrigger for pixel-perfect timing
- Showcase-driven: Client portfolio displayed through self-contained showcase components
- Form-based: Lead capture at page bottom with fallback email formatting
- Mobile-responsive: Adaptive Tailwind classes, mobile menu in nav

## Layers

**UI/Components Layer:**
- Purpose: Present content, handle user interaction (clicks, form input)
- Location: `src/components/`, `src/showcase/`
- Contains: React components (JSX), scoped CSS, Tailwind classes
- Depends on: gsap-config, custom hooks, Lenis library
- Used by: App.jsx to build the page

**Animation Layer:**
- Purpose: Provide reusable animation primitives and GSAP integration
- Location: `src/gsap-config.js`, `src/hooks/useGsapAnimations.js`
- Contains: GSAP setup, plugin registration, custom hook utilities (useStaggerIn, useScrollReveal, etc.)
- Depends on: gsap library + plugins (ScrollTrigger, SplitText, TextPlugin, Observer, MotionPathPlugin)
- Used by: All animated components

**Scroll Integration Layer:**
- Purpose: Synchronize smooth scroll with animation timelines
- Location: `src/components/SmoothScroll.jsx`
- Contains: Lenis initialization, GSAP ticker sync, ScrollTrigger update loop
- Depends on: Lenis, gsap, ScrollTrigger
- Used by: Mounted once in App to provide global smooth scroll

**Styling Layer:**
- Purpose: Apply visual design (colors, typography, layout)
- Location: `styles.css`, component-scoped `.css` files, Tailwind config
- Contains: Global styles, scoped component styles (prefixed with component shorthand like `.h2-` for Hero2)
- Depends on: Tailwind CSS, custom fonts (Google Fonts + Bunny)
- Used by: All components

## Data Flow

### Primary Page Load Path

1. **Entry Point:** `src/main.jsx`
   - Mounts React app to `#root` element in `index.html`
   - Imports global styles (`styles.css`, `tailwind.css`)

2. **App Component Setup:** `src/App.jsx`
   - Reads nav data from DOM (`#nav-data` dataset)
   - Renders FloatingNav component (header with language toggle, mobile menu)
   - Renders SmoothScroll component (initializes Lenis globally)
   - Renders page sections in sequence (Hero2Section, HeroWipe, WhyUs, etc.)

3. **Section Rendering:**
   - Each section component (WhyUs, WebsitesProcess, etc.) mounts
   - useEffect hooks set up GSAP animations with ScrollTrigger
   - Animation timelines remain paused until scroll enters trigger zone

4. **Scroll Interaction:**
   - User scrolls → Lenis captures scroll event
   - Lenis fires `onScroll` event → triggers `ScrollTrigger.update()`
   - ScrollTrigger fires callbacks when scroll position matches trigger zones
   - GSAP animations play/pause/reverse based on scroll progress

5. **Form Submission:** `App.jsx` → `submitLead()`
   - Captures form data from lead form
   - Logs to console (development) or calls optional tracking API
   - Returns success response

### Showcase Page Flow

1. User navigates to `/showcase/gardener` (hash routing in App.jsx)
2. Corresponding showcase component (Gardener.jsx, etc.) mounts
3. Component manages its own scroll listeners and IntersectionObserver for fade-in
4. Images lazy-load via local scroll tracking

**State Management:**
- Local component state (useState) for UI toggles, form data, animation flags
- No global state manager (Redux, Zustand, etc.) — props and refs suffice
- localStorage for language preference

## Key Abstractions

**GSAP Animation Primitive:**
- Purpose: Encapsulate scroll-triggered or interactive animations
- Examples: `useScrollReveal()`, `useStaggerIn()`, `useTextAnimation()`, `useHoverScale()`
- Pattern: Custom React hook wrapping gsap.context() and useGSAP()

**Showcase Component:**
- Purpose: Self-contained portfolio example (Gardener, TechStore, Restaurant)
- Examples: `src/showcase/Gardener.jsx`, `src/showcase/TechStore.jsx`, `src/showcase/Restaurant.jsx`
- Pattern: Standalone React components with internal scroll listeners, form handling, and intersection observers

**Scoped Styling:**
- Purpose: Isolate component styles to avoid global collisions
- Examples: `.h2-hero`, `.h2-tree`, `.h2-text` in Hero2Section; `.flip-stack-*` in FlipCardStack
- Pattern: CSS class prefixes tied to component name or section code

## Entry Points

**Web Entry Point:**
- Location: `src/main.jsx` (mounted to `#root` in `index.html`)
- Triggers: Browser loads index.html
- Responsibilities: Bootstrap React, render App component, attach global styles

**App Component:**
- Location: `src/App.jsx`
- Triggers: main.jsx renders App
- Responsibilities: 
  - Render FloatingNav, SmoothScroll, main page sections
  - Hash-based routing for showcase pages
  - Handle lead form submission and validation

**Smooth Scroll Initialization:**
- Location: `src/components/SmoothScroll.jsx`
- Triggers: App mounts SmoothScroll
- Responsibilities:
  - Initialize Lenis with custom easing
  - Sync Lenis scroll to GSAP ticker for unified animation clock
  - Keep ScrollTrigger in sync with smooth scroll events

## Architectural Constraints

- **Threading:** Single-threaded event loop; GSAP animations driven by requestAnimationFrame via ticker
- **Global state:** No Redux or global store; language preference stored in localStorage
- **Circular imports:** No known circular dependency chains (modules imported in one direction)
- **Scroll coupling:** All scroll-driven animations depend on SmoothScroll component being mounted early; removing it breaks ScrollTrigger animations
- **Mobile considerations:** Lenis disables smoothTouch to respect native mobile scroll momentum; GSAP animations scale responsively via CSS media queries and Tailwind breakpoints

## Error Handling

**Strategy:** Graceful degradation with console logging.

**Patterns:**
- Form submission: Logs error to console if tracking API fails; returns success anyway (client-side only fallback)
- Intersection Observer: Wrapped in try/catch in showcase components
- GSAP animations: Run inside gsap.context() to prevent stale references; cleaned up on unmount
- Lenis initialization: Returns early if mounted multiple times; single instance pattern assumed

## Cross-Cutting Concerns

**Logging:** 
- Form submissions logged to console (`console.log('Lead submitted:', lead)`)
- Tracking API failures logged as warnings (`console.warn('Tracking failed:', e)`)

**Validation:**
- Form inputs checked for required fields (name, email, message)
- Service selection arrays built from form data (checkboxes collected into arrays with `[]` suffix convention)

**Authentication:**
- None; public marketing website
- No user accounts or protected routes

**Responsive Design:**
- Tailwind breakpoints (sm, md, lg, xl) used throughout
- CSS media queries in component stylesheets (`@media (max-width: 768px)` patterns)
- Hero2Section uses `clamp()` for fluid typography and spacing

---

*Architecture analysis: 2026-05-05*

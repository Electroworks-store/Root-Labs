# Codebase Structure

> Mapped: 2026-05-05

## Directory Layout

```
Root-Labs/
├── src/                        # Primary source (React app)
│   ├── App.jsx                 # Main application component (monolithic, ~1600+ lines)
│   ├── main.jsx                # React entry point
│   ├── gsap-config.js          # GSAP + ScrollTrigger shared config
│   ├── tailwind.css            # Tailwind CSS imports
│   ├── components/             # Reusable UI section components
│   │   ├── AIAgentsPage.jsx    # AI agents service page
│   │   ├── Carousel3D.jsx      # 3D carousel component
│   │   ├── FlipCardStack.jsx   # Flip card stack animation
│   │   ├── FlipCardStack.css   # Component-scoped styles
│   │   ├── Hero2Section.jsx    # Secondary hero variant
│   │   ├── HeroWipe.jsx        # Hero transition/wipe effect
│   │   ├── HorizontalProcess.jsx  # Horizontal scroll process section
│   │   ├── HorizontalProcess.css
│   │   ├── Masonry.jsx         # Masonry layout component
│   │   ├── Masonry.css
│   │   ├── SmoothScroll.jsx    # Lenis smooth scroll wrapper
│   │   ├── WebsitesProcess.jsx # Website service process steps
│   │   ├── WebsitesProcess.css
│   │   ├── WhatYouGet.jsx      # Service deliverables section
│   │   ├── WhatYouGet.css
│   │   ├── WhyUs.jsx           # "Why Root Labs" section
│   │   └── websites-process.css
│   ├── hooks/                  # Custom React hooks
│   │   ├── useGsapAnimations.js  # Shared GSAP animation hook
│   │   └── useParallax.js        # Parallax scroll hook
│   └── showcase/               # Client website demos/showcases
│       ├── Gardener.jsx        # Gardener client showcase
│       ├── Restaurant.jsx      # Restaurant client showcase
│       └── TechStore.jsx       # Tech store client showcase
├── img/                        # Source images (WebP, PNG, SVG)
│   ├── *.webp                  # Optimized product/brand images
│   ├── *.png                   # Logo variants
│   └── *.svg                   # Vector assets
├── dist/                       # Vite build output (committed for gh-pages)
│   ├── index.html
│   ├── assets/                 # Hashed JS/CSS bundles + images
│   ├── fonts/                  # GulfDisplay font files
│   ├── img/                    # Copied static images
│   ├── logos/                  # Client logo WebP files
│   └── socialmedia/            # Social media post images
├── docs/                       # Project documentation
│   ├── DEPLOY.md
│   ├── PROJECT_CONTEXT.md
│   └── tech_stack.md
├── .github/
│   ├── workflows/
│   │   └── jekyll-gh-pages.yml # GitHub Pages deployment
│   └── skills/ui-polish/       # GitHub Copilot skill
├── .planning/codebase/         # GSD codebase map
│
│ — Root-level files (mixed concerns) —
├── index.html                  # Vite HTML entry
├── vite.config.js              # Vite + Tailwind config
├── postcss.config.js           # PostCSS config
├── package.json
├── server.js                   # Node.js email server (Express + nodemailer)
├── main.js                     # Legacy/alternate entry (unused?)
├── Bakery.jsx                  # Standalone showcase (outside src/)
├── TrustStrip.jsx              # Standalone component (outside src/)
├── hero2.html                  # HTML prototype/experiment
└── .env.example                # SMTP/email config template
```

## Key Locations

| Purpose | Path |
|---------|------|
| App entry | `src/main.jsx` |
| Main component | `src/App.jsx` |
| GSAP setup | `src/gsap-config.js` |
| Smooth scroll | `src/components/SmoothScroll.jsx` |
| Animation hooks | `src/hooks/useGsapAnimations.js` |
| Showcase demos | `src/showcase/` |
| Build output | `dist/` |
| Email backend | `server.js` |
| Images | `img/` |

## Naming Conventions

- **Components**: PascalCase (`HeroWipe.jsx`, `FlipCardStack.jsx`)
- **Hooks**: camelCase with `use` prefix (`useGsapAnimations.js`, `useParallax.js`)
- **CSS modules**: component name + `.css` suffix, co-located with component
- **Images**: descriptive lowercase with hyphens (`beaker-sketch.webp`)
- **Showcase files**: Client type (`Gardener.jsx`, `Restaurant.jsx`, `TechStore.jsx`)
- **Config files**: lowercase (`vite.config.js`, `gsap-config.js`)

## File Organization Notes

- Most components are section-level (full page sections, not primitives)
- CSS is split between Tailwind utility classes and component-scoped `.css` files
- Several files exist at root level that belong in `src/` (`Bakery.jsx`, `TrustStrip.jsx`)
- `dist/` is committed to the repo for GitHub Pages deployment
- No barrel exports (`index.js` files) — imports use direct paths

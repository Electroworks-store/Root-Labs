# Technology Stack

**Analysis Date:** 2026-05-05

## Languages

**Primary:**
- JavaScript (ES6+/ESM) - Frontend components, configuration, and utilities
- JSX - React component syntax (`src/App.jsx`, `src/components/`, `src/showcase/`)

**Secondary:**
- Node.js - Backend API server (`server.js`)

## Runtime

**Environment:**
- Node.js 18.x (specified in GitHub Actions workflow `.github/workflows/jekyll-gh-pages.yml`)
- Browser (modern ES2020+)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 18.3.1 - UI framework (`src/App.jsx`, component library in `src/components/`)
- Express 4.x - Backend API server (referenced in `server.js`)

**Animation & Motion:**
- GSAP 3.15.0 - Animation library with React integration (`src/gsap-config.js`, `src/hooks/useGsapAnimations.js`)
- @gsap/react 2.1.2 - GSAP React bindings
- Motion 12.38.0 - Framer Motion alternative for animations
- Lenis 1.3.23 - Smooth scrolling library (`src/components/SmoothScroll.jsx`)

**Build & Bundling:**
- Vite 6.0.5 - Build tool and dev server (`vite.config.js`)
- @vitejs/plugin-react 4.3.4 - React plugin for Vite

**Styling:**
- Tailwind CSS 4.0.0 - Utility-first CSS framework
- @tailwindcss/vite 4.1.18 - Tailwind Vite plugin
- @tailwindcss/postcss 4.0.0 - PostCSS integration for Tailwind
- PostCSS 8.5.6 - CSS transformation (`postcss.config.js`)
- Autoprefixer 10.4.23 - Vendor prefix addition

**Testing:**
- None detected

**UI Libraries:**
- lucide-react 0.468.0 - Icon library (`src/App.jsx` imports: Check, ArrowRight, etc.)
- react-svg-shape 1.0.11 - SVG shape utilities

## Key Dependencies

**Critical:**
- react-dom 18.3.1 - React DOM rendering
- helmet 8.1.0 - Security headers for Express server (`server.js`)
- nodemailer - Email sending via SMTP (referenced in `server.js`)

**Infrastructure:**
- cors - CORS middleware (`server.js`)
- dotenv - Environment variable loading (`server.js`)
- gh-pages 6.2.0 - GitHub Pages deployment (`package.json` scripts)
- express - Web framework (`server.js`)

## Configuration

**Environment:**
- Configuration via `.env` file (example in `.env.example`)
- Critical variables:
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` - Email server configuration
  - `SMTP_USER`, `SMTP_PASS` - Email authentication
  - `FROM_EMAIL`, `TO_EMAIL` - Email addresses for contact form
  - `PORT` - Server port (default 3000)
  - `CORS_ORIGIN` - CORS origin whitelist
  - `NODE_ENV` - Environment (development/production)

**Build:**
- `vite.config.js` - Vite configuration with React and Tailwind plugins
- `postcss.config.js` - PostCSS with Tailwind and Autoprefixer

## Platform Requirements

**Development:**
- Node.js 18+
- npm 9+
- Modern browser with ES2020 support

**Production:**
- Deployed to GitHub Pages for frontend (`dist/` directory)
- Separate backend API server for email submission (Node.js/Express)
- SMTP server access required for email functionality
- Port 3000 for API server (configurable via `PORT` env var)

---

*Stack analysis: 2026-05-05*

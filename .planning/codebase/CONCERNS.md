# Concerns

> Mapped: 2026-05-05

## Summary

| Severity | Count |
|----------|-------|
| High | 3 |
| Medium | 4 |
| Low | 3 |

---

## High Severity

### H1: Monolithic `App.jsx` (~1600+ lines)

**File:** `src/App.jsx`
**Issue:** The entire application lives in a single component. All page sections, routing logic, state, animations, and form handling are co-located. This makes the file extremely hard to maintain, debug, or extend.
**Impact:** Any change risks breaking unrelated sections. Context resets during AI-assisted development lose state. Scroll trigger conflicts are hard to isolate.
**Recommendation:** Extract each page section into its own component. Route-level splitting would dramatically reduce complexity.

---

### H2: No Tests

**Issue:** Zero test coverage. No test framework configured. No CI test step.
**Impact:** Regressions are caught only through manual QA. Animation and scroll changes are especially risky to modify without tests.
**Recommendation:** Add Vitest + React Testing Library. Start with utility functions and form logic. Mock GSAP/Lenis for component tests.

---

### H3: `CORS_ORIGIN=*` in Email Server

**File:** `.env.example`, `server.js`
**Issue:** The default CORS configuration allows requests from any origin. The email server (`server.js`) is a Node/Express backend that proxies contact form submissions.
**Impact:** Any website can submit forms to this server, enabling spam or abuse.
**Recommendation:** Set `CORS_ORIGIN` to the specific production domain (`rootlabs.ai` or gh-pages URL). Validate this in `server.js` startup.

---

## Medium Severity

### M1: Stray Files at Repository Root

**Files:** `Bakery.jsx`, `TrustStrip.jsx`, `hero2.html`, `main.js`
**Issue:** Several JSX components and an HTML prototype live at the project root rather than inside `src/`. `main.js` may be a legacy entry point that is no longer used.
**Impact:** Confusing project structure. Risk of accidentally importing from wrong paths. Dead code accumulation.
**Recommendation:** Move `Bakery.jsx` and `TrustStrip.jsx` into `src/showcase/` or `src/components/`. Delete `hero2.html` and `main.js` if unused.

---

### M2: `dist/` Committed to Repo

**Directory:** `dist/`
**Issue:** The Vite build output is committed to the repository and deployed via gh-pages. This creates large diffs on every deploy and pollutes git history with binary assets.
**Impact:** Repository size grows with every build. PRs include noisy asset changes.
**Recommendation:** Use `gh-pages` branch strategy — keep `dist/` in `.gitignore` on `main`, deploy only the built output to a separate `gh-pages` branch (which is what `npm run deploy` does via the `gh-pages` package — but `dist/` should still be gitignored on `main`).

---

### M3: `eslint-disable` in `Masonry.jsx`

**File:** `src/components/Masonry.jsx` (line ~unknown)
**Issue:** Two `// eslint-disable-next-line react-hooks/exhaustive-deps` suppressions indicate missing hook dependencies.
**Impact:** Potential stale closure bugs in animation logic. Missing deps can cause animations to reference outdated values.
**Recommendation:** Audit the suppressed dependencies. If they're intentionally omitted (e.g., refs), add a comment explaining why.

---

### M4: Email Credentials Scope in `.env.example`

**File:** `.env.example`
**Issue:** `TO_EMAIL=edwardsadrianj@gmail.com` is a hardcoded personal email address committed to the repo. While this is just an example file, it exposes a personal contact.
**Impact:** Low direct risk, but indicates no separation between dev and prod config.
**Recommendation:** Use placeholder values in `.env.example` (e.g., `TO_EMAIL=team@yourcompany.com`). Document required values in `docs/DEPLOY.md`.

---

## Low Severity

### L1: No TypeScript

**Issue:** Project uses plain JavaScript/JSX with no type safety.
**Impact:** Prop contract bugs only surface at runtime. Refactoring is risky without types.
**Recommendation:** Not urgent — TypeScript migration is a significant undertaking. Consider JSDoc type annotations as a lightweight alternative for critical hooks/utilities.

---

### L2: No Error Boundary

**Issue:** No React `ErrorBoundary` component wrapping the application.
**Impact:** Any unhandled error in a component will crash the entire page with no user feedback.
**Recommendation:** Add a root-level `ErrorBoundary` with a fallback UI. Especially important given the animation-heavy components.

---

### L3: Prototype Files (`hero2.html`, `main.js`)

**Files:** `hero2.html`, `main.js`
**Issue:** Appear to be experiments or legacy files not connected to the current Vite build.
**Impact:** Dead code in repository.
**Recommendation:** Confirm they're unused, then delete.

---

## Positive Notes

- No hardcoded API keys found in source files
- `.gitignore` correctly excludes `.env` and `node_modules/`
- WebP format used consistently for images (good performance)
- Vite build configured correctly with `base: "./"` for gh-pages compatibility

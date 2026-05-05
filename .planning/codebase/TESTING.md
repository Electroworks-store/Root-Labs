# Testing

> Mapped: 2026-05-05

## Status

**No tests exist.** Zero test files found in the codebase. No test framework is configured.

## Test Framework

- **Status**: Not configured
- **Recommended**: Vitest + React Testing Library (natural fit with Vite + React 18)
- **No** Jest, Mocha, Cypress, or Playwright configured

## Current Quality Checks

| Check | Tool | Status |
|-------|------|--------|
| Unit tests | — | ❌ None |
| Integration tests | — | ❌ None |
| E2E tests | — | ❌ None |
| Linting | ESLint (implied) | Partial (eslint-disable found in `src/components/Masonry.jsx`) |
| Type checking | — | ❌ No TypeScript |
| Build check | `npm run build` | ✅ Via Vite |

## Testing Challenges

Heavy dependencies on browser APIs and animation libraries make testing difficult:

1. **GSAP + ScrollTrigger** — requires DOM and scroll position; needs mocking
2. **Lenis smooth scroll** — requires `requestAnimationFrame` and DOM events
3. **Matter.js** (if used) — physics simulation with canvas
4. **Lucide React icons** — straightforward to test
5. **`App.jsx` is monolithic** — large component is hard to unit test without splitting

## Recommended Testing Strategy (when adding tests)

### Framework Setup
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### Vitest Config (add to `vite.config.js`)
```js
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: ['./src/test-setup.js'],
}
```

### What to Test First
- Utility functions (form serialization `serializeForm()` in `App.jsx`)
- Hooks (`useGsapAnimations`, `useParallax`) with GSAP mocked
- Showcase components (self-contained, less animation-dependent)
- Contact form validation logic

### Mocking Approach
```js
vi.mock('./gsap-config', () => ({
  gsap: { to: vi.fn(), from: vi.fn(), set: vi.fn() },
  ScrollTrigger: { create: vi.fn(), refresh: vi.fn() }
}))
```

## CI

- GitHub Actions workflow exists (`.github/workflows/jekyll-gh-pages.yml`) but only handles deployment
- No test step in CI pipeline

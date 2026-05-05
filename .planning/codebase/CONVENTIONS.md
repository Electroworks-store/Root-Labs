# Coding Conventions

**Analysis Date:** 2026-05-05

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `Hero2Section.jsx`, `WhyUs.jsx`, `FlipCardStack.jsx`)
- Hooks: camelCase with `use` prefix (e.g., `useGsapAnimations.js`, `useParallax.js`)
- CSS modules: kebab-case or lowercase (e.g., `websites-process.css`, `Masonry.css`)
- Utilities/config: camelCase (e.g., `gsap-config.js`)
- Showcase items: PascalCase (e.g., `Gardener.jsx`, `TechStore.jsx`, `Restaurant.jsx`)

**Functions:**
- React components: PascalCase function declaration
- Hooks: `use` prefix followed by PascalCase (e.g., `useStaggerIn`, `useScrollReveal`, `useTextAnimation`)
- Utility functions: camelCase (e.g., `preloadImages`, `clamp`, `buildStatics`, `spawnPetal`)
- Event handlers: `on` prefix followed by event name (e.g., `onPointerMove`, `onResize`, `onVisibilityChange`)

**Variables:**
- Constants (animation values, color arrays, configuration): UPPER_SNAKE_CASE or camelCase depending on context
  - Physics constants: `const TARGET = 38; const MAX = 45;`
  - Color arrays: `const COLORS = ['#7B4FBF', '#9B6FD4', '#B088E8'];`
  - Config data: `const FONT = "'Inter', system-ui, sans-serif";`
- Regular variables: camelCase (e.g., `petalFilter`, `airFriction`, `nextSpawnAt`)
- Boolean flags: camelCase, often with `is` prefix (e.g., `isPhysical`, `isMounted`, `prefersReduced`)
- Refs: camelCase with `Ref` suffix (e.g., `heroRef`, `petalsRef`, `containerRef`, `sectionRef`)

**Types/Classes:**
- Not prominently used; project is primarily component-based
- Matter.js physics objects use lowercase (e.g., `engine`, `runner`, `body`)
- CSS class names: kebab-case with scope prefix (e.g., `.h2-hero`, `.h2-content`, `.flip-stack-card`, `.masonry-item-wrapper`)

## Code Style

**Formatting:**
- No explicit linter/formatter configured (no `.eslintrc`, `.prettierrc`, `biome.json` found)
- Indentation: 2 spaces (standard React convention, observed in all files)
- Line length: No hard limit enforced, but components stay under 300 lines where possible
- Semicolons: Used consistently at end of statements
- String quotes: Single quotes preferred in JavaScript, double quotes in JSX attributes

**Linting:**
- Not actively enforced; no ESLint or Prettier config present
- React warnings suppressed with `// eslint-disable-next-line react-hooks/exhaustive-deps` where necessary (see `Masonry.jsx:13`)
- Convention: follow existing code style in each file

## Import Organization

**Order:**
1. React imports (React, ReactDOM, hooks)
2. External libraries (gsap, lucide-react, motion, etc.)
3. Local components and utilities (relative imports with `./` or `../`)
4. CSS files (last)

**Example from `Hero2Section.jsx`:**
```javascript
import { useEffect, useRef } from 'react';
import gsap from '../gsap-config';
```

**Example from `WhyUs.jsx`:**
```javascript
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../gsap-config';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
```

**Path Aliases:**
- No path aliases configured; all imports use relative paths
- GSAP setup centralized in `src/gsap-config.js` to avoid duplication

## Error Handling

**Patterns:**
- Try/catch used in form submission (`App.jsx:73-76`)
  ```javascript
  try {
    // form submit logic
  } catch (e) {
    console.warn('Tracking failed:', e);
  }
  ```
- Form validation with early returns and `setErrorMessage()` state updates
- Graceful fallbacks: check for null/undefined before using DOM elements
  ```javascript
  if (!ref.current) return;
  if (!heroEl || !container) return;
  ```
- Window API availability checks before use (e.g., `if (typeof window.Matter === 'undefined') return () => {};`)
- Silent failure patterns: `onload = onerror = () => resolve()` in `preloadImages` utility

**Console usage:**
- `console.warn()` for non-critical issues (tracking failures)
- `console.log()` for debugging (lead submission)
- No explicit error logging to external service; errors are logged locally or swallowed

## Logging

**Framework:** Browser `console` object

**Patterns:**
- Debug output: `console.log('Lead submitted:', lead)` in form handlers
- Warnings: `console.warn('Tracking failed:', e)` for catch blocks
- Silent failures preferred for animations and optional features

## Comments

**When to Comment:**
- Physical/algorithmic complexity: detailed comments above physics engine sections (e.g., Hero2Section.jsx:247-250)
- Style scope explanation: CSS class prefixes documented (e.g., Hero2Section.jsx:4-8)
- Section dividers: `/* ─── [Section Name] ─────── */` for visual separation
- Inline comments for non-obvious logic (e.g., Flip transitions, collision filters)

**JSDoc/TSDoc:**
- Used in hook definitions with example usage in comments
- Example from `useGsapAnimations.js`:
  ```javascript
  /**
   * Example: Stagger objects into view
   * Usage: const scope = useRef(null);
   *        useStaggerIn(scope);
   *        <div ref={scope}><p className="stagger-item">Item 1</p>...</div>
   */
  export function useStaggerIn(scope, delay = 0) {
  ```
- Not strict TypeScript; documentation comments used instead of type annotations

## Function Design

**Size:**
- Range: 20-80 lines for most utility functions
- Physics-heavy functions: up to 150+ lines if necessary (e.g., `initPhysics` in Hero2Section.jsx)
- Component hooks: 30-50 lines preferred

**Parameters:**
- Hooks accept `ref` as primary parameter, optional `options` object for configuration
- Example: `useParallax(ref, opts = {})` allows numeric shorthand: `useParallax(ref, 0.03)` or full options object
- Animation components accept configuration objects with sensible defaults

**Return Values:**
- Hooks return cleanup functions (useEffect return statement)
- Utilities return results directly (images array, animation state)
- GSAP animations often return animation instances for further control
- React components return JSX

## Module Design

**Exports:**
- Components: default export of React component
- Hooks: named exports (see `useGsapAnimations.js`: multiple named exports + default export)
- Utilities: named or default exports depending on reusability
- GSAP config: re-exports for convenience (`export { gsap, ScrollTrigger }`)

**Barrel Files:**
- No explicit barrel files (`index.js`) in use; direct imports preferred
- `gsap-config.js` acts as central dependency injection for GSAP plugins

**Organization:**
- Colocation: components and their CSS sit in same directory (`Masonry.jsx` + `Masonry.css`)
- Hooks in dedicated `src/hooks/` directory
- Showcase items in `src/showcase/` directory
- Main App component monolithic in `src/App.jsx` (~2600 lines with embedded sections)

## Conventions for Animations

**GSAP Usage:**
- Always import from `src/gsap-config.js` for consistent plugin registration
- Use `useGSAP` context hook (from `@gsap/react`) for scoped animations
- ScrollTrigger animations initialize with `scrollTrigger` property
- Timeline stagger for multiple elements: `stagger: 0.15` or `stagger: (idx) => idx * 0.1`

**CSS-in-JS:**
- Injected styles in components via `document.head.appendChild(styleEl)` (see Hero2Section.jsx)
- Scoped with data attributes or class prefixes to avoid collisions
- Cleanup: styles removed in useEffect return

**Performance Patterns:**
- `will-change: transform` for animated properties
- `transform: translate3d()` for GPU acceleration
- `passive: true` event listeners where appropriate
- `requestAnimationFrame` for continuous updates instead of timers

---

*Convention analysis: 2026-05-05*

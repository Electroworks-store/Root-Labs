# Deployment Guide

This project is configured to deploy to GitHub Pages and serves from custom domain **rootlabs.studio**.

## Quick Deploy

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

## What Happens

- The `npm run build` command generates the production-ready site in the `dist/` folder
- The `npm run deploy` command pushes the `dist/` folder contents to the `gh-pages` branch
- GitHub Pages automatically serves the site from the `gh-pages` branch
- Your custom domain **rootlabs.studio** is configured to point to GitHub Pages

## Configuration Details

### Vite Base Path
- Set to `base: "./"` in `vite.config.js` for universal compatibility
- Works with custom domain (rootlabs.studio) and GitHub Pages subdirectory
- Assets use relative paths that work in any deployment context

### Asset Handling Rules

**Rule: All static assets MUST be in `public/` folder**

#### ✅ Correct Pattern
1. **Place images in**: `public/img/` (or `public/avatars/`, `public/fonts/`, etc.)
2. **Reference in JSX/TSX**: Use `import.meta.env.BASE_URL` for dynamic base path
   ```jsx
   <img src={`${import.meta.env.BASE_URL}img/teamster.png`} alt="..." />
   ```
3. **Result**: Vite copies `public/` contents to `dist/` during build
   - `public/img/logo.png` → `dist/img/logo.png`
   - Path resolves to: `./img/logo.png` (works everywhere)

#### ❌ Incorrect Patterns
- ❌ Hardcoded absolute paths: `src="/img/logo.png"` (breaks with base path changes)
- ❌ Images outside `public/`: `img/logo.png` at project root (NOT included in build)
- ❌ Missing BASE_URL: Static string paths won't adapt to deployment context

### File Naming (Case-Sensitive!)
GitHub Pages is **case-sensitive**. Ensure exact filename matches:
- ✅ `Rootlabs-logo.png` (matches file)
- ❌ `RootLabs-logo.png` (404 on production)
- ✅ `Adrian_avatar.png` (matches file)
- ❌ `adrian_avatar.png` (404 on production)

### GitHub Pages Setup

Make sure GitHub Pages is enabled:
1. Go to repo: `https://github.com/Electroworks-store/Root-Labs`
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select the `gh-pages` branch
4. Under **Custom domain**, ensure **rootlabs.studio** is configured
5. Check **Enforce HTTPS**

## ⚠️ Known Issues

### Tailwind CDN (Development Only)
- Currently using Tailwind CDN: `https://cdn.tailwindcss.com`
- **Warning**: CDN is not recommended for production
- Consider migrating to a proper Tailwind build setup for better performance

## First-Time Deploy

```bash
npm install
npm run build
npm run deploy
```

After deployment, your site will be live at:
- Custom domain: **https://rootlabs.studio**
- GitHub Pages: **https://electroworks-store.github.io/Root-Labs/** (redirects to custom domain)

Changes typically appear within 1-2 minutes.

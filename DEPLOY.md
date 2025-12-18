# Deployment Guide

This project is configured to deploy to GitHub Pages at:
**https://rootlabs0.github.io/RootLabs/**

## Deployment Steps

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

## What Happens

- The `npm run build` command generates the production-ready site in the `dist/` folder
- The `npm run deploy` command pushes the `dist/` folder contents to the `gh-pages` branch
- GitHub Pages automatically serves the site from the `gh-pages` branch

## First-Time Setup

Make sure GitHub Pages is enabled for your repository:

1. Go to your repo: `https://github.com/rootlabs0/RootLabs`
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select the `gh-pages` branch
4. Save the settings

After the first deployment, your site will be live at the URL above within a few minutes.

## Notes

- The `base` path in `vite.config.js` is set to `/RootLabs/` to match the repository name
- All asset paths will be automatically prefixed with this base path

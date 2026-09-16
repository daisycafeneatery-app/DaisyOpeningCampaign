# Daisy Cafe & Eatery — Deployment Guide

## Static hosting

Upload the contents of this directory to the hosting provider's public/static site root. There is no build command.

## GitHub Pages

- Keep `index.html` at repository root.
- Commit/push the extracted project files.
- Enable GitHub Pages for the branch/folder containing the project.
- `.nojekyll` is included.
- Configure the custom domain at GitHub Pages and the DNS provider when ready.

## Netlify / Cloudflare Pages / Vercel

- Connect the repository or upload the project directory.
- Build command: none.
- Publish directory: the project root.

## Custom domain

The project currently uses `https://www.daisycafeneatery.com` as the canonical production domain. If this changes, update `js/config.js`, canonical tags, sitemap and robots.txt before launch.

## Forms

The frontend can post JSON to the configurable `formEndpoint`. If no endpoint is configured, forms fall back to WhatsApp. For production server endpoints, add validation, sanitisation, rate limiting, spam controls and CSRF protection where applicable.

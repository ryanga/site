# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (http://localhost:5173)
npm run build     # static build to ./build
npm run preview   # preview production build
npm test          # run vitest tests once
```

To run a single test file:
```bash
npx vitest run src/lib/feeds/github.test.js
```

## Architecture

This is a **SvelteKit 5 static site** (adapter-static) deployed to GitHub Pages at galgon.com. The entire site is a single page that prerenders at build time.

### Data flow

`+page.server.js` runs at build time and calls all four feed fetchers in parallel via `Promise.allSettled`. Failed feeds degrade gracefully to empty arrays (or `null` for Vivino). The fetched data flows as `data.feeds` into `+page.svelte`.

### Feed modules (`src/lib/feeds/`)

Each feed (`github.js`, `goodreads.js`, `pinboard.js`, `vivino.js`) exports a single async fetch function. They have corresponding `.test.js` files using vitest. Goodreads and Vivino use XML parsing (`xml2js`, `cheerio`); GitHub and Pinboard use JSON APIs.

### UI pattern

`+page.svelte` renders a 2-column grid of `LinkCard` components. Clicking a card sets `activeService` state, which opens a `Drawer` bottom sheet showing that feed's data. The `Drawer` component handles all four service layouts internally via `{#if service === '...'}` branches.

### Styling

Global CSS variables in `src/app.css` define the design tokens (`--bg`, `--surface`, `--text`, `--subtext`, `--radius`, `--max-width: 480px`). Dark mode is handled via `@media (prefers-color-scheme: dark)`. Component styles are scoped with `<style>` blocks.

### Deployment

Pushing to `main` triggers the Deploy workflow, which builds and pushes to the `gh-pages` branch via `peaceiris/actions-gh-pages`. A separate `refresh.yml` workflow exists for scheduled rebuilds (to refresh feed data without a code push). `static/robots.txt` and `CNAME` (galgon.com) are committed as static assets.

### Notable config

`svelte.config.js` suppresses prerender errors for `/photo.jpg` — this file is intentionally absent from the repo and expected to be added manually to the Pages branch.

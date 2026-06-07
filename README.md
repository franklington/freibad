# Freibad Wien

A love letter to Vienna's public outdoor pools. Discover Freibäder near you, read their stories, and feel the pull of public swimming over private pools.

**→ [freibad.pages.dev](https://freibad.pages.dev)** *(once deployed)*

---

## Prerequisites

- [Node.js](https://nodejs.org/) v22 or higher
- npm v10 or higher

Check your versions:
```bash
node --version  # should be >= 22
npm --version   # should be >= 10
```

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/franklington/freibad.git
cd freibad

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [localhost:4321](http://localhost:4321).

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start local dev server at localhost:4321 |
| `npm run build` | Build static site to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run check` | Lint + format + typecheck (run before committing) |
| `npm run test` | Run unit tests |
| `npm run test:data` | Validate pool data schema |
| `npm run test:e2e` | Run Playwright end-to-end tests |

Always run `npm run check` before pushing. It catches lint errors, formatting issues, and type mistakes in one step.

## Project structure

```
src/
  components/       # Reusable Astro components (PoolCard, etc.)
  layouts/          # Page shell (Base.astro)
  pages/            # Routes: /, /pools, /pools/[id], /map
  styles/           # global.css with design tokens
  data/
    pools.json      # Master pool list
    enrichment/     # Per-pool storytelling content ({id}.json)
  types/
    pool.ts         # TypeScript interfaces + amenity labels/icons

public/
  images/pools/     # Curated images per pool ({id}/hero.jpg, metadata.json)

scripts/
  fetch-images.js   # Downloads images from Wikimedia Commons
  fetch-pools.js    # Refreshes coordinates from Vienna WFS + OSM

tests/
  data/             # Schema validation tests (no build needed)
  e2e/              # Playwright browser tests
```

## Adding a pool

Use the built-in Claude Code skill:
```
/add-pool Angelibad
```

This scaffolds the data entry, enrichment file, and image folder with the correct schema. Then run `/fetch-images angelibad` to download images.

Or do it manually — add an entry to `src/data/pools.json` following the schema in `CLAUDE.md`, create `src/data/enrichment/{id}.json`, and run `npm run test:data` to verify.

## Design system

Colors, typography, spacing, and component patterns are documented in [`design.md`](design.md). All values are CSS custom properties in `src/styles/global.css` — never hardcode colors or sizes directly in components.

## Data sources

| Source | What it provides | License |
|---|---|---|
| [data.gv.at — Schwimmbäder Standorte Wien](https://www.data.gv.at/katalog/dataset/stadt-wien_schwimmbderstandortewien) | Official Vienna pool coordinates | CC BY 4.0 |
| [OpenStreetMap](https://www.openstreetmap.org/) via Overpass API | Surrounding area pools | ODbL |
| [Wikimedia Commons](https://commons.wikimedia.org/) | Pool photos | CC BY / CC BY-SA |
| [Wien Museum](https://sammlung.wienmuseum.at/) | Historical images | CC0 / CC BY 4.0 |

Both data sources require attribution — see the site footer.

## Deployment

The site deploys automatically via [Cloudflare Pages](https://pages.cloudflare.com/):

1. Connect the GitHub repo in the Cloudflare Pages dashboard
2. Build command: `npm run build`
3. Output directory: `dist`
4. Node version: `22`

Every push to `main` triggers a deploy. No manual steps needed.

## Contributing

See `CLAUDE.md` for the full developer guide — data schema, available skills, and coding constraints.

Not affiliated with or endorsed by [Wiener Bäder](https://www.wien.gv.at/freizeit/baeder/) / Stadt Wien.

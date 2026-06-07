# Scaffold a pool story page

Creates or updates the full storytelling page for a Freibad. Usage: `/new-story {pool-id}`.

A "story" is the deep-dive portrait page at `/pools/{id}` — history, vibe, photos, tips. It combines data from `pools.json`, the enrichment JSON, and the curated images.

## Steps

1. **Check prerequisites**:
   - `src/data/pools.json` contains an entry for `{id}`
   - `src/data/enrichment/{id}.json` exists (if not, create it first via `/add-pool`)
   - `public/images/pools/{id}/hero.jpg` exists (if not, run `/fetch-images {id}` first)

2. **Check if `src/pages/pools/[id].astro` exists** (the dynamic route). If it does, you only need to enrich the data files, not touch the template. If it doesn't exist yet, create it.

3. **Enrich `src/data/enrichment/{id}.json`** — review and improve the existing content:
   - `tagline`: one punchy line, max 8 words
   - `vibe`: two to three sentences, present tense, sensory details
   - `tip`: one actionable insider tip
   - `history`: one to three sentences, include the founding year, any notable facts
   - All text in German, casual register

   Reference the tone from existing enrichment files and `design.md` for voice guidelines.

4. **Verify the page renders** by checking that all referenced data fields exist and no keys are missing between `pools.json` and `enrichment/{id}.json`.

5. Report: pool name, page URL path (`/pools/{id}`), and a summary of what content was added or improved.

## Story Page Structure (for reference when building `[id].astro`)

```
Hero image (full width, 60vh)
  ↳ Pool name overlay (--font-display, large)
  ↳ Year badge + district badge

Lead section
  ↳ Tagline (large, --color-deep)
  ↳ Vibe paragraph

History section
  ↳ Historical Wien Museum photo (if available, duotone treatment)
  ↳ History text

Gallery
  ↳ 2–4 curated images in a CSS grid

Practical info
  ↳ Season dates, address, link to official site

Tip callout
  ↳ Highlighted box in --color-sun at 10% opacity

Back to map CTA
```

# Freibad Wien — CLAUDE.md

A love-letter website celebrating Vienna's public outdoor pools (Freibäder). The site helps users discover Freibäder near them, read their stories, and feel the pull of public swimming over private pools.

## Stack

- **Framework**: Astro (static output, zero JS by default)
- **Styling**: Plain CSS with CSS custom properties — no Tailwind, no CSS-in-JS
- **Map**: Leaflet.js (loaded client-side only on the map page)
- **Hosting**: Cloudflare Pages (auto-deploy on push to `main`)
- **Data**: Static JSON files + build-time fetch from Vienna WFS API and OSM Overpass

## Project Structure

```
src/
  components/       # Reusable Astro components
  layouts/          # Page shell layouts
  pages/            # File-based routing (index, map, pools/[id])
  styles/           # global.css + design tokens
  data/
    pools.json      # Master pool list (see schema below)
    enrichment/     # Per-pool JSON with vibe, tips, history
      gaensehaeufel.json
      krapfenwaldlbad.json
      ...

public/
  images/
    pools/          # One folder per pool-id
      gaensehaeufel/
        hero.jpg
        gallery-1.jpg
        metadata.json   # License + attribution for each image

scripts/
  fetch-images.js   # Wikimedia Commons + Wien Museum image curator
  fetch-pools.js    # Pulls live data from Vienna WFS + OSM Overpass
```

## Pool Data Schema

`src/data/pools.json` is the master list. Every pool entry:

```json
{
  "id": "gaensehaeufel",
  "name": "Strandbad Gänsehäufel",
  "type": "freibad",
  "district": 22,
  "address": "Moissigasse 21, 1220 Wien",
  "coordinates": [48.2333, 16.4667],
  "since": 1907,
  "officialUrl": "https://www.wien.gv.at/freizeit/strandbad-gaensehaeufel",
  "season": { "open": "05-01", "close": "09-15" },
  "hours": {
    "weekday": "09:00–20:00",
    "weekend": "07:00–20:00",
    "note": "Bei Hitzewarnung bis 21:00 geöffnet"
  },
  "amenities": {
    "rutsche":          true,
    "kinderbecken":     true,
    "sprungturm":       true,
    "wasser_schwammerl": false,
    "sauna":            false,
    "fritten":          true,
    "strudel":          true,
    "beachvolleyball":  true,
    "sandstrand":       true,
    "fkk":              true
  },
  "tags": ["Sprungturm", "Sandstrand", "FKK", "Insel"],
  "featured": true
}
```

### Amenities reference

| Key | Label (DE) | What it means |
|---|---|---|
| `rutsche` | Rutsche | Water slide |
| `kinderbecken` | Kinderbecken | Shallow children's pool |
| `sprungturm` | Sprungturm | Diving tower |
| `wasser_schwammerl` | Wasser-Schwammerl | The classic Austrian mushroom-shaped spray feature |
| `sauna` | Sauna | On-site sauna |
| `fritten` | Fritten | French fries / snack stall |
| `strudel` | Strudel | Strudel / pastry on site |
| `beachvolleyball` | Beachvolleyball | Beach volleyball court |
| `sandstrand` | Sandstrand | Sandy beach area |
| `fkk` | FKK-Bereich | Nudist section |

Set unknown amenities to `null` (not `false`) — `false` means confirmed absent, `null` means not yet verified. This distinction matters for the UI: `null` amenities are hidden, `false` amenities can show a "not available" state if needed.

Enrichment data (`src/data/enrichment/{id}.json`):

```json
{
  "id": "gaensehaeufel",
  "tagline": "Die Insel. Europas größtes Strandbad.",
  "vibe": "Iconic, urban beach energy. People of all ages, the best Sprungturm in the city.",
  "tip": "Arrive before 9am on hot days — it fills up fast.",
  "history": "Opened in 1907 as a bathing island on the Alte Donau..."
}
```

Image metadata (`public/images/pools/{id}/metadata.json`):

```json
{
  "hero": {
    "file": "hero.jpg",
    "source": "Wikimedia Commons",
    "author": "Name",
    "license": "CC BY-SA 4.0",
    "url": "https://commons.wikimedia.org/..."
  }
}
```

## Dev Commands

```bash
npm run dev       # Local dev server at localhost:4321
npm run build     # Static build to dist/
npm run preview   # Preview the built site

node scripts/fetch-pools.js    # Refresh pool coordinates from Vienna WFS + OSM
node scripts/fetch-images.js   # Curate and download images for all pools
```

## Adding Content

Use `/add-pool` to scaffold a new pool entry correctly.
Use `/fetch-images` to curate images for a specific pool.
Use `/new-story` to scaffold an enrichment file for the storytelling section.

## Deployment

Push to `main` → Cloudflare Pages auto-deploys. No manual step needed.
The `dist/` folder is never committed — Cloudflare builds it.

## Design

See `design.md` for the full design system: colors, typography, spacing, components.
Always use CSS custom properties from `src/styles/global.css` — never hardcode values.

## Key Constraints

- All pages must work without JavaScript (Astro's default). Leaflet is the only JS exception, loaded only on `/map`.
- Every image displayed must have its license and author recorded in `metadata.json`. Do not use images without verifying their license.
- Pool data from Vienna WFS is CC BY 4.0. OSM data is ODbL. Both require attribution — the footer has a data credits section.
- Keep the bundle lean. No component libraries, no icon packs beyond a handful of inline SVGs.

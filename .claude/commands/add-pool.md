# Add a new Freibad

Add a new pool entry to the site. Provide the pool name or ID to get started.

## Steps

1. **Look up basic facts** for the pool from `src/data/pools.json` to understand the existing schema. If the pool is already listed, update it instead of adding a duplicate.

2. **Add to `src/data/pools.json`** following this exact schema:
```json
{
  "id": "slug-no-umlauts",
  "name": "Full official name",
  "type": "freibad",
  "district": 0,
  "address": "Street Nr, PLZ Wien",
  "coordinates": [lat, lng],
  "since": null,
  "officialUrl": "https://www.wien.gv.at/freizeit/...",
  "season": { "open": "MM-DD", "close": "MM-DD" },
  "tags": [],
  "featured": false
}
```
For coordinates: look up the pool on OpenStreetMap (openstreetmap.org) to get accurate lat/lng.

3. **Create an enrichment file** at `src/data/enrichment/{id}.json`:
```json
{
  "id": "{id}",
  "tagline": "One punchy line — the soul of this pool.",
  "vibe": "Two to three sentences about the atmosphere and who goes there.",
  "tip": "One insider tip for first-timers.",
  "history": "One to three sentences about when it opened and what makes it historically notable."
}
```
Write in German, casual register (*du*-form), following the tone in `design.md`.

4. **Create the image folder**: `public/images/pools/{id}/` with an empty `metadata.json`:
```json
{}
```

5. **Run `/fetch-images {id}`** to curate images for this pool.

6. Confirm the addition by listing the new entry from `pools.json`.

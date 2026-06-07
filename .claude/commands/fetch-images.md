# Fetch and curate images for a pool

Downloads and curates images for one or all pools. Usage: `/fetch-images {pool-id}` or `/fetch-images all`.

## What this does

- Queries Wikimedia Commons API for the pool's category
- Queries Wien Museum collection API for historical images
- Picks the best candidates (resolution, composition, license)
- Downloads and saves to `public/images/pools/{id}/`
- Records license + attribution in `public/images/pools/{id}/metadata.json`

## Steps

1. **Check if `scripts/fetch-images.js` exists**. If not, create it first (see template below).

2. **Run the script** for the given pool ID:
```bash
node scripts/fetch-images.js {pool-id}
# or for all pools:
node scripts/fetch-images.js all
```

3. **Verify the output**: confirm that `public/images/pools/{id}/hero.jpg` exists and `metadata.json` has correct attribution fields.

4. **Check licenses**: every image must be CC BY, CC BY-SA, CC0, or equivalent free license. If the script could not find suitable images, report which pool is missing and suggest manual sourcing from Unsplash or Pexels.

## Script template (if `scripts/fetch-images.js` doesn't exist yet)

Create `scripts/fetch-images.js` with this structure:

```js
// Curates and downloads pool images from Wikimedia Commons and Wien Museum
import { mkdir, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const WIKIMEDIA_API = 'https://commons.wikimedia.org/w/api.php'
const WIEN_MUSEUM_API = 'https://sammlung.wienmuseum.at/api/v1/objects/'

// Map pool IDs to their Wikimedia Commons category names
const WIKIMEDIA_CATEGORIES = {
  gaensehaeufel:    'Strandbad_Gänsehäufel',
  krapfenwaldlbad:  'Krapfenwaldlbad',
  kongressbad:      'Kongressbad_(Wien)',
  schoenbrunnerbad: 'Schönbrunner_Bad',
  // add more as pools are added
}

async function fetchWikimediaImages(category) {
  const params = new URLSearchParams({
    action: 'query', format: 'json', list: 'categorymembers',
    cmtitle: `Category:${category}`, cmtype: 'file', cmlimit: '10',
    origin: '*'
  })
  const res = await fetch(`${WIKIMEDIA_API}?${params}`)
  const data = await res.json()
  return data.query?.categorymembers ?? []
}

async function fetchImageInfo(fileName) {
  const params = new URLSearchParams({
    action: 'query', format: 'json', titles: fileName,
    prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: '1200',
    origin: '*'
  })
  const res = await fetch(`${WIKIMEDIA_API}?${params}`)
  const data = await res.json()
  const pages = Object.values(data.query.pages)
  return pages[0]?.imageinfo?.[0] ?? null
}

async function downloadImage(url, destPath) {
  const res = await fetch(url)
  const buffer = await res.arrayBuffer()
  await writeFile(destPath, Buffer.from(buffer))
}

async function curatePool(poolId) {
  const dir = `public/images/pools/${poolId}`
  if (!existsSync(dir)) await mkdir(dir, { recursive: true })

  const category = WIKIMEDIA_CATEGORIES[poolId]
  if (!category) {
    console.warn(`No Wikimedia category mapped for ${poolId} — skipping`)
    return
  }

  const members = await fetchWikimediaImages(category)
  const metadata = {}

  for (let i = 0; i < Math.min(members.length, 5); i++) {
    const info = await fetchImageInfo(members[i].title)
    if (!info) continue

    const ext = path.extname(info.thumburl || info.url).split('?')[0]
    const label = i === 0 ? 'hero' : `gallery-${i}`
    const dest = `${dir}/${label}${ext}`

    await downloadImage(info.thumburl || info.url, dest)

    const meta = info.extmetadata
    metadata[label] = {
      file: `${label}${ext}`,
      source: 'Wikimedia Commons',
      author: meta?.Artist?.value?.replace(/<[^>]+>/g, '') ?? 'Unknown',
      license: meta?.LicenseShortName?.value ?? 'Unknown',
      url: info.descriptionurl ?? '',
    }
    console.log(`  ✓ ${label}${ext}`)
  }

  await writeFile(`${dir}/metadata.json`, JSON.stringify(metadata, null, 2))
  console.log(`Done: ${poolId} — ${Object.keys(metadata).length} images`)
}

// Entry point
const target = process.argv[2]
if (!target) { console.error('Usage: node scripts/fetch-images.js {pool-id|all}'); process.exit(1) }

if (target === 'all') {
  for (const id of Object.keys(WIKIMEDIA_CATEGORIES)) await curatePool(id)
} else {
  await curatePool(target)
}
```

## After running

- Commit the downloaded images and metadata.json files to the repo.
- Cloudflare Pages will serve them via CDN automatically.
- Always verify attribution is correct before publishing.

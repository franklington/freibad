// Curates and downloads pool images from Wikimedia Commons
import { mkdir, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const WIKIMEDIA_API = 'https://commons.wikimedia.org/w/api.php'

// Map pool IDs to Wikimedia Commons category names
const WIKIMEDIA_CATEGORIES = {
  gaensehaeufel: 'Strandbad_Gänsehäufel',
  krapfenwaldlbad: 'Krapfenwaldlbad',
  kongressbad: 'Kongressbad_(Wien)',
  schoenbrunnerbad: 'Schönbrunner_Bad',
  angelibad: 'Strandbad_Angelibad',
  altedonau: 'Bundesbad_Alte_Donau',
  stadionbad: 'Stadionbad_Wien',
  laaerbergbad: 'Laaerbergbad',
  schafbergbad: 'Schafbergbad',
}

async function fetchCategoryMembers(category) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    list: 'categorymembers',
    cmtitle: `Category:${category}`,
    cmtype: 'file',
    cmlimit: '15',
    origin: '*',
  })
  const res = await fetch(`${WIKIMEDIA_API}?${params}`)
  const data = await res.json()
  return data.query?.categorymembers ?? []
}

async function fetchImageInfo(fileName) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    titles: fileName,
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|mime|size',
    iiurlwidth: '1200',
    origin: '*',
  })
  const res = await fetch(`${WIKIMEDIA_API}?${params}`)
  const data = await res.json()
  const pages = Object.values(data.query.pages)
  return pages[0]?.imageinfo?.[0] ?? null
}

async function downloadImage(url, destPath) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const buffer = await res.arrayBuffer()
  await writeFile(destPath, Buffer.from(buffer))
}

function isUsableLicense(shortName = '') {
  const s = shortName.toLowerCase()
  return s.includes('cc') || s.includes('public domain') || s.includes('cc0') || s === 'pd'
}

async function curatePool(poolId) {
  const dir = `public/images/pools/${poolId}`
  if (!existsSync(dir)) await mkdir(dir, { recursive: true })

  const category = WIKIMEDIA_CATEGORIES[poolId]
  if (!category) {
    console.warn(`  ⚠ No Wikimedia category for ${poolId} — skipping`)
    return
  }

  console.log(`\nFetching images for ${poolId} (Category:${category}) …`)

  const members = await fetchCategoryMembers(category)

  if (members.length === 0) {
    console.warn(`  ⚠ No files found in Category:${category}`)
    return
  }

  // Filter to JPEG/PNG only, collect info
  const candidates = []
  for (const member of members) {
    if (candidates.length >= 8) break
    const lc = member.title.toLowerCase()
    if (!lc.endsWith('.jpg') && !lc.endsWith('.jpeg') && !lc.endsWith('.png')) continue
    const info = await fetchImageInfo(member.title)
    if (!info) continue
    const license = info.extmetadata?.LicenseShortName?.value ?? ''
    if (!isUsableLicense(license)) {
      console.log(`  – skipping ${member.title} (license: ${license || 'unknown'})`)
      continue
    }
    candidates.push({ member, info, license })
  }

  if (candidates.length === 0) {
    console.warn(`  ⚠ No freely-licensed images found for ${poolId}`)
    return
  }

  // Sort by pixel area descending — prefer high-res hero
  candidates.sort((a, b) => {
    const aSize = (a.info.width ?? 0) * (a.info.height ?? 0)
    const bSize = (b.info.width ?? 0) * (b.info.height ?? 0)
    return bSize - aSize
  })

  const metadata = {}
  const slots = ['hero', 'gallery-1', 'gallery-2', 'gallery-3', 'gallery-4']

  for (let i = 0; i < Math.min(candidates.length, slots.length); i++) {
    const { info, license } = candidates[i]
    const slot = slots[i]
    const srcUrl = info.thumburl || info.url
    const ext = path.extname(new URL(srcUrl).pathname).toLowerCase() || '.jpg'
    const dest = `${dir}/${slot}${ext}`

    try {
      await downloadImage(srcUrl, dest)
      const meta = info.extmetadata ?? {}
      metadata[slot] = {
        file: `${slot}${ext}`,
        source: 'Wikimedia Commons',
        author: meta.Artist?.value?.replace(/<[^>]+>/g, '').trim() ?? 'Unknown',
        license,
        url: info.descriptionurl ?? '',
      }
      console.log(`  ✓ ${slot}${ext} — ${license}`)
    } catch (err) {
      console.warn(`  ✗ Failed to download ${slot}: ${err.message}`)
    }
  }

  if (Object.keys(metadata).length > 0) {
    await writeFile(`${dir}/metadata.json`, JSON.stringify(metadata, null, 2))
    console.log(`  → metadata.json written (${Object.keys(metadata).length} images)`)
  }
}

// Entry point
const target = process.argv[2]
if (!target) {
  console.error('Usage: node scripts/fetch-images.js {pool-id|all}')
  process.exit(1)
}

if (target === 'all') {
  for (const id of Object.keys(WIKIMEDIA_CATEGORIES)) {
    await curatePool(id)
  }
} else {
  await curatePool(target)
}

console.log('\nDone.')

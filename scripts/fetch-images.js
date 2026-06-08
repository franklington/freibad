/**
 * Curates and downloads pool images from Wikimedia Commons.
 * Usage: node scripts/fetch-images.js [pool-id|all]
 *
 * Images are saved to public/images/pools/{id}/
 * Attribution is recorded in public/images/pools/{id}/metadata.json
 */

import { mkdir, writeFile, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { createWriteStream } from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'
import { Readable } from 'stream'

const WIKIMEDIA_API = 'https://commons.wikimedia.org/w/api.php'

/** Map pool IDs to their Wikimedia Commons category names */
const WIKIMEDIA_CATEGORIES = {
  gaensehaeufel:    'Strandbad_Gänsehäufel',
  krapfenwaldlbad:  'Krapfenwaldlbad',
  kongressbad:      'Kongressbad_(Wien)',
  schoenbrunnerbad: 'Schönbrunnerbad',
  angelibad:        'Strandbad_Angelibad',
  altedonau:        'Bundesbad_Alte_Donau',
  stadionbad:       'Stadionbad_(Wien)',
  laaerbergbad:     'Laaerbergbad',
  schafbergbad:     'Schafbergbad',
}

async function fetchCategoryMembers(category) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    list: 'categorymembers',
    cmtitle: `Category:${category}`,
    cmtype: 'file',
    cmlimit: '20',
    origin: '*',
  })
  const res = await fetch(`${WIKIMEDIA_API}?${params}`)
  const data = await res.json()
  return data.query?.categorymembers ?? []
}

async function fetchImageInfo(title) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    titles: title,
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|size',
    iiurlwidth: '1400',
    origin: '*',
  })
  const res = await fetch(`${WIKIMEDIA_API}?${params}`)
  const data = await res.json()
  const pages = Object.values(data.query?.pages ?? {})
  return pages[0]?.imageinfo?.[0] ?? null
}

function isUsableImage(info) {
  if (!info) return false
  // Only allow free licenses
  const license = info.extmetadata?.LicenseShortName?.value ?? ''
  const free = ['CC0', 'CC BY', 'CC BY-SA', 'Public domain', 'FAL']
  return free.some((l) => license.startsWith(l))
}

async function downloadFile(url, destPath) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const fileStream = createWriteStream(destPath)
  await pipeline(Readable.fromWeb(res.body), fileStream)
}

async function curatePool(poolId) {
  const category = WIKIMEDIA_CATEGORIES[poolId]
  if (!category) {
    console.warn(`  ⚠  No Wikimedia category mapped for "${poolId}" — skipping`)
    return
  }

  const dir = path.resolve(`public/images/pools/${poolId}`)
  await mkdir(dir, { recursive: true })

  // Load existing metadata if any
  const metaPath = path.join(dir, 'metadata.json')
  let metadata = {}
  if (existsSync(metaPath)) {
    metadata = JSON.parse(await readFile(metaPath, 'utf-8'))
  }

  console.log(`\n  Fetching category: ${category}`)
  const members = await fetchCategoryMembers(category)
  console.log(`  Found ${members.length} files`)

  let saved = 0
  for (const member of members) {
    if (saved >= 5) break

    const info = await fetchImageInfo(member.title)
    if (!isUsableImage(info)) {
      console.log(`  ✗ Skipped (license): ${member.title}`)
      continue
    }

    const srcUrl = info.thumburl || info.url
    const ext = path.extname(new URL(srcUrl).pathname).toLowerCase()
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue

    const label = saved === 0 ? 'hero' : `gallery-${saved}`
    const filename = `${label}${ext}`
    const destPath = path.join(dir, filename)

    try {
      await downloadFile(srcUrl, destPath)
      const meta = info.extmetadata
      metadata[label] = {
        file:    filename,
        source:  'Wikimedia Commons',
        author:  meta?.Artist?.value?.replace(/<[^>]+>/g, '').trim() ?? 'Unknown',
        license: meta?.LicenseShortName?.value ?? 'Unknown',
        url:     info.descriptionurl ?? '',
      }
      console.log(`  ✓ ${filename} (${meta?.LicenseShortName?.value})`)
      saved++
    } catch (err) {
      console.error(`  ✗ Failed to download ${member.title}: ${err.message}`)
    }
  }

  await writeFile(metaPath, JSON.stringify(metadata, null, 2))

  if (saved === 0) {
    console.log(`  ⚠  No usable images found for ${poolId}`)
  } else {
    console.log(`  → ${saved} image(s) saved`)
  }
}

// Entry point
const target = process.argv[2]
if (!target) {
  console.error('Usage: node scripts/fetch-images.js <pool-id|all>')
  process.exit(1)
}

console.log('🏊 Freibad Wien — Image curator\n')

if (target === 'all') {
  for (const id of Object.keys(WIKIMEDIA_CATEGORIES)) {
    console.log(`▶ ${id}`)
    await curatePool(id)
  }
} else {
  console.log(`▶ ${target}`)
  await curatePool(target)
}

console.log('\n✓ Done. Commit public/images/ to include images in the build.')

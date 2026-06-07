import { describe, it, expect } from 'vitest'
import { readdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import poolsRaw from '../../src/data/pools.json'
import type { Pool, Amenities } from '../../src/types/pool'

const pools = poolsRaw as Pool[]
const AMENITY_KEYS: (keyof Amenities)[] = [
  'rutsche', 'kinderbecken', 'sprungturm', 'wasser_schwammerl',
  'sauna', 'fritten', 'strudel', 'beachvolleyball', 'sandstrand', 'fkk',
]
const AUSTRIA_BOUNDS = { latMin: 46, latMax: 49, lngMin: 9, lngMax: 18 }
const DATE_RE = /^\d{2}-\d{2}$/
const TIME_RE = /^\d{2}:\d{2}[–-]\d{2}:\d{2}$/

describe('pools.json', () => {
  it('has at least one entry', () => {
    expect(pools.length).toBeGreaterThan(0)
  })

  it('has no duplicate IDs', () => {
    const ids = pools.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  pools.forEach((pool) => {
    describe(`pool: ${pool.id}`, () => {
      it('has required string fields', () => {
        expect(pool.id).toBeTruthy()
        expect(pool.name).toBeTruthy()
        expect(pool.address).toBeTruthy()
        expect(pool.officialUrl).toBeTruthy()
      })

      it('has type freibad', () => {
        expect(pool.type).toBe('freibad')
      })

      it('has valid coordinates within Austria', () => {
        expect(pool.coordinates).toHaveLength(2)
        const [lat, lng] = pool.coordinates
        expect(lat).toBeGreaterThanOrEqual(AUSTRIA_BOUNDS.latMin)
        expect(lat).toBeLessThanOrEqual(AUSTRIA_BOUNDS.latMax)
        expect(lng).toBeGreaterThanOrEqual(AUSTRIA_BOUNDS.lngMin)
        expect(lng).toBeLessThanOrEqual(AUSTRIA_BOUNDS.lngMax)
      })

      it('has valid season dates (MM-DD)', () => {
        expect(pool.season.open).toMatch(DATE_RE)
        expect(pool.season.close).toMatch(DATE_RE)
      })

      it('has valid hours (HH:MM–HH:MM)', () => {
        expect(pool.hours.weekday).toMatch(TIME_RE)
        expect(pool.hours.weekend).toMatch(TIME_RE)
      })

      it('has only true | false | null amenity values', () => {
        for (const key of AMENITY_KEYS) {
          const val = pool.amenities[key]
          expect([true, false, null]).toContain(val)
        }
      })

      it('has all amenity keys present', () => {
        for (const key of AMENITY_KEYS) {
          expect(pool.amenities).toHaveProperty(key)
        }
      })
    })
  })
})

describe('enrichment files', () => {
  it('every enrichment file ID matches a pool', async () => {
    const enrichmentDir = path.resolve('src/data/enrichment')
    if (!existsSync(enrichmentDir)) return

    const files = await readdir(enrichmentDir)
    const poolIds = new Set(pools.map((p) => p.id))

    for (const file of files.filter((f) => f.endsWith('.json'))) {
      const id = file.replace('.json', '')
      expect(poolIds.has(id), `enrichment/${file} has no matching pool`).toBe(true)

      const raw = await readFile(path.join(enrichmentDir, file), 'utf-8')
      const data = JSON.parse(raw)
      expect(data.tagline).toBeTruthy()
      expect(data.vibe).toBeTruthy()
      expect(data.tip).toBeTruthy()
      expect(data.history).toBeTruthy()
    }
  })
})

describe('image metadata', () => {
  it('every image folder has metadata.json', async () => {
    const imagesDir = path.resolve('public/images/pools')
    if (!existsSync(imagesDir)) return

    const folders = await readdir(imagesDir)
    for (const folder of folders) {
      const metaPath = path.join(imagesDir, folder, 'metadata.json')
      expect(
        existsSync(metaPath),
        `public/images/pools/${folder}/metadata.json is missing`
      ).toBe(true)
    }
  })
})

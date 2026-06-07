export interface Amenities {
  rutsche: boolean | null
  kinderbecken: boolean | null
  sprungturm: boolean | null
  wasser_schwammerl: boolean | null
  sauna: boolean | null
  fritten: boolean | null
  strudel: boolean | null
  beachvolleyball: boolean | null
  sandstrand: boolean | null
  fkk: boolean | null
}

export interface Pool {
  id: string
  name: string
  type: 'freibad'
  district: number
  address: string
  coordinates: [number, number]
  since: number | null
  officialUrl: string
  season: { open: string; close: string }
  hours: { weekday: string; weekend: string; note: string | null }
  amenities: Amenities
  tags: string[]
  featured: boolean
}

export interface Enrichment {
  id: string
  tagline: string
  vibe: string
  tip: string
  history: string
}

export const AMENITY_LABELS: Record<keyof Amenities, string> = {
  rutsche: 'Rutsche',
  kinderbecken: 'Kinderbecken',
  sprungturm: 'Sprungturm',
  wasser_schwammerl: 'Wasser-Schwammerl',
  sauna: 'Sauna',
  fritten: 'Fritten',
  strudel: 'Strudel',
  beachvolleyball: 'Beachvolleyball',
  sandstrand: 'Sandstrand',
  fkk: 'FKK',
}

export const AMENITY_ICONS: Record<keyof Amenities, string> = {
  rutsche: '🛝',
  kinderbecken: '👶',
  sprungturm: '🤸',
  wasser_schwammerl: '🍄',
  sauna: '🧖',
  fritten: '🍟',
  strudel: '🥐',
  beachvolleyball: '🏐',
  sandstrand: '🏖️',
  fkk: '🌿',
}

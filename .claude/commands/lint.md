# Check code quality

Runs linting, formatting, and type checks. Always run this before committing. Usage: `/lint` or `/lint fix` to auto-fix what's fixable.

## Commands

```bash
npm run lint          # ESLint + Stylelint (report only)
npm run lint:fix      # ESLint + Stylelint (auto-fix)
npm run format        # Prettier (report only)
npm run format:fix    # Prettier (auto-fix)
npm run typecheck     # TypeScript type check (tsc --noEmit)
npm run check         # Run all of the above in sequence
```

## Tools and config

| Tool | Config file | Covers |
|---|---|---|
| ESLint | `eslint.config.js` | `.astro`, `.ts`, `.js` |
| Stylelint | `.stylelintrc.json` | `.css` files |
| Prettier | `.prettierrc` | All files |
| TypeScript | `tsconfig.json` | Type safety |

## Rules that matter for this project

### ESLint
- No unused variables or imports
- No `console.log` left in components (use it in scripts, not UI code)
- Astro component props must be typed

### Stylelint
- Only use CSS custom properties defined in `src/styles/global.css` — no hardcoded colour hex values, no hardcoded `font-family` strings
- No magic numbers for spacing — use `var(--space-*)` tokens
- Exception: `border-radius: 999px` for pill shapes is allowed

### Prettier
- Single quotes for JS/TS strings
- No semicolons
- 2-space indent
- Trailing commas in multi-line structures

### TypeScript
- Pool data loaded from JSON must be typed against the `Pool` interface in `src/types/pool.ts`
- No `any` types — use `unknown` and narrow if needed
- Astro `getStaticPaths` must return typed params

## Types to keep in sync

`src/types/pool.ts` defines the canonical `Pool` and `Amenities` interfaces. If you update the schema in `CLAUDE.md` or `src/data/pools.json`, update this file too. The data validation tests in `tests/data/validate.test.ts` and the TypeScript types should always match the schema.

```ts
export interface Amenities {
  rutsche:           boolean | null
  kinderbecken:      boolean | null
  sprungturm:        boolean | null
  wasser_schwammerl: boolean | null
  sauna:             boolean | null
  fritten:           boolean | null
  strudel:           boolean | null
  beachvolleyball:   boolean | null
  sandstrand:        boolean | null
  fkk:               boolean | null
}

export interface Pool {
  id:          string
  name:        string
  type:        'freibad'
  district:    number
  address:     string
  coordinates: [number, number]
  since:       number | null
  officialUrl: string
  season:      { open: string; close: string }
  hours:       { weekday: string; weekend: string; note: string | null }
  amenities:   Amenities
  tags:        string[]
  featured:    boolean
}
```

## Before every commit

Run `npm run check`. If it fails:
1. Run `npm run lint:fix && npm run format:fix` to fix what's auto-fixable
2. Fix remaining issues manually
3. Run `npm run check` again to confirm clean
4. Then commit

Never commit with lint or type errors. Never use `// eslint-disable` to suppress a warning without a comment explaining why.

# Run tests

Runs the appropriate test suite for the change at hand. Usage: `/test` (runs all), `/test unit`, `/test e2e`, `/test data`.

## Test stack

- **Vitest** — unit and component tests (`src/**/*.test.ts`)
- **Playwright** — end-to-end tests (`tests/e2e/**/*.spec.ts`)
- **Data validation** — custom schema checks (`tests/data/`)

## Commands

```bash
npm run test          # All unit tests (Vitest)
npm run test:e2e      # E2E suite (Playwright, needs built site)
npm run test:data     # Data integrity checks only
npm run test:coverage # Unit tests with coverage report
```

## What to test and when

### After changing a component (`src/components/`)
Run unit tests for that component. If none exist, create them:
- Does it render without errors given valid props?
- Does it handle missing optional props gracefully?
- Does conditional rendering (e.g. showing hours only if present) work?

### After changing data files (`src/data/`)
Always run `npm run test:data` first — it catches schema violations before the build does.

### After adding a new pool (`/add-pool`)
Run `npm run test:data` to verify the new entry passes all schema checks.

### Before pushing
Run `npm run test` and `npm run test:data`. E2E is optional for content-only changes.

## Data integrity tests (`tests/data/validate.test.ts`)

These run against the JSON files directly — no build needed. They check:

```
pools.json
  ✓ every entry has id, name, coordinates, season, hours, amenities
  ✓ coordinates are valid [lat, lng] within Austria (lat 46–49, lng 9–18)
  ✓ season.open and season.close match MM-DD format
  ✓ hours.weekday and hours.weekend match HH:MM–HH:MM format
  ✓ all amenity values are true | false | null — no other values
  ✓ no duplicate IDs

enrichment/
  ✓ every enrichment file ID matches a pools.json entry
  ✓ tagline, vibe, tip, history are non-empty strings

public/images/pools/
  ✓ every pool ID in pools.json has a folder under public/images/pools/
  ✓ every folder with images has a metadata.json
  ✓ every metadata entry has source, author, license, url fields
```

If `tests/data/validate.test.ts` doesn't exist yet, create it before running.

## Writing new tests

Unit test file location: same directory as the component, `ComponentName.test.ts`.
E2E test location: `tests/e2e/{feature}.spec.ts`.

Unit test template:
```ts
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/dom'
// import component

describe('ComponentName', () => {
  it('renders with required props', () => {
    // ...
  })
})
```

E2E test template (Playwright):
```ts
import { test, expect } from '@playwright/test'

test('pool card shows amenities', async ({ page }) => {
  await page.goto('/')
  // ...
})
```

## Accessibility

Every E2E test should include a basic axe check on the page it visits:
```ts
import { checkA11y } from 'axe-playwright'
await checkA11y(page)
```

# Design System — Freibad Wien

Inspired by Wiener Bäder's visual identity: clean municipal confidence, water colours, warm summer energy. Playful but not juvenile. Documentary but not cold.

## Color Palette

```css
--color-water:       #009BB5;   /* Primary — Wiener Bäder teal */
--color-deep:        #005F73;   /* Dark anchor — headings, nav */
--color-sun:         #F5A623;   /* Accent — CTAs, highlights */
--color-sand:        #FDF6EC;   /* Page background — warm off-white */
--color-white:       #FFFFFF;   /* Cards, sections */
--color-text:        #1A1A2E;   /* Body text — near-black */
--color-text-muted:  #6B7280;   /* Secondary text, captions */
--color-border:      #E5E7EB;   /* Dividers, card borders */
```

Use `--color-water` for primary interactive elements (buttons, links, active states).
Use `--color-sun` sparingly — one accent per section maximum.
Never use pure black (`#000`) or pure white (`#FFF`) for text on coloured backgrounds.

## Typography

```css
--font-display: 'Archivo Black', sans-serif;   /* Headlines, hero text */
--font-body:    'Source Sans 3', sans-serif;   /* All body copy */
```

Load from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
```

### Type Scale

```css
--text-xs:   0.75rem;    /* 12px — captions, metadata */
--text-sm:   0.875rem;   /* 14px — secondary labels */
--text-base: 1rem;       /* 16px — body */
--text-lg:   1.125rem;   /* 18px — lead text */
--text-xl:   1.25rem;    /* 20px — card titles */
--text-2xl:  1.5rem;     /* 24px — section headings */
--text-3xl:  2rem;       /* 32px — page headings */
--text-4xl:  2.75rem;    /* 44px — hero subheading */
--text-hero: clamp(3rem, 8vw, 6rem);  /* Hero headline — fluid */
```

Hero and display text: `--font-display`, uppercase, tight letter-spacing (`-0.02em`).
All body copy: `--font-body`, `1.6` line-height minimum.

## Spacing

Based on a 4px grid:

```css
--space-1:  0.25rem;   /*  4px */
--space-2:  0.5rem;    /*  8px */
--space-3:  0.75rem;   /* 12px */
--space-4:  1rem;      /* 16px */
--space-6:  1.5rem;    /* 24px */
--space-8:  2rem;      /* 32px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-24: 6rem;      /* 96px */
--space-32: 8rem;      /* 128px */
```

Section vertical padding: `--space-24` desktop, `--space-16` mobile.
Card internal padding: `--space-6`.

## Layout

Max content width: `72rem` (1152px), centred with `margin-inline: auto`.
Grid: 12-column CSS grid, `gap: var(--space-6)`.
Mobile breakpoint: `640px`. Tablet: `1024px`.

```css
--content-width: 72rem;
--grid-cols: 12;
--grid-gap: var(--space-6);
```

## Components

### Pool Card
- White background, `border-radius: 12px`, subtle shadow
- Hero image (16:9 ratio, `object-fit: cover`)
- Pool name in `--font-display` at `--text-xl`
- District badge, distance badge (when geolocation active)
- One-line tagline in `--color-text-muted`
- Hover: slight lift (`translateY(-2px)`), shadow deepens

### Section Dividers
Use a CSS wave SVG as a horizontal divider between sections. Colour transitions:
`--color-sand` → `--color-white` → `--color-deep`

```html
<div class="wave-divider" aria-hidden="true">
  <svg viewBox="0 0 1440 60" ...>...</svg>
</div>
```

### Tags / Badges
Pill shape, `--color-water` background at 15% opacity, `--color-deep` text.
```css
.tag { background: color-mix(in srgb, var(--color-water) 15%, transparent); }
```

### Primary Button
```css
.btn-primary {
  background: var(--color-water);
  color: white;
  border-radius: 999px;
  padding: var(--space-3) var(--space-8);
  font-family: var(--font-body);
  font-weight: 600;
}
.btn-primary:hover { background: var(--color-deep); }
```

### Map Marker
Custom Leaflet marker: circle in `--color-water`, white pool icon inside.
Active/selected: `--color-sun` fill.

## Photography Style

- Natural light, daylight hours — no flash, no studio
- Candid over posed — swimmers, not models
- Slightly warm colour grade (lift shadows, pull highlights)
- Never crop people mid-face
- Historical Wien Museum photos: convert to slight sepia or duotone in `--color-water`/white

## Tone of Voice

- German-first, casual and warm — *du*, not *Sie*
- Short sentences. Active voice.
- Facts grounded with emotion: not *"Opened 1907"* but *"Seit 1907 kühlt Wien sich hier ab."*
- Anti-private-pool copy: humorous, never preachy

## Wiener Bäder Attribution

The design draws from Wiener Bäder's public visual identity. We are not affiliated with or endorsed by Wiener Bäder / Stadt Wien. Pool data is used under CC BY 4.0.

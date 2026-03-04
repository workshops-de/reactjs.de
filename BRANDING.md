# Branding & Color Configuration

This document explains how colors are managed in the project to make it easy to adapt for different portals (Angular.DE, ReactJS.DE, VueJS.DE).

## Color Configuration Location

Colors are defined in two places:

1. **`src/styles/global.css`** - Full Tailwind color scales (the source of truth)
2. **`src/config/site.ts`** - Reference values for JS/TS usage (gradients, etc.)

### CSS Variables (global.css)

```css
@theme {
  /* Primary color scale (React cyan #0891b2) */
  --color-primary-50: #ecfeff;
  --color-primary-100: #cffafe;
  --color-primary-200: #a5f3fc;
  --color-primary-300: #67e8f9;
  --color-primary-400: #22d3ee;
  --color-primary-500: #06b6d4;
  --color-primary-600: #0891b2; /* Base */
  --color-primary-700: #0e7490;
  --color-primary-800: #155e75;
  --color-primary-900: #164e63;
  --color-primary-950: #083344;
  --color-primary: #0891b2; /* Alias */

  /* Accent color scale (Blue #3b82f6) */
  --color-accent-50: #eff6ff;
  --color-accent-100: #dbeafe;
  --color-accent-200: #bfdbfe;
  --color-accent-300: #93c5fd;
  --color-accent-400: #60a5fa;
  --color-accent-500: #3b82f6; /* Base */
  --color-accent-600: #2563eb;
  --color-accent-700: #1d4ed8;
  --color-accent-800: #1e40af;
  --color-accent-900: #1e3a8a;
  --color-accent-950: #172554;
  --color-accent: #3b82f6; /* Alias */
}
```

## Usage Guidelines

### Correct Usage (Brand-agnostic)

Use these utility classes that automatically adapt to the brand:

- `text-primary` - Primary text color
- `bg-primary-100` - Light primary background
- `border-primary-200` - Light primary border
- `text-accent` - Accent text color

### Avoid (Brand-specific hardcoded colors)

| Avoid             | Use Instead        |
| ----------------- | ------------------ |
| `text-cyan-500`   | `text-primary`     |
| `text-blue-500`   | `text-accent`      |

### Exceptions (Keep hardcoded)

- `text-gray-*` - Neutral colors
- `text-red-500` - Error states (not brand color!)
- `text-green-500` - Success states

## Adapting for a New Portal

1. Update `src/styles/global.css` - Change color values in `@theme` block
2. Update `src/config/site.ts` - Update branding gradients
3. Update logos and images in `public/assets/img/`

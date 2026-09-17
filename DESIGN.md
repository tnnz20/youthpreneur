# Design System & Implementation Specification: YOUTHPRENEUR TAPIN

**Target Stack:** Vite 8 + React 19 + TypeScript 6 + React Router 7 + Tailwind CSS 4 + shadcn/ui (`base-nova`)
**Supporting Libraries:** `@base-ui/react`, `class-variance-authority`, `lucide-react`, `tw-animate-css`, `@fontsource-variable/geist`, ESLint, Prettier
**Institution:** Dinas Pemuda dan Olahraga (Dispora) Kabupaten Tapin, Kalimantan Selatan
**Design Style:** _Neo-Brutalist Editorial & Warm Retro-Modern_

---

## 1. Executive Summary & Design Principles

### 1.1 Brand Essence

- **Program Name:** YOUTHPRENEUR TAPIN
- **Organizer:** Dinas Pemuda dan Olahraga (Dispora) Kabupaten Tapin
- **Official Slogan:** _"Membangun Pemuda, Menggerakkan Kewirausahaan, Memajukan Tapin."_
- **System Purpose:** An integrated, data-driven ecosystem (**BADAPATAN** - Bank Data Pemuda Tapin) covering business incubation for local commodities across 12 kecamatan (Cabai Hiyung, Purun, Kriya, Kuliner), legalization/KUR facilitation, and youth-and-sports synergy.

### 1.2 Aesthetic Pillars (Neo-Brutalist Warmth)

1. **Decisive Contours:** Solid black borders (`2px border-brand-dark`, `#141416`) on every card, badge, and dialog.
2. **Tactile Hard-Edge Offset Shadows:** Sharp shadows with no blur radius (`box-shadow: 3px 3px 0px 0px #141416`), producing an embossed paper feel.
3. **Warm Editorial Canvas:** A warm paper/cream background (`#FAF7F2`) paired with snow-white cards (`#FFFFFF`) for high, comfortable contrast (WCAG AAA compliant).
4. **Functional Pastel Accents:** Soft pastels (_butter yellow_, _lavender purple_, _sky blue_, _soft peach_, _fresh mint_) distinguish business categories and scholarship statuses.
5. **Micro-Interactions & Delight:**
   - Gentle floating animation on hero badges (`animate-float`, 4s).
   - Card lift on hover (`hover:-translate-y-1 hover:shadow-solid-lg`).
   - Tactile button feedback on press (`active:scale-95`).

---

## 2. `components.json` Specification (shadcn CLI)

The project uses the `base-nova` style on a Vite SPA. The committed `components.json` at `apps/frontend/components.json` is the source of truth. Key settings: `rsc: false` (no server components), CSS entry at `src/index.css`, and **no** `tailwind.config` path because Tailwind v4 is CSS-first.

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}
```

Notes:

- The `@` alias resolves to `apps/frontend/src` via both `vite.config.ts` and `tsconfig.app.json`.
- `lib/utils.ts` re-exports `cn` from the installed `cn` package, so generated components import `{ cn } from 'cn'`.
- Add components on demand with `npx shadcn@latest add <component>`; they land in `src/components/ui/`.

---

## 3. Design Tokens & CSS Variables (`src/index.css`)

Tailwind v4 is **CSS-first**. All theme tokens live in `src/index.css`; no JavaScript theme file is required. The current file:

- Imports `tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css`, and `@fontsource-variable/geist`.
- Registers `@custom-variant dark (&:is(.dark *))` for class-based dark mode.
- Maps tokens to utilities through `@theme inline`.
- Declares raw values in `:root` and overrides them in `.dark`.

Because Tailwind v4 generates colors with `color-mix()`, opacity modifiers such as `bg-brand-yellow/40`, `text-brand-dark/80`, and `border-border/60` work with any color format, including hex. The existing shadcn base tokens use `oklch`; brand tokens may stay in the original hex values shown below.

### 3.1 Existing shadcn Base Tokens

The file already defines the standard shadcn variables (`--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--chart-*`, `--sidebar-*`, `--radius`) in `:root` and `.dark`, exposed in `@theme inline` as `--color-*` and radius utilities. Leave these intact.

### 3.2 Brand Token Extension

Add the Youthpreneur palette as custom properties, then expose them in the `@theme inline` block so Tailwind generates `brand-*` utilities.

```css
@theme inline {
  /* ...existing mappings... */

  /* Custom Neo-Brutalist Tapin Palette */
  --color-brand-bg: var(--brand-bg);
  --color-brand-dark: var(--brand-dark);
  --color-brand-yellow: var(--brand-yellow);
  --color-brand-yellow-light: var(--brand-yellow-light);
  --color-brand-purple: var(--brand-purple);
  --color-brand-blue: var(--brand-blue);
  --color-brand-peach: var(--brand-peach);
  --color-brand-mint: var(--brand-mint);
  --color-brand-muted: var(--brand-muted);
  --color-brand-footer: var(--brand-footer);

  /* Neo-Brutalist hard-edge shadows */
  --shadow-solid-sm: 2px 2px 0px 0px #141416;
  --shadow-solid: 3px 3px 0px 0px #141416;
  --shadow-solid-lg: 5px 5px 0px 0px #141416;
  --shadow-solid-hover: 4px 4px 0px 0px #141416;
}

:root {
  /* ...existing shadcn tokens... */
  --brand-bg: #faf7f2; /* Warm cream canvas */
  --brand-dark: #141416; /* Crisp dark ink */
  --brand-yellow: #fee78a; /* Brand highlight */
  --brand-yellow-light: #fef3c7; /* Subtle tag pill */
  --brand-purple: #ddd6fe; /* Agribusiness category */
  --brand-blue: #bae6fd; /* Kriya & data category */
  --brand-peach: #fecdd3; /* Culinary category */
  --brand-mint: #d1fae5; /* Scholarship & sports */
  --brand-muted: #71717a; /* Subtle gray */
  --brand-footer: #f4efe6; /* Footer surface */
}

.dark {
  /* ...existing shadcn tokens... */
  --brand-bg: #141416;
  --brand-footer: #1c1c1f;
}
```

With these tokens, utilities such as `bg-background`, `text-foreground`, `border-border`, `bg-brand-yellow`, `shadow-solid`, `shadow-solid-lg`, and `hover:shadow-solid-hover` are available.

### 3.3 Animations, Scrollbar, and Base Layer

- **Float keyframes:** define `@keyframes gentleFloat` and `.animate-float` / `.animate-float-delayed` in `src/index.css`. `tw-animate-css` (already imported) supplies the remaining animation utilities, so `tailwindcss-animate` is not used.
- **Scrollbar:** a slim 8px `::-webkit-scrollbar` styled with the warm palette.
- **Base layer:** keep the existing `@layer base` rules that apply `border-border`/`outline-ring` to all elements, `bg-background text-foreground` to `body`, and `font-sans` to `html`.

---

## 4. Tailwind CSS v4 Conventions

Tailwind v4 does **not** use a `tailwind.config.ts` here, and the legacy directives `@tailwind base; @tailwind components; @tailwind utilities;` are **not** used. The setup is:

1. `vite.config.ts` registers `@tailwindcss/vite`.
2. `src/index.css` starts with `@import 'tailwindcss';`.
3. Theme customization happens in `@theme inline`; raw values live in `:root` / `.dark`.
4. Content sources are detected automatically by the Vite plugin, so no `content` array is needed.
5. Class-based dark mode is provided by `@custom-variant dark (&:is(.dark *))`.
6. Animations come from `tw-animate-css`, not `tailwindcss-animate`.

When adding design tokens, extend the existing `@theme inline` block and the matching `:root` / `.dark` blocks rather than creating a new config file.

---

## 5. Typography & Font Loading

Fonts are self-hosted with Fontsource and imported directly in the CSS entry point. There is no `next/font` and no `src/app/layout.tsx`; the app is a client-rendered Vite SPA.

`src/index.css`:

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import 'shadcn/tailwind.css';
@import '@fontsource-variable/geist';

@theme inline {
  --font-heading: var(--font-sans);
  --font-sans: 'Geist Variable', sans-serif;
  /* ...other tokens... */
}
```

Guidelines:

- **Primary typeface:** Geist Variable via `@fontsource-variable/geist`; the family name exposed to CSS is `'Geist Variable'`.
- Use the `font-sans` / `font-heading` utilities rather than hardcoding font families.
- If a display face is added later, install its `@fontsource-variable/*` package and import it in `src/index.css`, then map it to a `--font-*` token in `@theme inline`. Do not introduce `next/font`.

---

## 6. shadcn/ui Component Mapping & Variant Extension

### 6.1 Component Mapping Matrix

Only `Button` is currently generated in `src/components/ui/`. Other rows describe the intended mapping; add each component with `npx shadcn@latest add <component>` when its section is built. Primitives are Base UI (`@base-ui/react`), not Radix.

| Landing page element                  | shadcn/ui component                        | Customization                                                                                                                           |
| :------------------------------------ | :----------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **Login / CTA button**                | `Button`                                   | `variant="default"` (`bg-brand-dark text-white rounded-full`)                                                                           |
| **Neo-brutalist action button**       | `Button`                                   | `variant="neo"` / `variant="neoYellow"` (see CVA extension below)                                                                       |
| **Hero registration form (pill)**     | `Field` / `Input` + `Button`               | Single pill container with a borderless input; add form and validation libraries when the form is implemented (not currently installed) |
| **Course card**                       | `Card`, `CardContent`                      | `border-2 border-brand-dark rounded-2xl overflow-hidden hover:-translate-y-1`                                                           |
| **"Best Seller / Scholarship" badge** | `Badge`                                    | `variant="neoYellow"` or `variant="neoMint"`                                                                                            |
| **Pastel category cards**             | `Card`                                     | Pastel background (`bg-brand-purple`, etc.) with a centered icon circle                                                                 |
| **Mentor & alumni avatar**            | `Avatar`, `AvatarImage`, `AvatarFallback`  | `rounded-full border-2 border-brand-dark p-0.5`                                                                                         |
| **Alumni success story**              | `Card`                                     | `bg-brand-yellow border-2 border-brand-dark shadow-solid-sm`                                                                            |
| **BADAPATAN registration dialog**     | `Dialog`, `DialogContent`, `DialogHeader`  | `bg-brand-bg border-2 border-brand-dark rounded-3xl shadow-solid-lg`                                                                    |
| **Tapin kecamatan selector**          | `Select`, `SelectTrigger`, `SelectContent` | Dropdown of the 12 official Tapin kecamatan                                                                                             |
| **Mobile navigation menu**            | `Sheet`, `SheetContent`, `SheetTrigger`    | Side drawer with search bar and divider-separated navigation                                                                            |
| **Toast notifications**               | `Sonner` / shadcn toast                    | Dark toast with a yellow accent checkmark icon                                                                                          |

### 6.2 CVA Extension for Buttons and Badges

Add custom variants to `src/components/ui/button.tsx`, keeping the existing Base UI import, `cva` usage, and `size` keys. Example addition:

```tsx
// src/components/ui/button.tsx
const buttonVariants = cva('...existing base classes...', {
  variants: {
    variant: {
      // ...existing variants...
      neo: 'bg-brand-dark border-brand-dark shadow-solid hover:shadow-solid-sm border-2 font-bold text-white hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-black active:translate-x-1 active:translate-y-1 active:shadow-none',
      neoYellow:
        'bg-brand-yellow text-brand-dark border-brand-dark shadow-solid hover:shadow-solid-sm border-2 font-bold hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-amber-300 active:translate-x-1 active:translate-y-1 active:shadow-none',
    },
    size: {
      // ...existing sizes: default, xs, sm, lg, icon, icon-xs, icon-sm, icon-lg...
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});
```

Apply the same approach to `Badge` (`neoYellow`, `neoMint`) once it is generated. Prefer extending variants over one-off class strings so styling stays consistent.

---

## 7. Architecture & Component Hierarchy

The frontend lives in `apps/frontend/` and is a client-rendered Vite SPA with React Router. Each `src/` directory has one clear responsibility.

```text
apps/frontend/
├─ index.html              # Vite HTML entry; mounts #root
├─ vite.config.ts          # React + Tailwind v4 plugins; "@" -> ./src alias
├─ components.json         # shadcn CLI config (base-nova, Vite, rsc: false)
├─ tsconfig.json           # Project references
├─ tsconfig.app.json       # App TS config incl. "@/*" paths
└─ src/
   ├─ main.tsx             # Bootstrap: React root, StrictMode, BrowserRouter, global CSS
   ├─ app.tsx              # Route table (React Router <Routes>)
   ├─ index.css            # Tailwind v4 entry: imports, @theme tokens, @layer base
   ├─ components/
   │  └─ ui/               # Generated shadcn/base-nova primitives (e.g. button.tsx)
   ├─ constants/           # Static data (e.g. 12 kecamatan, categories, copy)
   ├─ hooks/               # Reusable React hooks
   ├─ lib/                 # Framework-agnostic helpers (utils.ts re-exports cn)
   ├─ pages/               # Route-level screens (home.tsx, about.tsx)
   ├─ schemas/             # Validation schemas (e.g. Zod) for forms
   └─ types/               # Shared TypeScript types and interfaces
```

**Directory responsibilities**

- **`src/components/ui`** — shadcn/base-nova primitives. Generated by the CLI; customize through variants; do not hand-roll equivalents.
- **`src/constants`** — immutable data and configuration: branding strings, the 12 official kecamatan, category and status mappings. UI code imports from here instead of inlining literals.
- **`src/hooks`** — reusable behavior extracted from components (data fetching, media queries, dialog state). Prefix with `use`.
- **`src/lib`** — pure helpers with no React dependency. `utils.ts` re-exports `cn` for class merging.
- **`src/pages`** — one component per route (`home.tsx`, `about.tsx`); compose UI primitives, hooks, and constants here.
- **`src/schemas`** — declarative validation schemas shared by forms and API boundaries.
- **`src/types`** — shared TypeScript types/interfaces used across pages, hooks, and lib.

**Routing and bootstrap flow**

1. `index.html` provides the `<div id="root">` mount point and loads `src/main.tsx`.
2. `src/main.tsx` imports `./index.css`, creates the React root with `createRoot`, and renders `<App />` inside `<StrictMode>` and `<BrowserRouter>`.
3. `src/app.tsx` declares the route table with `react-router-dom`:
   - `/` → `HomePage` (`src/pages/home.tsx`)
   - `/about` → `AboutPage` (`src/pages/about.tsx`)
4. Page components use `<Link>` for client-side navigation; new routes are added as `<Route>` entries in `app.tsx`.
5. Tailwind utilities and brand tokens come from `src/index.css`, imported once in `main.tsx`.

**Conventions**

- TypeScript is strict (`noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`); use `import type` for type-only imports.
- Import via the `@/` alias (for example `@/components/ui/button`) instead of long relative paths.
- Keep `constants`, `hooks`, `schemas`, and `types` as small, single-purpose modules; they are currently empty scaffolding and should be populated as features land.

---

## 8. Verification Checklist

- [ ] **shadcn CLI compatibility:** `npx shadcn@latest add <component>` succeeds with the committed `components.json` (`base-nova`, `rsc: false`, css `src/index.css`, no Tailwind config path).
- [ ] **Tailwind v4 CSS-first setup:** tokens are defined in `@theme inline` with raw values in `:root` / `.dark`; no `tailwind.config.ts` and no `@tailwind` directives exist.
- [ ] **Token opacity:** utilities such as `bg-brand-yellow/40`, `text-brand-dark/80`, and `border-border/60` render correct alpha values.
- [ ] **Dark mode:** toggling the `.dark` class on an ancestor applies the dark token overrides.
- [ ] **Typography:** Geist Variable loads through `@fontsource-variable/geist`; `font-sans` resolves to `'Geist Variable'`; no `next/font` usage.
- [ ] **Animations:** `tw-animate-css` and the custom `animate-float` keyframes work without `tailwindcss-animate`.
- [ ] **Component mapping:** each UI pattern maps to a shadcn base-nova component, and neo variants are applied via CVA rather than ad-hoc classes.
- [ ] **Architecture:** files live in the directories defined in Section 7; routes resolve through `src/app.tsx`; `main.tsx` bootstraps `BrowserRouter` and imports `index.css`.
- [ ] **Accessibility & responsiveness:** navigation collapses into a `Sheet` on mobile, dialogs use focus trapping, and layout breakpoints remain stable.
- [ ] **Brand integrity:** tagline, copywriting, and the 12 official Kabupaten Tapin kecamatan are consistent across pages.
- [ ] **Quality gates:** `npm run typecheck`, `npm run lint`, and `npm run format:check` pass in `apps/frontend/`.

---

## 9. Dashboard (Bento) Theme

The public site keeps the Neo-Brutalist Editorial language from Sections 1-8. The authenticated dashboard areas (`/admin/*`, `/dashboard/*`) use a **separate, additive theme**: a neutral bento grid with soft surfaces. Both themes coexist in one stylesheet; neither overrides the other.

### 9.1 Scope

- Applies to: `src/layouts/dashboard-layout.tsx`, everything under `src/components/dashboard/`, and the dashboard pages in `src/pages/` (`admin*.tsx`, `dashboard*.tsx`).
- Does **not** apply to: public layouts/pages (`main-layout`, `home`, `about`, `database`, `login`, `register`) or shared shadcn primitives in `src/components/ui/`. Primitives stay neutral; dashboard styling is applied through `className` overrides and the additive tokens below.

### 9.2 Dashboard Tokens (`src/index.css`)

Raw values live in `:root` and `.dark`, exposed to Tailwind through `@theme inline`, so utilities such as `bg-dash-surface`, `text-dash-fg`, `border-dash-border`, and `shadow-bento` are generated.

| Token              | Light     | Dark      | Utility               |
| :----------------- | :-------- | :-------- | :-------------------- |
| `--dash-bg`        | `#f4f5f7` | `#0b0d10` | `bg-dash-bg`          |
| `--dash-surface`   | `#ffffff` | `#16181d` | `bg-dash-surface`     |
| `--dash-surface-2` | `#fafafa` | `#1d2027` | `bg-dash-surface-2`   |
| `--dash-border`    | `#e7e8ec` | `#2a2e37` | `border-dash-border`  |
| `--dash-fg`        | `#18181b` | `#f4f4f5` | `text-dash-fg`        |
| `--dash-muted`     | `#71717a` | `#a1a1aa` | `text-dash-muted`     |
| `--dash-accent`    | `#fee78a` | `#fee78a` | `bg-dash-accent`      |
| `--dash-accent-fg` | `#422006` | `#422006` | `text-dash-accent-fg` |

Shadows are exposed as `--shadow-bento` and `--shadow-bento-lg` (soft, blurred, no hard offset).

### 9.3 Visual Rules

1. **Surfaces, not outlines:** `bg-dash-surface` + `ring-1 ring-dash-border` + `shadow-bento`. Do not use `border-2 border-brand-dark` or the `shadow-solid*` trio inside the dashboard.
2. **Radius:** `rounded-2xl` for cards and dialogs, `rounded-xl` for controls, `rounded-full` for pills.
3. **Typography:** `font-semibold` / `font-medium` with `tracking-tight` headings. Avoid `font-black` and uppercase display weights.
4. **Accent:** `bg-dash-accent` fills (badges, active nav pill, progress bars, avatar). Accent is a fill colour; pair it with `text-dash-accent-fg` for contrast. Primary actions use the default `Button` variant.
5. **Status colours:** soft tinted pills — `bg-{hue}-500/12 text-{hue}-700 ring-{hue}-500/25` with a `dark:text-{hue}-300` counterpart.
6. **Layout:** bento grid — `grid gap-5 lg:grid-cols-12` with tiles spanning different column counts (`lg:col-span-3/5/7/12`). One tile hosts a `Tabs` switcher; supporting tiles stack in the narrower column.
7. **Motion:** `transition-shadow` / `transition-colors` only. No `hover:-translate-y-1` or `active:scale-95`.

### 9.4 Dark Mode

- Driven by the `.dark` class on `<html>`, already registered via `@custom-variant dark (&:is(.dark *))`.
- `ThemeToggle` (`src/components/dashboard/shared/theme-toggle.tsx`) toggles the class, persists the choice in `localStorage['youthpreneur-theme']`, and falls back to `prefers-color-scheme`.
- The toggle only exists inside `DashboardLayout`; on unmount it removes `.dark`, so the public Neo-Brutalist pages are never rendered in the dashboard palette.

### 9.5 Verification

- [ ] Dashboard renders correctly at 360px, 768px, and 1440px widths, in both light and dark mode.
- [ ] No dashboard file imports `shadow-solid*`, `border-brand-dark`, or `variant="neo*"`.
- [ ] `--dash-*` tokens have both `:root` and `.dark` values; no hardcoded hex values in dashboard components.
- [ ] Public pages are visually unchanged.

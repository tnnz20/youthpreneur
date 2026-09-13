# Agent Instructions

## Repository

- `apps/frontend` is the only implemented application; `apps/backend` is an empty placeholder.
- This is not an npm workspace. Frontend dependencies and lockfile live in `apps/frontend/`.
- Frontend entrypoints: `apps/frontend/src/main.tsx` bootstraps React; `src/app.tsx` defines declarative `react-router` routes.
- Public pages use `src/layouts/main-layout.tsx`; `/login` intentionally renders outside that layout.
- Keep page components in `src/pages/`, page-specific components in `src/components/home/` or `src/components/about/`, shared components in `src/components/shared/`, and shadcn components in `src/components/ui/`.
- Static data belongs in `src/constants/`; shared TypeScript types belong in `src/types/`.
- Follow `DESIGN.md` for Youthpreneur visual tokens and component rules.

## Commands

Run from repository root through Makefile:

```bash
make fe-install
make fe-dev
make fe-format
make fe-format-check
make fe-lint
make fe-typecheck
make fe-build
make fe-preview
```

Or run npm commands from `apps/frontend/`:

```bash
npm install
npm run format:check
npm run lint
npm run typecheck
npm run build
```

Run `format:check`, `lint`, `typecheck`, and `build` after code changes. No test runner is configured.

## Conventions

- Import routing APIs from `react-router`, not `react-router-dom`.
- Use shadcn/Base UI components before creating raw equivalents; use Sonner for notifications.
- Use `lucide-react` for icons. Avoid text glyphs, inline SVG icons, and emoji icons.
- Use `SubmitEvent` for form submit handlers; current `@types/react` deprecates `FormEvent`.
- Tailwind CSS is v4 CSS-first: customize `src/index.css`, not `tailwind.config.ts`. Prefer canonical utilities suggested by Tailwind IntelliSense, such as `grow` instead of `flex-grow`.
- Preserve the repository Prettier config and do not add comments unless explicitly requested.
- Do not commit generated `dist/`, `node_modules/`, or `.playwright-mcp/` artifacts.

# User Table Search and Pagination Implementation Plan

**Goal:** Add debounced API name search and shadcn pagination/loading/empty components to admin user management.

**API:** `GET /users` accepts `cursor`, `limit` (default 20, maximum 100), exact `district`, `gender` (`male|female`), and case-insensitive partial `search` against `full_name`. Response is `{ users, next_cursor? }`; clients reuse returned cursors and never construct them.

**Files:**
- Create: `src/components/ui/pagination.tsx`
- Create: `src/components/ui/empty.tsx`
- Create: `src/components/ui/skeleton.tsx`
- Create: `docs/superpowers/plans/2026-09-20-user-search-pagination.md`
- Modify: `src/types/users.ts`
- Modify: `src/lib/api/users.ts`
- Modify: `src/hooks/use-users.ts`
- Modify: `src/components/dashboard/admin/user-table.tsx`

**Constraints:**
- Keep rows per page default at `20`.
- Display filter defaults as `Semua Jenis Kelamin` and `Semua Kecamatan`.
- Debounce name search by 300ms before requesting API.
- Reset cursor when search, district, gender, or limit changes.
- Preserve existing dashboard style and actions.
- Use shadcn/Base UI components; no new dependency.
- Do not add comments.

## Task 1: Extend user list query

- [x] Add `search?: string` to `UserListParams`.
- [x] Add `search` query parameter in `listUsers`, omitting blank values.
- [x] Add `limit` to user state and initialize it to `20`.
- [x] Add `search` input state and debounced request state.
- [x] Request API only after 300ms debounce for changed name search.
- [x] Send exact `search`, `district`, `gender`, `cursor`, and `limit` values.
- [x] Reset cursor and fetch first page when search, district, gender, or limit changes.
- [x] Reuse only returned `next_cursor` for next-page requests.
- [x] Expose `search`, `setSearch`, `limit`, and `setLimit` from `UserState`.

## Task 2: Add shadcn UI primitives

- [x] Create `src/components/ui/pagination.tsx` using existing Base UI/shadcn conventions.
- [x] Export `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationPrevious`, `PaginationNext`, and `PaginationLink`.
- [x] Create `src/components/ui/empty.tsx` with reusable empty-state primitives or a minimal `Empty` component matching existing dashboard tokens.
- [x] Create `src/components/ui/skeleton.tsx` with reusable animated skeleton styling.
- [x] Keep components accessible and dependency-free beyond existing packages.

## Task 3: Update user table filters

- [x] Add name search input bound to debounced `state.search` setter.
- [x] Keep district Select default label exactly `Semua Kecamatan`.
- [x] Change gender default label exactly to `Semua Jenis Kelamin`.
- [x] Keep `KECAMATAN` values unchanged for API exact-match filtering.
- [x] Keep reset filters clearing search, district, gender, and cursor.
- [x] Preserve active-filter detection and empty-state reset action.

## Task 4: Replace table loading and empty markup

- [x] Replace custom pulse spans with `Skeleton` component rows while loading.
- [x] Replace custom empty `<div>` markup with `Empty` component primitives.
- [x] Preserve filter-aware empty copy and reset action.
- [x] Keep table headers visible while loading.

## Task 5: Refactor pagination layout

- [x] Replace custom first/next Buttons with `Pagination` components.
- [x] Add rows-per-page Select with only API-safe values and default `20`.
- [x] Render `Previous` and `Next` icon/text controls without page numbers.
- [x] Use `flex justify-between` for rows-per-page and previous/next controls.
- [x] Disable Previous on first page and Next when `next_cursor` is absent or loading.
- [x] Track cursor history if needed for Previous; pass only server-returned cursor values.
- [x] Keep pagination responsive on narrow screens.

## Task 6: Verify and mark checklist

- [x] Run `npm run format:check`.
- [x] Run `npm run lint`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run build`.
- [x] Run targeted Prettier checks on all changed files if repo-wide formatting has unrelated failures.
- [x] Review diff and confirm no unsupported user query parameter or constructed cursor exists.
- [x] Change only completed checklist markers from `[ ]` to `[x]`; do not alter task wording or order.

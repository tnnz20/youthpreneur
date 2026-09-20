# PR #4 Review Follow-up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` or `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Resolve PR #4 review findings across legacy routing, user pagination recovery, accessibility, duplicate code, and user detail completeness.

**Architecture:** Keep existing API-backed user management and URL-persisted state. Apply focused fixes in route configuration, shared utilities/types, user hook, user table, detail page, and shared UI primitives. Preserve server cursor semantics and existing dashboard styling.

**Tech Stack:** React 19, TypeScript, React Router, Base UI/shadcn, Tailwind CSS v4, Luxon, Sonner.

**Spec:** `docs/reviews/pr-4-user-management-review.md`

## Global Constraints

- Preserve `/dashboard/users` as primary user management route.
- Restore `/admin/pendaftaran` as a legacy redirect to `/dashboard/users`.
- Use `/dashboard/users/:publicId` for user detail route.
- Never construct API cursors; only reuse server-returned `next_cursor`.
- Keep cookie-auth API transport through `apiRequest`.
- Preserve keyboard accessibility and visible focus states.
- Do not add dependencies or comments.
- Do not commit during implementation.

---

### Task 1: Restore legacy routes and correct navigation

**Files:**
- Modify: `src/app.tsx`
- Modify: `src/components/dashboard/admin/overview-stats.tsx`
- Modify: `src/components/dashboard/admin/user-table.tsx`
- Modify: `src/pages/admin/admin-user-detail.tsx`

- [x] Add `/admin/pendaftaran` route redirecting to `/dashboard/users` with existing `Navigate replace` convention.
- [x] Change detail route from `/admin/users/:publicId` to `/dashboard/users/:publicId` under authenticated admin layout.
- [x] Change `Lihat Detail` navigation to `/dashboard/users/${user.public_id}`.
- [x] Keep detail page back navigation pointing to `/dashboard/users`.
- [x] Update `overview-stats.tsx` registration card link/label so it does not misrepresent `/dashboard/users` as registration verification; use user-management wording or remove the stale link while preserving layout.
- [x] Confirm no active in-app link points to `/admin/users/:publicId`.

### Task 2: Recover stale or empty cursor pages

**Files:**
- Modify: `src/hooks/use-users.ts`
- Modify: `src/components/dashboard/admin/user-table.tsx`

- [x] Expose `cursor` or `hasCursor` state to distinguish first page from a URL-loaded/current cursor page.
- [x] If a cursor-backed response returns zero users, provide recovery rather than a dead-end: clear cursor/history and reload first page, or render a clearly labeled `Kembali ke halaman pertama` action independent of filters.
- [x] Ensure stale cursor empty state is not labeled `Belum Ada Pengguna`.
- [x] Preserve search/filter empty-state reset behavior.
- [x] Keep URL cursor synchronized after recovery using `replace`.
- [x] Keep cursor values server-provided only.
- [x] Ensure deleting the last item on a page leaves a usable previous/first-page path.

### Task 3: Fix shared user types and duplicate utilities

**Files:**
- Modify: `src/types/users.ts`
- Modify: `src/constants/users.ts`
- Modify: `src/lib/utils.ts`
- Modify: `src/hooks/use-users.ts`
- Modify: `src/components/dashboard/admin/user-table.tsx`
- Modify: `src/pages/admin/admin-user-detail.tsx`

- [x] Type `User.role` with existing `UserRole` union from `src/types/auth.ts`.
- [x] Import shared `GENDER_LABELS` into detail page; remove local duplicate.
- [x] Add shared `renderValue` utility and remove duplicate local helpers.
- [x] Add shared error-message helper or reuse one existing exported helper; remove inline duplicate fallback logic.
- [x] Remove unused `UserState.refresh` and implementation if no consumer needs it.
- [x] Remove unused `UserState.nextCursor` field if UI only needs `hasNextPage`; preserve internal hook state.
- [x] Keep `formatUnixDateTime` as shared formatter and retain its existing consumers.
- [x] Avoid unrelated abstraction for one-off class strings; only remove clear duplication.

### Task 4: Fix action accessibility and destructive styling

**Files:**
- Modify: `src/components/dashboard/admin/user-table.tsx`
- Modify: `src/components/ui/alert-dialog.tsx` only if required by existing variant API

- [x] Restore visible `focus-visible` ring on row `Aksi` trigger; do not leave only `focus:outline-none`.
- [x] Use shared Button styling/render pattern if compatible, otherwise add explicit `focus-visible:ring` classes.
- [x] Replace undefined `text-destructive-foreground` class with existing `AlertDialogAction variant="destructive"` styling.
- [x] Keep disabled state and accessible row-specific `aria-label`.
- [x] Make pagination previous/next controls render as buttons or expose correct disabled semantics without `href="#"` navigation.
- [x] Preserve no-page-number design and current cursor behavior.

### Task 5: Improve table/detail accessibility and loading consistency

**Files:**
- Modify: `src/components/ui/table.tsx`
- Modify: `src/components/dashboard/admin/user-table.tsx`
- Modify: `src/pages/admin/admin-user-detail.tsx`
- Modify: `src/components/ui/empty.tsx`

- [x] Add `scope="col"` to `TableHead` output or allow it through existing props without breaking callers.
- [x] Mark table busy while loading with `aria-busy`.
- [x] Provide accessible loading status for skeleton rows without noisy repeated announcements.
- [x] Add `role="alert"` to detail-page error output.
- [x] Replace inert `cn-font-heading` class with valid project utility or remove it.
- [x] Align `EmptyDescription` prop type with its rendered element.
- [x] Keep skeleton cell count synchronized with actual eight table columns plus action column as rendered.

### Task 6: Complete user detail and copy behavior

**Files:**
- Modify: `src/pages/admin/admin-user-detail.tsx`
- Modify: `src/components/dashboard/admin/user-table.tsx`

- [x] Display `birth_date` and `created_at` in user detail using shared timestamp/date formatting appropriate to their API formats.
- [x] Keep updated timestamp formatting through `formatUnixDateTime`.
- [x] Resolve deactivation copy promising reactivation when no reactivation action exists; either add explicit activation action using `PATCH /users/{publicID}/status` with `true`, or change copy to state account becomes inactive without promising UI recovery.
- [x] Preserve confirmation dialogs and success/error feedback.

### Task 7: Remove minor drift and verify

**Files:**
- Modify: files above as needed.

- [x] Remove redundant height utility from `selectClassName` if no visual change.
- [x] Check URL search debounce behavior; preserve 300ms search debounce and document behavior through code naming, not comments.
- [x] Prevent duplicate fetches caused by pending debounce after filter/limit changes if minimal cleanup is safe.
- [x] Keep mutation error feedback consistent; avoid duplicate inline error and toast where practical.
- [x] Run `npm run lint`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run build`.
- [x] Run targeted Prettier checks on all changed files and report repo-wide pre-existing format failures separately.
- [x] Search for stale `/admin/users/`, `/admin/pendaftaran` references, duplicate helpers, unused `refresh`, `nextCursor`, and undefined CSS tokens.
- [x] Inspect full diff and working tree; do not commit.

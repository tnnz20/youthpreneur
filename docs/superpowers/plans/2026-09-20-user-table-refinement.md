# User Table Refinement Implementation Plan

**Goal:** Align admin user table constants, date formatting, status colors, action spacing, and district filtering with project conventions and API contract.

**Files:**

- Create: `src/constants/users.ts`
- Modify: `src/components/dashboard/admin/user-table.tsx`
- Modify: `src/components/dashboard/shared/status-badge.tsx`

**Constraints:**

- Use existing `KECAMATAN` from `src/constants/site.ts`; do not duplicate district values.
- Use installed Luxon; do not add dependencies.
- Preserve existing table layout, dashboard styles, API behavior, and action behavior.
- District filter must send exact selected value through existing `setDistrict` state to `GET /users?district=...`.
- Keep existing status badge mappings unchanged except adding user statuses.
- No comments.

## Task 1: Extract user constants

- [x] Create `src/constants/users.ts`.
- [x] Export `GENDER_LABELS` with `male: 'Laki-laki'` and `female: 'Perempuan'`.
- [x] Export `GENDER_OPTIONS` with `all`, `male`, and `female` values and Indonesian labels.
- [x] Import `UserGender` as a type only.
- [x] Do not define or duplicate `KECAMATAN` in this file.

## Task 2: Refactor user table constants and date formatting

- [x] Remove `GENDER_LABELS`, `GENDER_OPTIONS`, and `formatTimestamp` local definitions from `user-table.tsx`.
- [x] Import gender constants from `@/constants/users`.
- [x] Import `DateTime` from `luxon`.
- [x] Format Unix-second `updated_at` values with Luxon using Indonesian locale and readable date/time output, equivalent to `DateTime.fromSeconds(value).setLocale('id').toFormat('dd LLL yyyy, HH:mm')`.
- [x] Preserve nullable field rendering as `—`.

## Task 3: Use Kecamatan select filter

- [x] Import `KECAMATAN` from `@/constants/site`.
- [x] Replace district text `Input` with the existing `Select` component pattern.
- [x] Use `filters.district` as the select value and call `setDistrict(value ?? '')` on change.
- [x] Add `SelectItem` for empty value with label `Semua Kecamatan`.
- [x] Add one `SelectItem` per `KECAMATAN` value, preserving exact API values.
- [x] Keep the filter label `Kecamatan` and existing select styling.
- [x] Keep filter-active/reset behavior working with empty district value.

## Task 4: Update user status badge tones

- [x] Add `Aktif` mapping to `TONE_CLASSES` in `status-badge.tsx` using the dashboard accent/active styling.
- [x] Add `Non Aktif` mapping using clearly inactive/destructive styling and a rose/red dot.
- [x] Preserve all existing mappings and fallback behavior.
- [x] Keep `user-table.tsx` labels exactly `Aktif` and `Non Aktif`.

## Task 5: Add Aksi button padding

- [x] Add horizontal and vertical padding to the `DropdownMenuTrigger` used for `Aksi` without breaking its circular hit area or icon alignment.
- [x] Preserve accessible `aria-label`, disabled state, border, hover, and focus behavior.

## Task 6: Verify

- [x] Run `npm run format:check`.
- [x] Run `npm run lint`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run build`.
- [x] Review diff to confirm only intended constants, table, badge, and plan files changed.
- [x] Mark only completed checklist items as `[x]`; do not rewrite plan task text.

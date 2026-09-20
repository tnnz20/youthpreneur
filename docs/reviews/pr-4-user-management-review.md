# PR #4 Review: feat(admin) — persistent user management

- **PR:** https://github.com/tnnz20/youthpreneur/pull/4
- **Branch:** `feat/user-management` → `main` (head `bd879a9`), 18 files, +1626/−288.
- **Commits reviewed:** `065182c` (feat(admin): add user management), `2822837` (refactor(admin): refine user table), `bd879a9` (feat(admin): persist user table state).
- **Scope reviewed:** full `main...HEAD` diff; `use-users` hook state/debounce/race handling; URL param sync and cursor pagination lifecycle; `lib/api/users.ts` against the backend contract (`youthpreneur-be/api/api-contract.md` @ `master`, fetched locally); `user-table` and `admin-user-detail` rendering/mutations; new shadcn `empty`/`pagination`/`skeleton` primitives; route changes in `app.tsx`; deleted `registration-table.tsx` / `admin-pendaftaran.tsx`; duplicate/unused code; accessibility; lint/typecheck/build/format.
- **Reviewer mode:** audit only; no application code modified, nothing committed.

## Scope

Adds API-backed admin user management: `GET /users` list with search (debounced 300 ms), district/gender filters, page size, and keyset (cursor) pagination; URL persistence of `search`, `district`, `gender`, `limit`, `cursor` via `useSearchParams(..., { replace: true })`; in-memory `cursorHistory` for Previous (not persisted — documented in PR body); user detail page at `/admin/users/:publicId`; deactivate (`PATCH /users/{publicID}/status` with `is_active: false`) and delete (`DELETE /users/{publicID}`) with AlertDialog confirms and toasts; new shadcn primitives (`empty`, `pagination`, `skeleton`); `formatUnixDateTime` (Luxon) in `lib/utils.ts`; deletes the mock-data `registration-table.tsx` and `admin-pendaftaran.tsx` pages and the `/admin/pendaftaran` redirect.

## Findings

### Critical

None. No security, data-loss, or build-breaking defects found. API transport stays in `src/lib/api/`, uses `apiRequest` with `credentials: 'include'`, and no secrets are exposed.

### Important

1. **Registration/verification UI removed silently; stale cross-links and legacy redirect now dead-end.**
   The PR deletes `src/components/dashboard/admin/registration-table.tsx` (267 lines), `src/pages/admin-pendaftaran.tsx`, and the `/admin/pendaftaran → /dashboard/users` redirect (removed in `src/app.tsx` diff, previously `main`'s app.tsx line 81). Consequences with evidence:
   - `src/components/dashboard/admin/overview-stats.tsx:222-228`: the "Pendaftaran Terbaru" card's "Lihat semua" link still points to `/dashboard/users`, which now renders user management — semantically wrong destination (unchanged file; the mismatch existed on `main` too but `main`'s page actually showed registrations).
   - `/admin/pendaftaran` bookmarks now hit the catch-all `NotFoundPage` (no redirect remains; `src/app.tsx:77-82` redirects only `/admin`, `/admin/pemuda`, `/admin/program`).
   - PR body does not mention removing the only admin registrations view (mock-data-driven, but the only one).
   Needs a product decision: restore a registration review surface, or update the "Lihat semua" link/label and document the removal.

2. **Detail route breaks the `/dashboard/*` convention this PR's siblings follow.**
   List page lives at `/dashboard/users` (`src/app.tsx:106`) and all in-app links navigate there (`user-table.tsx:304` → `/admin/users/${publicId}` target aside; `admin-user-detail.tsx:61` back → `/dashboard/users`; `constants/dashboard.ts:345` nav → `/dashboard/users`), but the detail route is `/admin/users/:publicId` (`src/app.tsx:113-120`). `main` deliberately redirects legacy `/admin/*` paths to `/dashboard/*` (PR #3 review, Important #1). Move detail to `/dashboard/users/:publicId` for consistency.

3. **Stale `?cursor=` dead-ends with a wrong empty message and no reset affordance.**
   `use-users.ts:67` initializes `cursor` from the URL with no validation; the backend cursor is an opaque `users.id` offset (contract: "Return users with `users.id` greater than cursor"). A cursor from an old session/data state can legitimately return an empty page. Then:
   - `hasPreviousPage` is `false` (fresh `cursorHistory`, `use-users.ts:68`, `280`) and `hasNextPage` is `false` (`nextCursor` absent on empty response) — both pager buttons disabled (`user-table.tsx:394-397`, `410-413`).
   - `filtersActive` (`user-table.tsx:115-116`) ignores `cursor`, so the empty state renders "Belum ada pengguna terdaftar" (`user-table.tsx:343-348`) — misleading — and the "Reset Filter" button in `EmptyContent` is not rendered (gated on `filtersActive`, `user-table.tsx:351`).
   Recovery currently requires manually editing the URL or changing a filter. Suggest: when `users.length === 0 && cursor !== null`, clear the cursor and refetch page 1 (or render a "Kembali ke halaman pertama" action).

4. **Keyboard focus indicator removed on the row action trigger.**
   `user-table.tsx:297` applies `focus:outline-none` to the custom `DropdownMenuTrigger` with no `focus-visible:` ring replacement — unlike every other control, which rides `buttonVariants`' `focus-visible:ring-3` (`src/components/ui/button.tsx:6`). Keyboard users cannot see focus on the per-row menu. Either use `<Button size="icon-sm" variant="ghost">` via `render`/`asChild` pattern or restore a `focus-visible:ring-2` class.

5. **`text-destructive-foreground` is not a defined token — inert class on the destructive confirm.**
   `user-table.tsx:462`: `className="bg-destructive text-destructive-foreground hover:bg-destructive/90"`. `src/index.css` defines `--color-destructive` (line 29) but has no `--color-destructive-foreground` anywhere (verified by grep), so the text-color class generates nothing and the label inherits the dark foreground on a red background (weak contrast). `AlertDialogAction` renders a `Button` (`src/components/ui/alert-dialog.tsx:127-128`) and accepts its props — the canonical fix is `<AlertDialogAction variant="destructive">` using the existing variant (`src/components/ui/button.tsx:17-18`).

### Minor

1. **Duplicate code — `GENDER_LABELS` defined twice.** `src/constants/users.ts:3-6` (typed `Record<UserGender, string>`) vs `src/pages/admin/admin-user-detail.tsx:20-23` (untyped `Record<string, string>` local copy). Detail page should import from constants.

2. **Duplicate code — `renderValue` defined twice.** Identical helper in `user-table.tsx:85-87` and `admin-user-detail.tsx:25-27`. Hoist to `lib/utils.ts` (or the constants module) once.

3. **Duplicate code — error-message fallback logic twice.** `toErrorMessage` (`use-users.ts:50-52`) vs the inline ternary in `admin-user-detail.tsx:49-51` (same string `'Terjadi kesalahan yang tidak diketahui.'`). Reuse one helper.

4. **Duplicate code — `CARD` class string twice.** `user-table.tsx:72` vs `admin-user-detail.tsx:14` (same tokens plus `p-6`); `overview-stats.tsx:218` carries a third near-copy. Low priority; a shared dashboard-surface constant would do.

5. **Unused hook API.** `UserState.refresh` (`use-users.ts:34`, implemented 230-234) and `UserState.nextCursor` (`use-users.ts:24`) are never consumed by `user-table.tsx` or the pages (verified by destructuring at `user-table.tsx:94-113`). Delete or wire up a refresh control.

6. **`User.role` typed as bare `string`** (`src/types/users.ts:14`) while the codebase already has the `UserRole` union (`member | admin`) used for RBAC (`src/types/auth.ts`, `constants/dashboard.ts:354`). Reuse the union for type safety.

7. **Pagination controls are `<a href="#">` acting as buttons.** `user-table.tsx:392,408` pass `href="#"` + `onClick preventDefault` (`pagination.tsx:40-57` renders anchors). They remain in link semantics/screen-reader link lists and are focusable while visually disabled. Render `PaginationPrevious/Next` as buttons (or `aria-disabled` + `tabIndex={-1}` when inert).

8. **Table accessibility gaps.** `TableHead` (`src/components/ui/table.tsx:54-65`) emits no `scope="col"`; loading skeletons (`user-table.tsx:252-261`) are silent (no `aria-busy` on the table, no `aria-live` region); the detail page error block (`admin-user-detail.tsx:78-85`) lacks the `role="alert"` the list page uses (`user-table.tsx:231`). Cheap wins, non-blocking.

9. **Hardcoded skeleton geometry.** `user-table.tsx:255` hardcodes 8 skeleton cells matching today's 8 columns; a column-count constant or deriving from the header would prevent drift.

10. **`birth_date` and `created_at` fetched but never rendered.** `types/users.ts:21,26` model them; the detail page (`admin-user-detail.tsx:100-140`) shows NIK/gender/district/phone/address/updated but skips birth date and created timestamp. Either display or note as intentionally omitted.

11. **URL loses in-flight search text.** The URL effect writes `debouncedSearch` only (`use-users.ts:143-145`); typing then refreshing within the 300 ms window loses the query. Acceptable trade-off; worth a comment.

12. **Filter change does not cancel a pending search debounce.** `setDistrict`/`setGender`/`setLimit` (`use-users.ts:174-196`) reset cursor but leave the debounce timer (`use-users.ts:76-90`) armed, so a second fetch fires ~300 ms later. The `requestIdRef` guard (`use-users.ts:125-137`) prevents stale writes — cosmetic double-fetch only.

13. **Mutation errors surface twice.** `deactivate`/`remove` set hook `error` state (`use-users.ts:244,261`) → rendered via `role="alert"` (`user-table.tsx:230-234`), and the callers also `toast.error` (`user-table.tsx:130,146`). Pick one channel for mutation failures.

14. **`cn-font-heading` class has no definition.** `src/components/ui/empty.tsx:61` uses `cn-font-heading`; no `cn-*` utility/`@theme` namespace exists in `src/index.css` or `node_modules/shadcn/dist/tailwind.css` (verified by grep) — the class is inert. Since `--font-heading` aliases `--font-sans` (`src/index.css:10`), safe to drop or replace with `font-heading`.

15. **`EmptyDescription` type/render mismatch.** Typed `React.ComponentProps<'p'>` but renders a `div` (`empty.tsx:67-70`). Harmless; align one or the other.

16. **Deactivate dialog promises re-activation the UI never offers.** Copy "sampai diaktifkan kembali" (`user-table.tsx:436`) while the menu item is disabled for inactive users (`user-table.tsx:311`) and the hook hardcodes `updateUserStatus(publicId, false)` (`use-users.ts:241`). The contract supports `is_active: true`. Either add an "Aktifkan" action or soften the copy.

17. **Redundant height classes in `selectClassName`.** `h-11` plus `data-[size=default]:h-11` (`user-table.tsx:75`) — one is redundant.

### Cursor/URL pagination audit (explicit check)

- Cursors are never constructed client-side; only server `next_cursor` is forwarded (`use-users.ts:94,216`, `lib/api/users.ts:7-9`). ✔ Matches contract ("must not construct cursors").
- Filter/search/limit changes reset cursor and history (`use-users.ts:166-206`). ✔
- `nextPage` no-ops while loading or without `nextCursor`; `previousPage` no-ops with empty history (`use-users.ts:208-228`). ✔
- Out-of-order responses discarded via `requestIdRef` counter (`use-users.ts:74,125-137`); survives StrictMode double-effects. ✔ (No `AbortController`, so superseded requests still complete on the wire — minor.)
- Cursor history is session-only, so Previous dies on refresh — **documented and intentional** (PR body). ✔
- Gaps: stale-cursor dead end (Important #3); delete on a page's last row refetches the same cursor and can land on an empty page (recoverable via Previous, `use-users.ts:226-227`); search text not in URL until debounce (Minor #11).

### API contract cross-check (`youthpreneur-be/api/api-contract.md` @ `master`)

- `GET /users`: params `cursor`, `limit` (default 20, max 100), `district`, `gender` (`male|female`), `search` — all sent correctly, empties omitted (`lib/api/users.ts:5-23`, `use-users.ts:113-119`); `USER_PAGE_SIZE_OPTIONS` caps at 100 (`constants/users.ts:14`). ✔
- Response `{ users, next_cursor? }`, `next_cursor` omitted on last page → `hasNextPage` derives from `next_cursor ?? null` (`use-users.ts:94,279`). ✔
- `GET /users/{publicID}`, `PATCH /users/{publicID}/status` `{ is_active: boolean }`, `DELETE /users/{publicID}` → 204 handled by `apiRequest` (`lib/api/client.ts:38-40`). ✔
- Field shapes (`public_id`, `email`, `role`, `is_active`, `created_at`/`updated_at` epoch-seconds, nullable `profile`) match `types/users.ts`; `DateTime.fromSeconds` matches epoch-seconds (`lib/utils.ts:5`). ✔
- Contract permits `is_active: true`; deactivate-only is a UI choice (Minor #16).

## Duplicate / Unused Code Audit

| Item | Locations | Verdict |
| --- | --- | --- |
| `GENDER_LABELS` | `constants/users.ts:3` / `admin-user-detail.tsx:20` | duplicate — keep constants copy |
| `renderValue` | `user-table.tsx:85` / `admin-user-detail.tsx:25` | duplicate — hoist |
| error fallback string/logic | `use-users.ts:50` / `admin-user-detail.tsx:49-51` | duplicate — hoist |
| `CARD` class string | `user-table.tsx:72` / `admin-user-detail.tsx:14` (variant of `overview-stats.tsx:218`) | duplicate — optional hoist |
| `UserState.refresh` | `use-users.ts:34,230-234` | unused — delete or wire |
| `UserState.nextCursor` | `use-users.ts:24` | unused by UI — trim from interface |
| `formatUnixDateTime` | `lib/utils.ts:5`, used at `user-table.tsx:291`, `admin-user-detail.tsx:134` | used; Luxon already a dependency (`package.json:23`), no new dep introduced |
| deleted `registration-table` / `admin-pendaftaran` references | grep across `src/` | clean — no orphan imports; only stale cross-link remains (Important #1) |

## Verification Results

Run at head `bd879a9`, repository root, Windows/PowerShell:

| Command | Result |
| --- | --- |
| `npm run lint` (eslint) | PASS — 0 errors, 0 warnings |
| `npm run typecheck` (`tsc -b`) | PASS |
| `npm run build` (vite) | PASS — `built in 513ms` |
| `npm run format:check` | 59 files warn repo-wide — pre-existing CRLF baseline (`core.autocrlf=true`): includes files untouched by this PR (e.g. `src/schema/auth.ts`). The 4 PR files flagged (`src/types/users.ts`, `src/lib/api/users.ts`, `src/lib/utils.ts`, `src/hooks/use-users.ts`) are **content-identical** to Prettier output (verified via `Compare-Object` — zero diff); only working-tree line endings differ. No PR-attributable formatting regressions. |
| Contract grep (`/users` in backend repo) | PASS — all 4 endpoints, params, and field shapes match |
| Stale-reference grep (`admin/pendaftaran`, `registration-table`, `AdminPendaftaran`) | PASS in `src/` (no orphans); cross-link issue tracked as Important #1 |
| Playwright/browser smoke | Not run — static review only |

## Conclusion

**Approve with changes requested.** Core implementation is sound: correct keyset pagination discipline, race-guarded fetching, contract-accurate transport, good dialog/toast UX, and clean deletion of the replaced mock pages. The blocking items are the silently removed registration surface with its stale "Lihat semua" link and dead `/admin/pendaftaran` redirect (Important #1), the inconsistent `/admin/users/:publicId` route (Important #2), the stale-cursor dead end (Important #3), and the two small accessibility/contrast defects (Important #4, #5). Minor items are cheap follow-ups that can land in this PR or a follow-up.

## Concrete Suggestions

1. Decide the fate of registration review; at minimum repoint or relabel `overview-stats.tsx:223-228` and restore a `/admin/pendaftaran` redirect if that URL was ever shared.
2. Move the detail route to `/dashboard/users/:publicId` (`src/app.tsx:113-120`) and update `user-table.tsx:304`.
3. Auto-recover from an empty cursor page: in `use-users.ts`, when a response returns 0 users and `cursor !== null`, clear `cursor`/`cursorHistory` and refetch; or add a "back to first page" action independent of `filtersActive` (`user-table.tsx:351`).
4. Replace the row-trigger classes (`user-table.tsx:295-301`) with the shared `Button` (`variant="ghost" size="icon-sm"`) so the `focus-visible` ring returns; use `<AlertDialogAction variant="destructive">` for the delete confirm (`user-table.tsx:460-465`).
5. Hoist `GENDER_LABELS`/`renderValue`/error-message helper into shared modules; delete `refresh`/`nextCursor` from `UserState` or use them; type `User.role` as `UserRole`.
6. Convert pager anchors to buttons (`user-table.tsx:388-423`), add `scope="col"` to `TableHead` (`table.tsx:56-63`), `role="alert"` on the detail error (`admin-user-detail.tsx:82`), and `aria-busy` on the table while loading.

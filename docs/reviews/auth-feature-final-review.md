# Auth Feature Final Review: `feat/auth`

- **Branch:** `feat/auth` at `7b0d98e`; commits under review `e745bac..7b0d98e` (auth layout widening, register redesign, date picker migration, success message), against base `1418387`.
- **Scope:** full diff `main...HEAD` with focus on the three newest commits: `src/pages/auth/register.tsx`, `src/components/auth/*`, `src/components/ui/calendar.tsx`, `src/components/ui/popover.tsx`, `src/schema/auth.ts`, `src/types/auth.ts`, `src/layouts/auth-layout.tsx`, `package.json`.
- **References:** `AGENTS.md`, `DESIGN.md`, `docs/superpowers/plans/2026-09-19-register-redesign.md`, `docs/superpowers/plans/2026-09-19-date-picker-migration.md`, previous reports (`docs/reviews/pr-2-auth-review.md`, `docs/reviews/register-redesign-review.md`), API contract Auth/User sections (via plan constraints — backend repo not in this checkout).
- **Reviewer mode:** audit only; no code modified, nothing committed.

## Verification Commands / Results

Run at `7b0d98e` (HEAD), repository root, Windows/PowerShell:

| Command                                  | Result                                                                      |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| `npm run format:check`                   | PASS — "All matched files use Prettier code style!"                         |
| `npm run lint`                           | PASS — 0 errors, 0 warnings                                                 |
| `npm run typecheck` (`tsc -b`)           | PASS                                                                        |
| `npm run build`                          | PASS — `✓ built in 6.28s`, register chunk 99.76 kB (incl. react-day-picker) |
| `git diff --check`                       | PASS — no whitespace errors                                                 |
| Stale-route grep (`/login`, `/register`) | No stale references in `src/`                                               |
| Playwright smoke (Vite `:5211`, Chrome)  | Executed — see below                                                        |

### Browser Smoke Test Evidence

- `/auth/register` renders step 1 in `AuthLayout`; back-home link, login link, no navbar/footer; `RedirectIfAuthenticated` still wraps both auth routes (`src/app.tsx:49-66`).
- Step 1 empty submit → toast `Format email tidak valid.`; valid credentials → step 2; `Kembali` preserves email/password/confirm in DOM.
- Date picker: opens, future dates (Sep 21–30 2026) disabled, today selectable; caption button opens years grid (2021–2032); years beyond `endMonth` (2027+) and before `startMonth` (1913–1919) disabled; prev-years paging reaches the `startMonth` floor and disables (1913–1924). **Years-view Next defect found — see Important 1.**
- Selected date displays Indonesian: `20 September 2026`, `15 Januari 1990` (`dd MMMM yyyy`, `.setLocale('id')`).
- Gender trigger displays `Laki-Laki`; hidden form input carries `male`.
- District select lists all 12 `KECAMATAN` values; selected `Bakarangan` submitted verbatim.
- **Captured `POST /users` body (intercepted):** `{"email":"siti@example.com","password":"rahasia123","full_name":"Siti Aminah","nik":"6371010109900002","birth_date":"2026-09-20","gender":"male","district":"Bakarangan","phone":"081234567890","address":"Jl. Merdeka No. 1"}` — exactly the 9 contract fields; no `confirmPassword`, no `terms`, no extras.
- Backend down (CORS): toast `Pendaftaran gagal. Coba lagi.`, all step-2 values preserved, no navigation. Only expected `/auth/refresh` CORS console noise.
- Mobile 390×844: single column, no horizontal overflow, progress labels truncate.
- `/auth/login` re-tested: **card width regressed from 448px to 768px at ≥sm — see Important 2.**
- Enter key on step 1 email field: no implicit submission, no state change (step-1 submit path remains unreachable, as previous review concluded).

## Findings

### Critical

None. The payload leak from the redesign review (Critical 1) is confirmed fixed: `src/pages/auth/register.tsx:68-78` builds the payload field-by-field; captured network body matches `RegisterRequest` exactly.

### Important

1. **Years-view "Next" navigation is dead whenever the displayed month is at `endMonth` — which is every fresh open.**
   `src/components/ui/calendar.tsx:279-280` — `handleNextClick` starts with `if (!nextMonth) return;` **before** the `navView === 'years'` branch. `nextMonth`/`previousMonth` come from `useDayPicker()` (`calendar.tsx:241`) and describe _month-grid_ neighbors, not year-grid paging. The picker is mounted with `endMonth={today}` (`src/components/auth/birth-date-picker.tsx:47`) and `defaultMonth={selected}` (`:44`), so a fresh open shows the current month and `nextMonth` is `undefined` — the years-view Next button is clickable (its `isNextDisabled` guard at `calendar.tsx:254-263` correctly checks `displayYears.to + 1`) but every click early-returns. Verified: at years range 1913–1924, Next shows enabled, click registers (`[active]` state), range stays 1913–1924. Prev works only because `previousMonth` is defined from the current month. The same trap kills years-view Prev if the display month sits at `startMonth` (e.g., after picking a January 1920 date and reopening). User impact: navigate prev past the desired decade and you cannot page back forward — you must close and reopen the picker. Fix: hoist the years-view branch above the early returns in both handlers:

   ```tsx
   const handlePreviousClick = () => {
     if (navView === 'years') {
       /* existing years paging */ return;
     }
     if (!previousMonth) return;
     goToMonth(previousMonth);
     onPrevClick?.(previousMonth);
   };
   ```

   (mirror for next). This is the Luca-Felix registry's guard-order bug; the component is vendored in-repo so it can be patched directly.

2. **`sm:max-w-3xl` on the shared auth layout visibly stretches the login card.**
   `src/layouts/auth-layout.tsx:15` — changed `w-full max-w-md` → `w-full max-w-md sm:max-w-3xl`. Login's `Card` has no width of its own (`src/pages/auth/login.tsx:54`), so it inherits the new 768px width (measured 768px at 1278px viewport; screenshot confirms a stretched two-thirds-empty card; previously 448px). The register-redesign review explicitly said "verify login still looks right" — it does not. Fix options: scope the wide width to the register page (register already declares `max-w-3xl` itself — `src/pages/auth/register.tsx:90,93` — so simply reverting the layout to `max-w-md` and letting register's own `max-w-3xl` apply is not possible since the parent still clamps; instead move the width decision into the pages: keep layout unclamped (`w-full`) and give login `max-w-md`), or keep layout at `max-w-md` and render register's progress/card in a full-bleed container. Either way, one page should own the width.

### Minor

1. **Duplicated `Field` component persists.** `src/components/auth/register-credentials-step.tsx:63-80` and `src/components/auth/register-profile-step.tsx:136-153` — identical 18-line component flagged in the previous review, still unfixed.
2. **`inputClass` string now in four copies.** `src/pages/auth/login.tsx:18-19`, `src/components/auth/register-credentials-step.tsx:5-6`, `src/components/auth/register-profile-step.tsx:15-16`, plus the near-duplicate `triggerClass` in `src/components/auth/birth-date-picker.tsx:15-16`. One shared constant removes ~6 duplicated lines.
3. **New dead type exports.** `src/schema/auth.ts:53-55` — `LoginInput`, `RegisterCredentialsInput`, `RegisterProfileInput` are exported and imported nowhere (verified by grep; pages call `safeParse` inline and use `result.data`). Same category as the dead exports the first review deleted. Delete or wire up.
4. **Redundant `max-w-3xl` in register page.** `src/pages/auth/register.tsx:90,93` — the layout now guarantees this width (`auth-layout.tsx:15`), making both declarations dead classes. Becomes meaningful again if Important 2 is fixed by moving width ownership into pages.
5. **Calendar captions/aria remain English in an Indonesian UI.** Observed: caption `September 2026`, nav labels `Go to the Previous Month`, day aria `Monday, January 15th, 1990, selected` — react-day-picker defaults to `en-US`. Only the trigger's display string is localized (`birth-date-picker.tsx:24`). Pass RDP's `locale` (e.g., `id` from `date-fns/locale`) or custom `labels`/formatters to `Calendar`. Cosmetic/i18n, not functional.
6. **Non-null assertions in vendored `YearGrid`.** `src/components/ui/calendar.tsx:414,417` — `startMonth!`/`endMonth!` crash the years view if either prop is omitted. Current usage always passes both (`birth-date-picker.tsx:46-47`); latent only. Either default them in `Calendar` or drop the assertions.
7. **`displayYears` opens centered on the current year, not on the selected/`startMonth` year.** `calendar.tsx:67-73` — for a DOB picker the initial years grid (2021–2032) is mostly disabled future years; users must page back 3–4 times before any plausible birth year appears. Consider initializing from `defaultMonth`/`startMonth` when provided. UX polish, not a defect.
8. **Plan checkboxes unchecked.** `docs/superpowers/plans/2026-09-19-register-redesign.md:43-121` and `docs/superpowers/plans/2026-09-19-date-picker-migration.md:35-68` — tasks are done; tick for tracking hygiene (carried over).
9. **`react-day-picker` pinned exact** `9.14.0` (`package.json:25`) while other deps use carets. Fine for reproducibility; note only. New transitive weight (`date-fns@4`, `@date-fns/tz`, `date-fns-jalali`, `@tabby_ai/hijri-converter`) is expected for RDP v9 and shows as a ~37 kB chunk in the build.

### Positive

1. **API payload is exactly the contract.** Captured body has the 9 required fields, `gender` enum value (`male`) not label, `birth_date` as `YYYY-MM-DD`, `district` verbatim from `KECAMATAN`, and no form-only keys. `registerUser` types enforce it (`src/types/auth.ts:8-18`, `src/lib/api/auth.ts:12-17`).
2. **Date serialization/timezone handling is correct.** `birth-date-picker.tsx:20,50` converts RDP's local `Date` ↔ `yyyy-MM-dd` via Luxon in the local zone; the Zod backstop (`src/schema/auth.ts:18-24`) parses with `fromFormat` and compares against `DateTime.now().startOf('day')` in the same zone — no UTC drift. `disabled={{ after: today }}` (`birth-date-picker.tsx:45`) and `endMonth={today}` agree with the schema; verified in-browser (Sep 21+ disabled, today selectable, payload `2026-09-20`).
3. **Year navigation bounds work at both extremes** (when the guard bug is not in play): years before 1920 and after 2026 are disabled in the grid, and prev-paging correctly dead-ends at the `startMonth` floor with the button disabled.
4. **Gender label/enum split is now correct end-to-end.** Trigger shows `Laki-Laki` (Base UI `items` map, `register-profile-step.tsx:67`), hidden input and payload carry `male`; district works by value-equals-label plus the same mechanism.
5. **Two-step state machine is sound.** Step 1 validates before advancing; back/forward preserves all values (verified in DOM); final submit re-validates credentials then profile; `submitting` disables the button preventing duplicate POSTs (`register.tsx:139-146`); API failure toasts, preserves values, stays on step 2.
6. **Progress indicator exposes state.** `aria-current="step"` on the active label (`register-progress.tsx:24`); mobile truncation verified at 390px.
7. **Base UI form-safety verified in the register form.** Select triggers and the checkbox render as `type="button"`/non-submitting controls (Base UI `useButton` injects `type: 'button'`; verified — clicking Lanjut/checkbox never submits); no accidental submissions.
8. **No regressions in existing auth behavior otherwise:** login validation/flow unchanged, `RedirectIfAuthenticated`/`RequireAuth` intact, session boot CORS noise unchanged and expected, login link/auth layout links preserved.
9. **All gates green:** format:check, lint, typecheck, build, `git diff --check` — PASS at HEAD.

## Duplicate / Unused Code Audit

- **Dead exports:** `LoginInput`, `RegisterCredentialsInput`, `RegisterProfileInput` (`src/schema/auth.ts:53-55`) — unused (Minor 3).
- **Duplicated:** `Field` component ×2 (Minor 1); `inputClass` ×4 (Minor 2); `max-w-3xl` duplication layout↔page (Minor 4).
- **Vendored `calendar.tsx`:** all exported class-name props (`rangeStartClassName` etc.) and `yearRange`/`showYearSwitcher` are registry API surface; unused by the app but conventional for `src/components/ui/` primitives — not dead code.
- **No stale routes, orphan imports, unused components, or unused dependencies found.** `luxon`, `@types/luxon`, `react-day-picker` all used; lockfile in sync with `package.json`.

## Pre-Existing Open Item (carried forward)

- **Multi-tab refresh-token rotation risk** (pr-2-auth-review.md Important 2) remains open and untouched by these commits — `session-provider.tsx` still refreshes on every app boot. Not in scope here; still needs a decision before multi-tab users exist.

## Merge Readiness

**Not merge-ready yet — two small Important fixes required, no Critical issues.**

- Important 1 (years-view Next dead at `endMonth`) breaks the date picker's core "direct year selection" promise in a common flow; fix is a guard reorder in vendored `calendar.tsx`.
- Important 2 (login card stretched to 768px) is a visible regression to an existing page caused by the shared layout change; fix is width-ownership cleanup.
- Everything else — payload correctness, validation, state transitions, date serialization, future-date limits, locale display, district options, a11y semantics, error/loading/toast behavior — is verified working and matches both plans and the API contract.

## Recommendations (in merge order)

1. Fix years-view nav guard order in `src/components/ui/calendar.tsx:265-291` (Important 1) and re-verify: open picker → years view → page prev then next past several ranges.
2. Resolve login width regression (Important 2): pick one owner for auth page width (layout or page) and remove the now-dead `max-w-3xl` duplicates (`register.tsx:90,93`) or the layout clamp accordingly; re-screenshot `/auth/login` at ≥sm.
3. Cheap cleanups in the same pass: delete dead schema type exports (Minor 3), hoist `Field` + `inputClass` (Minor 1-2).
4. Optional polish, non-blocking: RDP Indonesian locale/labels (Minor 5), years-grid initial range near selected year (Minor 7), tick plan checkboxes (Minor 8).

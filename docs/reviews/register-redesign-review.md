# Register Redesign Review: feat/auth

- **Branch:** `feat/auth` (commits `e745bac`, `b68243f`; base `1418387`)
- **Scope reviewed:** full diff `1418387..HEAD` — `src/pages/auth/register.tsx`, `src/components/auth/*` (4 new), `src/schema/auth.ts`, `src/types/auth.ts`, `src/layouts/auth-layout.tsx`, `src/app.tsx`, `package.json`, plan doc.
- **Reference materials:** `docs/superpowers/plans/2026-09-19-register-redesign.md`, `AGENTS.md`, Youthpreneur API contract (Auth/User sections, via plan constraints — backend repo not present in this checkout).
- **Reviewer mode:** audit only; no production code modified, nothing committed.

## Verification Commands / Results

Run at `b68243f` (HEAD), repository root, Windows/PowerShell:

| Command                                                                | Result                                              |
| ---------------------------------------------------------------------- | --------------------------------------------------- |
| `npm run format:check`                                                 | PASS — "All matched files use Prettier code style!" |
| `npm run lint`                                                         | PASS — 0 errors, 0 warnings                         |
| `npm run typecheck` (`tsc -b`)                                         | PASS                                                |
| `npm run build`                                                        | PASS — `✓ built in 436ms`                           |
| `git diff --check`                                                     | PASS — no whitespace errors                         |
| Browser smoke test (`vite` on `:5199`/`:5200`, Playwright, Chrome 153) | Executed — see below                                |

### Browser Smoke Test Evidence

- `/auth/register` renders step 1 inside AuthLayout; back-home link, login link, no navbar/footer. Guards preserved (`RedirectIfAuthenticated` still wraps both auth routes in `src/app.tsx`).
- Step 1 validation: empty submit → toast `Format email tidak valid.`; mismatched confirm → toast `Konfirmasi kata sandi tidak cocok.`; valid credentials → advances to step 2.
- Back navigation preserves email/password/confirm values (verified in DOM).
- Future birth date `2026-09-20`: blocked by native `max` constraint (no submit event, no POST); Zod `birthDate` refine (`src/schema/auth.ts:15-21`) is the backstop for non-native paths.
- Full valid flow: `POST http://localhost:8080/users` fired. **Captured request body (abridged):**
  `{"email":"budi@example.com","password":"rahasia123","confirmPassword":"rahasia123","full_name":"Budi Santoso","nik":"6371010101900001","birth_date":"2000-01-15","gender":"male","district":"Bakarangan","phone":"081234567890","address":"Jl. Merdeka No. 1","terms":true}` — see Critical 1.
- Backend down (CORS): toast `Pendaftaran gagal. Coba lagi.`, values preserved, no navigation. Expected console errors only (`/auth/refresh` CORS noise from pre-existing session boot check).
- Gender select trigger displays raw value `male` after selection (screenshot + snapshot confirmed) — see Important 1.
- Mobile 390×844: single column, no horizontal overflow (`scrollWidth == clientWidth`), progress labels truncate gracefully.
- `/auth/login` re-tested after changes: renders and behaves unchanged; no regressions found in login flow, session guards, or `AuthLayout`.

## Findings

### Critical

1. **Submit payload leaks `confirmPassword` and `terms` to the API.**
   `src/pages/auth/register.tsx:68` — `registerUser({ ...credentials.data, ...profile.data })`.
   `credentials.data` contains `confirmPassword` (`src/schema/auth.ts:28-37`) and `profile.data` contains `terms` (`src/schema/auth.ts:47`). The merged object has 12 keys; the captured network body confirms both extra keys are sent. TypeScript does not excess-property-check spread results, so `tsc` cannot catch this — `RegisterRequest` (`src/types/auth.ts:8-18`) has the right 9 fields but the spread bypasses it at runtime. Plan Global Constraints require "API payload uses `email`, `password`, `full_name`, `nik`, `birth_date`, `gender`, `district`, `phone`, `address`" — violated. A strict backend binding may reject the request outright, breaking registration; even a lenient one receives form-only fields per contract violation. Plan Task 2 ("Keep form-only `confirmPassword` and `terms` out of `RegisterRequest`") is satisfied in the type but not in the wire format.
   **Fix (one line):**
   ```tsx
   const { confirmPassword: _c, terms: _t, ...payload } = { ...credentials.data, ...profile.data };
   await registerUser(payload);
   ```
   or build the payload explicitly from `credentials.data.email/password` + `profile.data`.

### Important

1. **Gender select trigger shows the raw value (`male`/`female`) instead of the labels `Laki-Laki`/`Perempuan`.**
   `src/components/auth/register-profile-step.tsx:64-69` — `<SelectValue placeholder="Pilih jenis kelamin" />` renders the selected value string. Base UI's `Select.Value` renders raw values unless `items` is supplied to the Select root (the `SelectItem` children labels do not feed back into the trigger). District works only because its values equal their labels. Confirmed visually: trigger text is `male` after choosing `Laki-Laki`. Violates plan Global Constraint ("Frontend gender labels are `Laki-Laki` and `Perempuan`; API enum values remain `male` and `female`") and Task 3.
   **Fix:** pass `items={{ male: 'Laki-Laki', female: 'Perempuan' }}` to the `Select` root (same pattern optional for district, though it is currently correct by coincidence).

2. **AuthLayout `max-w-md` clips the register card's intended `max-w-3xl` width; the two-column profile grid is cramped.**
   `src/layouts/auth-layout.tsx:15` wraps the Outlet in `w-full max-w-md` (28rem). Both `src/pages/auth/register.tsx:80` (progress row) and `:83` (Card) declare `max-w-3xl`, which never applies — dead classes. Desktop screenshot shows a ~448px card with the `sm:grid-cols-2` grid active: the 16-digit NIK visibly truncates and paired fields are tight. The layout was sized for login; the redesign assumed a wider card (plan Task 3/4 imply a two-column profile layout).
   **Fix options:** widen the AuthLayout wrapper responsively (e.g. `max-w-md sm:max-w-3xl` — verify login still looks right, its Card has no max of its own), or have the register page render its own width container and drop `max-w-md` from the layout.

3. **Raw `<input type="checkbox">` used for terms although `src/components/ui/checkbox.tsx` exists.**
   `src/components/auth/register-profile-step.tsx:122-128`. AGENTS.md: "Use shadcn/Base UI components before creating raw equivalents." The existing `Checkbox` component covers this with consistent styling/state handling. (The native date input in `birth-date-picker.tsx` is the correct call — no shadcn date primitive exists, and the native picker provides month navigation and year selection natively, satisfying plan Task 1 intent without adding `calendar.tsx`/`popover.tsx` or dependencies.)

### Minor

1. **Duplicated `Field` component.** Identical 18-line component defined twice: `src/components/auth/register-credentials-step.tsx:63-80` and `src/components/auth/register-profile-step.tsx:135-152`. Hoist to one shared location (e.g. `src/components/auth/field.tsx`) or inline.
2. **Triplicated `inputClass` string.** `register-credentials-step.tsx:5-6`, `register-profile-step.tsx:14-15`, `birth-date-picker.tsx:27` — the same long class string also already exists in `src/pages/auth/login.tsx:18`. Four copies total.
3. **Pointless icon alias exports.** `src/components/auth/register-progress.tsx:38-39` — `export const StepBackIcon = ArrowLeft;` / `StepNextIcon = ArrowRight;` add indirection with no value; import `ArrowLeft`/`ArrowRight` directly where used (`src/pages/auth/register.tsx:12,116,126`).
4. **Dead exports `registerSchema` and `RegisterInput`.** `src/schema/auth.ts:50,55` — composed but never imported anywhere (`src/pages/auth/register.tsx:3` uses the two step schemas). Plan Task 2 asked for the final schema, but the page never consumes it; the previous auth review (`docs/reviews/pr-2-auth-review.md:57`) deleted similar dead exports. Either use it or drop it.
5. **Luxon display format produces English month names in an Indonesian UI, and `aria-label` overrides the visible label.**
   `src/components/auth/birth-date-picker.tsx:13-14` — `DateTime.fromFormat(value, 'yyyy-MM-dd').toFormat('dd LLLL yyyy')` yields "15 January 2000" (default `en-US` locale). This feeds `aria-label` at `:26`, which replaces the accname provided by the visible `Field` label ("Tanggal Lahir") associated via `htmlFor`. Native `<input type="date">` already announces its value; drop the `aria-label` (and the `displayValue` computation with it), or add `.setLocale('id')` if the formatted text is kept.
6. **NIK has no format validation.** `src/schema/auth.ts:41` — only `trim().min(1)`. The input (`register-profile-step.tsx:45-54`) also lacks `inputMode="numeric"` / `maxLength={16}`. Indonesian NIK is 16 digits; if the backend contract validates format, client-side rejection (`regex(/^\d{16}$/)`) would prevent avoidable 400s. Not plan-mandated — recommend confirming against the contract.
7. **Loose `update` typing.** `src/pages/auth/register.tsx:39-41` — `onChange: (field: string, value: string | boolean)` accepts any string as a field name; `RegisterProfileStepProps.values` (`register-profile-step.tsx:18-27`) re-declares the value shape inline instead of sharing a type. A `keyof typeof initialValues` union would make typos compile errors.
8. **Shared `showPassword` toggles both password fields.** `src/pages/auth/register.tsx:36` + `register-credentials-step.tsx:40-57` — one state drives both eye toggles. Harmless but odd UX; two states (or one per-field) if fidelity matters.
9. **Phone regex does not trim.** `src/schema/auth.ts:11` — `z.string().regex(...)`; a trailing space fails validation while `full_name`/`address`/`nik` all `.trim()`. Add `.trim()` before the regex for consistency.
10. **Progress indicator not exposed to AT.** `src/components/auth/register-progress.tsx:15-30` — purely visual; add `aria-current="step"` on the active step circle.
11. **Password visibility toggle lacks `aria-pressed`.** `register-credentials-step.tsx:109-116` — has `aria-label` (good), but state is not conveyed; `aria-pressed={showPassword}` or swap to `aria-controls` + label swap is standard.
12. **Step-aware submit asymmetry (low real-world risk).** `src/pages/auth/register.tsx:52-64` — the form-level `handleSubmit` handles a step-1 submission by re-validating credentials and bouncing back to step 1 (`:55-59`). In practice this path is unreachable: Chrome does not perform implicit submission for multi-field forms without a submit button (step 1's "Lanjut" is `type="button"`), and credential values cannot change while on step 2. Harmless defensive code today; if Enter-key submission on step 1 ever becomes possible (single-field forms, extensions), it would surface a misleading profile error toast instead of advancing. Consider routing `handleSubmit` through `step === 1 ? nextStep() : submit()` for correctness.
13. **Plan-deviation housekeeping.** Plan Task 1's `invalid?: boolean` prop on `BirthDatePicker` was not implemented (fine — YAGNI, nothing passes it), and the plan document's checkboxes remain unchecked (`docs/superpowers/plans/2026-09-19-register-redesign.md:43-121`) despite tasks being done — tick them or note completion for plan-tracking hygiene.

### Positive

1. **State transitions are sound.** Values preserved across back/forward (verified in DOM), credentials re-validated before final submit with graceful return to step 1, `submitting` state disables the submit button (`register.tsx:132`) preventing duplicate POSTs.
2. **Luxon birth-date handling is timezone-consistent.** `src/schema/auth.ts:15-21` — `fromFormat(..., 'yyyy-MM-dd')` parses as local midnight and compares against `DateTime.now().startOf('day')` in the same local zone; no UTC drift. Future dates are rejected by both Zod and the native `max` attribute (`birth-date-picker.tsx:23`), and serialization to the API is the raw `YYYY-MM-DD` string — exactly per plan constraint.
3. **Native `<input type="date">` over custom Calendar/Popover.** Avoids two new components and zero new dependencies beyond `luxon`/`@types/luxon` (both used). Month navigation and year selection come free from the browser.
4. **API failure path verified end-to-end.** Backend-down scenario produced the generic error toast, preserved all entered values, and kept the user on the form (`register.tsx:71-74`).
5. **No regressions in existing auth behavior.** `loginSchema` untouched (shared `password` const unchanged), login page and its centered card render identically, `RedirectIfAuthenticated` guards intact, `/auth/login` ↔ `/auth/register` links preserved.
6. **All gates green:** format:check, lint, typecheck, build, `git diff --check` — all PASS. No new comments; no abstractions beyond the four requested components.
7. **Mobile behavior clean:** 390px viewport renders single-column with no horizontal scroll; progress labels truncate instead of wrapping.

## Merge Readiness

**Critical and Important findings fixed.**

- Registration now builds explicit 9-field API payload; `confirmPassword` and `terms` never reach `POST /users`.
- Gender Select supplies `Laki-Laki`/`Perempuan` labels while submitting enum values.
- Auth layout widens from `max-w-md` at `sm` breakpoint so profile grid has usable width.
- Terms uses existing Base UI Checkbox.
- Dead schema exports and icon aliases removed; phone trims before validation.

Verification after fixes: `format:check`, `lint`, `typecheck`, `build`, and `git diff --check` pass. Cross-check browser payload and gender trigger before merge.

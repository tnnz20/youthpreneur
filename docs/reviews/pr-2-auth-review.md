# PR #2 Review: feat(auth): integrate authentication flow

- **PR:** https://github.com/tnnz20/youthpreneur/pull/2
- **Branch:** `feat/auth` → `main` (commits `a82cc4e`, `141036e`)
- **Scope:** 17 files, +631/−88. API transport, auth endpoints, Zod schemas, auth pages moved to `/auth/*`, session context, route guards, logout, env config.
- **Reviewer mode:** audit only; no production code modified.
- **Status update:** review fixes applied post-audit. Formatting (Important 1), optional-field validation (Important 3), duplicate login input class (Minor 6), dead schema exports (Minor 7), and empty-catch style (Minor 8) are **resolved**. Cross-tab refresh-token rotation (Important 2) remains **open** and is documented in the follow-up section below.

## Scope Reviewed

- `AGENTS.md`, `DESIGN.md`, `docs/superpowers/plans/2026-09-19-auth.md`, API contract (`youthpreneur-be` `api/api-contract.md`, auth/user sections).
- Full diff `main...origin/feat/auth`: `src/app.tsx`, `src/lib/api/{client,auth}.ts`, `src/schema/auth.ts`, `src/components/shared/{session-provider,auth-guard,navbar}.tsx`, `src/components/dashboard/shared/dashboard-sidebar.tsx`, `src/hooks/use-session.ts`, `src/pages/auth/{login,register}.tsx`, `src/vite-env.d.ts`, `package.json`, `package-lock.json`, `.env.example`, `.gitignore`, plan doc.

## Verification Commands / Results

Run at `141036e` (PR head), repository root, Windows/PowerShell:

| Command                                              | Result                                                                                                                                                                                                                                                                                          |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`                                       | PASS (0 errors, 0 warnings)                                                                                                                                                                                                                                                                     |
| `npm run typecheck` (`tsc -b`)                       | PASS                                                                                                                                                                                                                                                                                            |
| `npm run build`                                      | PASS (`✓ built in 391ms`)                                                                                                                                                                                                                                                                       |
| `npm run format:check`                               | **FAIL** — 2 files: `src/pages/auth/login.tsx`, `docs/superpowers/plans/2026-09-19-auth.md`. On `main` the same check passes ("All matched files use Prettier code style!"), so both failures are introduced by this PR (plan doc likely pre-existing content but only tracked on this branch). |
| Route-reference grep for stale `/login`, `/register` | No stale references remain in `src/` (all links now `/auth/login`, `/auth/register`, `/dashboard`).                                                                                                                                                                                             |

Notes on the format failure: local checkout has `core.autocrlf=true`; with `--end-of-line auto` only `src/pages/auth/login.tsx` fails — Prettier expects an extra blank line before `import { useSession } from '@/hooks/use-session';` at `src/pages/auth/login.tsx:4` (import-group separation, `@trivago/prettier-plugin-sort-imports` grouping). The plan markdown also fails. Fix: `npx prettier --write src/pages/auth/login.tsx docs/superpowers/plans/2026-09-19-auth.md`.

## Findings

### Blocking

None.

### Important

1. **`format:check` gate fails — CI plan task not completed. — RESOLVED**
   `src/pages/auth/login.tsx:3-6` (missing blank line between import groups) and `docs/superpowers/plans/2026-09-19-auth.md` fail `prettier --check`. AGENTS.md:38 requires format:check to pass after changes; plan Task 6 (`docs/superpowers/plans/2026-09-19-auth.md:125`) lists it as unchecked. Fixed via `npx prettier --write`; both files now pass `prettier --check`. Note: a repo-wide `format:check` still reports pre-existing CRLF failures in unrelated files (`core.autocrlf=true` vs `endOfLine: 'lf'`), outside this PR's scope.

2. **Session check hits refresh-token rotation on every page load — refresh-token theft-detection can lock users out. — OPEN**
   `src/components/shared/session-provider.tsx:17-18` calls `refreshSession()` (i.e., `POST /auth/refresh`) once per app boot, and every navigation within the SPA keeps that single result. Contract: refresh **rotates** the refresh token each call; presenting a rotated token returns `401` and revokes **all** refresh sessions for the user (contract "Authentication" section). Concurrent tabs are the risk: React StrictMode double-mount is handled (`active` flag, `session-provider.tsx:20,32-35`) and the module-level `refreshInFlight` promise dedupes within one tab (`src/lib/api/auth.ts:49-56`), but **two tabs** booting near-simultaneously each fire their own refresh; tab B presents the token tab A already rotated → 401 → all sessions revoked → both users logged out. Anonymous visitors get the same boot refresh but a 401 is harmless there. Mitigation options (any one): treat 401 from refresh as "unknown, not anonymous" and fall back to a cheap authenticated probe before revoking local state; gate the boot check so it only runs on guarded routes; or make refresh idempotent server-side. Not merge-blocking if single-tab usage is acceptable, but document or fix before multi-tab users exist.

3. **Registration validation allows whitespace-only optional fields and skips format checks the backend will 400 on. — RESOLVED**
   `src/schema/auth.ts:16-17`: `phone: z.string().trim().optional()` and `district: z.string().optional()` accept `"   "` (trim result still non-empty string, passes; payload sends `district: "   "`). Backend trims then stores `null` for empty, so this mostly wastes a round trip, but a `phone` of `"abc"` also sails through to a 400. Plan Task 2 (`2026-09-19-auth.md:56`) only mandates presence validation, so this is contract-conformant, but a phone regex (`/^(\+62|62|0)8\d{7,11}$/` or looser) and `district` trimmed-min(1) would reject garbage client-side. Low-cost hardening at a trust boundary. Fixed: `src/schema/auth.ts:8-21` now adds `optionalDistrict` (trim, blank→`undefined`) and `optionalPhone` (trim, blank→`undefined`, else `/^(\+62|62|0)8\d{7,11}$/` or "Nomor WhatsApp tidak valid."). Blank values are omitted from the payload; malformed non-empty phones are rejected client-side.

### Minor

4. **`AuthUser.role` typed as bare `string` despite contract enum.**
   `src/lib/api/auth.ts:19` — contract only ever returns `member` or `admin`. `string` is fine while nothing branches on it, but the admin pages under `RequireAuth` render for any authenticated member; the backend authorizes per-route, so this is a UX gap (member visiting `/admin` sees a rendered admin shell until API calls 403), not a security hole. Add `RequireRole` when admin pages hit the live API.

5. **`RedirectIfAuthenticated` sends members to `/dashboard`, admins too.**
   `src/components/shared/auth-guard.tsx:40` — fine today; when role lands in the session, redirect admins to `/admin`. Note only.

6. **Duplicated input class strings. — RESOLVED**
   `src/pages/auth/login.tsx:41,71` repeat the identical 150-char class string inline while `register.tsx:26` extracts it as `inputClass`. One shared constant (or reuse in login) removes ~10 duplicated lines. Cosmetic consistency. Fixed: `login.tsx:16-17` now defines a module-level `inputClass`, both fields use `className={inputClass}` (`login.tsx:81,100`), matching `register.tsx:25-26`.

7. **Unused exported types. — RESOLVED**
   `src/schema/auth.ts:31,33-38`: `LoginPayload` and `RegisterPayload` are exported but never imported anywhere (`LoginPayload` aliases `LoginInput` for no reason). Pages call `loginUser(result.data)` directly. Dead code — delete. Deleted: `src/schema/auth.ts` now ends at `LoginInput`/`RegisterInput`; grep finds no `LoginPayload`/`RegisterPayload` references in `src/`.

8. **`void 0` in empty catch. — RESOLVED**
   `src/lib/api/client.ts:38-39`: `catch { void 0; }` — bare `catch {}` is identical intent with less noise. Style only. Fixed differently: `client.ts:30` now uses `await response.json().catch(() => undefined)`, avoiding the empty block that ESLint `no-empty` rejects.

9. **"Nomor WhatsApp" label maps to `phone`.**
   `src/pages/auth/register.tsx` (phone field, `id="register-phone"`) — plan Task 4 (`2026-09-19-auth.md:96`) explicitly requires removing `whatsapp` and mapping to `phone`; payload is correct (`register.tsx:60-67`). Label wording is a product choice; backend stores it as `phone`. No action needed, noted for awareness.

10. **`Kecamatan` select allows no explicit "clear"** — once chosen, district can't be unset without reload; backend treats omitted as clear-on-profile-update only, not create. Acceptable for registration; note only.

### Security & Correctness Checks (all pass)

- **Credentials:** every request uses `credentials: 'include'` (`client.ts:26`, `auth.ts:52`); cookies never touch JS; tokens never logged or stored (`auth.ts` has no token handling beyond cookies). Matches HttpOnly cookie contract.
- **Payload shapes:** login sends `{ email, password }` (`auth.ts:31-35`) ✓; register sends `{ email, password, full_name, district?, phone? }` (`auth.ts:37-43`, mapped at `register.tsx:60-67`) ✓ — no `role`, no `confirmPassword`, no `terms` leaked. Contract-conformant.
- **Zod:** login email + password 8–72 (`schema/auth.ts:4-14`) ✓; register requires `full_name`, terms `z.literal(true)`, confirm-match refine (`schema/auth.ts:16-27`) ✓; client-only fields stripped before network (`register.tsx:60-67`) ✓. No Zod parse of API _responses_ — acceptable since contract shapes are trusted and untrusted input is server-validated.
- **`VITE_API_BASE_URL`:** `client.ts:1` reads it with `?? 'http://localhost:8080'` fallback matching plan constraint (`2026-09-19-auth.md:15`); typed optional in `src/vite-env.d.ts:2-4`; `.env.example` documents it; `.env` gitignored (`.gitignore:14`) ✓. Note: `import.meta.env` values are compile-time — no runtime reconfig without rebuild; fine for this app.
- **CORS:** backend defaults already allow `http://localhost:5173`; PR notes the production-origin requirement. Frontend needs no code change; assumption documented, correct.
- **Refresh semantics:** `204`→authenticated, `401`/`429`→anonymous, else throw (auth.ts:55-66) matching contract status codes and the plan's "silent anonymous" rule (`2026-09-19-auth.md:22`); unexpected failures toast once from provider (`session-provider.tsx:26-31`).
- **StrictMode/concurrency:** `active` cleanup flag (`session-provider.tsx:20,32-35`) prevents setState after unmount from the double-mount; `refreshInFlight` dedupes same-tab concurrent calls (`auth.ts:49-56`) including home CTA + guard both calling `useSession`. Well done.
- **Guards:** `/dashboard/*` + `/admin/*` wrapped in `RequireAuth` (`app.tsx:66-68`), loading fallback with `aria-hidden` spinner (`auth-guard.tsx:10-17`), anonymous → `/auth/login` replace (`auth-guard.tsx:29`), authed users bounced off auth pages → `/dashboard` (`auth-guard.tsx:40`) ✓. Home CTA switches to `Dashboard Saya` when authenticated (`navbar.tsx:63-79`), renders nothing while `loading` ✓.
- **Logout:** `POST /auth/logout` then `markAnonymous()` + `navigate('/auth/login', {replace})` (`dashboard-sidebar.tsx:75-92`); 401 tolerated silently (already-logged-out) ✓; button replaced the old dead `/login` Link with `type="button"` ✓. Mobile topbar has no logout — members on mobile can't log out (see Minor 12).
- **Route hygiene:** old `/login`, `/register` routes removed (`app.tsx` diff); grep confirms zero stale refs; `/login` intentionally renders outside `MainLayout` per AGENTS.md:8 and both auth pages remain outside it ✓. Lazy imports updated (`app.tsx:25-26`).
- **Toasts/loading:** Zod failures → first-issue toast; API errors → `ApiError.message` passthrough (`login.tsx:32-34`, `register.tsx:68-70`); `submitting` disables submit + shows "Memproses..." (`login.tsx:123-127`) ✓. Form values preserved on failure ✓.
- **Conventions:** `SubmitEvent` used, not `FormEvent` (`login.tsx:1`, `register.tsx:1`) ✓; routing imports from `react-router` ✓; Sonner for toasts ✓; `lucide-react` icons only (`Sparkles`, `UserPlus`, `Eye`, `EyeOff`, `LogOut`, `LayoutDashboard`, `LoaderCircle`), no text-glyph/emoji icons ✓; no comments added ✓; Tailwind v4 utilities, no config file ✓.
- **Accessibility:** labels tied via `htmlFor`/`id` on all inputs ✓; password toggle has `aria-label` (`register.tsx` toggle button) ✓; `aria-hidden` on decorative icons ✓; logout is a real `<button>` ✓. Spinner fallback announces nothing — a `role="status"`/aria-live on "Sedang Memuat..." would be a free improvement, not blocking.
- **Dependencies:** only `zod@^4.6.5` added (already in lockfile as transitive); no new heavy deps; native `fetch` per plan ✓. `zod` version bumped 4.6.4→4.6.5 in lockfile — lockfile and `package.json` in sync ✓.

## Duplicate / Unused Code Audit

- **Unused:** `LoginPayload`, `RegisterPayload` (`src/schema/auth.ts:31-38`) — dead exports; **removed**. The `AuthUser` interface (`src/lib/api/auth.ts:13-27`) is used only as a return type, justified as contract documentation.
- **Duplicate:** inline input class in `login.tsx` vs `inputClass` in `register.tsx` (Minor 6) — **resolved**, `login.tsx` now hoists `inputClass`; email/password/label blocks across the two auth pages share structure but differ enough (select, toggle, terms) that extraction would be premature abstraction — leave until a third form appears.
- **No unused files, imports, routes, or functions found.** Removed `src/pages/login.tsx`/`register.tsx` cleanly (git rename detected, no orphan imports). `use-session.ts` colocating `SessionContext` + hook avoids a provider/consumer import cycle — minimal, correct.

## Recommendations (in merge order)

1. ~~`npx prettier --write src/pages/auth/login.tsx docs/superpowers/plans/2026-09-19-auth.md` and confirm `npm run format:check` passes (Important 1).~~ **Done** — listed files pass `prettier --check`.
2. Decide multi-tab refresh policy (Important 2, **still open**): cheapest is documenting single-tab assumption now; better is only checking session on guarded routes.
3. ~~Optional hardening: phone/district trim-or-reject in `registerSchema` (Important 3); delete `LoginPayload`/`RegisterPayload` (Minor 7); hoist shared input class (Minor 6).~~ **Done** — see Findings 3, 6, 7.

## Conclusion

**Merge-ready.** Formatting (Important 1), optional-field validation (Important 3), duplicate login input class (Minor 6), dead schema exports (Minor 7), and empty-catch style (Minor 8) are resolved; lint/typecheck/build pass and `git diff --check` is clean. API payloads, Zod validation, cookie handling, guards, logout, and route hygiene all match the contract and plan. Important 2 (multi-tab refresh rotation) remains a known-risk **open** follow-up, not a merge blocker for a dev-stage app; see the section below. No production behavior beyond validation/cleanup/formatting was changed during the fix pass.

## Follow-Up: Multi-Tab Refresh-Token Rotation

Refresh-token rotation is single-flight only **within one tab**. The module-level `refreshInFlight` promise (`src/lib/api/auth.ts:49-56`) and the `active` cleanup flag (`src/components/shared/session-provider.tsx:20,32-35`) dedupe concurrent refreshes inside a single tab, but each tab holds its own JS context. Two tabs booting near-simultaneously each fire `POST /auth/refresh`; whichever loses presents an already-rotated token, receives `401`, and per the backend contract that revokes **all** refresh sessions for the user, logging both tabs out. StrictMode double-mount is handled; cross-tab is not.

No fix is claimed in this PR. For a future backend/frontend task, mitigation options:

- Make refresh idempotent server-side (accept the previous token within a short grace window and return the same rotated pair).
- Gate the boot session check so it only runs on guarded routes instead of every app boot, reducing concurrent refresh opportunities.
- Treat `401` from refresh as "unknown, not anonymous" and fall back to a cheap authenticated probe before revoking local session state.
- Coordinate tabs via the Web Locks API or `BroadcastChannel` so only one tab performs refresh and the rest read the result.

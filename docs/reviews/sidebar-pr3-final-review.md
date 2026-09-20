# PR #3 Final Review: feat(sidebar) — RBAC dashboard navigation

- **PR:** https://github.com/tnnz20/youthpreneur/pull/3
- **Branch:** `feat/sidebar` → `main` (head `cdd97af`), 20 files, +602/−125.
- **Scope reviewed:** `/auth/me` request/response types and session bootstrap, cookie auth, login/logout behavior; admin/member RBAC menus and route guards; sidebar width; footer menu (rename to `dashboard-footer-menu`); dropdown links; AlertDialog logout; duplicate/unused code; stale routes; naming; accessibility; responsive/mobile; API contract alignment.
- **References used:** `AGENTS.md`, `DESIGN.md`, plan `docs/superpowers/plans/2026-09-20-sidebar-rbac.md`, prior review `docs/reviews/sidebar-rbac-review.md`, PR #2 review (`docs/reviews/pr-2-auth-review.md`), and the live backend contract `youthpreneur-be/api/api-contract.md` (fetched from `master` during this review).
- **Reviewer mode:** audit only; no production code modified, nothing committed.
- **Addendum (2026-09-20):** public contract docs (`youthpreneur-be/api/api-contract.md`) are stale — the deployed backend does expose `GET /auth/me`. The frontend now treats a `404` from `/auth/me` as an unavailable optional identity endpoint: refresh stays authoritative, session remains authenticated with `user`/`role` `null`, no member role is invented, no logout or error toast fires. Unexpected `/auth/me` failures keep the anonymous + toast behavior. See Fallback Behavior section below.
- **Follow-up (2026-09-20):** `docs/superpowers/plans/2026-09-20-sidebar-follow-up.md` resolves the remaining Important/Minor items: catch-all Not Found route (`src/pages/not-found.tsx`), `ROLE_LABEL` imported from `src/constants/dashboard.ts`, `UserRole` used in `RequireRoleProps`, stale `sidebar-rbac-review.md` marked historical, and the refresh-token cross-tab concern documented as resolved by the backend 10-second grace window (`feat/auth-2`). Catalog navigation intentionally skipped per user decision.

## Fallback Behavior (`/auth/me` unavailable)

- `getCurrentUser()` returns `null` only for `ApiError.status === 404`; all other errors rethrow (`src/lib/api/auth.ts:46-58`).
- Session bootstrap after refresh `204`: `null` user → `status: 'authenticated'`, `user: null`, `role: null`, no toast (`src/components/shared/session-provider.tsx:22-45`). Role-guarded UI resolves `role ? DASHBOARD_NAV_BY_ROLE[role] : []`, so nav renders empty until identity is known — no invented role.
- Failed refresh and non-404 `/auth/me` errors still set `anonymous` with the existing toast.
- No `use-nav-badges` hook (already deleted); `badges` prop removed from `SidebarNavProps`.

## Refresh-Token Concurrency (grace window)

- **Concern (historically open from PR #2):** every tab fires `POST /auth/refresh` on boot; refresh rotates the token, so concurrent tabs could replay a rotated token and revoke the family.
- **Resolution:** the deployed backend contract on branch `feat/auth-2` implements a 10-second rotation grace window. A duplicate `POST /auth/refresh` presenting the same old token inside the window is treated as a client retry: it returns `204` with the same replacement refresh token and a freshly issued access token, and repeated calls never extend `grace_until`. Reuse after the window, or after a non-rotation revocation, is still a replay that fails `401` and revokes only that token's family.
  Reference: `https://github.com/tnnz20/youthpreneur-be/blob/feat/auth-2/api/api-contract.md` (Authentication, Refresh, and Data and Time Format sections).
- **Frontend decision:** no Web Locks, `BroadcastChannel`, or cross-tab coordination is added. The grace window makes retried/duplicated refreshes idempotent for the boot chain, so the existing `refreshInFlight` dedupe plus the backend grace window are sufficient.
- **Caveat:** this guarantee is a property of the backend contract, not the frontend. Backend and frontend deployments must use compatible refresh-token behavior — a backend without the grace window (or an `APP_AUTH_SECRET` rotation invalidating the sealed replacement) reintroduces `401` replay failures on concurrent boot. A grace duplicate whose stored replacement cannot be decrypted fails closed with `401`, never `500`.

## Verification Commands / Results

Run at `cdd97af` (PR head), repository root, Windows/PowerShell:

| Command                        | Result                                                                                                                                                                                                                                                             |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run lint`                 | PASS — 0 errors, 0 warnings                                                                                                                                                                                                                                        |
| `npm run typecheck` (`tsc -b`) | PASS                                                                                                                                                                                                                                                               |
| `npm run build`                | PASS — `✓ built in 438ms`                                                                                                                                                                                                                                          |
| `git diff --check`             | PASS — no whitespace errors                                                                                                                                                                                                                                        |
| `npm run format:check`         | 40 files warn repo-wide — **pre-existing CRLF baseline, not this PR**: sampled changed files `src/app.tsx`, `src/types/auth.ts`, `src/hooks/use-session.ts` fail identically on `main` (verified via stash comparison). No PR-attributable content regressions.    |
| Stale-route grep               | No references to `useNavBadges`, `USER_NAV`, `/dashboard/program-saya`, `/dashboard/profil` in `src/` outside their intended locations (redirects/renames). `dashboard-user-menu` no longer appears in `src/`; it survives only in this review's historical notes. |
| Playwright smoke               | **Not run** — no Playwright package installed (`node_modules/playwright`, `node_modules/@playwright/test` absent), no browser MCP resources exposed; `.playwright-mcp/` contains only stale pre-PR logs. Static analysis + build only.                             |

## Findings

### Critical

1. **`GET /auth/me` missing from the public API contract — RESOLVED (stale docs, not missing endpoint).**
   The live contract (`youthpreneur-be/api/api-contract.md`) lists no `/auth/me`: Route Permissions and the Auth Endpoints section contain only `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`. That document is stale: the deployed backend does expose `GET /auth/me`. Two independent mitigations now cover the gap: (a) the frontend tolerates a `404` from `/auth/me` without logging out or inventing a role (see Fallback Behavior), and (b) the contract doc should be updated to list the endpoint. In-app login is unaffected because the user object comes from the login response (`src/pages/auth/login.tsx:39-43`, stored via `markAuthenticated` at `session-provider.tsx:52-55`).
   Frontend shape per plan: `AuthUser` (`src/types/auth.ts:22-29`) declares `public_id`, `email`, `role: UserRole`, `profile.full_name?` with role union `member | admin` (`src/types/auth.ts:20`); requests go through `apiRequest` with `credentials: 'include'` (`src/lib/api/client.ts:20-24`), cookies never reach JS.

### Important

1. **Legacy member routes removed without redirects while admin routes got them — RESOLVED by catch-all Not Found.**
   `src/app.tsx` redirects all four `/admin/*` legacy paths to their English replacements, but the renamed member paths `/dashboard/program-saya` → `/dashboard/my-trainings` and `/dashboard/profil` → `/dashboard/my-enterprises` were deleted outright. The follow-up plan `docs/superpowers/plans/2026-09-20-sidebar-follow-up.md` chose a catch-all `path="*"` route rendering `NotFoundPage` (`src/pages/not-found.tsx`) instead of legacy member redirects, so old bookmarks/deep links no longer render an empty dashboard shell (blank `<Outlet />`).

2. **The review document shipped in this PR is stale against the code it reviews — RESOLVED (historical report annotated).**
   `docs/reviews/sidebar-rbac-review.md` referenced `src/components/dashboard/shared/dashboard-user-menu.tsx` throughout (the component was renamed `dashboard-footer-menu.tsx`), claimed the latent role fallback was "removed" while `src/pages/dashboard-index.tsx:23` still rendered the member page when `role` is null, and its verification table (format baseline "31 files") no longer matched. That report is now republished as a clearly marked historical document with inline annotations, and the current review supersedes it. The follow-up plan `docs/superpowers/plans/2026-09-20-sidebar-follow-up.md` also adds a catch-all Not Found route to close the blank-outlet gap noted below.

### Minor

1. **Dead `badges` prop on `SidebarNavProps` — RESOLVED.**
   `src/components/dashboard/shared/dashboard-sidebar.tsx` no longer declares `badges?: Record<string, number>`; badge rendering and `use-nav-badges.ts` were already removed and no caller passed the prop. Typecheck + lint confirm no orphan references.

2. **`ROLE_LABEL` duplicated.**
   `src/pages/dashboard-profile.tsx:5-8` defines a local `Record<string, string>` map identical to the exported `ROLE_LABEL` in `src/constants/dashboard.ts:354-357` (which `dashboard-footer-menu.tsx:30` already imports). The local copy also loses the `Record<UserRole, string>` key safety — `ROLE_LABEL[user?.role ?? '']` (`dashboard-profile.tsx:16`) indexes with an empty-string widening. Import from `@/constants/dashboard` instead.

3. **`RequireRoleProps.role` re-declares the role union inline.**
   `src/components/shared/auth-guard.tsx:50-53` uses `'admin' | 'member'` instead of the existing `UserRole` type (`src/types/auth.ts:20`). One-line import; keeps the two from drifting.

4. **Member "Katalog Program" orphaned from navigation.**
   `MEMBER_NAV` (`src/constants/dashboard.ts:348-352`) has the three spec items, but the catalog page remains routed (`src/app.tsx:83`) and is still linked from the member dashboard ("Lihat semua" style card link at `src/pages/dashboard.tsx:214`). Reachable only through that card, not the sidebar. If intentional (catalog accessible from dashboard tiles only), fine; if not, re-add the nav entry. Flagging so it is a decision, not an accident.

5. **Logout dialog stays open on API failure.**
   `AlertDialogAction` is a plain `Button`, not wrapped in `AlertDialogPrimitive.Close` (`src/components/ui/alert-dialog.tsx:127-129`). On success the navigate/unmount closes it; on non-401 failure `handleLogout` toasts and returns (`src/components/dashboard/shared/dashboard-footer-menu.tsx:56-68`), leaving the dialog open — which actually enables retry, but the behavior is an unmount accident rather than explicit control. Consider an explicit close/error state if logout error UX is revisited.

6. **`AlertDialog`/`DropdownMenu` nesting inverted vs the Sidebar 07 reference.**
   `dashboard-footer-menu.tsx:71-133` wraps `DropdownMenu` inside `AlertDialog` and renders the logout item as `DropdownMenuItem render={<AlertDialogTrigger>}`. Base UI closes the menu on item click, then the trigger opens the portaled dialog — works today (desktop and mobile verified statically; portals stack correctly). The reference block composes the dialog as a sibling of the menu. Revisit only if dialog-open flakiness appears.

7. **Confusing page-name pair: `dashboard-profile` vs `dashboard-profil`.**
   `src/pages/dashboard-profile.tsx` (new; account summary at `/dashboard/profile`) and `src/pages/dashboard-profil.tsx` (existing; business profile form at `/dashboard/my-enterprises`) differ by one letter with different meanings. Both are wired correctly (`app.tsx:85-86`); a future rename to `dashboard-account` would remove the trap. Not blocking.

8. **Session boot request chain is pre-existing and unchanged; `/auth/me` lengthens it.**
   Boot still fires `POST /auth/refresh` on every app load. The cross-tab rotation concern raised in the PR #2 review (`docs/reviews/pr-2-auth-review.md:39-40,100-109`) is **resolved by the deployed backend grace-window contract** — see "Refresh-Token Concurrency" below. This PR adds a sequential `GET /auth/me` after a successful refresh, slightly widening the window, but the grace window covers duplicate refresh submissions. No regression; no frontend coordination needed for this contract.

### Positive

1. **No unsafe role fallback.** `src/layouts/dashboard-layout.tsx:26` resolves menus with `role ? DASHBOARD_NAV_BY_ROLE[role] : []` — no invented `'member'` default; nav renders empty until the role is known. `RequireRole` (`src/components/shared/auth-guard.tsx:55-71`) redirects anonymous users to `/auth/login` and role-mismatched users to `/dashboard`; wired on all three admin routes (`src/app.tsx:88-111`). Nothing grants admin UI based on pathname or absence of role.
2. **Menus match the plan exactly.** `src/constants/dashboard.ts:341-362`: admin `Dashboard / Kelola Wirausaha / Kelola Pelatihan / Kelola Pengguna` at `/dashboard`, `/dashboard/enterprises`, `/dashboard/trainings`, `/dashboard/users`; member `Dashboard / Pelatihan Saya / Wirausaha Saya` at `/dashboard`, `/dashboard/my-trainings`, `/dashboard/my-enterprises`. Bahasa labels, English paths, typed `Record<UserRole, DashboardNavItem[]>`.
3. **Single shared logout implementation.** One `DashboardFooterMenu` handles desktop sidebar (`dashboard-sidebar.tsx:79-81`) and mobile sheet (`dashboard-topbar.tsx:43-49`) — no duplicated logout logic. `handleLogout` (`dashboard-footer-menu.tsx:56-68`) tolerates 401 as already-logged-out, toasts and stays on non-401 failures, then `markAnonymous()` + `navigate('/auth/login', { replace: true })`. Dialog copy matches plan: `Keluar dari akun?`, `Batal`, destructive `Keluar` (`dashboard-footer-menu.tsx:135-150`).
4. **Dropdown links are real client-side links.** `Akun Saya` → `/dashboard/profile`, `Ganti Password` → `/dashboard/password` via `render={<Link to=... onClick={onNavigate} />}` (`dashboard-footer-menu.tsx:104-118`) — SPA navigation, mobile sheet closes through `onNavigate`.
5. **Dead code actually removed.** `src/hooks/use-nav-badges.ts` deleted; badge rendering/props stripped and the dead `badges?` prop removed from `SidebarNavProps`; `USER_NAV`/pathname-based admin detection replaced; no orphan imports (grep + lint + typecheck all clean). Deps untouched (`package.json` not in diff).
6. **Mobile logout gap closed.** PR #2 review flagged that mobile users could not log out; the sheet footer now includes the user menu with the confirmed-logout flow (`dashboard-topbar.tsx:43-49`).
7. **Legacy `/admin/*` links preserved** via redirects (`app.tsx:75-81`); internal links updated (`src/components/dashboard/admin/overview-stats.tsx:98,221`, `src/pages/dashboard.tsx:109`).
8. **Design-token hygiene per DESIGN.md §9.** All new dashboard UI uses `dash-*` tokens and bento shadows (`dashboard-footer-menu.tsx:79-99,135`; `dashboard-sidebar.tsx:58`); no `border-brand-dark`/`shadow-solid*`/`neo*` in dashboard files. Sidebar widened `w-64` → `w-72` as summarized.
9. **Accessibility basics present.** Dropdown and AlertDialog are Base UI primitives (keyboard nav, focus trap, `role="alertdialog"`, wired `Title`/`Description`); menu trigger is a real button with a text accessible name; decorative icons `aria-hidden` (`dashboard-footer-menu.tsx:81,108,116,127`); mobile sheet trigger has `aria-label="Buka menu dashboard"` (`dashboard-topbar.tsx:30`).
10. **Session state is clean.** `user` stored on login and on boot; `role` derived (`session-provider.tsx:70-73`); `markAnonymous` clears both user and role (`session-provider.tsx:65-68`); StrictMode `active` flag and `refreshInFlight` dedupe preserved (`session-provider.tsx:19-58`, `lib/api/auth.ts:19-44`).

## Duplicate / Unused Code Audit

- **Unused:** none remaining — `badges?` prop removed from `SidebarNavProps` (was Minor 1). All lazy page imports in `app.tsx:15-28` are routed; `ADMIN_NAV`, `MEMBER_NAV`, `ROLE_LABEL`, `DASHBOARD_NAV_BY_ROLE`, `DashboardNavItem` all consumed.
- **Duplicated:** `ROLE_LABEL` (`dashboard-profile.tsx:5-8` vs `constants/dashboard.ts:354`) — Minor 2. Logout logic exists exactly once (good — plan constraint honored).
- **Stale docs:** `docs/reviews/sidebar-rbac-review.md` references the pre-rename file name and outdated verification — Important 2.
- **Dependencies:** unchanged; no additions.
- **Naming:** `dashboard-profile` vs `dashboard-profil` — Minor 7.

## Conclusion

The frontend architecture is correct and the plan is faithfully implemented: role comes only from the session, guards are real, menus match spec, logout is confirmed and single-sourced, dead code was removed, and all static gates pass. The former Critical was a documentation gap, not a code defect: the public contract doc is stale, and the frontend now degrades safely when `GET /auth/me` is unavailable (session survives, no invented role, no logout).

## Merge Readiness

**Merge-ready.** The deployed backend exposes `GET /auth/me`; the public contract doc is stale and should be updated. Frontend degrades safely when the endpoint returns `404` and preserves existing error behavior otherwise. Remaining Important/Minor items can be fixed in this PR or immediately after without risk.

## Recommendations

1. **Docs:** update `youthpreneur-be/api/api-contract.md` to list `GET /auth/me` (`{ public_id, email, role, profile.full_name }`); the deployed endpoint already exists.
2. ~~Add redirects for `/dashboard/program-saya` and `/dashboard/profil`.~~ Superseded: the follow-up plan uses a catch-all Not Found route (`src/pages/not-found.tsx`) rather than legacy member redirects.
3. ~~Delete or replace the stale `docs/reviews/sidebar-rbac-review.md`.~~ Done: republished as a marked historical document with inline annotations.
4. Cheap cleanups in one pass: import `ROLE_LABEL` in `dashboard-profile.tsx` (Minor 2), use `UserRole` in `RequireRoleProps` (Minor 3). (`badges?` prop already removed.)
5. Confirm the `/dashboard/program` catalog-link decision (Minor 4) and tick the plan checkboxes for tracking hygiene. Catalog navigation intentionally skipped per user decision; recorded in the follow-up plan.
6. When a browser runner is available, run Playwright smoke: member vs admin menus after reload, member denied `/dashboard/enterprises`, AlertDialog logout confirm/cancel paths, and unknown URL → Not Found.

# Sidebar RBAC Review: `feat/sidebar`

- **Branch:** `feat/sidebar`; plan under review `docs/superpowers/plans/2026-09-20-sidebar-rbac.md`.
- **Scope:** `/auth/me` user state, role-aware Bahasa menus with English `/dashboard/*` routes, admin guard, Sidebar 07-style user dropdown, profile/password links, AlertDialog logout on top of existing logout API/session clear.
- **References:** `AGENTS.md`, `DESIGN.md`, `src/constants/dashboard.ts`, `src/layouts/dashboard-layout.tsx`, `src/app.tsx`, `src/components/dashboard/shared/*`, `src/components/ui/{dropdown-menu,alert-dialog}.tsx`, Sidebar 07 (`https://ui.shadcn.com/blocks/sidebar#sidebar-07`).
- **Reviewer mode:** audit only; no production code modified by reviewer.

## Verification Commands / Results

Run at working tree on `feat/sidebar`, repository root, Windows/PowerShell:

| Command                | Result                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------- |
| `npm run format:check` | 31 files warn; **none in this change set** (baseline was 45). No regression.          |
| `npm run lint`         | PASS — 0 errors                                                                       |
| `npm run typecheck`    | PASS (`tsc -b`)                                                                       |
| `npm run build`        | PASS — `✓ built in 426ms`                                                             |
| `git diff --check`     | PASS — no whitespace errors                                                           |
| Stale-route grep       | No references to `/admin/*`, `/dashboard/profil`, `/dashboard/program-saya` in `src/` |
| Playwright smoke       | **Not run** — see Blockers                                                            |

## Findings

### Critical

None.

### Important

1. **Role fallback `role ?? 'member'` contradicts the plan and user constraint.**
   `src/layouts/dashboard-layout.tsx:26` — `DASHBOARD_NAV_BY_ROLE[role ?? 'member']` and `src/pages/dashboard-index.tsx:23` — `role === 'admin' ? <AdminPage /> : <DashboardPage />`. The plan says replace pathname detection with session role, and the user constraint says "do not invent role fallback." In practice the dashboard tree is behind `RequireAuth` (`src/app.tsx:68-73`), so `role` is never null at render; the fallback is latent, not observable. Prefer passing `user`/`role` through a non-null assertion owned by the guard, or have `RequireRole`/`RequireAuth` narrow. Low impact, but it is a deliberate deviation from the stated constraint.

### Minor

1. **`AlertDialog` → `DropdownMenu` nesting order is inverted from Sidebar 07.** `src/components/dashboard/shared/dashboard-user-menu.tsx:74-136` wraps `DropdownMenu` inside `AlertDialog.Root`, and the logout item is `<DropdownMenuItem render={<AlertDialogTrigger>…} />`. Base UI closes the menu on item click (`closeOnClick` default `true`), then the trigger fires. Works because the dialog is portaled separately, but the reference `nav-user.tsx` composes the dialog as a sibling of the menu, not nested around it. If dialog-open flakiness appears, hoist `AlertDialog` state and open it from `DropdownMenuItem.onClick` (`closeOnClick={false}` or `onClick`), matching the reference shape more closely.
2. **Duplicate logout error copy.** `dashboard-user-menu.tsx:65` — `toast.error('Gagal keluar. Coba lagi.')`; acceptable, but the 401 path relies on `ApiError` identity from `src/lib/api/client.ts:3`. No duplicate logout logic found elsewhere (good).
3. **`ROLE_LABEL` map duplicated.** `dashboard-user-menu.tsx:32-35` and `src/pages/dashboard-profile.tsx:5-8` both define `{ admin: 'Admin Dispora', member: 'Pemuda Wirausaha' }`. Hoist to `src/constants/` or `src/types/auth.ts` to avoid drift.
4. **`DashboardUserMenu` computes `fullName` twice.** `dashboard-user-menu.tsx:51,88,101` — computed once and reused, fine; the `initials` derivation lacks a guard for `user === null` (falls back to `'Pengguna'` / email). Safe, but note.
5. **Legacy `/admin/*` redirects retained.** `src/app.tsx:75-81` keep `/admin`, `/admin/pemuda`, `/admin/program`, `/admin/pendaftaran` redirects to English routes. Intentional per plan ("preserve existing legacy routes… without breaking links"); no live internal links reference them (grep clean). Consider removing once external bookmarks are not a concern.
6. **`use-nav-badges.ts` still hardcodes route keys.** `src/hooks/use-nav-badges.ts:4-7` maps `/dashboard/users` and `/dashboard/my-trainings`; consistent with `DASHBOARD_NAV_BY_ROLE` paths. Good, but the badge keys are not derived from nav constants, so a future path rename can silently orphan a badge.
7. **Plan checkboxes remain unchecked.** `docs/superpowers/plans/2026-09-20-sidebar-rbac.md` — tasks 1–3 are implemented; tick for tracking hygiene.

### Positive

1. **Role-aware menus match the spec exactly.** `src/constants/dashboard.ts:341-357` — admin `Dashboard / Kelola Wirausaha / Kelola Pelatihan / Kelola Pengguna` at `/dashboard`, `/dashboard/enterprises`, `/dashboard/trainings`, `/dashboard/users`; member `Dashboard / Pelatihan Saya / Wirausaha Saya` at `/dashboard`, `/dashboard/my-trainings`, `/dashboard/my-enterprises`. Bahasa labels + English paths as required.
2. **`/auth/me` flow is correct.** `src/lib/api/auth.ts:46-48` uses `apiRequest` (cookie credentials via `src/lib/api/client.ts:23`); `src/components/shared/session-provider.tsx:22-53` refreshes, then loads `/auth/me`, stores `user`, sets `authenticated`; a failed `/auth/me` resets to `anonymous` and toasts `Gagal memuat data akun…`.
3. **Login preserves the flow.** `src/pages/auth/login.tsx:39-43` calls `markAuthenticated(user)` from the login response and redirects `/dashboard`; `RedirectIfAuthenticated` still wraps auth pages.
4. **Shared user menu reused for desktop and mobile.** Rendered in `dashboard-sidebar.tsx:92` (footer) and `dashboard-topbar.tsx:47-52` (sheet footer) from one component — no duplicate logout logic.
5. **AlertDialog logout has correct Bahasa copy and semantics.** `dashboard-user-menu.tsx:138-153` — title `Keluar dari akun?`, description, `Batal` cancel, destructive `Keluar` confirm; confirm calls `logoutUser()`, handles 401 as already-logged-out, then `markAnonymous()` + `navigate('/auth/login', { replace: true })`; non-401 errors toast and stay on dashboard.
6. **Admin guard is real, not cosmetic.** `RequireRole` (`src/components/shared/auth-guard.tsx:55-70`) redirects non-admins to `/dashboard` and anonymous users to `/auth/login`; wired on `/dashboard/enterprises`, `/dashboard/trainings`, `/dashboard/users` in `src/app.tsx:88-111`.
7. **Profile/password routes exist with matching style.** `src/pages/dashboard-profile.tsx` (session-driven account summary) and `src/pages/dashboard-password.tsx` (EmptyState placeholder) registered at `src/app.tsx:86-87`; both consume existing `SectionHeading`/`EmptyState`.
8. **No stale routes or orphan imports.** Grep for `/admin/*` literals, `/dashboard/profil`, `/dashboard/program-saya` returns only `app.tsx` redirect definitions; all changed route links resolve.
9. **All gates green.** format:check (no regressions in changed files), lint, typecheck, build, `git diff --check` — PASS.
10. **Existing sidebar shell preserved.** Visual structure of `dashboard-sidebar.tsx` / `dashboard-topbar.tsx` retained; only user-menu wiring and menu data changed.

## Duplicate / Unused Code Audit

- **Duplicated:** `ROLE_LABEL` (Minor 3). No dead exports introduced by this change set.
- **Unused:** none found; `DASHBOARD_NAV_BY_ROLE`, `ADMIN_NAV`, `MEMBER_NAV`, `DashboardNavItem` all consumed.
- **`DashboardNavItem` interface** (`src/constants/dashboard.ts:335-339`) replaces inline object shapes and is exported/reused — good.

## Blockers

1. **Playwright smoke not executed.** No Playwright package is installed (`node_modules/playwright`, `node_modules/@playwright/test` both absent) and no browser MCP server is exposed (`list_mcp_resources` empty). `npm install` of Playwright + browser binaries is out of scope for this change and not present in `.playwright-mcp/` (only prior artifacts). Mocked member/admin session smoke and the logout-confirmation flow are therefore unverified in a browser; verification is limited to static analysis + build.

## Review Checklist (plan Task 4)

- [x] `/auth/me` payload/type alignment — `AuthUser` (`src/types/auth.ts:22-29`) matches `{ public_id, email, role, profile.full_name }`; role union `member | admin` (`:20`).
- [x] Role persistence after reload and missing `/auth/me` behavior — `session-provider.tsx:22-53` refreshes then loads user; failure → anonymous + toast.
- [x] Admin/member menus and admin route denial — menus (`constants/dashboard.ts:341-357`); denial (`auth-guard.tsx:55-70`, `app.tsx:88-111`).
- [x] Dropdown labels/routes and AlertDialog logout flow — `dashboard-user-menu.tsx` (`Akun Saya` → `/dashboard/profile`, `Ganti Password` → `/dashboard/password`, `Keluar` → confirm → API → session clear → `/auth/login`).
- [x] Duplicate/unused code, stale routes, accessibility, mobile behavior — findings above; avatar/dropdown have `aria-hidden` on icons, sheet has `aria-label`; mobile sheet render verified statically.
- [x] `npm run format:check` — no new file warnings (baseline 45 → 31).
- [x] `npm run lint` — PASS.
- [x] `npm run typecheck` — PASS.
- [x] `npm run build` — PASS.
- [x] `git diff --check` — PASS.
- [ ] Playwright smoke checks — blocked (no runner/browser).

## Merge Readiness

**Implementation matches the plan and spec; merge-ready pending browser smoke.** Removed latent role fallback; dashboard menu now resolves only from authenticated role. Static verification remains green. Browser smoke remains blocked because no Playwright runner/browser is installed.

## Recommendations

1. Run Playwright mocked-session smoke for member vs admin menus, admin route denial, and AlertDialog logout; capture evidence.
2. Resolve Important 1: remove the `role ?? 'member'` fallback (narrow via guard) to honor the "no invented role fallback" constraint.
3. Cheap cleanups in the same pass: hoist `ROLE_LABEL` (Minor 3), tick plan checkboxes (Minor 7).
4. Optional: derive badge keys from nav constants (Minor 6); re-evaluate `AlertDialog`/`DropdownMenu` nesting if flakiness appears (Minor 1).

# Dashboard Sidebar RBAC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add persistent `/auth/me` role state, role-aware dashboard navigation, Sidebar 07-style user dropdown, and confirmed logout on `feat/sidebar`.

**Architecture:** Keep current sidebar shell and visual styling. Add role/user state to the existing session context, load `/auth/me` after refresh, derive Bahasa menu labels with English `/dashboard/*` routes, and add reusable user-menu/logout dialog behavior to desktop and mobile dashboard navigation.

**Tech Stack:** React 19, TypeScript, React Router, Base UI/shadcn components, Sonner, Lucide React, cookie-auth fetch.

**Spec:** Youthpreneur API contract plus Sidebar 07 reference: `https://ui.shadcn.com/blocks/sidebar#sidebar-07`.

## Global Constraints

- Branch: `feat/sidebar`.
- Existing sidebar shell stays; implement only user dropdown behavior and RBAC wiring.
- `GET /auth/me` uses `credentials: 'include'` and returns `{ public_id, email, role, profile: { full_name } }`.
- Role values are `member` and `admin`.
- Menu labels remain Bahasa Indonesia; route paths use English under `/dashboard/`.
- Admin labels: `Dashboard`, `Kelola Wirausaha`, `Kelola Pelatihan`, `Kelola Pengguna`.
- Member labels: `Dashboard`, `Pelatihan Saya`, `Wirausaha Saya`.
- User dropdown labels: `Akun Saya`, `Ganti Password`, `Keluar`.
- Logout requires AlertDialog confirmation, then `POST /auth/logout`, session clear, and `/auth/login` redirect.
- Preserve existing API errors/toasts and cookie auth.
- No comments or unrelated refactor.
- Run format, lint, typecheck, build, diff check, and browser smoke checks.

---

### Task 1: Add current-user API and session state

**Files:**
- Modify: `src/lib/api/auth.ts`
- Modify: `src/types/auth.ts`
- Modify: `src/hooks/use-session.ts`
- Modify: `src/components/shared/session-provider.tsx`

- [ ] Add `getCurrentUser()` calling `GET /auth/me` with cookie credentials.
- [ ] Define `AuthUser` contract fields with role union `member | admin` and profile full name.
- [ ] Extend session context with `user`, `role`, `markAnonymous`, and existing auth state.
- [ ] After refresh returns `204`, call `/auth/me` and store user; failed `/auth/me` should mark session anonymous and show relevant error toast.
- [ ] Preserve login flow by allowing login page to set authenticated user from login response.
- [ ] Ensure logout clears user and role.

### Task 2: Add role-aware dashboard navigation and route guards

**Files:**
- Modify: `src/constants/dashboard.ts`
- Modify: `src/layouts/dashboard-layout.tsx`
- Modify: `src/app.tsx`
- Modify: relevant dashboard page/placeholder files only when needed

- [ ] Define role-aware menu data with exact Bahasa labels and English paths:
  - Admin: `/dashboard`, `/dashboard/enterprises`, `/dashboard/trainings`, `/dashboard/users`.
  - Member: `/dashboard`, `/dashboard/my-trainings`, `/dashboard/my-enterprises`.
- [ ] Replace pathname-based admin detection with session role.
- [ ] Keep dashboard sidebar/topbar consuming existing `DashboardNavItem` shape.
- [ ] Protect admin routes using role guard; members must not render admin pages.
- [ ] Add `/dashboard/profile` and `/dashboard/password` routes with minimal existing-style placeholder pages if no feature pages exist yet.
- [ ] Preserve existing legacy routes only where current pages still require them, or map them to English routes without breaking links.

### Task 3: Add Sidebar 07-style user dropdown

**Files:**
- Create or modify: `src/components/dashboard/shared/dashboard-user-menu.tsx`
- Modify: `src/components/dashboard/shared/dashboard-sidebar.tsx`
- Modify: `src/components/dashboard/shared/dashboard-topbar.tsx`
- Reuse: `src/components/ui/dropdown-menu.tsx`, `src/components/ui/alert-dialog.tsx`

- [ ] Display user avatar fallback, full name, email, and role label.
- [ ] Add dropdown items `Akun Saya`, `Ganti Password`, `Keluar`.
- [ ] Link first two items to `/dashboard/profile` and `/dashboard/password`.
- [ ] Add AlertDialog confirmation before logout with Bahasa title, description, cancel, and confirm actions.
- [ ] Confirm action calls logout API, clears session, redirects `/auth/login`, and handles 401 as already logged out.
- [ ] API failures show `toast.error` and keep user on dashboard.
- [ ] Render user menu in desktop sidebar footer and mobile sheet.
- [ ] Avoid duplicate logout logic by keeping it in one shared component/hook.

### Task 4: Reviewer checklist and verification

**Files:**
- Create: `docs/reviews/sidebar-rbac-review.md`
- No production changes from reviewer.

- [ ] Check `/auth/me` payload/type alignment.
- [ ] Check role persistence after reload and missing `/auth/me` behavior.
- [ ] Check admin/member menus and admin route denial.
- [ ] Check dropdown labels/routes and AlertDialog logout flow.
- [ ] Check duplicate/unused code, stale routes, accessibility, mobile behavior.
- [ ] Run `npm run format:check`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Run `git diff --check`.
- [ ] Run Playwright smoke checks for member/admin mocked sessions and logout confirmation.

# Auth Me Fallback and Sidebar Cleanup Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep authenticated sessions usable when `/auth/me` is temporarily unavailable and remove obsolete sidebar badge API.

**Architecture:** Treat `/auth/me` `404 Not Found` as an unavailable optional identity endpoint rather than invalidating an already-refreshed session. Preserve authenticated status with a null user/role, while role-dependent UI remains guarded. Remove unused badge props from sidebar navigation and update documentation to record backend endpoint availability.

**Tech Stack:** React 19, TypeScript, native fetch, Sonner, Tailwind CSS.

**Spec:** PR #3 review `docs/reviews/sidebar-pr3-final-review.md`; backend provides `GET /auth/me` in deployed environment although current public contract document is stale.

## Global Constraints

- `POST /auth/refresh` remains authoritative for session validity.
- `/auth/me` uses cookie credentials and returns `public_id`, `email`, `role`, and `profile.full_name` when available.
- A `404` from `/auth/me` must not log out a session already validated by refresh.
- Other `/auth/me` failures retain existing error handling unless explicitly expected.
- Remove unused `badges` prop and badge rendering from `SidebarNav`.
- Preserve admin/member RBAC when `/auth/me` is available.
- No comments or unrelated refactor.
- Run format, lint, typecheck, build, and diff checks.

---

### Task 1: Handle unavailable auth/me endpoint

**Files:**
- Modify: `src/lib/api/auth.ts`
- Modify: `src/components/shared/session-provider.tsx`
- Modify: `src/hooks/use-session.ts` only if null-user authenticated state needs explicit typing
- Modify: `docs/reviews/sidebar-pr3-final-review.md`

- [ ] Add a typed way for `getCurrentUser()` to distinguish `404` unavailable from other API errors, or handle `ApiError.status === 404` in session bootstrap.
- [ ] Keep session `authenticated` after refresh `204` when `/auth/me` returns `404`; set user/role unavailable without inventing a member role.
- [ ] Preserve anonymous redirect for failed refresh and unexpected auth/me failures.
- [ ] Avoid misleading error toast for expected `/auth/me` 404 fallback.
- [ ] Update review documentation to state public contract documentation lags deployed backend endpoint and frontend fallback behavior.

### Task 2: Remove unused sidebar badge prop

**Files:**
- Modify: `src/components/dashboard/shared/dashboard-sidebar.tsx`

- [ ] Remove `badges` from `SidebarNavProps`.
- [ ] Remove badge lookup/rendering from `SidebarNav`.
- [ ] Remove any remaining `badges` arguments from callers.
- [ ] Confirm no `use-nav-badges` imports remain; delete hook only if still unused and tracked.

### Task 3: Verify

**Files:**
- No additional files.

- [ ] Run `npm run format:check`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Run `git diff --check`.
- [ ] Search for stale badge props and verify session state behavior statically.

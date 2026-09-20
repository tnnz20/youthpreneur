# Sidebar Follow-Up and Not Found Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Checklist is updated as work completes.

**Goal:** Add catch-all Not Found behavior, clean remaining PR #3 findings, and document backend refresh grace-window handling.

**Architecture:** Unknown routes render one `NotFoundPage`; browser back is used only when history contains an in-app previous entry, otherwise navigation goes home. Keep current dashboard/RBAC architecture. Skip member catalog navigation changes for now. Backend refresh-token replay safety is handled by the deployed grace-window contract, so no frontend cross-tab coordination is added.

**Tech Stack:** React 19, React Router, TypeScript, existing Base UI, Sonner, Lucide React.

**References:**

- `docs/reviews/sidebar-pr3-final-review.md`
- Backend contract: `https://github.com/tnnz20/youthpreneur-be/blob/feat/auth-2/api/api-contract.md`

## Global Constraints

- Skip PR #3 review item 5: catalog navigation decision.
- Use catch-all Not Found instead of legacy member-route redirects.
- Keep labels and routes already implemented.
- Do not add frontend refresh locks or BroadcastChannel logic; backend grace window handles rotated-token replay.
- Preserve existing auth/session behavior.
- No comments or unrelated refactors.

---

### Task 1: Add Not Found route/page

**Files:**

- Create: `src/pages/not-found.tsx`
- Modify: `src/app.tsx`

- [x] Build accessible 404 page using existing dashboard/public tokens.
- [x] Add `Kembali` action that calls browser back only when a previous in-app history entry exists.
- [x] Fall back to `/` when no previous route exists.
- [x] Add catch-all `path="*"` route after known routes.
- [x] Ensure unknown dashboard/auth/public URLs render Not Found instead of blank outlet.
- [x] Verify no redirect loop from Not Found navigation.

### Task 2: Clean duplicate and stale review code/docs

**Files:**

- Modify: `src/pages/dashboard-profile.tsx`
- Modify: `src/components/shared/auth-guard.tsx`
- Modify: `docs/reviews/sidebar-rbac-review.md`

- [x] Import shared `ROLE_LABEL` instead of defining duplicate local map.
- [x] Use shared `UserRole` in `RequireRoleProps`.
- [x] Update stale review references from `dashboard-user-menu.tsx` to `dashboard-footer-menu.tsx`.
- [x] Remove outdated role-fallback and verification claims from stale report, or clearly mark them historical.
- [x] Keep catalog navigation unchanged per user decision.

### Task 3: Document refresh grace-window decision

**Files:**

- Modify: `docs/reviews/sidebar-pr3-final-review.md`

- [x] Mark cross-tab refresh-token concern as resolved by backend grace-window behavior.
- [x] Reference backend contract branch `feat/auth-2`.
- [x] State frontend does not need Web Locks/BroadcastChannel coordination for this contract.
- [x] Preserve warning that backend and frontend deployments must use compatible refresh-token behavior.

### Task 4: Update implementation checklist

**Files:**

- Modify: `docs/superpowers/plans/2026-09-20-sidebar-follow-up.md`

- [x] Mark each completed task step with `[x]`.
- [x] Record skipped catalog navigation item explicitly.
- [x] Record Playwright availability result.

### Task 5: Verify

- [x] Run `npm run format:check`.
- [x] Run `npm run lint`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run build`.
- [x] Run `git diff --check`.
- [x] Search for stale `dashboard-user-menu`, duplicate `ROLE_LABEL`, and inline role unions.
- [x] Run browser smoke if runner available; otherwise record blocker in review docs.

## Execution Status (2026-09-20)

- **Catalog navigation:** explicitly skipped per user decision. `MEMBER_NAV` unchanged; the `/dashboard/program` catalog remains reachable from the member dashboard tile only. No sidebar entry added or removed.
- **Browser runner:** unavailable. `node_modules/playwright` and `node_modules/@playwright/test` are both absent; `.playwright-mcp/` holds only prior artifacts. Browser smoke not run; recorded as a blocker in `docs/reviews/sidebar-pr3-final-review.md`. Verification limited to format/lint/typecheck/build/`git diff --check` plus static search.
- **Refresh token:** cross-tab concern marked resolved by the backend 10-second grace window on branch `feat/auth-2`; no frontend Web Locks/BroadcastChannel added.
- **Result:** all static gates PASS. `format:check` reports 42 files repo-wide; all are the pre-existing CRLF baseline outside this change set — every file created or edited here passes Prettier individually.

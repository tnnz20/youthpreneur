# Auth Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add shared auth layout with centered login/register content and back-to-home navigation.

**Architecture:** Create `src/layouts/auth-layout.tsx` as a route layout rendering an `Outlet`. Wrap `/auth/login` and `/auth/register` in this layout while preserving existing auth guards. Auth pages keep their own cards and form logic; only redundant outer section spacing may be removed.

**Tech Stack:** React 19, React Router, Tailwind CSS v4, Lucide React.

**Spec:** Approved chat design for auth route layout.

## Global Constraints

- Auth routes remain `/auth/login` and `/auth/register`.
- Layout must not render public navbar/footer.
- Auth content must be centered horizontally and vertically in a `min-h-screen` canvas.
- Back control must navigate to `/` and use `ArrowLeft` from `lucide-react`.
- Preserve existing auth guards and form behavior.
- Follow existing Youthpreneur design tokens and no-comment convention.
- Run `npm run format:check`, `npm run lint`, `npm run typecheck`, and `npm run build`.

---

### Task 1: Add auth route layout

**Files:**

- Create: `src/layouts/auth-layout.tsx`
- Modify: `src/app.tsx`
- Modify: `src/pages/auth/login.tsx` only if redundant outer spacing must be removed
- Modify: `src/pages/auth/register.tsx` only if redundant outer spacing must be removed

**Interfaces:**

- `AuthLayout` default export renders `<Outlet />`.
- Auth routes remain wrapped by `RedirectIfAuthenticated` inside the auth layout route.

- [ ] Create layout with `min-h-screen`, `bg-brand-bg`, and centered content container.
- [ ] Add accessible `Link` to `/` labeled `Kembali ke Beranda`, with `ArrowLeft` icon.
- [ ] Position back link at top-left without disrupting vertical/horizontal centering of auth cards.
- [ ] Ensure content wrapper uses responsive padding and allows register card height without clipping.
- [ ] Update route tree so both auth routes render under `AuthLayout` and remain outside `MainLayout`.
- [ ] Preserve `SessionProvider` and auth guard behavior.

### Task 2: Verify layout

**Files:**

- No additional files.

- [ ] Run `npm run format:check`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Check `git diff --check`.
- [ ] Confirm auth routes and back link via browser smoke test if dev server is available.

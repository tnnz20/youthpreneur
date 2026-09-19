# Auth Final Review Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix auth review bugs and polish registration layout without changing API behavior.

**Architecture:** Calendar fixes stay in vendored React Day Picker v9 component. Auth width belongs to pages: login owns compact width, register owns wide width. Shared form field/control styles are deduplicated only where existing duplication is clear.

**Tech Stack:** React 19, TypeScript, React Day Picker 9, Luxon, Base UI, Tailwind CSS v4.

**Spec:** `docs/reviews/auth-feature-final-review.md` and approved auth UI requests.

## Global Constraints

- Preserve routes, API payload, validation, cookie auth, and registration flow.
- Keep `birth_date` serialization as `YYYY-MM-DD`.
- Keep gender labels/API enum behavior unchanged.
- Keep responsive mobile layout.
- No comments or unrelated refactors.
- Run format, lint, typecheck, build, diff check, and browser smoke checks.

---

### Task 1: Fix calendar year navigation

**Files:**

- Modify: `src/components/ui/calendar.tsx`

- [ ] Move years-view branch before month neighbor early returns in both previous/next handlers.
- [ ] Preserve existing year range calculation and callbacks.
- [ ] Verify year view pages backward and forward across ranges.

### Task 2: Fix auth width ownership

**Files:**

- Modify: `src/layouts/auth-layout.tsx`
- Modify: `src/pages/auth/login.tsx`
- Modify: `src/pages/auth/register.tsx`

- [ ] Remove page-specific max-width clamp from `AuthLayout`; keep `w-full`.
- [ ] Add `max-w-md` ownership to login page section/card wrapper.
- [ ] Keep register progress and card at `max-w-3xl`.
- [ ] Remove redundant width classes where ownership is now clear.

### Task 3: Fix date icon and profile field sizing

**Files:**

- Modify: `src/components/auth/birth-date-picker.tsx`
- Modify: `src/components/auth/register-profile-step.tsx`

- [ ] Move calendar icon to right side of date text.
- [ ] Ensure date picker trigger, text inputs, textarea, and Select triggers use consistent control height and width.
- [ ] Apply `w-full h-12` and matching border/radius/padding at page/component level.
- [ ] Preserve date picker accessibility and Luxon behavior.

### Task 4: Remove dead and duplicate code

**Files:**

- Modify: `src/schema/auth.ts`
- Modify: `src/components/auth/register-credentials-step.tsx`
- Modify: `src/components/auth/register-profile-step.tsx`
- Modify: `src/pages/auth/login.tsx`
- Modify: `src/components/auth/birth-date-picker.tsx`

- [ ] Remove unused schema type exports.
- [ ] Extract duplicated `Field` into one shared auth component only if both current consumers use it.
- [ ] Extract repeated input/control class constants without creating unused abstractions.
- [ ] Preserve behavior and type safety.

### Task 5: Verify

**Files:**

- No additional files.

- [ ] Run `npm run format:check`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Run `git diff --check`.
- [ ] Use Playwright to check compact login, wide register, centered progress, right-side date icon, equal field sizing, bidirectional year navigation, and unchanged registration flow.

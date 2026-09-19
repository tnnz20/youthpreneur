# PR #2 Review Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve actionable PR #2 review findings without changing authentication behavior beyond validation, cleanup, and formatting hardening.

**Architecture:** Keep current domain API modules, session provider, route guards, and auth page structure. Apply minimal fixes: format tracked files, remove dead schema exports, reuse the existing login input class, normalize optional registration fields, and document multi-tab refresh rotation as a known follow-up.

**Tech Stack:** React 19, TypeScript 6, Zod 4, native fetch, Prettier, ESLint.

**Spec:** `docs/reviews/pr-2-auth-review.md` and `docs/superpowers/plans/2026-09-19-auth.md`.

## Global Constraints

- Do not change API endpoint paths or cookie-auth behavior.
- Keep `VITE_API_BASE_URL` and `http://localhost:8080` fallback unchanged.
- Keep login/register routes at `/auth/login` and `/auth/register`.
- Keep `toast.error(...)` behavior for validation and API failures.
- Do not add new dependencies.
- Do not add comments to production code.
- Do not commit during implementation.
- Run `npm run format:check`, `npm run lint`, `npm run typecheck`, and `npm run build`.

---

### Task 1: Fix formatting and remove dead code

**Files:**

- Modify: `src/pages/auth/login.tsx`
- Modify: `docs/superpowers/plans/2026-09-19-auth.md`
- Modify: `src/schema/auth.ts`
- Modify: `src/lib/api/client.ts`

**Interfaces:**

- Preserve all public API functions and schema names used by pages.
- Remove only unused `LoginPayload` and `RegisterPayload` exports.
- Preserve `loginSchema`, `registerSchema`, `LoginInput`, and `RegisterInput`.

- [ ] Run `npx prettier --write src/pages/auth/login.tsx docs/superpowers/plans/2026-09-19-auth.md src/schema/auth.ts src/lib/api/client.ts`.
- [ ] Remove unused `LoginPayload` and `RegisterPayload` declarations from `src/schema/auth.ts`.
- [ ] Replace `catch { void 0; }` with an empty catch block in `src/lib/api/client.ts`.
- [ ] Run `npm run format:check` and confirm no files fail.

### Task 2: Normalize registration optional fields

**Files:**

- Modify: `src/schema/auth.ts`
- Modify: `src/pages/auth/register.tsx` only if required by schema types

**Interfaces:**

- Registration API payload remains `{ email, password, full_name, district?, phone? }`.

- [ ] Make optional `district` trim whitespace and convert empty values to `undefined` before payload construction.
- [ ] Make optional `phone` trim whitespace and reject malformed non-empty values with a concise Indonesian validation message. Accept common Indonesian formats beginning with `0`, `62`, or `+62`, followed by valid mobile digits.
- [ ] Preserve optional-field behavior: blank district/phone must be omitted, not sent as whitespace.
- [ ] Keep confirm password and terms client-only.
- [ ] Run `npm run lint` and `npm run typecheck`.

### Task 3: Remove duplicated login input classes

**Files:**

- Modify: `src/pages/auth/login.tsx`

**Interfaces:**

- No runtime/API behavior changes.

- [ ] Extract the repeated login input class string into one module-level `inputClass` constant, matching registration page convention.
- [ ] Replace both inline duplicates with `className={inputClass}` while preserving password padding or other field-specific classes through composition.
- [ ] Run `npm run format:check` and `npm run lint`.

### Task 4: Document known multi-tab refresh risk

**Files:**

- Modify: `docs/reviews/pr-2-auth-review.md`

**Interfaces:**

- No production behavior changes.

- [ ] Add a concise follow-up section stating that refresh token rotation is single-flight only within one tab and concurrent tabs can trigger backend replay revocation.
- [ ] State mitigation options for a future backend/frontend task, without claiming this PR fixes cross-tab coordination.
- [ ] Run `npm run format:check`.

### Task 5: Verify complete fixes

**Files:**

- No new production files.

- [ ] Run `npm run format:check`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Run `git diff --check`.
- [ ] Search `src/` for `LoginPayload`, `RegisterPayload`, stale `/login`, and stale `/register` references.
- [ ] Review `git status --short` and diff for unrelated changes.

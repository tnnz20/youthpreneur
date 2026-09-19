# Multi-Step Register Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace registration page with clean two-step credentials/profile flow using API-contract fields, per-step Zod validation, Luxon date handling, and reusable components.

**Architecture:** Keep orchestration in `src/pages/auth/register.tsx`; render each step through focused components under `src/components/auth/`. Keep validation in `src/schema/auth.ts`, API types in `src/types/auth.ts`, and API transport functions in `src/lib/api/auth.ts`. Use existing shadcn/Base UI components and `KECAMATAN` from `src/constants/site.ts`.

**Tech Stack:** React 19, TypeScript, Zod, Luxon, React Router, shadcn/Base UI, Lucide React, Sonner, Tailwind CSS v4.

**Spec:** Youthpreneur API contract Authentication/User Endpoints; approved register redesign plan.

## Global Constraints

- Route remains `/auth/register`.
- Registration endpoint remains `POST /users`.
- All registration fields are required in Zod, including API-optional fields.
- API payload uses `email`, `password`, `full_name`, `nik`, `birth_date`, `gender`, `district`, `phone`, `address`.
- Frontend gender labels are `Laki-Laki` and `Perempuan`; API enum values remain `male` and `female`.
- District options come from `KECAMATAN` in `src/constants/site.ts`, not `src/types/site.ts`.
- Step 1 must validate before Step 2; profile must validate before API submission.
- Birth date must be valid, not future, and serialize as `YYYY-MM-DD` using Luxon.
- Preserve `AuthLayout`, back-home link, API error toasts, loading state, success redirect, and no navbar/footer.
- No comments or new abstractions beyond requested components.
- Run format, lint, typecheck, build, and browser smoke checks.

---

### Task 1: Add date picker dependencies/components

**Files:**

- Modify: `package.json`, `package-lock.json`
- Create or reuse: `src/components/ui/calendar.tsx`
- Create or reuse: `src/components/ui/popover.tsx`
- Create: `src/components/auth/birth-date-picker.tsx`

**Interfaces:**

- `BirthDatePicker` accepts `value: string`, `onChange: (value: string) => void`, and optional `invalid?: boolean`.
- Value is API format `YYYY-MM-DD` or empty string.

- [ ] Inspect existing UI components and dependencies before adding anything.
- [ ] Install `luxon`; add `@types/luxon` only if typecheck requires it.
- [ ] Add shadcn Calendar/Popover only when absent, preserving Base UI conventions.
- [ ] Build accessible date picker with month navigation and direct year selection.
- [ ] Use Luxon to parse/display selected date and emit `YYYY-MM-DD`.
- [ ] Prevent future dates and expose usable label/placeholder.

### Task 2: Add auth types and validation schemas

**Files:**

- Modify: `src/types/auth.ts`
- Modify: `src/schema/auth.ts`

**Interfaces:**

- `RegisterRequest` includes required `nik`, `birth_date`, `gender`, `district`, `phone`, and `address`.
- Produce `registerCredentialsSchema`, `registerProfileSchema`, and final `registerSchema`.

- [ ] Define `Gender = 'male' | 'female'`.
- [ ] Extend `RegisterRequest` with all API contract fields.
- [ ] Define credentials schema: email, password 8–72, confirm password match.
- [ ] Define profile schema: required full name, NIK, valid non-future birth date, gender enum, district enum from `KECAMATAN`, valid phone, address, and terms `true`.
- [ ] Use Luxon for birth-date validation without timezone drift.
- [ ] Keep form-only `confirmPassword` and `terms` out of `RegisterRequest`.

### Task 3: Create focused registration components

**Files:**

- Create: `src/components/auth/register-progress.tsx`
- Create: `src/components/auth/register-credentials-step.tsx`
- Create: `src/components/auth/register-profile-step.tsx`

**Interfaces:**

- Credentials step receives controlled values and change handlers, renders fields only.
- Profile step receives controlled values and change handlers, renders fields only.
- Progress component receives current step and total steps.

- [ ] Build progress indicator with `Kredensial Pengguna` and `Profil Pengguna` labels.
- [ ] Build credentials step with email, password, repeat password, and password visibility controls if useful.
- [ ] Build profile step with full name, NIK, BirthDatePicker, gender select, district select from `KECAMATAN`, phone, address, and terms checkbox.
- [ ] Display gender labels `Laki-Laki` and `Perempuan` while values stay `male`/`female`.
- [ ] Use accessible labels, IDs, required markers, and existing UI components.
- [ ] Keep components free of API calls and duplicated validation logic.

### Task 4: Refactor register page orchestration

**Files:**

- Modify: `src/pages/auth/register.tsx`
- Modify: `src/lib/api/auth.ts` only if request type/function needs alignment

**Interfaces:**

- Page owns step, form values, validation transitions, submit, toast, and navigation.

- [ ] Replace monolithic form markup with progress, credentials step, and profile step components.
- [ ] Validate credentials schema before advancing from Step 1; show first issue via `toast.error`.
- [ ] Preserve all values when moving back and forward.
- [ ] Validate profile/final schema before calling API.
- [ ] Send complete `RegisterRequest` payload to `registerUser`.
- [ ] Keep loading state and prevent duplicate submit.
- [ ] On API failure show `toast.error` and preserve values.
- [ ] On success show toast and navigate to `/auth/login`.
- [ ] Keep existing link to login and auth layout behavior.

### Task 5: Verify implementation

**Files:**

- No additional files.

- [ ] Run `npm run format:check`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Run `git diff --check`.
- [ ] Use Playwright to verify `/auth/register`, step 1 validation, step transition, profile fields, gender labels, district options, date picker year/month controls, back navigation preserving values, and no console errors except expected backend CORS/session errors.

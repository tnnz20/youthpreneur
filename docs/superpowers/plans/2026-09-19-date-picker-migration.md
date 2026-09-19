# Date Picker Migration and Register Progress Styling Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace native birth-date input with Luca-Felix's React Day Picker v9-compatible date picker and center/refine register progress styling.

**Architecture:** Use the provided Luca-Felix shadcn date-picker registry implementation as source for the date picker, preserving existing project tokens and Luxon API value conversion. No shadcn v8 Calendar is installed currently; avoid adding one. Keep `BirthDatePicker` controlled and keep register page/schema behavior unchanged.

**Tech Stack:** React 19, TypeScript, React Day Picker 9, Luxon, Base UI/shadcn components, Tailwind CSS v4.

**Spec:** `https://date-picker.luca-felix.com/`, approved register redesign requirements.

## Global Constraints

- `BirthDatePicker` value remains `YYYY-MM-DD` or empty string.
- API payload remains unchanged.
- Birth dates after today must be disabled and rejected by existing Zod validation.
- Date picker must support year navigation/view for date-of-birth use.
- Do not install or retain incompatible shadcn/react-day-picker v8 Calendar.
- Progress indicator remains outside registration card, centered within `max-w-3xl`.
- Active progress number/text uses brand colors; inactive uses muted foreground/gray.
- Preserve accessibility, auth behavior, and existing design tokens.
- Run format, lint, typecheck, build, and browser smoke checks.

---

### Task 1: Install and add compatible date picker

**Files:**

- Modify: `package.json`, `package-lock.json`
- Create or modify: supporting `src/components/ui/*` files required by registry
- Modify: `src/components/auth/birth-date-picker.tsx`

- [ ] Inspect registry implementation and required dependencies.
- [ ] Install `react-day-picker@9` and only required supporting dependencies.
- [ ] Add Luca-Felix date picker implementation or minimal adapted source compatible with Base UI/Tailwind conventions.
- [ ] Do not add shadcn v8 Calendar; remove it if accidentally introduced.
- [ ] Configure single-date selection, year navigation/view, and `disabled` dates after today.
- [ ] Keep `BirthDatePicker` controlled with `value` and `onChange` props.
- [ ] Convert selected date to `YYYY-MM-DD` using Luxon.
- [ ] Display selected date with Indonesian locale where applicable.
- [ ] Remove native input-only `aria-label` workaround; preserve visible label association.

### Task 2: Refine progress indicator

**Files:**

- Modify: `src/components/auth/register-progress.tsx`
- Modify: `src/pages/auth/register.tsx` only if container adjustment is needed

- [ ] Center progress content inside the same `max-w-3xl` width as register card.
- [ ] Keep active step number/text in brand dark/yellow styling.
- [ ] Use muted foreground/gray styling for inactive step number/text and connector.
- [ ] Preserve mobile truncation and responsive layout.
- [ ] Add active-step accessibility state if compatible with existing markup.

### Task 3: Verify date-picker/register flow

**Files:**

- No additional files.

- [ ] Run `npm run format:check`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Run `git diff --check`.
- [ ] Use Playwright to verify date picker opens, year view/navigation works, future dates are disabled, selected date updates field, and register flow remains usable.

# Enterprise Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` or `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the member profile page with API-backed enterprise management at `/dashboard/my-enterprises`, including create, detail, delete, filters, empty state, skeleton loading, and cursor pagination.

**Architecture:** Add enterprise domain types, Zod schemas, API functions, and a focused hook that owns owner-scoped enterprise list state, filters, URL persistence, cursor pagination, create, and delete operations. Keep the page and table separate from the detail page and create dialog. Reuse existing user-table layout patterns and Base UI/shadcn components without duplicating transport or pagination logic unnecessarily.

**Tech Stack:** React 19, TypeScript, React Router, Vite, Zod, Base UI/shadcn, Tailwind CSS v4, Luxon, Sonner, existing `apiRequest` client.

**API Contract:** `GET /enterprises` is authenticated and owner-scoped for members. It accepts `cursor`, `limit` (default 20, maximum 100), exact `district`, `status` (`active|inactive`), `business_sector`, `legal_status`, `business_digitization`, `intervention_needs`, `training_status`, `mentoring_status`, `capital_access`, and `partnership`. It returns `{ enterprises, next_cursor? }`. `GET /enterprises/{publicID}` returns one enterprise. `POST /enterprises` creates an enterprise. `DELETE /enterprises/{publicID}` soft-deletes an enterprise and returns `204`. Clients must reuse returned cursors and never construct cursors.

## Global Constraints

- Create and switch to branch `feat/enterprises` before implementation.
- Keep route `/dashboard/my-enterprises`; rename page module to `src/pages/enterprises-user.tsx`.
- Add detail route `/dashboard/my-enterprises/:publicId`.
- Use cookie-auth `apiRequest`; never add bearer handling.
- Use Zod validation before `POST /enterprises`.
- Keep API values unchanged in submitted payloads; translate only visible labels into Bahasa Indonesia.
- Preserve exact API enum values such as `active`, `inactive`, `complete`, `in_progress`, `none`, `planned`, `ongoing`, `completed`, `yes`, and `no`.
- Use server-returned cursors only.
- Do not add dependencies or comments.
- Do not commit unless explicitly requested.

---

### Task 1: Create branch and inspect enterprise contract

**Files:**

- Modify: Git branch only.
- Reference: `src/app.tsx`, `src/pages/dashboard-profil.tsx`, `src/components/dashboard/admin/user-table.tsx`, `src/components/dashboard/admin/program-form-dialog.tsx`.

- [x] Confirm working tree state with `git status --short --branch`.
- [x] Create and switch to `feat/enterprises`.
- [x] Confirm enterprise endpoint fields and enum values against `api-contract.md`.
- [x] Record existing route/layout/auth conventions before modifying files.

**Done when:** branch is active and enterprise contract fields are mapped without assumptions.

---

### Task 2: Add enterprise types, constants, and Zod schema

**Files:**

- Create: `src/types/enterprises.ts`
- Create or modify: `src/constants/enterprises.ts`
- Create: `src/schema/enterprises.ts`

**Interfaces:**

```ts
export type EnterpriseStatus = 'active' | 'inactive';
export type LegalStatus = 'complete' | 'in_progress' | 'none';
export type BusinessDigitization = 'high' | 'medium' | 'low';
export type ProcessStatus = 'planned' | 'ongoing' | 'completed';
export type GeneralStatus = 'yes' | 'no' | 'in_progress';

export interface Enterprise {
  public_id: string;
  name: string | null;
  business_sector: string;
  legal_status: LegalStatus | null;
  business_digitization: BusinessDigitization | null;
  intervention_needs: string | null;
  training_status: ProcessStatus | null;
  mentoring_status: ProcessStatus | null;
  capital_access: GeneralStatus | null;
  partnership: GeneralStatus | null;
  initial_turnover: string;
  current_turnover: string;
  district: string | null;
  status: EnterpriseStatus;
  created_at: number;
  updated_at: number;
}

export interface EnterpriseListResponse {
  enterprises: Enterprise[];
  next_cursor?: string;
}
```

- [x] Define nullable fields exactly as API responses allow.
- [x] Define create input type without server-controlled fields: no `public_id`, `status`, `created_at`, or `updated_at`.
- [x] Add Indonesian label maps/options for business sector and every contract enum.
- [x] Keep option values equal to contract values while labels are Bahasa Indonesia.
- [x] Add Zod schema for create input:
  - `business_sector` required.
  - `name` optional, max 255 characters.
  - nullable/optional assessment fields constrained to contract enums.
  - turnover values non-negative decimal strings accepted by API.
  - district optional and trimmed.
- [x] Export inferred create input type from schema or keep types aligned without duplicate incompatible definitions.

**Done when:** enterprise response and create payload are type-safe and visible labels never replace API values.

---

### Task 3: Add enterprise API module and state hook

**Files:**

- Create: `src/lib/api/enterprises.ts`
- Create: `src/hooks/use-enterprises.ts`
- Reference: `src/lib/api/client.ts`, `src/hooks/use-users.ts`

**API functions:**

```ts
listEnterprises(params): Promise<EnterpriseListResponse>;
getEnterprise(publicId: string): Promise<Enterprise>;
createEnterprise(input: CreateEnterpriseInput): Promise<Enterprise>;
deleteEnterprise(publicId: string): Promise<void>;
```

- [x] Implement `GET /enterprises` with contract-backed query parameters only.
- [x] Omit blank optional query parameters; preserve exact enum values.
- [x] Implement `GET /enterprises/{publicID}`.
- [x] Implement `POST /enterprises` with JSON body and `apiRequest`.
- [x] Implement `DELETE /enterprises/{publicID}` and handle `204` through `apiRequest`.
- [x] Add owner-scoped hook state with loading, error, create/delete mutation state, filters, limit default 20, cursor, returned `next_cursor`, and cursor history.
- [x] Persist list filters, limit, and current cursor to `/dashboard/my-enterprises` query params with `replace` if matching user-table URL behavior.
- [x] Initialize state from URL on refresh; previous-page history remains session-only.
- [x] Reset cursor/history when any filter or limit changes.
- [x] Never construct cursor values; pass only server-returned `next_cursor` or URL-restored cursor.
- [x] Guard against stale/out-of-order responses as `use-users.ts` does.
- [x] Expose `create` and `remove` methods; refresh current list after successful delete/create as appropriate.

**Done when:** API and hook support owner enterprise list/create/delete/detail flows with contract-safe pagination.

---

### Task 4: Rename member page and update routes

**Files:**

- Create: `src/pages/enterprises-user.tsx`
- Delete: `src/pages/dashboard-profil.tsx`
- Modify: `src/app.tsx`

- [x] Move page from `dashboard-profil.tsx` to `enterprises-user.tsx`.
- [x] Update lazy import in `app.tsx`.
- [x] Keep `/dashboard/my-enterprises` route path unchanged.
- [x] Render `SectionHeading` with enterprise-focused title and description.
- [x] Replace old `ProfileForm` rendering with enterprise table/list page.
- [x] Add `/dashboard/my-enterprises/:publicId` route and require authenticated dashboard access.
- [x] Add lazy-loaded enterprise detail page.
- [x] Confirm no stale `dashboard-profil` import or route module remains.

**Done when:** old page module is removed, list route still works, and detail route resolves.

---

### Task 5: Build create enterprise dialog with Zod validation

**Files:**

- Create: `src/components/dashboard/enterprise/enterprise-form-dialog.tsx`
- Reference: `src/components/dashboard/admin/program-form-dialog.tsx`
- Reference: `src/schema/enterprises.ts`, `src/constants/enterprises.ts`

- [x] Follow `ProgramFormDialog` dialog structure, dashboard styling, labels, close behavior, and submit layout.
- [x] Add visible Bahasa fields for all create payload fields that belong in first version: name, business sector, legal status, business digitization, intervention needs, training status, mentoring status, capital access, partnership, initial turnover, current turnover, and district.
- [x] Use native numeric/decimal-friendly inputs where suitable; preserve submitted turnover strings.
- [x] Use Select controls with Indonesian labels and real API values.
- [x] Validate form with enterprise Zod schema before submit.
- [x] Display field-level validation messages accessibly and prevent API call on invalid input.
- [x] Disable submit while creating and close dialog only after successful API response.
- [x] Show Sonner success/error feedback.
- [x] Reset form to clean defaults when reopened for a new enterprise.

**Done when:** `Tambahkan Wirausaha` opens a validated Indonesian form and sends contract-compatible JSON.

---

### Task 6: Build enterprise table with filters, empty, skeleton, and pagination

**Files:**

- Create: `src/components/dashboard/enterprise/enterprise-table.tsx`
- Create: focused child components under `src/components/dashboard/enterprise/` if needed.
- Reference: `src/components/dashboard/admin/user-table.tsx` and its split children.

- [x] Follow user-table structure and dashboard visual tokens without copying unrelated user-specific code.
- [x] Add filters supported by `GET /enterprises`, at minimum district, status, and business sector; use exact API values with Bahasa labels.
- [x] Add `Reset Filter` and `Tambahkan Wirausaha` beside it.
- [x] Display useful enterprise columns: name, business sector, district, status, initial turnover, current turnover, and updated timestamp.
- [x] Render nullable fields as `—` and format timestamps with shared utility.
- [x] Add skeleton rows using `Skeleton` while loading.
- [x] Add `Empty` state with filter-aware copy and reset action.
- [x] Add `Pagination` previous/next controls and rows-per-page selector defaulting to 20.
- [x] Use `flex justify-between` layout for rows-per-page and pagination controls.
- [x] Keep table accessible with `scope`, `aria-busy`, status text, and keyboard-visible action focus.
- [x] Split table if file becomes large; keep parent orchestration focused.

**Done when:** list page supports contract-backed filtering, responsive table rendering, empty/loading states, and cursor pagination.

---

### Task 7: Add enterprise row actions and detail page

**Files:**

- Create: `src/pages/enterprise-detail.tsx`
- Modify: enterprise table/action component.

- [x] Add row dropdown actions:
  - `Lihat Detail` navigates to `/dashboard/my-enterprises/${public_id}`.
  - `Delete Wirausaha` opens destructive AlertDialog.
- [x] Call `deleteEnterprise(public_id)` only after confirmation.
- [x] Disable row action while mutation is pending.
- [x] Refresh list and show toast after successful deletion; show API error toast on failure.
- [x] Detail page fetches `GET /enterprises/{publicID}` and handles loading/error states.
- [x] Render enterprise fields with Bahasa labels and API values translated only for display.
- [x] Include back navigation to `/dashboard/my-enterprises`.
- [x] Keep detail route accessible to authenticated owner users; do not apply admin-only `RequireRole`.

**Done when:** detail navigation and destructive deletion work end-to-end.

---

### Task 8: Verify and clean up

**Files:**

- Modify: plan checklist only during implementation.

- [x] Run `npm run lint`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run build`.
- [x] Run targeted Prettier checks on all changed files and report unrelated repo-wide formatting failures separately.
- [x] Search for stale `dashboard-profil` imports and old ProfileForm rendering.
- [x] Search enterprise API calls for unsupported query/body fields and constructed cursors.
- [x] Confirm `Tambahkan Wirausaha`, `Lihat Detail`, and `Delete Wirausaha` labels exist.
- [x] Inspect `git diff` and `git status --short`; do not commit unless explicitly requested.
- [x] Update only completed checklist markers from `[ ]` to `[x]`; do not alter task wording or order.

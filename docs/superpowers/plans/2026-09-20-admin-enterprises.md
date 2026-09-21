# Admin Enterprise Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` or `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the admin youth directory page with API-backed enterprise administration at `/dashboard/enterprises`.

**Architecture:** Reuse existing enterprise API transport, types, constants, and `useEnterprises` state hook. Replace the mock `YouthTable` with a focused admin enterprise page/table while preserving dashboard layout, admin role protection, cursor pagination, filters, skeleton, empty state, and detail navigation.

**Tech Stack:** React 19, TypeScript, React Router, Base UI/shadcn, Tailwind CSS v4, Sonner, existing enterprise API/hook modules.

**Spec:** Approved user request and current enterprise implementation in `src/lib/api/enterprises.ts`, `src/hooks/use-enterprises.ts`, and `src/components/dashboard/enterprise/`.

## Global Constraints

- Keep `/dashboard/enterprises` as the admin route.
- Keep admin protection with `RequireRole role="admin"`.
- Use existing `useEnterprises` and `listEnterprises`; do not add duplicate API transport or mock data.
- Preserve server cursor discipline and existing pagination behavior.
- Use `/dashboard/my-enterprises/:publicId` for `Lihat Detail` navigation.
- Remove stale youth-directory dependencies from this admin flow.
- Do not add dependencies or comments.
- Do not commit unless explicitly requested.

---

### Task 1: Move and rename admin page

**Files:**

- Create: `src/pages/admin/enterprise-admin.tsx`
- Delete: `src/pages/admin-pemuda.tsx`
- Modify: `src/app.tsx`

- [x] Create `EnterpriseAdminPage` in `src/pages/admin/enterprise-admin.tsx`.
- [x] Import `SectionHeading` and the new `EnterpriseAdminTable`.
- [x] Use enterprise-focused heading copy such as `Kelola Wirausaha` and describe reviewing enterprise records.
- [x] Update `app.tsx` lazy import from `@/pages/admin-pemuda` to `@/pages/admin/enterprise-admin`.
- [x] Keep `/dashboard/enterprises` path unchanged and retain `RequireRole role="admin"`.
- [x] Delete `src/pages/admin-pemuda.tsx`.

**Done when:** `/dashboard/enterprises` renders the new admin page without `admin-pemuda` imports.

### Task 2: Replace youth table with enterprise admin table

**Files:**

- Create: `src/components/dashboard/admin/enterprise-admin-table.tsx`
- Delete: `src/components/dashboard/admin/youth-table.tsx`
- Reference: `src/components/dashboard/enterprise/enterprise-table.tsx`
- Reference: `src/components/dashboard/enterprise/enterprise-table-content.tsx`
- Reference: `src/components/dashboard/enterprise/enterprise-table-filters.tsx`

- [x] Export `EnterpriseAdminTable` with no youth-directory props; instantiate or consume `useEnterprises` consistently with existing enterprise table pattern.
- [x] Load all admin-visible enterprises through existing `useEnterprises`/`GET /enterprises` flow.
- [x] Reuse contract-supported filters available in existing enterprise state: district, status, and business sector.
- [x] Preserve URL filter, limit, cursor, reset, stale-cursor recovery, and race-safe request behavior from `useEnterprises`.
- [x] Render columns: `Nama Wirausaha`, `Sektor Usaha`, `Kecamatan`, `Status`, `Omzet Awal`, `Omzet Saat Ini`, `Diperbarui`, `Aksi`.
- [x] Format currency and timestamps through existing shared utilities.
- [x] Render nullable enterprise values as `—`.
- [x] Keep dashboard card/table styles and responsive overflow behavior.
- [x] Remove `YouthProfile`, `YouthStatus`, `useYouthDirectory`, mock constants, profile detail dialog, copy-contact logic, and youth status mutation logic.

**Done when:** admin table displays API enterprises and has no youth-specific data path.

### Task 3: Add admin action dropdown

**Files:**

- Modify: `src/components/dashboard/admin/enterprise-admin-table.tsx` or extracted admin table child.

- [x] Add accessible `Aksi` dropdown for each enterprise row.
- [x] Add `Lihat Detail` item with icon and keyboard-visible focus style.
- [x] Navigate to `/dashboard/my-enterprises/${enterprise.public_id}`.
- [x] Keep row action disabled while row mutation/loading state applies.
- [x] Do not expose member-only create/delete actions in admin table unless already required by the approved scope; this task requires `Lihat Detail` only.

**Done when:** admin row detail action opens existing enterprise detail page using `public_id`.

### Task 4: Preserve loading, empty, and pagination UX

**Files:**

- Modify: `src/components/dashboard/admin/enterprise-admin-table.tsx` or focused child files.

- [x] Render `Skeleton` rows while enterprise data loads.
- [x] Render `Empty` state when no enterprises exist or filters match no records.
- [x] Show filter-aware reset action.
- [x] Show stale-cursor recovery action when current cursor page is unavailable.
- [x] Render `Pagination` previous/next controls and rows-per-page selector using existing page-size options, default 20.
- [x] Use `flex justify-between` pagination layout.
- [x] Preserve `aria-busy`, loading status, table header `scope="col"`, and focus-visible action styling.

**Done when:** admin table matches enterprise member table quality for loading, empty, accessibility, and pagination behavior.

### Task 5: Remove stale references and verify

**Files:**

- Modify: changed implementation files only.

- [x] Search `src/` for `admin-pemuda`, `AdminPemudaPage`, `youth-table`, `YouthTable`, and `useYouthDirectory`; remove stale admin-flow references.
- [x] Confirm `/dashboard/enterprises` lazy route points to `enterprise-admin`.
- [x] Confirm `/dashboard/my-enterprises/:publicId` remains member enterprise detail route.
- [x] Run `npm run lint`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run build`.
- [x] Run targeted Prettier checks on changed files and report unrelated repo-wide formatting failures separately.
- [x] Inspect `git diff` and `git status --short`; do not commit.
- [x] Update only completed checklist markers from `[ ]` to `[x]`; do not alter task wording or order.

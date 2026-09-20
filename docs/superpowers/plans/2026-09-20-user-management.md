# User Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` or `executing-plans` to implement this plan task-by-task. Update only checklist markers; do not rewrite task text during execution.

**Goal:** Replace registration management with API-backed admin user management at `/dashboard/users`, with a separate admin user detail route.

**Architecture:** Add a small users API module and shared user types. A focused users hook owns server state, filters, cursor pagination, refresh, and mutations. The management page renders the existing dashboard heading and table; the detail page fetches one user by `public_id`. Existing dashboard styling and cookie-auth transport remain unchanged.

**Tech Stack:** React 19, TypeScript, React Router, Vite, Tailwind CSS v4, Base UI/shadcn components, Sonner, existing `apiRequest` client.

**API Contract:** `GET /users` returns `{ users: User[], next_cursor?: string }`; query parameters are `cursor`, `limit`, `district`, and `gender`. `GET /users/{publicID}` returns one user. `PATCH /users/{publicID}/status` accepts `{ is_active: boolean }`. `DELETE /users/{publicID}` returns `204`. User response fields are `public_id`, `email`, `role`, `is_active`, `created_at`, `updated_at`, and nullable `profile` containing `full_name`, `nik`, `birth_date`, `gender`, `district`, `phone`, and `address`. Cursor values must be reused exactly from `next_cursor`.

**Global Constraints:**
- Remove `/admin/pendaftaran`; do not replace it with a redirect.
- Keep `/dashboard/users` behind `RequireRole role="admin"`.
- Add `/admin/users/:publicId` behind `RequireRole role="admin"`.
- Use `public_id` for detail, status, and delete requests.
- Use `apiRequest`; never add bearer-token handling.
- Preserve existing dashboard visual tokens and responsive table style.
- Do not add comments or dependencies.
- Do not commit generated artifacts or commit changes.

---

### Task 1: Confirm branch and baseline

**Files:**
- Modify: Git branch only.

- [x] Confirm working tree state with `git status --short --branch`.
- [x] Confirm current branch is `feat/user-management`; create and switch to it if absent.
- [x] Record baseline commands available from `package.json`: `format:check`, `lint`, `typecheck`, `build`.

**Done when:** branch is `feat/user-management` and no unrelated changes are modified.

---

### Task 2: Add user API types and API functions

**Files:**
- Create: `src/types/users.ts`
- Create: `src/lib/api/users.ts`
- Reference: `src/lib/api/client.ts`

**Interfaces:**
```ts
export type UserGender = 'male' | 'female';

export interface UserProfile {
  full_name: string;
  nik: string | null;
  birth_date: string | null;
  gender: UserGender | null;
  district: string | null;
  phone: string | null;
  address: string | null;
}

export interface User {
  public_id: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: number;
  updated_at: number;
  profile: UserProfile | null;
}

export interface UserListResponse {
  users: User[];
  next_cursor?: string;
}

export interface UserListParams {
  cursor?: string;
  limit?: number;
  district?: string;
  gender?: UserGender;
}
```

- [x] Define nullable profile fields exactly as API response allows.
- [x] Implement `listUsers(params: UserListParams): Promise<UserListResponse>` with `URLSearchParams`; omit empty optional values and use `/users`.
- [x] Implement `getUser(publicId: string): Promise<User>` using `GET /users/{publicId}`.
- [x] Implement `updateUserStatus(publicId: string, isActive: boolean): Promise<User>` using `PATCH /users/{publicId}/status` and JSON body `{ is_active: isActive }`.
- [x] Implement `deleteUser(publicId: string): Promise<void>` using `DELETE /users/{publicId}`.
- [x] Use `apiRequest` for every request so cookie credentials and API errors remain centralized.

**Done when:** API functions compile and expose only contract-backed paths and fields.

---

### Task 3: Add users state hook

**Files:**
- Create: `src/hooks/use-users.ts`
- Reference: `src/lib/api/users.ts`, `src/types/users.ts`

**Interfaces:**
```ts
export interface UserFilters {
  district: string;
  gender: UserGender | 'all';
}

export interface UserState {
  users: User[];
  filters: UserFilters;
  loading: boolean;
  mutatingId: string | null;
  error: string | null;
  nextCursor: string | null;
  hasNextPage: boolean;
  setDistrict: (district: string) => void;
  setGender: (gender: UserGender | 'all') => void;
  resetFilters: () => void;
  nextPage: () => void;
  refresh: () => void;
  deactivate: (publicId: string) => Promise<void>;
  remove: (publicId: string) => Promise<void>;
}
```

- [x] Load first page with `limit: 20` on mount.
- [x] Encode only `district`, `gender`, `cursor`, and `limit` query parameters.
- [x] Reset cursor and reload first page whenever filters change.
- [x] Store server `next_cursor` as returned; never increment or construct cursors.
- [x] Make `nextPage` a no-op when no `nextCursor` exists or while loading.
- [x] Refresh current filter view after status or delete mutation succeeds.
- [x] Surface API error messages in `error`; retain stable state on failed mutations.
- [x] Keep `mutatingId` set while one row action is pending.

**Done when:** hook provides server-backed list state, filters, cursor navigation, and mutations without importing UI components.

---

### Task 4: Move management page and update routes

**Files:**
- Create: `src/pages/admin/admin-users-management.tsx`
- Delete: `src/pages/admin-pendaftaran.tsx`
- Modify: `src/app.tsx`

- [x] Move page responsibility into `admin-users-management.tsx`.
- [x] Replace `useDashboard` registration/program state with the users state hook.
- [x] Set heading title to `Manajemen Pengguna` and description to explain reviewing, deactivating, and deleting users.
- [x] Update lazy import to `@/pages/admin/admin-users-management`.
- [x] Keep `/dashboard/users` wrapped by `RequireRole role="admin"`.
- [x] Delete `/admin/pendaftaran` route; do not add `Navigate`, `replace`, or compatibility redirect.

**Done when:** management route resolves new page and old route has no route declaration or source reference.

---

### Task 5: Add admin user detail route and page

**Files:**
- Create: `src/pages/admin/admin-user-detail.tsx`
- Modify: `src/app.tsx`

- [x] Add lazy import for `AdminUserDetailPage`.
- [x] Add `/admin/users/:publicId` route inside authenticated dashboard layout and `RequireRole role="admin"`.
- [x] Read `publicId` with React Router route params.
- [x] Fetch `getUser(publicId)` on mount and when `publicId` changes.
- [x] Render loading state, API error state, and user detail fields including email, status, full name, NIK, gender, district, phone, address, and updated timestamp.
- [x] Add navigation back to `/dashboard/users`.
- [x] Do not use a dialog for `Lihat Detail`; table action must navigate to this route.

**Done when:** `/admin/users/{public_id}` renders fetched user details and handles loading/error states.

---

### Task 6: Refactor table filters and columns

**Files:**
- Modify: `src/components/dashboard/admin/registration-table.tsx`
- Reference: `src/hooks/use-users.ts`, `src/types/users.ts`

**Interface:**
```ts
interface UserTableProps {
  state: UserState;
}
```

- [x] Rename component/export if needed to reflect user management while preserving import compatibility only where useful.
- [x] Replace registration/program filters with search-free contract filters: district text input and gender select (`Semua Gender`, `Laki-laki`, `Perempuan`). Do not send unsupported search parameters.
- [x] Keep filter reset action and dashboard card styling.
- [x] Render columns in this order: `full_name`, `nik`, `gender`, `district`, `phone`, `is_active`, `updated_at`, `Aksi`.
- [x] Render nullable values as `—`; format Unix `updated_at` consistently with existing locale conventions.
- [x] Render active status with existing status badge or equivalent accessible styled badge.
- [x] Keep table usable on narrow screens with existing overflow behavior.

**Done when:** table consumes only user state and displays every requested column with API field mappings.

---

### Task 7: Add empty state, skeleton, pagination, and actions

**Files:**
- Modify: `src/components/dashboard/admin/registration-table.tsx` or renamed user table file.
- Reference: `src/components/ui/dialog.tsx`, `src/components/ui/alert-dialog.tsx`.

- [x] Add table skeleton rows while `loading` is true; keep header visible.
- [x] Add Base UI/shadcn empty state when loading is false and `users.length === 0`; include filter-aware message and reset action when filters are active.
- [x] Add previous/next pagination controls; disable previous on first page and next when `hasNextPage` is false. Track cursor history locally only to return to a previously loaded cursor; never construct server cursors.
- [x] Add `Aksi` dropdown with `Lihat Detail`, `Non Aktifkan Pengguna`, and `Delete Pengguna`.
- [x] Make `Lihat Detail` navigate to `/admin/users/${user.public_id}` with `useNavigate`.
- [x] Open `AlertDialog` for deactivate confirmation; call `state.deactivate(user.public_id)` only after confirmation.
- [x] Open destructive `AlertDialog` for delete confirmation; call `state.remove(user.public_id)` only after confirmation.
- [x] Disable row actions while that row is mutating.
- [x] Show Sonner success/error feedback for mutations and list failures.
- [x] Preserve accessible labels and keyboard operation for dropdown/dialog controls.

**Done when:** loading, empty, pagination, detail navigation, deactivation, and deletion all work without registration-era actions or fields.

---

### Task 8: Update plan checklists and verify

**Files:**
- Modify: `docs/superpowers/plans/2026-09-20-user-management.md` — checklist markers only.

- [x] Run `npm run format:check`.
- [x] Run `npm run lint`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run build`.
- [x] Search source for `/admin/pendaftaran`, registration-table registration props, and obsolete registration actions; confirm no active references remain.
- [x] Inspect `git diff` and `git status --short`; confirm only intended files changed.
- [x] Change only completed checklist markers from `[ ]` to `[x]`; do not change task wording, ordering, or add tasks.

**Done when:** all checks pass, route/reference audit is clean, and checklist accurately reflects completed work.

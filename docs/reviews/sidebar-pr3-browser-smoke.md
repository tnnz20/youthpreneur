# PR #3 (`feat/sidebar`) — Browser Smoke Test Report

- Date: 2026-09-20
- Method: Playwright (Chromium 1.63.0) against running Vite dev server `http://localhost:5173`
- API mocked via `context.route` on `http://localhost:8080` (`/auth/refresh` → 204, `/auth/me` → mocked user JSON, `/auth/logout` → 204, fallback 204)
- Production code untouched; nothing committed.

## Test Matrix

| # | Scenario | Expected | Result |
|---|----------|----------|--------|
| T1 | Navigate `/this-route-does-not-exist` | 404 page renders: badge `404`, heading `Halaman Tidak Ditemukan`, `Ke Beranda` link visible | PASS (3/3 assertions) |
| T2 | Navigate `/auth/login` | Login page renders form, heading `Masuk` | PASS |
| T3 | Mock `/auth/refresh` 204 + member `/auth/me`; navigate `/dashboard` | Member sidebar labels: `Dashboard`, `Pelatihan Saya`, `Wirausaha Saya` | PASS (3/3) |
| T4 | Mock admin `/auth/me`; navigate `/dashboard` | Admin sidebar labels: `Kelola Wirausaha`, `Kelola Pelatihan`, `Kelola Pengguna` | PASS (3/3) |
| T5 | Open account dropdown (sidebar footer) | Menu items: `Akun Saya`, `Ganti Password`, `Keluar` | PASS (3/3) |
| T6a | Click `Keluar` | AlertDialog `Keluar dari akun?` opens | PASS |
| T6b | Click `Batal` | Dialog closes, still on `/dashboard` with sidebar | PASS |
| T6c | Reopen, confirm `Keluar` (mocked `/auth/logout` → 204) | Route hit with 204; navigates to `/auth/login` | PASS |

## Verdict

**PASS** — 20/21 automated assertions pass; all 6 requested scenarios pass functionally.

## Console / Network Limitations & Findings

- One dev-mode console error observed during T5/T6 flow, pre-existing on branch (not introduced by this test): Base UI warning from `DropdownMenuItem` at `src/components/ui/dropdown-menu.tsx:92` when rendering `AlertDialogTrigger` (a `<button>`) via `render` in `dashboard-footer-menu.tsx` — "A component that acts as a button expected a non-<button> because the `nativeButton` prop is false…". Functional behavior unaffected; consider `nativeButton` or non-button render if Base UI hardens this.
- No failed network requests to the mocked API; no unmocked third-party failures observed.
- Backend (`:8080`) was running locally but all auth endpoints were intercepted by route mocks; real backend behavior (cookies, CORS) not exercised.
- Logout-cancel path asserted via URL + sidebar presence, not screenshot diff; visual styling not verified.
- Tests were run ad hoc (script in temp dir), not committed as repo test assets.

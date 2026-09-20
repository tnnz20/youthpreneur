import { Suspense, lazy } from 'react';

import { Navigate, Route, Routes } from 'react-router';

import AuthLayout from '@/layouts/auth-layout';
import DashboardLayout from '@/layouts/dashboard-layout';
import MainLayout from '@/layouts/main-layout';

import { RedirectIfAuthenticated, RequireAuth, RequireRole } from '@/components/shared/auth-guard';
import { SessionProvider } from '@/components/shared/session-provider';
import { Toaster } from '@/components/ui/sonner';

import { LoaderCircle } from 'lucide-react';

const AboutPage = lazy(() => import('@/pages/about'));
const AdminPemudaPage = lazy(() => import('@/pages/admin-pemuda'));
const AdminProgramPage = lazy(() => import('@/pages/admin-program'));
const AdminUserDetailPage = lazy(() => import('@/pages/admin/admin-user-detail'));
const AdminUsersManagementPage = lazy(() => import('@/pages/admin/admin-users-management'));
const DashboardIndexPage = lazy(() => import('@/pages/dashboard-index'));
const DashboardPasswordPage = lazy(() => import('@/pages/dashboard-password'));
const DashboardProfilePage = lazy(() => import('@/pages/dashboard-profile'));
const EnterpriseDetailPage = lazy(() => import('@/pages/enterprise-detail'));
const EnterprisesUserPage = lazy(() => import('@/pages/enterprises-user'));
const DashboardProgramPage = lazy(() => import('@/pages/dashboard-program'));
const DashboardProgramSayaPage = lazy(() => import('@/pages/dashboard-program-saya'));
const DatabasePage = lazy(() => import('@/pages/database'));
const HomePage = lazy(() => import('@/pages/home'));
const LoginPage = lazy(() => import('@/pages/auth/login'));
const NotFoundPage = lazy(() => import('@/pages/not-found'));
const RegisterPage = lazy(() => import('@/pages/auth/register'));

function PageFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <LoaderCircle className="text-brand-yellow h-16 w-16 animate-spin" aria-hidden="true" />
      <span className="text-sm font-semibold">Sedang Memuat...</span>
    </div>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <Suspense fallback={<PageFallback />}>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/database" element={<DatabasePage />} />
          </Route>
          <Route element={<AuthLayout />}>
            <Route
              path="/auth/login"
              element={
                <RedirectIfAuthenticated>
                  <LoginPage />
                </RedirectIfAuthenticated>
              }
            />
            <Route
              path="/auth/register"
              element={
                <RedirectIfAuthenticated>
                  <RegisterPage />
                </RedirectIfAuthenticated>
              }
            />
          </Route>
          <Route
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/admin/pemuda"
              element={<Navigate to="/dashboard/enterprises" replace />}
            />
            <Route path="/admin/program" element={<Navigate to="/dashboard/trainings" replace />} />
            <Route path="/dashboard" element={<DashboardIndexPage />} />
            <Route path="/dashboard/program" element={<DashboardProgramPage />} />
            <Route path="/dashboard/my-trainings" element={<DashboardProgramSayaPage />} />
            <Route path="/dashboard/my-enterprises" element={<EnterprisesUserPage />} />
            <Route path="/dashboard/my-enterprises/:publicId" element={<EnterpriseDetailPage />} />
            <Route path="/dashboard/profile" element={<DashboardProfilePage />} />
            <Route path="/dashboard/password" element={<DashboardPasswordPage />} />
            <Route
              path="/dashboard/enterprises"
              element={
                <RequireRole role="admin">
                  <AdminPemudaPage />
                </RequireRole>
              }
            />
            <Route
              path="/dashboard/trainings"
              element={
                <RequireRole role="admin">
                  <AdminProgramPage />
                </RequireRole>
              }
            />
            <Route
              path="/dashboard/users"
              element={
                <RequireRole role="admin">
                  <AdminUsersManagementPage />
                </RequireRole>
              }
            />
            <Route
              path="/dashboard/users/:publicId"
              element={
                <RequireRole role="admin">
                  <AdminUserDetailPage />
                </RequireRole>
              }
            />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </SessionProvider>
  );
}

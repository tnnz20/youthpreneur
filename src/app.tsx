import { Suspense, lazy } from 'react';

import { Route, Routes } from 'react-router';

import DashboardLayout from '@/layouts/dashboard-layout';
import MainLayout from '@/layouts/main-layout';

import { Toaster } from '@/components/ui/sonner';

import { LoaderCircle } from 'lucide-react';

const AboutPage = lazy(() => import('@/pages/about'));
const AdminPage = lazy(() => import('@/pages/admin'));
const AdminPemudaPage = lazy(() => import('@/pages/admin-pemuda'));
const AdminPendaftaranPage = lazy(() => import('@/pages/admin-pendaftaran'));
const AdminProgramPage = lazy(() => import('@/pages/admin-program'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const DashboardProfilPage = lazy(() => import('@/pages/dashboard-profil'));
const DashboardProgramPage = lazy(() => import('@/pages/dashboard-program'));
const DashboardProgramSayaPage = lazy(() => import('@/pages/dashboard-program-saya'));
const DatabasePage = lazy(() => import('@/pages/database'));
const HomePage = lazy(() => import('@/pages/home'));
const LoginPage = lazy(() => import('@/pages/login'));
const RegisterPage = lazy(() => import('@/pages/register'));

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
    <Suspense fallback={<PageFallback />}>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/database" element={<DatabasePage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/pemuda" element={<AdminPemudaPage />} />
          <Route path="/admin/program" element={<AdminProgramPage />} />
          <Route path="/admin/pendaftaran" element={<AdminPendaftaranPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/program" element={<DashboardProgramPage />} />
          <Route path="/dashboard/program-saya" element={<DashboardProgramSayaPage />} />
          <Route path="/dashboard/profil" element={<DashboardProfilPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

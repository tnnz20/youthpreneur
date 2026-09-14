import { Suspense, lazy } from 'react';

import { Route, Routes } from 'react-router';

import MainLayout from '@/layouts/main-layout';

import { LoaderCircle } from 'lucide-react';

const AboutPage = lazy(() => import('@/pages/about'));
const HomePage = lazy(() => import('@/pages/home'));
const LoginPage = lazy(() => import('@/pages/login'));

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
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Suspense>
  );
}

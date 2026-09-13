import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import MainLayout from '@/layouts/main-layout';

const AboutPage = lazy(() => import('@/pages/about'));
const HomePage = lazy(() => import('@/pages/home'));
const LoginPage = lazy(() => import('@/pages/login'));

function PageFallback() {
  return <div className="flex min-h-[50vh] items-center justify-center">Memuat...</div>;
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

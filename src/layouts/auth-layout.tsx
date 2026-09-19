import { Link, Outlet } from 'react-router';

import { ArrowLeft } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="bg-brand-bg text-brand-dark selection:bg-brand-yellow relative flex min-h-screen flex-col items-center justify-center px-4 py-16 selection:text-black sm:px-6 lg:px-8 lg:py-24">
      <Link
        to="/"
        className="text-brand-dark border-brand-dark shadow-solid-sm hover:shadow-solid absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border-2 bg-white px-3.5 py-2 text-xs font-bold sm:top-6 sm:left-6"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Kembali ke Beranda
      </Link>
      <div className="w-full max-w-md sm:max-w-3xl">
        <Outlet />
      </div>
    </div>
  );
}

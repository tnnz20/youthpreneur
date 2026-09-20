import { Link, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';

import { ArrowLeft, Compass, Home as HomeIcon } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    const index = (window.history.state as { idx?: number } | null)?.idx ?? 0;

    if (index > 0) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  return (
    <section className="bg-brand-bg text-brand-dark flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="border-brand-dark shadow-solid-lg w-full max-w-lg rounded-3xl border-2 bg-white p-8 text-center sm:p-10">
        <div className="border-brand-dark bg-brand-yellow shadow-solid-sm mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2">
          <Compass className="text-brand-dark h-7 w-7" aria-hidden="true" />
        </div>
        <p className="text-brand-dark mt-5 text-sm font-black tracking-widest uppercase">404</p>
        <h1 className="text-brand-dark mt-1 text-2xl font-black tracking-tight sm:text-3xl">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-brand-muted mx-auto mt-3 max-w-sm text-sm font-medium">
          Halaman yang Anda cari tidak tersedia atau sudah dipindahkan. Periksa kembali alamatnya
          atau kembali ke halaman utama.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="neo" size="lg" onClick={handleBack}>
            <ArrowLeft aria-hidden="true" />
            Kembali
          </Button>
          <Button variant="neoOutline" size="lg" render={<Link to="/" />}>
            <HomeIcon aria-hidden="true" />
            Ke Beranda
          </Button>
        </div>
      </div>
    </section>
  );
}

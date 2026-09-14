import { Link } from 'react-router';

import { cn } from '@/lib/utils';

import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useSite } from '@/hooks/use-site';

import { Sparkles } from 'lucide-react';

export function CtaSection() {
  const { openModal } = useSite();

  return (
    <section className="bg-brand-bg border-t border-black/10 py-16">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <Card className="border-brand-dark shadow-solid-lg mx-auto max-w-4xl rounded-3xl border-2 bg-white p-8 py-8 ring-0 sm:p-14">
          <div className="border-brand-dark bg-brand-yellow shadow-solid-sm mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 text-2xl">
            <Sparkles className="h-6 w-6" aria-hidden="true" />
          </div>

          <h2 className="text-brand-dark text-3xl font-black tracking-tight sm:text-4xl">
            Mari Bergabung dalam Gerakan Pemuda Tapin
          </h2>

          <p className="text-brand-muted mx-auto mt-3 max-w-xl text-sm leading-relaxed sm:text-base">
            Apakah Anda pemuda berjiwa wirausaha, pegiat komunitas, atlet berprestasi, akademisi,
            atau mitra dunia usaha? Saatnya bersinergi memajukan potensi daerah Kabupaten Tapin.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              type="button"
              variant="neo"
              onClick={() =>
                openModal(
                  'Pendaftaran Database BADAPATAN',
                  'Daftarkan diri atau usaha Anda ke dalam Bank Data Pemuda Tapin.'
                )
              }
              className="h-auto w-full rounded-full px-8 py-3.5 sm:w-auto"
            >
              Daftar ke BADAPATAN
            </Button>
            <Button
              type="button"
              variant="neoYellow"
              onClick={() =>
                openModal(
                  'Ajukan Kemitraan & Kolaborasi',
                  'Sinergikan program CSR, riset perguruan tinggi, ataupun perbankan Anda bersama Dispora Tapin.'
                )
              }
              className="h-auto w-full rounded-full px-8 py-3.5 sm:w-auto"
            >
              Kemitraan &amp; Kolaborasi
            </Button>
            <Link
              to="/#kursus"
              className={cn(
                buttonVariants({ variant: 'neoOutline' }),
                'h-auto w-full rounded-full px-7 py-3.5 text-sm sm:w-auto'
              )}
            >
              Lihat Program Pelatihan
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}

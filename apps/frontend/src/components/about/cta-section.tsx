import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

import { useSite } from '@/hooks/use-site';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function CtaSection() {
  const { openModal } = useSite();

  return (
    <section className="border-t border-black/10 bg-brand-bg py-16">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-4xl rounded-3xl border-2 border-brand-dark bg-white p-8 py-8 ring-0 shadow-solid-lg sm:p-14">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-brand-dark bg-brand-yellow text-2xl shadow-solid-sm">
            <Sparkles className="h-6 w-6" aria-hidden="true" />
          </div>

          <h2 className="text-3xl font-black tracking-tight text-brand-dark sm:text-4xl">
            Mari Bergabung dalam Gerakan Pemuda Tapin
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-brand-muted sm:text-base">
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

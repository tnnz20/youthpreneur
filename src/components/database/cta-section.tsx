import { Link } from 'react-router';

import { Button } from '@/components/ui/button';

interface CtaSectionProps {
  onRegister: () => void;
}

export function CtaSection({ onRegister }: CtaSectionProps) {
  return (
    <section className="border-t border-black/10 bg-[#FAF7F2] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-brand-dark shadow-solid-lg bg-brand-yellow relative overflow-hidden rounded-3xl border-2 p-8 text-center sm:p-12">
          <div className="mx-auto max-w-2xl space-y-4">
            <span className="text-brand-dark rounded-full border border-black/20 bg-white px-3.5 py-1 text-xs font-black tracking-wider uppercase">
              Gerakan Satu Data Pemuda
            </span>
            <h2 className="text-brand-dark text-3xl font-black tracking-tight sm:text-4xl">
              Belum Terdaftar di BADAPATAN?
            </h2>
            <p className="text-brand-dark/90 text-sm leading-relaxed font-medium sm:text-base">
              Ayo daftarkan usaha, keahlian, komunitas, atau prestasi Anda ke dalam Bank Data Pemuda
              Tapin. Dapatkan fasilitas pembinaan, kemudahan legalitas, dan akses permodalan dari
              Dispora Kabupaten Tapin.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
              <Button
                type="button"
                variant="neo"
                onClick={onRegister}
                className="h-auto w-full rounded-full px-8 py-3.5 text-sm sm:w-auto"
              >
                Isi Formulir Data Pemuda
              </Button>
              <Link
                to="/about"
                className="border-brand-dark shadow-solid-sm text-brand-dark h-auto w-full rounded-full border-2 bg-white px-8 py-3.5 text-center text-sm font-bold transition-all hover:bg-black/5 sm:w-auto"
              >
                Pelajari Program Youthpreneur
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

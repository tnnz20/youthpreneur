import { FolderOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BENEFITS, DATASET_ROWS } from '@/constants/about';
import { useSite } from '@/hooks/use-site';

export function BadapatanSection() {
  const { openModal } = useSite();

  return (
    <section id="badapatan" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <Card className="relative gap-0 overflow-visible rounded-3xl border-2 border-brand-dark bg-brand-yellow p-6 py-6 ring-0 shadow-solid-lg sm:p-8">
              <Badge className="absolute -right-3 -top-3 h-auto rounded-full border-0 bg-brand-dark px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                Sistem Satu Data
              </Badge>

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-brand-dark bg-white text-2xl shadow-solid-sm">
                  <FolderOpen className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-xl font-black leading-tight text-brand-dark">BADAPATAN</h4>
                  <p className="text-xs font-bold text-brand-dark/70">Bank Data Pemuda Tapin</p>
                </div>
              </div>

              <div className="space-y-3 text-xs font-medium sm:text-sm">
                {DATASET_ROWS.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-xl border border-brand-dark bg-white p-3"
                  >
                    <span>{row.label}</span>
                    <span className={`font-bold ${row.color}`}>{row.status}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4 text-xs">
                <span className="font-bold text-brand-dark/80">Akurasi Berbasis Data Digital</span>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    openModal(
                      'Pendaftaran Database BADAPATAN',
                      'Daftarkan data kepemudaan atau usaha Anda ke dalam Bank Data Pemuda Tapin (BADAPATAN).'
                    )
                  }
                  className="h-auto rounded-full bg-brand-dark px-4 py-1.5 text-xs font-bold text-white hover:bg-black"
                >
                  Isi Profil
                </Button>
              </div>
            </Card>
          </div>

          <div className="order-1 space-y-6 lg:order-2 lg:col-span-7">
            <Badge
              variant="neoMint"
              className="inline-block h-auto rounded-full px-3.5 py-1 text-xs"
            >
              Ruang Tumbuh Wirausaha Muda
            </Badge>

            <h2 className="text-3xl font-extrabold leading-snug tracking-tight text-brand-dark sm:text-4xl">
              TENTANG YOUTHPRENEUR TAPIN
            </h2>

            <p className="text-base font-normal leading-relaxed text-brand-dark/90 sm:text-lg">
              Melalui pemanfaatan{' '}
              <strong className="font-bold text-brand-dark">
                BADAPATAN (Bank Data Pemuda Tapin)
              </strong>
              , pelatihan, pendampingan, pengembangan usaha, jejaring kemitraan, dan layanan
              digital, <strong className="font-bold text-brand-dark">YOUTHPRENEUR TAPIN</strong>{' '}
              menjadi ruang bagi pemuda dan wirausaha muda untuk belajar, berkembang, berkolaborasi,
              mempromosikan usaha, dan menciptakan peluang ekonomi.
            </p>

            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
              {BENEFITS.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.title}
                    className={`flex items-start gap-3 rounded-xl border border-brand-dark/20 bg-white p-3 ${
                      benefit.wide ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-brand-dark text-sm font-bold ${benefit.color}`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-brand-dark">{benefit.title}</h4>
                      <p className="mt-0.5 text-xs text-brand-muted">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

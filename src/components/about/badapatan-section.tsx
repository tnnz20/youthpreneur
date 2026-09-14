import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useSite } from '@/hooks/use-site';

import { BENEFITS, DATASET_ROWS } from '@/constants/about';

import { FolderOpen } from 'lucide-react';

export function BadapatanSection() {
  const { openModal } = useSite();

  return (
    <section id="badapatan" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <Card className="border-brand-dark bg-brand-yellow shadow-solid-lg relative gap-0 overflow-visible rounded-3xl border-2 p-6 py-6 ring-0 sm:p-8">
              <Badge className="bg-brand-dark absolute -top-3 -right-3 h-auto rounded-full border-0 px-3.5 py-1 text-[10px] font-black tracking-wider text-white uppercase">
                Sistem Satu Data
              </Badge>

              <div className="mb-6 flex items-center gap-3">
                <div className="border-brand-dark shadow-solid-sm flex h-12 w-12 items-center justify-center rounded-2xl border-2 bg-white text-2xl">
                  <FolderOpen className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-brand-dark text-xl leading-tight font-black">BADAPATAN</h4>
                  <p className="text-brand-dark/70 text-xs font-bold">Bank Data Pemuda Tapin</p>
                </div>
              </div>

              <div className="space-y-3 text-xs font-medium sm:text-sm">
                {DATASET_ROWS.map((row) => (
                  <div
                    key={row.label}
                    className="border-brand-dark flex items-center justify-between rounded-xl border bg-white p-3"
                  >
                    <span>{row.label}</span>
                    <span className={`font-bold ${row.color}`}>{row.status}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4 text-xs">
                <span className="text-brand-dark/80 font-bold">Akurasi Berbasis Data Digital</span>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    openModal(
                      'Pendaftaran Database BADAPATAN',
                      'Daftarkan data kepemudaan atau usaha Anda ke dalam Bank Data Pemuda Tapin (BADAPATAN).'
                    )
                  }
                  className="bg-brand-dark h-auto rounded-full px-4 py-1.5 text-xs font-bold text-white hover:bg-black"
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

            <h2 className="text-brand-dark text-3xl leading-snug font-extrabold tracking-tight sm:text-4xl">
              TENTANG YOUTHPRENEUR TAPIN
            </h2>

            <p className="text-brand-dark/90 text-base leading-relaxed font-normal sm:text-lg">
              Melalui pemanfaatan{' '}
              <strong className="text-brand-dark font-bold">
                BADAPATAN (Bank Data Pemuda Tapin)
              </strong>
              , pelatihan, pendampingan, pengembangan usaha, jejaring kemitraan, dan layanan
              digital, <strong className="text-brand-dark font-bold">YOUTHPRENEUR TAPIN</strong>{' '}
              menjadi ruang bagi pemuda dan wirausaha muda untuk belajar, berkembang, berkolaborasi,
              mempromosikan usaha, dan menciptakan peluang ekonomi.
            </p>

            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
              {BENEFITS.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.title}
                    className={`border-brand-dark/20 flex items-start gap-3 rounded-xl border bg-white p-3 ${
                      benefit.wide ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <div
                      className={`border-brand-dark flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-bold ${benefit.color}`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="text-brand-dark text-sm font-extrabold">{benefit.title}</h4>
                      <p className="text-brand-muted mt-0.5 text-xs">{benefit.description}</p>
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

import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { STAKEHOLDERS } from '@/constants/about';

export function CommitmentSection() {
  return (
    <section id="komitmen" className="border-t border-black/10 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="relative mb-16 overflow-hidden rounded-3xl border-2 border-brand-dark bg-brand-yellow p-8 py-8 ring-0 shadow-solid-lg sm:p-12">
          <div className="absolute right-8 top-6 text-brand-dark opacity-30">
            <Sparkles className="h-14 w-14 fill-current stroke-none" />
          </div>

          <div className="max-w-3xl space-y-4">
            <Badge
              variant="outline"
              className="inline-block h-auto rounded-full border-black/20 bg-white px-3.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-sm"
            >
              Pernyataan Sikap &amp; Visi Bersama
            </Badge>
            <h2 className="text-3xl font-black tracking-tight text-brand-dark sm:text-4xl">
              KOMITMEN KAMI
            </h2>

            <p className="text-base font-medium leading-relaxed text-brand-dark sm:text-xl">
              “Mewujudkan generasi muda Tapin yang{' '}
              <span className="font-bold underline decoration-black decoration-2">
                aktif, kreatif, inovatif, adaptif, berprestasi, berjiwa kewirausahaan, dan mandiri
                secara ekonomi
              </span>{' '}
              melalui kolaborasi pemerintah, pemuda, komunitas, dunia usaha, perguruan tinggi,
              lembaga keuangan, dan berbagai mitra pembangunan.”
            </p>

            <div className="pt-2">
              <div className="inline-block rounded-2xl bg-brand-dark px-5 py-2.5 text-sm font-extrabold text-brand-yellow shadow-solid-sm sm:text-base">
                “Membangun Pemuda, Menggerakkan Kewirausahaan, Memajukan Tapin.”
              </div>
            </div>
          </div>
        </Card>

        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h3 className="text-2xl font-extrabold tracking-tight text-brand-dark sm:text-3xl">
            Kolaborasi Multipihak Pembangunan Pemuda Tapin
          </h3>
          <p className="mt-2 text-sm text-brand-muted">
            Sinergi bersama seluruh pemangku kepentingan dalam menggerakkan ekosistem wirausaha dan
            olahraga daerah.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {STAKEHOLDERS.map((stakeholder) => {
            const Icon = stakeholder.icon;
            return (
              <Card
                key={stakeholder.title}
                className={`flex flex-col items-center justify-center gap-0 rounded-2xl border-2 border-brand-dark bg-brand-bg p-4 py-4 text-center ring-0 shadow-solid-sm transition-all hover:-translate-y-1 ${
                  stakeholder.wide ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                <div
                  className={`mb-2 flex h-11 w-11 items-center justify-center rounded-full border border-brand-dark text-lg shadow-sm ${stakeholder.color}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h4 className="text-xs font-extrabold text-brand-dark">{stakeholder.title}</h4>
                <p className="mt-1 text-[10px] font-medium text-brand-muted">
                  {stakeholder.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

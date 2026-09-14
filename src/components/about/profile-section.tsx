import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

import { PROFILE_ROLES } from '@/constants/about';

import { Landmark } from 'lucide-react';

export function ProfileSection() {
  return (
    <section id="dispora" className="border-y border-black/10 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Badge
            variant="outline"
            className="border-brand-dark bg-brand-blue text-brand-dark mb-3 inline-block h-auto rounded-full px-3.5 py-1 text-xs font-bold"
          >
            Pemerintah Kabupaten Tapin
          </Badge>
          <h2 className="text-brand-dark text-3xl font-extrabold tracking-tight sm:text-4xl">
            PROFIL DISPORA KABUPATEN TAPIN
          </h2>
          <p className="text-brand-muted mt-3 text-sm leading-relaxed sm:text-base">
            Perangkat daerah garda terdepan pembinaan potensi generasi muda dan keolahragaan di
            Kabupaten Tapin, Kalimantan Selatan.
          </p>
        </div>

        <Card className="border-brand-dark bg-brand-bg shadow-solid-lg mb-12 rounded-3xl border-2 p-6 py-6 ring-0 sm:p-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7">
              <Badge
                variant="outline"
                className="inline-block h-auto rounded-full border-amber-400 bg-amber-200/80 px-3.5 py-1 text-xs font-black tracking-wider text-amber-900 uppercase"
              >
                Tugas Pokok &amp; Kewenangan
              </Badge>
              <h3 className="text-brand-dark text-2xl leading-tight font-black sm:text-3xl">
                Pemberdayaan, Kepemimpinan, dan Prestasi Olahraga Tapin
              </h3>
              <p className="text-brand-dark/90 text-sm leading-relaxed font-medium sm:text-base">
                Dinas Pemuda dan Olahraga (Dispora) Kabupaten Tapin merupakan perangkat daerah yang
                menyelenggarakan urusan pemerintahan di bidang kepemudaan dan keolahragaan yang
                menjadi kewenangan daerah.
              </p>
              <p className="text-brand-muted text-sm leading-relaxed sm:text-base">
                Dispora berperan dalam pemberdayaan dan pengembangan potensi pemuda, pembinaan
                prestasi olahraga, pengembangan kepemimpinan dan kewirausahaan pemuda, pelayanan
                kepemudaan, serta pengelolaan sarana dan prasarana pemuda dan olahraga.
              </p>
            </div>

            <Card className="border-brand-dark shadow-solid-sm flex flex-col items-center justify-center gap-0 rounded-2xl border-2 bg-white p-6 py-6 text-center ring-0 lg:col-span-5">
              <div className="border-brand-dark bg-brand-yellow shadow-solid-sm mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border-2 text-3xl">
                <Landmark className="h-8 w-8" aria-hidden="true" />
              </div>
              <h4 className="text-brand-dark text-base font-extrabold">
                Dinas Pemuda dan Olahraga
              </h4>
              <p className="text-brand-muted mt-1 text-xs">Kabupaten Tapin, Kalimantan Selatan</p>
              <div className="text-brand-dark/80 mt-4 w-full border-t border-black/10 pt-3 text-xs font-bold">
                “Membangun Pemuda, Menggerakkan Kewirausahaan, Memajukan Tapin.”
              </div>
            </Card>
          </div>
        </Card>

        <div>
          <div className="mb-6">
            <h3 className="text-brand-dark text-xl font-extrabold">
              5 Peran Strategis Dispora Kabupaten Tapin:
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5">
            {PROFILE_ROLES.map((role) => {
              const Icon = role.icon;
              return (
                <Card
                  key={role.title}
                  className="border-brand-dark shadow-solid-sm flex flex-col justify-between gap-0 rounded-2xl border-2 bg-white p-5 py-5 ring-0 transition-all hover:-translate-y-1"
                >
                  <div>
                    <div
                      className={`border-brand-dark mb-3 flex h-10 w-10 items-center justify-center rounded-xl border text-lg font-bold ${role.iconBg}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h4 className="text-brand-dark text-sm leading-snug font-extrabold">
                      {role.title}
                    </h4>
                    <p className="text-brand-muted mt-2 text-xs leading-relaxed">
                      {role.description}
                    </p>
                  </div>
                  <span
                    className={`mt-4 text-[10px] font-bold tracking-wider uppercase ${role.tagColor}`}
                  >
                    {role.tag}
                  </span>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

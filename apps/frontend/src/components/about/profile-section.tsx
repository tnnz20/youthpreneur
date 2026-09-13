import { Landmark } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PROFILE_ROLES } from '@/constants/about';

export function ProfileSection() {
  return (
    <section id="dispora" className="border-y border-black/10 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Badge
            variant="outline"
            className="mb-3 inline-block h-auto rounded-full border-brand-dark bg-brand-blue px-3.5 py-1 text-xs font-bold text-brand-dark"
          >
            Pemerintah Kabupaten Tapin
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            PROFIL DISPORA KABUPATEN TAPIN
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-muted sm:text-base">
            Perangkat daerah garda terdepan pembinaan potensi generasi muda dan keolahragaan di
            Kabupaten Tapin, Kalimantan Selatan.
          </p>
        </div>

        <Card className="mb-12 rounded-3xl border-2 border-brand-dark bg-brand-bg p-6 py-6 ring-0 shadow-solid-lg sm:p-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7">
              <Badge
                variant="outline"
                className="inline-block h-auto rounded-full border-amber-400 bg-amber-200/80 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-amber-900"
              >
                Tugas Pokok &amp; Kewenangan
              </Badge>
              <h3 className="text-2xl font-black leading-tight text-brand-dark sm:text-3xl">
                Pemberdayaan, Kepemimpinan, dan Prestasi Olahraga Tapin
              </h3>
              <p className="text-sm font-medium leading-relaxed text-brand-dark/90 sm:text-base">
                Dinas Pemuda dan Olahraga (Dispora) Kabupaten Tapin merupakan perangkat daerah yang
                menyelenggarakan urusan pemerintahan di bidang kepemudaan dan keolahragaan yang
                menjadi kewenangan daerah.
              </p>
              <p className="text-sm leading-relaxed text-brand-muted sm:text-base">
                Dispora berperan dalam pemberdayaan dan pengembangan potensi pemuda, pembinaan
                prestasi olahraga, pengembangan kepemimpinan dan kewirausahaan pemuda, pelayanan
                kepemudaan, serta pengelolaan sarana dan prasarana pemuda dan olahraga.
              </p>
            </div>

            <Card className="flex flex-col items-center justify-center gap-0 rounded-2xl border-2 border-brand-dark bg-white p-6 py-6 text-center ring-0 shadow-solid-sm lg:col-span-5">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-brand-dark bg-brand-yellow text-3xl shadow-solid-sm">
                <Landmark className="h-8 w-8" aria-hidden="true" />
              </div>
              <h4 className="text-base font-extrabold text-brand-dark">
                Dinas Pemuda dan Olahraga
              </h4>
              <p className="mt-1 text-xs text-brand-muted">Kabupaten Tapin, Kalimantan Selatan</p>
              <div className="mt-4 w-full border-t border-black/10 pt-3 text-xs font-bold text-brand-dark/80">
                “Membangun Pemuda, Menggerakkan Kewirausahaan, Memajukan Tapin.”
              </div>
            </Card>
          </div>
        </Card>

        <div>
          <div className="mb-6">
            <h3 className="text-xl font-extrabold text-brand-dark">
              5 Peran Strategis Dispora Kabupaten Tapin:
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5">
            {PROFILE_ROLES.map((role) => {
              const Icon = role.icon;
              return (
                <Card
                  key={role.title}
                  className="flex flex-col justify-between gap-0 rounded-2xl border-2 border-brand-dark bg-white p-5 py-5 ring-0 shadow-solid-sm transition-all hover:-translate-y-1"
                >
                  <div>
                    <div
                      className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-brand-dark text-lg font-bold ${role.iconBg}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h4 className="text-sm font-extrabold leading-snug text-brand-dark">
                      {role.title}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-brand-muted">
                      {role.description}
                    </p>
                  </div>
                  <span
                    className={`mt-4 text-[10px] font-bold uppercase tracking-wider ${role.tagColor}`}
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

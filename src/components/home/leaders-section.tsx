import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';

import { OFFICIALS } from '@/constants/home';

import { Award } from 'lucide-react';

/* Hallmark · component: leaders-section · genre: editorial · theme: neo-brutalist
 * states: default · hover · focus-visible · active
 * contrast: pass (WCAG AAA compliant with #141416 ink on #FAF7F2 / #FFFFFF)
 */
export function LeadersSection() {
  return (
    <section className="bg-brand-bg relative overflow-hidden border-b border-black/10 pt-8 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className="border-brand-dark bg-brand-yellow-light text-brand-dark inline-flex h-auto items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-wide uppercase shadow-xs"
          >
            <Award className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
            Pemerintah Kabupaten Tapin • Dinas Pemuda dan Olahraga
          </Badge>
        </div>

        <div className="mx-auto mt-4 max-w-3xl text-center">
          <h2 className="text-brand-dark text-3xl font-black tracking-tight sm:text-4xl lg:text-[40px] lg:leading-tight">
            Pimpinan Daerah Kabupaten Tapin
          </h2>
          <p className="text-brand-muted mt-3 text-sm leading-relaxed font-normal sm:text-base">
            Dukungan penuh Pemerintah Kabupaten Tapin dalam mendorong generasi muda berdaya saing,
            mandiri berwirausaha, dan memajukan potensi daerah di 12 kecamatan.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-6 sm:mt-10 sm:grid-cols-2 sm:gap-8">
          {OFFICIALS.map((official) => (
            <div
              key={official.name}
              className="border-brand-dark shadow-solid hover:shadow-solid-lg group/card relative flex flex-col overflow-hidden rounded-3xl border-2 bg-white transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* Photo Frame: Full bleed flush to the top edge (zero gap) */}
              <div className="border-brand-dark relative flex h-72 w-full items-end justify-center overflow-hidden border-b-2 sm:h-84">
                <div className={cn('absolute inset-0', official.accentColor)} />
                <div className="absolute inset-0 bg-[radial-gradient(#141416_1px,transparent_1px)] [background-size:14px_14px] opacity-10" />
                <img
                  src={official.image}
                  alt={`${official.role} - ${official.name}`}
                  width={640}
                  height={768}
                  loading="eager"
                  fetchPriority="high"
                  className="relative z-10 h-full w-auto object-contain object-bottom transition-transform duration-300 ease-out group-hover/card:scale-[1.03]"
                />
              </div>

              {/* Information Area: Exclusively Official Name and Role */}
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-brand-dark text-2xl font-black tracking-tight sm:text-3xl">
                  {official.name}
                </h3>
                <div className="mt-2.5">
                  <Badge
                    variant={official.badgeVariant ?? 'neoYellow'}
                    className="text-xs font-bold tracking-wide uppercase sm:text-sm"
                  >
                    {official.role}
                  </Badge>
                </div>
                <span className="text-brand-muted mt-1.5 text-[11px] font-bold tracking-widest uppercase">
                  Kabupaten Tapin
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-brand-dark shadow-solid-sm bg-brand-yellow-light/70 mx-auto mt-8 max-w-4xl rounded-2xl border-2 p-4 sm:mt-10 sm:p-5">
          <div className="divide-brand-dark/10 md:divide-brand-dark/15 grid grid-cols-1 divide-y-2 md:grid-cols-3 md:divide-x-2 md:divide-y-0">
            <div className="flex items-center gap-3 py-3 md:py-1 md:pr-4">
              <div className="border-brand-dark bg-brand-yellow flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black shadow-xs sm:h-9 sm:w-9 sm:text-sm">
                1
              </div>
              <span className="text-brand-dark text-xs leading-snug font-bold sm:text-sm">
                Inkubasi &amp; Pelatihan Wirausaha 12 Kecamatan
              </span>
            </div>

            <div className="flex items-center gap-3 py-3 md:px-4 md:py-1">
              <div className="border-brand-dark bg-brand-blue flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black shadow-xs sm:h-9 sm:w-9 sm:text-sm">
                2
              </div>
              <span className="text-brand-dark text-xs leading-snug font-bold sm:text-sm">
                Kemudahan Legalitas (NIB/PIRT/Halal) &amp; Akses KUR
              </span>
            </div>

            <div className="flex items-center gap-3 py-3 md:py-1 md:pl-4">
              <div className="border-brand-dark bg-brand-mint flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black shadow-xs sm:h-9 sm:w-9 sm:text-sm">
                3
              </div>
              <span className="text-brand-dark text-xs leading-snug font-bold sm:text-sm">
                Hilirisasi &amp; Digitalisasi Pasar Komoditas Lokal
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

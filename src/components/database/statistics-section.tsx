import { SECTOR_STATS } from '@/constants/database';

interface StatisticsSectionProps {
  onRegister: () => void;
}

const FUNCTIONS = [
  '1. Rekomendasi modal usaha wirausaha pemula (WMP).',
  '2. Fasilitasi legalitas P-IRT, NIB, & Sertifikasi Halal gratis.',
  '3. Pemanggilan atlet berbakat untuk ajang Porprov & Kejurda.',
];

export function StatisticsSection({ onRegister }: StatisticsSectionProps) {
  return (
    <section id="statistik" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-5">
            <div className="border-brand-dark bg-brand-peach text-brand-dark inline-block rounded-full border px-3 py-1 text-xs font-bold">
              Transparansi Data BADAPATAN
            </div>
            <h2 className="text-brand-dark text-3xl leading-tight font-black tracking-tight sm:text-4xl">
              Distribusi Minat & Komoditas Pemuda Tapin
            </h2>
            <p className="text-brand-muted text-sm leading-relaxed sm:text-base">
              Data BADAPATAN diperbarui langsung melalui pendaftaran mandiri serta program
              verifikasi lapangan Dispora Kabupaten Tapin. Data ini menjadi rujukan utama alokasi
              program bantuan usaha, fasilitasi NIB gratis, dan keikutsertaan pameran.
            </p>

            <div className="bg-brand-yellow/30 border-brand-dark space-y-2 rounded-2xl border-2 p-4 text-xs">
              <div className="text-brand-dark flex items-center gap-2 font-extrabold">
                <span>📌</span>
                <span>Fungsi Strategis Bank Data Pemuda:</span>
              </div>
              {FUNCTIONS.map((item) => (
                <p key={item} className="text-brand-dark/80">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="border-brand-dark shadow-solid-lg space-y-5 rounded-3xl border-2 bg-white p-6 sm:p-8 lg:col-span-7">
            <h3 className="text-brand-dark mb-4 text-lg font-black">
              Persentase Konsentrasi Sektor Pemuda:
            </h3>

            {SECTOR_STATS.map((stat) => (
              <div key={stat.label}>
                <div className="mb-1.5 flex justify-between gap-4 text-xs font-bold">
                  <span>{stat.label}</span>
                  <span className="text-brand-dark whitespace-nowrap">
                    {stat.value}% ({stat.detail})
                  </span>
                </div>
                <div className="border-brand-dark h-3 w-full overflow-hidden rounded-full border bg-gray-100">
                  <div
                    className={`h-full rounded-full ${stat.bar}`}
                    style={{ width: `${stat.value}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="text-brand-muted flex flex-col gap-2 border-t border-black/10 pt-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span>Sumber: Bank Data Pemuda Tapin (Update Semester I - 2026)</span>
              <button
                type="button"
                onClick={onRegister}
                className="text-brand-dark cursor-pointer font-bold underline hover:opacity-75"
              >
                Daftarkan Diri Anda Sekarang →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

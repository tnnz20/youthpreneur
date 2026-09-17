import { toast } from 'sonner';

import { KECAMATAN_INFO } from '@/constants/database';

interface KecamatanSectionProps {
  onSelectDistrict: (name: string) => void;
  onReset: () => void;
}

export function KecamatanSection({ onSelectDistrict, onReset }: KecamatanSectionProps) {
  const handleSelect = (name: string) => {
    onSelectDistrict(name);
    toast.info(`Menyaring data pemuda: Kecamatan ${name}`);
    document.getElementById('direktori')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReset = () => {
    onReset();
    toast.success('Semua saringan telah direset.');
    document.getElementById('direktori')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="wilayah" className="border-y border-black/10 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="border-brand-dark bg-brand-yellow text-brand-dark mb-3 inline-block rounded-full border px-3 py-1 text-xs font-bold">
            Sebaran Potensi Geografis
          </div>
          <h2 className="text-brand-dark text-3xl font-black tracking-tight sm:text-4xl">
            Pemetaan 12 Kecamatan Kabupaten Tapin
          </h2>
          <p className="text-brand-muted mt-3 text-sm sm:text-base">
            Setiap kecamatan memiliki komoditas unggulan dan konsentrasi bakat kepemudaan yang khas
            yang terhimpun dalam ekosistem BADAPATAN.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {KECAMATAN_INFO.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => handleSelect(item.name)}
              className="group border-brand-dark shadow-solid-sm cursor-pointer rounded-2xl border-2 bg-[#FAF7F2] p-4 text-left transition-all hover:-translate-y-1"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-brand-dark text-xs font-black">{item.name}</span>
                <span
                  className={`h-2.5 w-2.5 rounded-full transition-transform group-hover:scale-125 ${item.dot}`}
                />
              </div>
              <p className={`text-xs font-bold ${item.accent}`}>{item.focus}</p>
              <p className="text-brand-muted mt-1 text-[11px]">{item.description}</p>
              <div className="text-brand-dark mt-3 flex justify-between border-t border-black/10 pt-2 text-[10px] font-bold">
                <span>Terdata: {item.count} Pemuda</span>
                <span className="underline">Lihat →</span>
              </div>
            </button>
          ))}

          <button
            type="button"
            onClick={handleReset}
            className="border-brand-dark shadow-solid-sm bg-brand-yellow cursor-pointer rounded-2xl border-2 p-4 text-left transition-all hover:-translate-y-1"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-brand-dark text-xs font-black">Semua Kecamatan</span>
              <span className="text-sm">✦</span>
            </div>
            <p className="text-brand-dark text-xs font-bold">Kabupaten Tapin Lengkap</p>
            <p className="text-brand-dark/80 mt-1 text-[11px]">
              Tampilkan direktori gabungan tanpa filter wilayah geografis.
            </p>
            <div className="text-brand-dark mt-3 flex justify-between border-t border-black/10 pt-2 text-[10px] font-black">
              <span>Total 12 Wilayah</span>
              <span>Tampilkan Semua →</span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}

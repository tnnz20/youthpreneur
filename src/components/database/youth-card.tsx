import { Button } from '@/components/ui/button';

import type { YouthProfile } from '@/types/database';

interface YouthCardProps {
  profile: YouthProfile;
  onView: (profile: YouthProfile) => void;
}

export function YouthCard({ profile, onView }: YouthCardProps) {
  const isAchiever = profile.status === 'Juara Daerah';

  return (
    <div className="border-brand-dark shadow-solid-sm flex flex-col justify-between overflow-hidden rounded-2xl border-2 bg-white transition-all duration-200 hover:-translate-y-1">
      <div className="p-5 pb-3">
        <div className="mb-3 flex items-start justify-between gap-2">
          <span
            className={`border-brand-dark text-brand-dark rounded-md border px-2.5 py-1 text-[10px] font-black tracking-wider uppercase ${profile.badgeColor}`}
          >
            {profile.kategori}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              isAchiever
                ? 'border border-amber-300 bg-amber-100 text-amber-900'
                : 'border border-emerald-300 bg-emerald-100 text-emerald-800'
            }`}
          >
            {profile.status}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="border-brand-dark bg-brand-yellow shadow-solid-sm flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 text-xl">
            {profile.icon}
          </div>
          <div>
            <h3 className="text-brand-dark text-base leading-tight font-black">{profile.nama}</h3>
            <p className="mt-0.5 text-xs font-bold text-amber-800">{profile.usaha}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-3 text-xs">
          <span className="text-brand-muted flex items-center gap-1">
            📍 <strong className="text-brand-dark">{profile.kecamatan}</strong>
          </span>
          <span className="text-[11px] font-semibold text-gray-500">{profile.id}</span>
        </div>

        <p className="text-brand-muted mt-2.5 line-clamp-2 text-xs leading-relaxed">
          {profile.deskripsi}
        </p>
      </div>

      <div className="border-brand-dark flex items-center justify-between border-t-2 bg-[#FAF7F2] px-5 py-3">
        <div className="text-brand-dark max-w-[170px] truncate text-[11px] font-bold">
          {profile.produk}
        </div>
        <Button
          type="button"
          onClick={() => onView(profile)}
          className="bg-brand-dark h-auto rounded-lg px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-black active:scale-95"
        >
          Lihat Profil →
        </Button>
      </div>
    </div>
  );
}

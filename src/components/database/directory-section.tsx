import { useState } from 'react';

import { ProfileDetailDialog } from '@/components/database/profile-detail-dialog';
import { YouthCard } from '@/components/database/youth-card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { YouthDirectoryState } from '@/hooks/use-youth-directory';
import { ALL_FILTER } from '@/hooks/use-youth-directory';

import type { YouthProfile } from '@/types/database';

import { CATEGORY_OPTIONS, KECAMATAN_FILTER_OPTIONS, STATUS_OPTIONS } from '@/constants/database';

import { Search } from 'lucide-react';

interface DirectorySectionProps {
  directory: YouthDirectoryState;
}

export function DirectorySection({ directory }: DirectorySectionProps) {
  const [selectedProfile, setSelectedProfile] = useState<YouthProfile | null>(null);

  const {
    filtered,
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
    kecamatan,
    setKecamatan,
    status,
    setStatus,
    resetFilters,
  } = directory;

  return (
    <section id="direktori" className="py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="bg-brand-purple border-brand-dark text-brand-dark mb-3 inline-block rounded-full border px-3 py-1 text-xs font-bold">
              Katalog Terbuka
            </div>
            <h2 className="text-brand-dark text-3xl font-black tracking-tight sm:text-4xl">
              Direktori Pemuda & Wirausaha Tapin
            </h2>
            <p className="text-brand-muted mt-2 max-w-xl text-sm sm:text-base">
              Gunakan kata kunci atau saring berdasarkan kategori minat dan 12 kecamatan untuk
              menemukan profil talenta dan produk unggulan.
            </p>
          </div>

          <div className="border-brand-dark shadow-solid-sm flex items-center gap-2 self-start rounded-2xl border-2 bg-white px-4 py-2.5 text-xs font-bold md:self-auto">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
            <span>
              Menampilkan <strong className="text-brand-dark text-sm">{filtered.length}</strong>{' '}
              Profil Aktif
            </span>
          </div>
        </div>

        <div className="border-brand-dark shadow-solid-lg mb-10 space-y-5 rounded-3xl border-2 bg-white p-5 sm:p-7">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            <div className="md:col-span-6">
              <label
                htmlFor="direktori-search"
                className="text-brand-muted mb-1.5 block text-[11px] font-black tracking-wider uppercase"
              >
                Pencarian Data
              </label>
              <div className="relative">
                <Search
                  className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="direktori-search"
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Ketik nama, jenis usaha (Cabai Hiyung, Purun, Sasirangan), dsb..."
                  className="focus:border-brand-dark h-12 w-full rounded-2xl border border-black/30 bg-[#FAF7F2] pr-4 pl-11 text-base transition-all focus:outline-none sm:text-sm"
                />
              </div>
            </div>

            <div className="md:col-span-3">
              <label
                htmlFor="direktori-kecamatan"
                className="text-brand-muted mb-1.5 block text-[11px] font-black tracking-wider uppercase"
              >
                Pilih Kecamatan
              </label>
              <Select
                value={kecamatan}
                onValueChange={(value) => setKecamatan(value ?? ALL_FILTER)}
              >
                <SelectTrigger
                  id="direktori-kecamatan"
                  className="text-brand-dark focus-visible:border-brand-dark h-12 w-full rounded-2xl border border-black/30 bg-[#FAF7F2] px-4 py-0 text-xs font-medium focus-visible:ring-0 data-[size=default]:h-12 sm:text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_FILTER}>Semua Kecamatan (12 Wilayah)</SelectItem>
                  {KECAMATAN_FILTER_OPTIONS.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3">
              <label
                htmlFor="direktori-status"
                className="text-brand-muted mb-1.5 block text-[11px] font-black tracking-wider uppercase"
              >
                Status Binaan
              </label>
              <Select value={status} onValueChange={(value) => setStatus(value ?? ALL_FILTER)}>
                <SelectTrigger
                  id="direktori-status"
                  className="text-brand-dark focus-visible:border-brand-dark h-12 w-full rounded-2xl border border-black/30 bg-[#FAF7F2] px-4 py-0 text-xs font-medium focus-visible:ring-0 data-[size=default]:h-12 sm:text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto border-t border-black/10 pt-2 pb-1 text-xs">
            <span className="text-brand-muted mr-2 text-[11px] font-bold whitespace-nowrap uppercase">
              Kategori:
            </span>
            {CATEGORY_OPTIONS.map((option) => {
              const active = category === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setCategory(option.value)}
                  className={`border-brand-dark cursor-pointer rounded-full border px-4 py-2 font-bold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-brand-dark shadow-solid-sm text-white'
                      : `text-brand-dark bg-white ${option.hover}`
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((profile) => (
              <YouthCard key={profile.id} profile={profile} onView={setSelectedProfile} />
            ))}
          </div>
        ) : (
          <div className="border-brand-dark shadow-solid-sm rounded-3xl border-2 bg-white p-12 text-center">
            <div className="border-brand-dark bg-brand-yellow mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-2 text-3xl">
              🔍
            </div>
            <h3 className="text-brand-dark text-xl font-black">Data Tidak Ditemukan</h3>
            <p className="text-brand-muted mx-auto mt-2 max-w-md text-sm">
              Tidak ada profil pemuda yang cocok dengan kriteria pencarian Anda. Coba kata kunci
              lain atau daftarkan profil baru ke BADAPATAN.
            </p>
            <Button
              type="button"
              onClick={resetFilters}
              className="bg-brand-dark mt-5 h-auto rounded-full px-6 py-2.5 text-xs font-bold text-white hover:bg-black"
            >
              Reset Semua Filter
            </Button>
          </div>
        )}
      </div>

      <ProfileDetailDialog
        profile={selectedProfile}
        open={selectedProfile !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProfile(null);
          }
        }}
      />
    </section>
  );
}

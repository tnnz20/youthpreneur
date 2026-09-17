import { useState } from 'react';

import { toast } from 'sonner';

import { EmptyState } from '@/components/dashboard/shared/empty-state';
import { SectionHeading } from '@/components/dashboard/shared/section-heading';
import { ProgramCard } from '@/components/dashboard/user/program-card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useDashboard } from '@/hooks/use-dashboard';
import { ALL_FILTER } from '@/hooks/use-youth-directory';

import type { TrainingProgram } from '@/types/dashboard';

import { PROGRAM_CATEGORY_OPTIONS, PROGRAM_STATUS_OPTIONS } from '@/constants/dashboard';

import { GraduationCap, Search } from 'lucide-react';

const selectClassName =
  'text-dash-fg focus-visible:border-dash-fg h-12 w-full rounded-2xl border border-dash-border bg-dash-surface-2 px-4 py-0 text-xs font-medium focus-visible:ring-0 data-[size=default]:h-12 sm:text-sm';

const LABEL_CLASS =
  'text-dash-muted mb-1.5 block text-[11px] font-semibold tracking-wide uppercase';

export default function DashboardProgramPage() {
  const { programs, registrations } = useDashboard();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string>(ALL_FILTER);
  const [status, setStatus] = useState<string>(ALL_FILTER);

  const query = searchTerm.toLowerCase().trim();
  const filtered = programs.programs.filter((program) => {
    const matchesCategory = category === ALL_FILTER || program.kategori === category;
    const matchesStatus = status === ALL_FILTER || program.status === status;
    const matchesSearch =
      !query ||
      [program.judul, program.mentor, program.lokasi].some((value) =>
        value.toLowerCase().includes(query)
      );

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleRegister = (program: TrainingProgram) => {
    registrations.register(program);
    toast.success(`Pendaftaran "${program.judul}" terkirim. Menunggu verifikasi Dispora.`);
  };

  return (
    <>
      <SectionHeading
        title="Katalog Program Pelatihan"
        description="Temukan program pelatihan Dispora Kabupaten Tapin yang sesuai dengan minat usahamu, lalu daftar langsung dari halaman ini."
      />

      <div className="border-dash-border/60 bg-dash-surface shadow-bento mb-5 space-y-4 rounded-[2rem] border p-5 sm:p-6 lg:mb-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-6">
            <label htmlFor="katalog-search" className={LABEL_CLASS}>
              Pencarian Program
            </label>
            <div className="relative">
              <Search
                className="text-dash-muted absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2"
                aria-hidden="true"
              />
              <Input
                id="katalog-search"
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Cari judul, mentor, atau lokasi pelatihan..."
                className="text-dash-fg focus-visible:border-dash-fg border-dash-border bg-dash-surface-2 h-12 rounded-2xl pr-4 pl-11 text-base focus-visible:ring-0 sm:text-sm"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label htmlFor="katalog-kategori" className={LABEL_CLASS}>
              Kategori
            </label>
            <Select value={category} onValueChange={(value) => setCategory(value ?? ALL_FILTER)}>
              <SelectTrigger id="katalog-kategori" className={selectClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER}>Semua Kategori</SelectItem>
                {PROGRAM_CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-3">
            <label htmlFor="katalog-status" className={LABEL_CLASS}>
              Status
            </label>
            <Select value={status} onValueChange={(value) => setStatus(value ?? ALL_FILTER)}>
              <SelectTrigger id="katalog-status" className={selectClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER}>Semua Status</SelectItem>
                {PROGRAM_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-dash-border/60 flex items-center gap-2 overflow-x-auto border-t pt-3 text-xs font-semibold">
          <span className="text-dash-muted mr-1 text-[11px] font-bold whitespace-nowrap uppercase">
            Kategori cepat:
          </span>
          {[{ value: ALL_FILTER, label: 'Semua' }, ...PROGRAM_CATEGORY_OPTIONS].map((option) => {
            const active = category === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setCategory(option.value)}
                className={`rounded-full border px-3.5 py-1.5 font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-dash-fg text-dash-bg border-transparent shadow-md'
                    : 'border-dash-border/60 bg-dash-surface-2 text-dash-muted hover:text-dash-fg'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="text-dash-muted border-dash-border/60 flex items-center gap-2 border-t pt-3 text-xs font-semibold">
          <span className="bg-dash-accent dash-pulse h-2.5 w-2.5 rounded-full" />
          <span>
            <strong className="text-dash-fg text-sm font-extrabold">{filtered.length}</strong>{' '}
            program tersedia
          </span>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((program, index) => (
            <div
              key={program.id}
              className="dash-reveal"
              style={{ animationDelay: `${Math.min(index, 9) * 50}ms` }}
            >
              <ProgramCard
                program={program}
                registered={registrations.isRegistered(program.id)}
                onRegister={handleRegister}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={GraduationCap}
          title="Program Tidak Ditemukan"
          description="Tidak ada program yang cocok dengan filter. Coba ubah kata kunci atau kategori."
        />
      )}
    </>
  );
}

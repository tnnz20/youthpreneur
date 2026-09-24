import { Link } from 'react-router';

import { cn } from '@/lib/utils';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { UserTrainingState } from '@/hooks/use-user-trainings';

import { GraduationCap, RotateCcw, Search } from 'lucide-react';

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento';
const SELECT_CLASS =
  'text-dash-fg focus-visible:border-dash-fg w-full rounded-2xl border border-dash-border bg-dash-surface-2 px-3.5 py-0 text-xs focus-visible:ring-0 data-[size=default]:h-11 sm:text-sm';
const INPUT_CLASS =
  'text-dash-fg focus-visible:border-dash-fg h-11 rounded-2xl border border-dash-border bg-dash-surface-2 px-3.5 text-sm focus-visible:ring-0';
const LABEL_CLASS =
  'text-dash-muted mb-1.5 block text-[11px] font-semibold tracking-wide uppercase';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Semua Status Pendaftaran' },
  { value: 'pending', label: 'Menunggu Konfirmasi' },
  { value: 'accepted', label: 'Diterima' },
  { value: 'rejected', label: 'Ditolak' },
  { value: 'cancelled', label: 'Dibatalkan' },
];

interface UserTrainingTableFiltersProps {
  state: UserTrainingState;
}

export function UserTrainingTableFilters({ state }: UserTrainingTableFiltersProps) {
  const { search, filters, error, loading, setSearch, setStatus, resetFilters } = state;

  const filtersActive = search.trim() !== '' || filters.status !== 'all';

  return (
    <div className={`${CARD} space-y-4 p-5`}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-12">
        <div className="md:col-span-8">
          <label htmlFor="user-training-filter-search" className={LABEL_CLASS}>
            Cari Pelatihan
          </label>
          <div className="relative">
            <Search
              className="text-dash-muted pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              id="user-training-filter-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari judul pelatihan atau ID pendaftaran..."
              className={`${INPUT_CLASS} pl-10`}
            />
          </div>
        </div>

        <div className="md:col-span-4">
          <label htmlFor="user-training-filter-status" className={LABEL_CLASS}>
            Status Pendaftaran
          </label>
          <Select
            value={filters.status}
            onValueChange={(val) => setStatus(val ?? 'all')}
            items={STATUS_OPTIONS}
          >
            <SelectTrigger id="user-training-filter-status" className={SELECT_CLASS}>
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-dash-border flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <div>
          {error && (
            <p className="text-xs font-medium text-rose-500" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetFilters}
            disabled={loading || !filtersActive}
            className="border-dash-border rounded-full"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset Filter
          </Button>

          <Link
            to="/training-catalog"
            className={cn(buttonVariants({ variant: 'lime', size: 'sm' }), 'rounded-full')}
          >
            <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
            Jelajahi Katalog
          </Link>
        </div>
      </div>
    </div>
  );
}

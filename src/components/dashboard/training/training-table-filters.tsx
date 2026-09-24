import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { TrainingState } from '@/hooks/use-trainings';

import type { TrainingCategory, TrainingStatus } from '@/types/trainings';

import { TRAINING_CATEGORY_OPTIONS, TRAINING_STATUS_OPTIONS } from '@/constants/trainings';

import { Plus, RotateCcw, Search } from 'lucide-react';

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento';
const SELECT_CLASS =
  'text-dash-fg focus-visible:border-dash-fg w-full rounded-2xl border border-dash-border bg-dash-surface-2 px-3.5 py-0 text-xs focus-visible:ring-0 data-[size=default]:h-11 sm:text-sm';
const INPUT_CLASS =
  'text-dash-fg focus-visible:border-dash-fg h-11 rounded-2xl border border-dash-border bg-dash-surface-2 px-3.5 text-sm focus-visible:ring-0';
const LABEL_CLASS =
  'text-dash-muted mb-1.5 block text-[11px] font-semibold tracking-wide uppercase';

interface TrainingTableFiltersProps {
  state: TrainingState;
  onOpenCreate: () => void;
}

export function TrainingTableFilters({ state, onOpenCreate }: TrainingTableFiltersProps) {
  const { filters, search, error, loading, setSearch, setCategory, setStatus, resetFilters } =
    state;

  const filtersActive =
    search.trim() !== '' || filters.category !== 'semua' || filters.training_status !== 'semua';

  return (
    <div className={`${CARD} space-y-4 p-5`}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="training-filter-search" className={LABEL_CLASS}>
            Cari Pelatihan
          </label>
          <div className="relative">
            <Search
              className="text-dash-muted pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              id="training-filter-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari judul pelatihan atau mentor..."
              className={`${INPUT_CLASS} pl-10`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="training-filter-category" className={LABEL_CLASS}>
            Kategori Pelatihan
          </label>
          <Select
            value={filters.category === 'semua' ? null : filters.category}
            onValueChange={(value) => setCategory((value ?? 'semua') as TrainingCategory | 'semua')}
            items={TRAINING_CATEGORY_OPTIONS}
          >
            <SelectTrigger id="training-filter-category" className={SELECT_CLASS}>
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              {TRAINING_CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.label} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="training-filter-status" className={LABEL_CLASS}>
            Status Pelatihan
          </label>
          <Select
            value={filters.training_status === 'semua' ? null : filters.training_status}
            onValueChange={(value) => setStatus((value ?? 'semua') as TrainingStatus | 'semua')}
            items={TRAINING_STATUS_OPTIONS}
          >
            <SelectTrigger id="training-filter-status" className={SELECT_CLASS}>
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              {TRAINING_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.label} value={option.value}>
                  {option.label}
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

          <Button
            type="button"
            variant="lime"
            size="sm"
            onClick={onOpenCreate}
            className="rounded-full"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Tambahkan Program
          </Button>
        </div>
      </div>
    </div>
  );
}

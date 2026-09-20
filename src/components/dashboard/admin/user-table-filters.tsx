import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { UserState } from '@/hooks/use-users';

import type { UserGender } from '@/types/users';

import { KECAMATAN } from '@/constants/site';
import { GENDER_OPTIONS } from '@/constants/users';

import { RotateCcw } from 'lucide-react';

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento';
const SELECT_CLASS =
  'text-dash-fg focus-visible:border-dash-fg w-full rounded-2xl border border-dash-border bg-dash-surface-2 px-3.5 py-0 text-xs focus-visible:ring-0 data-[size=default]:h-11 sm:text-sm';
const INPUT_CLASS =
  'text-dash-fg focus-visible:border-dash-fg h-11 rounded-2xl border border-dash-border bg-dash-surface-2 px-3.5 text-sm focus-visible:ring-0';
const LABEL_CLASS =
  'text-dash-muted mb-1.5 block text-[11px] font-semibold tracking-wide uppercase';

interface UserTableFiltersProps {
  state: UserState;
}

export function UserTableFilters({ state }: UserTableFiltersProps) {
  const { filters, search, error, setSearch, setDistrict, setGender, resetFilters } = state;

  return (
    <div className={`${CARD} space-y-4 p-5`}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-5">
          <label htmlFor="user-search" className={LABEL_CLASS}>
            Cari Nama
          </label>
          <Input
            id="user-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama pengguna"
            className={INPUT_CLASS}
          />
        </div>

        <div className="md:col-span-4">
          <label htmlFor="user-district" className={LABEL_CLASS}>
            Kecamatan
          </label>
          <Select
            value={filters.district || null}
            onValueChange={(value) => setDistrict(value ?? '')}
            items={[
              { label: 'Semua Kecamatan', value: null },
              ...KECAMATAN.map((name) => ({ label: name, value: name })),
            ]}
          >
            <SelectTrigger id="user-district" className={SELECT_CLASS}>
              <SelectValue placeholder="Semua Kecamatan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>Semua Kecamatan</SelectItem>
              {KECAMATAN.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-3">
          <label htmlFor="user-gender" className={LABEL_CLASS}>
            Jenis Kelamin
          </label>
          <Select
            value={filters.gender === 'all' ? null : filters.gender}
            onValueChange={(value) => setGender((value ?? 'all') as UserGender | 'all')}
            items={GENDER_OPTIONS}
          >
            <SelectTrigger id="user-gender" className={SELECT_CLASS}>
              <SelectValue placeholder="Semua Jenis Kelamin" />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map((option) => (
                <SelectItem key={option.label} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col justify-end gap-3 sm:flex-row sm:items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="border-dash-border self-start rounded-full sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset Filter
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-xs font-semibold text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
}

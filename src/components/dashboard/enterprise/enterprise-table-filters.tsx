import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { EnterpriseState } from '@/hooks/use-enterprises';

import type { EnterpriseStatus, LegalStatus, ProcessStatus } from '@/types/enterprises';

import {
  BUSINESS_SECTOR_OPTIONS,
  ENTERPRISE_STATUS_OPTIONS,
  LEGAL_STATUS_OPTIONS,
  MENTORING_STATUS_OPTIONS,
} from '@/constants/enterprises';
import { KECAMATAN } from '@/constants/site';

import { Plus, RotateCcw } from 'lucide-react';

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento';
const SELECT_CLASS =
  'text-dash-fg focus-visible:border-dash-fg w-full rounded-2xl border border-dash-border bg-dash-surface-2 px-3.5 py-0 text-xs focus-visible:ring-0 data-[size=default]:h-11 sm:text-sm';
const INPUT_CLASS =
  'text-dash-fg focus-visible:border-dash-fg h-11 rounded-2xl border border-dash-border bg-dash-surface-2 px-3.5 text-sm focus-visible:ring-0';
const LABEL_CLASS =
  'text-dash-muted mb-1.5 block text-[11px] font-semibold tracking-wide uppercase';

interface EnterpriseTableFiltersProps {
  state: EnterpriseState;
  onOpenCreate: () => void;
}

export function EnterpriseTableFilters({ state, onOpenCreate }: EnterpriseTableFiltersProps) {
  const {
    filters,
    search,
    error,
    setSearch,
    setDistrict,
    setStatus,
    setBusinessSector,
    setLegalStatus,
    setMentoringStatus,
    resetFilters,
  } = state;

  return (
    <div className={`${CARD} space-y-4 p-5`}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div>
          <label htmlFor="ent-filter-search" className={LABEL_CLASS}>
            Cari Usaha
          </label>
          <Input
            id="ent-filter-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama usaha..."
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor="ent-filter-district" className={LABEL_CLASS}>
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
            <SelectTrigger id="ent-filter-district" className={SELECT_CLASS}>
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

        <div>
          <label htmlFor="ent-filter-sector" className={LABEL_CLASS}>
            Sektor Usaha
          </label>
          <Select
            value={filters.business_sector || null}
            onValueChange={(value) => setBusinessSector(value ?? '')}
            items={[
              { label: 'Semua Sektor', value: null },
              ...BUSINESS_SECTOR_OPTIONS.map((item) => ({ label: item.label, value: item.value })),
            ]}
          >
            <SelectTrigger id="ent-filter-sector" className={SELECT_CLASS}>
              <SelectValue placeholder="Semua Sektor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>Semua Sektor</SelectItem>
              {BUSINESS_SECTOR_OPTIONS.map((sector) => (
                <SelectItem key={sector.value} value={sector.value}>
                  {sector.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="ent-filter-legal" className={LABEL_CLASS}>
            Legalitas
          </label>
          <Select
            value={filters.legal_status === 'all' ? null : filters.legal_status}
            onValueChange={(value) => setLegalStatus((value ?? 'all') as LegalStatus | 'all')}
            items={LEGAL_STATUS_OPTIONS}
          >
            <SelectTrigger id="ent-filter-legal" className={SELECT_CLASS}>
              <SelectValue placeholder="Semua Legalitas" />
            </SelectTrigger>
            <SelectContent>
              {LEGAL_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.label} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="ent-filter-mentoring" className={LABEL_CLASS}>
            Pendampingan
          </label>
          <Select
            value={filters.mentoring_status === 'all' ? null : filters.mentoring_status}
            onValueChange={(value) => setMentoringStatus((value ?? 'all') as ProcessStatus | 'all')}
            items={MENTORING_STATUS_OPTIONS}
          >
            <SelectTrigger id="ent-filter-mentoring" className={SELECT_CLASS}>
              <SelectValue placeholder="Semua Pendampingan" />
            </SelectTrigger>
            <SelectContent>
              {MENTORING_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.label} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="ent-filter-status" className={LABEL_CLASS}>
            Status Wirausaha
          </label>
          <Select
            value={filters.status === 'all' ? null : filters.status}
            onValueChange={(value) => setStatus((value ?? 'all') as EnterpriseStatus | 'all')}
            items={ENTERPRISE_STATUS_OPTIONS}
          >
            <SelectTrigger id="ent-filter-status" className={SELECT_CLASS}>
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              {ENTERPRISE_STATUS_OPTIONS.map((option) => (
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
        <Button
          type="button"
          variant="lime"
          size="sm"
          onClick={onOpenCreate}
          className="self-start rounded-full sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Tambahkan Wirausaha
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

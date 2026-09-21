import { useNavigate } from 'react-router';

import { formatCurrency, formatUnixDateTime, renderValue } from '@/lib/utils';

import { StatusBadge } from '@/components/dashboard/shared/status-badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { type EnterpriseState, useEnterprises } from '@/hooks/use-enterprises';

import type { EnterpriseStatus } from '@/types/enterprises';

import {
  BUSINESS_SECTOR_OPTIONS,
  ENTERPRISE_PAGE_SIZE_OPTIONS,
  ENTERPRISE_STATUS_LABELS,
  ENTERPRISE_STATUS_OPTIONS,
} from '@/constants/enterprises';
import { KECAMATAN } from '@/constants/site';

import { Eye, MoreHorizontal, RotateCcw, SearchX } from 'lucide-react';

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento';
const HEAD_CLASS = 'text-dash-muted text-[11px] font-semibold tracking-wide uppercase';
const SELECT_CLASS =
  'text-dash-fg focus-visible:border-dash-fg w-full rounded-2xl border border-dash-border bg-dash-surface-2 px-3.5 py-0 text-xs focus-visible:ring-0 data-[size=default]:h-11 sm:text-sm';
const LABEL_CLASS =
  'text-dash-muted mb-1.5 block text-[11px] font-semibold tracking-wide uppercase';
const COLUMN_COUNT = 8;

interface EnterpriseAdminTableProps {
  state?: EnterpriseState;
}

export function EnterpriseAdminTable({ state: customState }: EnterpriseAdminTableProps = {}) {
  const defaultState = useEnterprises();
  const state = customState ?? defaultState;
  const navigate = useNavigate();

  const {
    enterprises,
    filters,
    limit,
    loading,
    mutatingId,
    error,
    hasCursor,
    hasNextPage,
    hasPreviousPage,
    setDistrict,
    setStatus,
    setBusinessSector,
    setLimit,
    resetFilters,
    nextPage,
    previousPage,
    goToFirstPage,
  } = state;

  const filtersActive =
    filters.district.trim() !== '' ||
    filters.status !== 'all' ||
    filters.business_sector.trim() !== '';

  return (
    <div className="space-y-5">
      <div className={`${CARD} space-y-4 p-5`}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-4">
            <label htmlFor="ent-admin-district" className={LABEL_CLASS}>
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
              <SelectTrigger id="ent-admin-district" className={SELECT_CLASS}>
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

          <div className="md:col-span-4">
            <label htmlFor="ent-admin-sector" className={LABEL_CLASS}>
              Sektor Usaha
            </label>
            <Select
              value={filters.business_sector || null}
              onValueChange={(value) => setBusinessSector(value ?? '')}
              items={[
                { label: 'Semua Sektor', value: null },
                ...BUSINESS_SECTOR_OPTIONS.map((item) => ({
                  label: item.label,
                  value: item.value,
                })),
              ]}
            >
              <SelectTrigger id="ent-admin-sector" className={SELECT_CLASS}>
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

          <div className="md:col-span-4">
            <label htmlFor="ent-admin-status" className={LABEL_CLASS}>
              Status Wirausaha
            </label>
            <Select
              value={filters.status === 'all' ? null : filters.status}
              onValueChange={(value) => setStatus((value ?? 'all') as EnterpriseStatus | 'all')}
              items={ENTERPRISE_STATUS_OPTIONS}
            >
              <SelectTrigger id="ent-admin-status" className={SELECT_CLASS}>
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

        <div className="flex items-center justify-between gap-3">
          <span className="text-dash-muted text-xs font-semibold">
            <strong className="text-dash-fg text-sm font-extrabold">{enterprises.length}</strong>{' '}
            wirausaha ditampilkan
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="border-dash-border rounded-full"
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

      <div className={`${CARD} dash-reveal overflow-hidden`}>
        {loading && (
          <span role="status" className="sr-only">
            Memuat data wirausaha...
          </span>
        )}
        <Table aria-busy={loading}>
          <TableHeader className="bg-dash-surface-2">
            <TableRow className="border-dash-border hover:bg-transparent">
              <TableHead scope="col" className={`${HEAD_CLASS} pl-6 sm:pl-8`}>
                Nama Wirausaha
              </TableHead>
              <TableHead scope="col" className={HEAD_CLASS}>
                Sektor Usaha
              </TableHead>
              <TableHead scope="col" className={HEAD_CLASS}>
                Kecamatan
              </TableHead>
              <TableHead scope="col" className={HEAD_CLASS}>
                Status
              </TableHead>
              <TableHead scope="col" className={HEAD_CLASS}>
                Omzet Awal
              </TableHead>
              <TableHead scope="col" className={HEAD_CLASS}>
                Omzet Saat Ini
              </TableHead>
              <TableHead scope="col" className={HEAD_CLASS}>
                Diperbarui
              </TableHead>
              <TableHead scope="col" className={`${HEAD_CLASS} pr-6 text-right sm:pr-8`}>
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading &&
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow
                  key={`skeleton-${index}`}
                  className="border-dash-border"
                  aria-hidden="true"
                >
                  {Array.from({ length: COLUMN_COUNT }).map((__, cellIndex) => (
                    <TableCell key={`skeleton-${index}-${cellIndex}`}>
                      <Skeleton className="bg-dash-surface-2 h-3.5 w-full rounded-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading &&
              enterprises.map((enterprise) => {
                const isMutating = mutatingId === enterprise.public_id;

                return (
                  <TableRow
                    key={enterprise.public_id}
                    className="border-dash-border hover:bg-dash-surface-2/60"
                  >
                    <TableCell className="py-3.5 pl-6 font-bold sm:pl-8">
                      {renderValue(enterprise.name)}
                    </TableCell>
                    <TableCell className="text-dash-muted py-3.5 text-xs font-medium">
                      {renderValue(enterprise.business_sector)}
                    </TableCell>
                    <TableCell className="text-dash-muted py-3.5 text-xs font-medium">
                      {renderValue(enterprise.district)}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <StatusBadge
                        label={ENTERPRISE_STATUS_LABELS[enterprise.status] ?? enterprise.status}
                      />
                    </TableCell>
                    <TableCell className="text-dash-muted py-3.5 text-xs font-medium">
                      {formatCurrency(enterprise.initial_turnover)}
                    </TableCell>
                    <TableCell className="text-dash-muted py-3.5 text-xs font-medium">
                      {formatCurrency(enterprise.current_turnover)}
                    </TableCell>
                    <TableCell className="text-dash-muted py-3.5 text-xs font-medium">
                      {formatUnixDateTime(enterprise.updated_at)}
                    </TableCell>
                    <TableCell className="py-3.5 pr-6 text-right sm:pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          disabled={loading || isMutating}
                          className="border-dash-border text-dash-muted hover:bg-dash-surface-2 hover:text-dash-fg focus-visible:border-dash-fg focus-visible:ring-dash-fg/40 inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
                          aria-label={`Aksi untuk ${enterprise.name ?? enterprise.business_sector}`}
                        >
                          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/dashboard/enterprises/${enterprise.public_id}`)
                            }
                            className="text-dash-fg hover:bg-dash-surface-2 cursor-pointer py-2 text-sm font-medium"
                          >
                            <Eye className="h-4 w-4" aria-hidden="true" />
                            Lihat Detail
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>

        {!loading && enterprises.length === 0 && (
          <Empty className="p-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchX aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>
                {filtersActive
                  ? 'Wirausaha Tidak Ditemukan'
                  : hasCursor
                    ? 'Halaman Tidak Tersedia'
                    : 'Belum Ada Wirausaha'}
              </EmptyTitle>
              <EmptyDescription>
                {filtersActive
                  ? 'Tidak ada unit wirausaha yang cocok dengan filter yang dipilih.'
                  : hasCursor
                    ? 'Halaman ini sudah tidak berisi data wirausaha.'
                    : 'Belum ada unit wirausaha yang terdaftar pada ekosistem BADAPATAN.'}
              </EmptyDescription>
            </EmptyHeader>
            {filtersActive ? (
              <EmptyContent>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="border-dash-border rounded-full"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Reset Filter
                </Button>
              </EmptyContent>
            ) : hasCursor ? (
              <EmptyContent>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={goToFirstPage}
                  className="border-dash-border rounded-full"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Kembali ke halaman pertama
                </Button>
              </EmptyContent>
            ) : null}
          </Empty>
        )}

        <div className="border-dash-border flex flex-col justify-between gap-3 border-t p-4 sm:flex-row sm:items-center sm:px-8">
          <div className="flex items-center gap-2">
            <span className="text-dash-muted text-xs font-semibold">Baris per halaman</span>
            <Select
              value={String(limit)}
              onValueChange={(value) => setLimit(Number(value ?? limit))}
            >
              <SelectTrigger id="ent-admin-limit" className="h-9 w-[88px] rounded-full" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ENTERPRISE_PAGE_SIZE_OPTIONS.map((value) => (
                  <SelectItem key={value} value={String(value)}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  text="Sebelumnya"
                  disabled={loading || !hasPreviousPage}
                  className="rounded-full"
                  onClick={previousPage}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  text="Berikutnya"
                  disabled={loading || !hasNextPage}
                  className="rounded-full"
                  onClick={nextPage}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

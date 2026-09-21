import { useNavigate } from 'react-router';

import { formatCurrency, renderValue } from '@/lib/utils';

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

import type { EnterpriseState } from '@/hooks/use-enterprises';

import type { Enterprise } from '@/types/enterprises';

import {
  ENTERPRISE_PAGE_SIZE_OPTIONS,
  ENTERPRISE_STATUS_LABELS,
  LEGAL_STATUS_LABELS,
  PROCESS_STATUS_LABELS,
} from '@/constants/enterprises';

import { Eye, MoreHorizontal, Pencil, Plus, RotateCcw, SearchX, Trash2 } from 'lucide-react';

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento';
const HEAD_CLASS = 'text-dash-muted text-[11px] font-semibold tracking-wide uppercase';
const COLUMN_COUNT = 9;

interface EnterpriseTableContentProps {
  state: EnterpriseState;
  filtersActive: boolean;
  onRequestDelete: (enterprise: Enterprise) => void;
  onRequestEdit: (enterprise: Enterprise) => void;
  onOpenCreate: () => void;
}

export function EnterpriseTableContent({
  state,
  filtersActive,
  onRequestDelete,
  onRequestEdit,
  onOpenCreate,
}: EnterpriseTableContentProps) {
  const navigate = useNavigate();

  const {
    enterprises,
    limit,
    loading,
    mutatingId,
    hasCursor,
    hasNextPage,
    hasPreviousPage,
    setLimit,
    nextPage,
    previousPage,
    goToFirstPage,
    resetFilters,
  } = state;

  return (
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
              Nama Usaha
            </TableHead>
            <TableHead scope="col" className={HEAD_CLASS}>
              Sektor Usaha
            </TableHead>
            <TableHead scope="col" className={HEAD_CLASS}>
              Kecamatan
            </TableHead>
            <TableHead scope="col" className={HEAD_CLASS}>
              Legalitas
            </TableHead>
            <TableHead scope="col" className={HEAD_CLASS}>
              Pendampingan
            </TableHead>
            <TableHead scope="col" className={HEAD_CLASS}>
              Omzet Awal
            </TableHead>
            <TableHead scope="col" className={HEAD_CLASS}>
              Omzet Saat Ini
            </TableHead>
            <TableHead scope="col" className={HEAD_CLASS}>
              Status
            </TableHead>
            <TableHead scope="col" className={`${HEAD_CLASS} pr-6 text-right sm:pr-8`}>
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading &&
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`} className="border-dash-border" aria-hidden="true">
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
                    {renderValue(enterprise.enterprise_name ?? enterprise.name)}
                  </TableCell>
                  <TableCell className="text-dash-muted py-3.5 text-xs font-medium">
                    {renderValue(enterprise.business_sector)}
                  </TableCell>
                  <TableCell className="text-dash-muted py-3.5 text-xs font-medium">
                    {renderValue(enterprise.district)}
                  </TableCell>
                  <TableCell className="py-3.5">
                    {enterprise.legal_status ? (
                      <StatusBadge label={LEGAL_STATUS_LABELS[enterprise.legal_status]} />
                    ) : (
                      <span className="text-dash-muted text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5">
                    {enterprise.mentoring_status ? (
                      <StatusBadge label={PROCESS_STATUS_LABELS[enterprise.mentoring_status]} />
                    ) : (
                      <span className="text-dash-muted text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-dash-muted py-3.5 text-xs font-medium">
                    {formatCurrency(enterprise.initial_turnover)}
                  </TableCell>
                  <TableCell className="text-dash-muted py-3.5 text-xs font-medium">
                    {formatCurrency(enterprise.current_turnover)}
                  </TableCell>
                  <TableCell className="py-3.5">
                    <StatusBadge
                      label={ENTERPRISE_STATUS_LABELS[enterprise.status] ?? enterprise.status}
                    />
                  </TableCell>
                  <TableCell className="py-3.5 pr-6 text-right sm:pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        disabled={isMutating}
                        className="border-dash-border text-dash-muted hover:bg-dash-surface-2 hover:text-dash-fg focus-visible:border-dash-fg focus-visible:ring-dash-fg/40 inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
                        aria-label={`Aksi untuk ${enterprise.enterprise_name ?? enterprise.name ?? enterprise.business_sector}`}
                      >
                        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/dashboard/my-enterprises/${enterprise.public_id}`)
                          }
                          className="text-dash-fg hover:bg-dash-surface-2 cursor-pointer py-2 text-sm font-medium"
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onRequestEdit(enterprise)}
                          className="text-dash-fg hover:bg-dash-surface-2 cursor-pointer py-2 text-sm font-medium"
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                          Edit Usaha
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={isMutating}
                          variant="destructive"
                          onClick={() => onRequestDelete(enterprise)}
                          className="text-dash-fg hover:bg-dash-surface-2 cursor-pointer py-2 text-sm font-medium"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          Delete Wirausaha
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
                  : 'Anda belum mendaftarkan unit usaha pada ekosistem BADAPATAN.'}
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
          ) : (
            <EmptyContent>
              <Button
                type="button"
                variant="lime"
                size="sm"
                onClick={onOpenCreate}
                className="rounded-full"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Tambahkan Wirausaha
              </Button>
            </EmptyContent>
          )}
        </Empty>
      )}

      <div className="border-dash-border flex flex-col justify-between gap-3 border-t p-4 sm:flex-row sm:items-center sm:px-8">
        <div className="flex items-center gap-2">
          <span className="text-dash-muted text-xs font-semibold">Baris per halaman</span>
          <Select value={String(limit)} onValueChange={(value) => setLimit(Number(value ?? limit))}>
            <SelectTrigger id="ent-limit" className="h-9 w-[88px] rounded-full" size="sm">
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
  );
}

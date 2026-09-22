import { useState } from 'react';

import { useNavigate } from 'react-router';

import { formatDateOnly, renderValue, resolveImageUrl } from '@/lib/utils';

import { Meter } from '@/components/dashboard/shared/meter';
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

import type { TrainingState } from '@/hooks/use-trainings';

import type { TrainingCatalog } from '@/types/trainings';

import { TRAINING_PAGE_SIZE_OPTIONS, TRAINING_STATUS_LABELS } from '@/constants/trainings';

import {
  ExternalLink,
  Eye,
  GraduationCap,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento';
const HEAD_CLASS = 'text-dash-muted text-[11px] font-semibold tracking-wide uppercase';
const COLUMN_COUNT = 7;

function TrainingThumbnail({ src, title }: { src?: string | null; title?: string | null }) {
  const [failed, setFailed] = useState(false);
  const resolvedUrl = resolveImageUrl(src);

  if (!resolvedUrl || failed) {
    return (
      <div className="bg-dash-surface-2 border-dash-border/60 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border">
        <GraduationCap className="text-dash-muted h-5 w-5" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={resolvedUrl}
      alt={title ?? 'Thumbnail'}
      onError={() => setFailed(true)}
      className="border-dash-border/60 h-12 w-12 shrink-0 rounded-xl border object-cover"
    />
  );
}

interface TrainingTableContentProps {
  state: TrainingState;
  filtersActive: boolean;
  onRequestDelete: (catalog: TrainingCatalog) => void;
  onRequestEdit: (catalog: TrainingCatalog) => void;
  onOpenCreate: () => void;
}

export function TrainingTableContent({
  state,
  filtersActive,
  onRequestDelete,
  onRequestEdit,
  onOpenCreate,
}: TrainingTableContentProps) {
  const navigate = useNavigate();

  const {
    catalogs,
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
          Memuat program pelatihan...
        </span>
      )}
      <Table aria-busy={loading}>
        <TableHeader className="bg-dash-surface-2">
          <TableRow className="border-dash-border hover:bg-transparent">
            <TableHead scope="col" className={`${HEAD_CLASS} pl-6 sm:pl-8`}>
              Program Pelatihan
            </TableHead>
            <TableHead scope="col" className={HEAD_CLASS}>
              Kategori
            </TableHead>
            <TableHead scope="col" className={HEAD_CLASS}>
              Mentor / Pengajar
            </TableHead>
            <TableHead scope="col" className={HEAD_CLASS}>
              Jadwal
            </TableHead>
            <TableHead scope="col" className={HEAD_CLASS}>
              Kuota Pendaftar
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
            catalogs.map((catalog) => {
              const isMutating = mutatingId === catalog.public_id;
              const statusLabel = catalog.training_status
                ? (TRAINING_STATUS_LABELS[catalog.training_status] ?? catalog.training_status)
                : 'Direncanakan';

              const dateRange =
                catalog.start_date && catalog.end_date
                  ? `${formatDateOnly(catalog.start_date)} - ${formatDateOnly(catalog.end_date)}`
                  : catalog.start_date
                    ? `Mulai ${formatDateOnly(catalog.start_date)}`
                    : 'Jadwal belum ditentukan';

              return (
                <TableRow
                  key={catalog.public_id}
                  className="border-dash-border hover:bg-dash-surface-2/60"
                >
                  <TableCell className="py-3.5 pl-6 sm:pl-8">
                    <div className="flex items-center gap-3">
                      <TrainingThumbnail src={catalog.thumbnail} title={catalog.title} />
                      <div className="min-w-0">
                        <p className="text-dash-fg truncate text-sm font-bold">
                          {renderValue(catalog.title)}
                        </p>
                        <p className="text-dash-muted truncate text-xs">ID: {catalog.public_id}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-dash-muted py-3.5 text-xs font-medium">
                    {renderValue(catalog.category)}
                  </TableCell>

                  <TableCell className="text-dash-fg py-3.5 text-xs font-medium">
                    {renderValue(catalog.mentor)}
                  </TableCell>

                  <TableCell className="text-dash-muted py-3.5 text-xs font-medium whitespace-nowrap">
                    {dateRange}
                  </TableCell>

                  <TableCell className="py-3.5">
                    {catalog.max_slots ? (
                      <div className="min-w-[120px] space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-dash-fg font-medium">
                            {catalog.registered_count} / {catalog.max_slots}
                          </span>
                          <span className="text-dash-muted">
                            {Math.min(
                              100,
                              Math.round((catalog.registered_count / catalog.max_slots) * 100)
                            )}
                            %
                          </span>
                        </div>
                        <Meter
                          value={Math.min(
                            100,
                            Math.round((catalog.registered_count / catalog.max_slots) * 100)
                          )}
                        />
                      </div>
                    ) : (
                      <span className="text-dash-fg text-xs font-medium">
                        {catalog.registered_count} (Tanpa Kuota)
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="py-3.5">
                    <StatusBadge label={statusLabel} />
                  </TableCell>

                  <TableCell className="py-3.5 pr-6 text-right sm:pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        disabled={isMutating}
                        className="border-dash-border text-dash-muted hover:bg-dash-surface-2 hover:text-dash-fg focus-visible:border-dash-fg focus-visible:ring-dash-fg/40 inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
                        aria-label={`Aksi untuk ${catalog.title ?? catalog.public_id}`}
                      >
                        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => navigate(`/dashboard/trainings/${catalog.public_id}`)}
                          className="text-dash-fg hover:bg-dash-surface-2 cursor-pointer py-2 text-sm font-medium"
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onRequestEdit(catalog)}
                          className="text-dash-fg hover:bg-dash-surface-2 cursor-pointer py-2 text-sm font-medium"
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                          Edit Program
                        </DropdownMenuItem>
                        {catalog.link && (
                          <DropdownMenuItem
                            onClick={() =>
                              window.open(catalog.link!, '_blank', 'noopener,noreferrer')
                            }
                            className="text-dash-fg hover:bg-dash-surface-2 cursor-pointer py-2 text-sm font-medium"
                          >
                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
                            Kunjungi Tautan
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          disabled={isMutating}
                          variant="destructive"
                          onClick={() => onRequestDelete(catalog)}
                          className="text-dash-fg hover:bg-dash-surface-2 cursor-pointer py-2 text-sm font-medium"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          Hapus Program
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>

      {!loading && catalogs.length === 0 && (
        <Empty className="p-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <GraduationCap aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>
              {filtersActive
                ? 'Program Pelatihan Tidak Ditemukan'
                : hasCursor
                  ? 'Halaman Tidak Tersedia'
                  : 'Belum Ada Program Pelatihan'}
            </EmptyTitle>
            <EmptyDescription>
              {filtersActive
                ? 'Tidak ada program pelatihan yang cocok dengan filter yang dipilih.'
                : hasCursor
                  ? 'Halaman ini sudah tidak berisi data program pelatihan.'
                  : 'Belum ada program pelatihan yang didaftarkan pada sistem.'}
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
                Tambahkan Program
              </Button>
            </EmptyContent>
          )}
        </Empty>
      )}

      <div className="border-dash-border flex flex-col justify-between gap-3 border-t p-4 sm:flex-row sm:items-center sm:px-8">
        <div className="flex items-center gap-2">
          <span className="text-dash-muted text-xs font-semibold">Baris per halaman</span>
          <Select value={String(limit)} onValueChange={(value) => setLimit(Number(value ?? limit))}>
            <SelectTrigger id="training-limit" className="h-9 w-[88px] rounded-full" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TRAINING_PAGE_SIZE_OPTIONS.map((value) => (
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

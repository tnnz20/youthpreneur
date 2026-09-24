import { Link } from 'react-router';

import { cn, formatDateOnly, renderValue } from '@/lib/utils';

import { StatusBadge } from '@/components/dashboard/shared/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { UserTrainingState } from '@/hooks/use-user-trainings';

import type { TrainingEnrollment } from '@/types/trainings';

import { ENROLLMENT_STATUS_LABELS, TRAINING_STATUS_LABELS } from '@/constants/trainings';

import { Ban, Eye, GraduationCap, MoreHorizontal, RotateCcw, SearchX } from 'lucide-react';

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento';
const HEAD_CLASS = 'text-dash-muted text-[11px] font-semibold tracking-wide uppercase';
const COLUMN_COUNT = 5;

interface UserTrainingTableContentProps {
  state: UserTrainingState;
  filtersActive: boolean;
  onSelectDetail: (enrollment: TrainingEnrollment) => void;
  onRequestCancel: (enrollment: TrainingEnrollment) => void;
}

function getDisplayStatus(item: TrainingEnrollment): { label: string; tone: string } {
  if (item.deleted_at || item.status === 'cancelled') {
    return { label: 'Dibatalkan', tone: 'Dibatalkan' };
  }
  const label = ENROLLMENT_STATUS_LABELS[item.status] ?? item.status;
  return { label, tone: label };
}

export function UserTrainingTableContent({
  state,
  filtersActive,
  onSelectDetail,
  onRequestCancel,
}: UserTrainingTableContentProps) {
  const {
    enrollments,
    loading,
    hasPreviousPage,
    hasNextPage,
    nextPage,
    previousPage,
    resetFilters,
  } = state;

  return (
    <div className={`${CARD} dash-reveal overflow-hidden`}>
      {loading && (
        <span role="status" className="sr-only">
          Memuat data pendaftaran pelatihan...
        </span>
      )}

      <Table>
        <TableHeader className="bg-dash-surface-2">
          <TableRow className="border-dash-border hover:bg-transparent">
            <TableHead className={`${HEAD_CLASS} pl-6 sm:pl-8`}>Program Pelatihan</TableHead>
            <TableHead className={HEAD_CLASS}>Tanggal Daftar</TableHead>
            <TableHead className={HEAD_CLASS}>Status Pelatihan</TableHead>
            <TableHead className={HEAD_CLASS}>Status Pendaftaran</TableHead>
            <TableHead className={`${HEAD_CLASS} pr-6 text-right sm:pr-8`}>Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading &&
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`user-training-skel-${index}`} className="border-dash-border/60">
                <TableCell className="py-4 pl-6 sm:pl-8">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-48 rounded-md" />
                    <Skeleton className="h-3 w-24 rounded-md" />
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Skeleton className="h-4 w-28 rounded-md" />
                </TableCell>
                <TableCell className="py-4">
                  <Skeleton className="h-6 w-24 rounded-full" />
                </TableCell>
                <TableCell className="py-4">
                  <Skeleton className="h-6 w-28 rounded-full" />
                </TableCell>
                <TableCell className="py-4 pr-6 text-right sm:pr-8">
                  <Skeleton className="ml-auto h-8 w-20 rounded-full" />
                </TableCell>
              </TableRow>
            ))}

          {!loading && enrollments.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={COLUMN_COUNT} className="p-0">
                {filtersActive ? (
                  <Empty className="py-14">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <SearchX className="h-6 w-6" aria-hidden="true" />
                      </EmptyMedia>
                      <EmptyTitle>Pendaftaran Tidak Ditemukan</EmptyTitle>
                      <EmptyDescription>
                        Tidak ada pendaftaran pelatihan yang sesuai dengan kriteria filter saat ini.
                      </EmptyDescription>
                    </EmptyHeader>
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
                  </Empty>
                ) : (
                  <Empty className="py-16">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <GraduationCap className="h-7 w-7" aria-hidden="true" />
                      </EmptyMedia>
                      <EmptyTitle>Belum Ada Pelatihan Diikuti</EmptyTitle>
                      <EmptyDescription>
                        Kamu belum mendaftar program pelatihan apa pun. Buka katalog pelatihan resmi
                        Dispora Tapin untuk mulai mendaftar.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Link
                        to="/training-catalog"
                        className={cn(
                          buttonVariants({ variant: 'lime', size: 'sm' }),
                          'rounded-full'
                        )}
                      >
                        <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
                        Jelajahi Katalog Pelatihan
                      </Link>
                    </EmptyContent>
                  </Empty>
                )}
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            enrollments.map((item) => {
              const catalogTitle = item.catalog?.title ?? item.catalog?.name ?? 'Program Pelatihan';
              const isCancelled = Boolean(item.deleted_at || item.status === 'cancelled');
              const displayStatus = getDisplayStatus(item);
              const trainingStatusLabel = item.catalog?.training_status
                ? (TRAINING_STATUS_LABELS[item.catalog.training_status] ??
                  item.catalog.training_status)
                : 'Direncanakan';

              return (
                <TableRow
                  key={item.public_id}
                  className="border-dash-border/60 hover:bg-dash-surface-2/40 transition-colors"
                >
                  {/* Program Title & ID */}
                  <TableCell className="py-4 pl-6 sm:pl-8">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-dash-fg font-bold tracking-tight">
                          {renderValue(catalogTitle)}
                        </span>
                        {item.catalog?.category && (
                          <Badge
                            variant="secondary"
                            className="bg-dash-surface-2 text-dash-muted border-dash-border text-[10px] font-semibold"
                          >
                            {item.catalog.category}
                          </Badge>
                        )}
                      </div>
                      <span className="text-dash-muted font-mono text-[11px]">
                        ID: {item.public_id}
                      </span>
                    </div>
                  </TableCell>

                  {/* Register Date */}
                  <TableCell className="text-dash-fg py-4 text-xs font-medium">
                    {formatDateOnly(item.register_date)}
                  </TableCell>

                  {/* Training Status */}
                  <TableCell className="py-4">
                    <StatusBadge label={trainingStatusLabel} />
                  </TableCell>

                  {/* Enrollment Status */}
                  <TableCell className="py-4">
                    <StatusBadge label={displayStatus.label} />
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-4 pr-6 text-right sm:pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        disabled={state.cancellingId === item.public_id}
                        className="border-dash-border text-dash-muted hover:bg-dash-surface-2 hover:text-dash-fg focus-visible:border-dash-fg focus-visible:ring-dash-fg/40 inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
                        aria-label={`Aksi pendaftaran ${item.public_id}`}
                      >
                        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          onClick={() => onSelectDetail(item)}
                          className="text-dash-fg hover:bg-dash-surface-2 cursor-pointer py-2 text-sm font-medium"
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={
                            isCancelled ||
                            item.status !== 'pending' ||
                            state.cancellingId === item.public_id
                          }
                          variant="destructive"
                          onClick={() => onRequestCancel(item)}
                          className="cursor-pointer py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 disabled:pointer-events-none disabled:opacity-40 dark:hover:bg-rose-950/30"
                        >
                          <Ban className="h-4 w-4" aria-hidden="true" />
                          Batalkan
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      {(hasPreviousPage || hasNextPage) && (
        <div className="border-dash-border/60 flex items-center justify-between border-t px-6 py-4">
          <p className="text-dash-muted text-xs font-medium">
            Menampilkan <span className="text-dash-fg font-bold">{enrollments.length}</span> data
            pendaftaran
          </p>
          <Pagination className="mx-0 w-auto">
            <PaginationContent className="gap-2">
              <PaginationItem>
                <PaginationPrevious
                  text="Sebelumnya"
                  disabled={loading || !hasPreviousPage}
                  className="border-dash-border rounded-full text-xs font-semibold"
                  onClick={previousPage}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  text="Berikutnya"
                  disabled={loading || !hasNextPage}
                  className="border-dash-border rounded-full text-xs font-semibold"
                  onClick={nextPage}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

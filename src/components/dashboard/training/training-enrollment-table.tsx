import { useEffect, useState } from 'react';

import { Link } from 'react-router';
import { toast } from 'sonner';

import { listCatalogEnrollments, updateEnrollmentStatus } from '@/lib/api/trainings';
import { cn, formatDateOnly, formatUnixDateTime, toErrorMessage } from '@/lib/utils';

import { StatusBadge } from '@/components/dashboard/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Empty,
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

import type { EnrollmentStatus, TrainingEnrollment } from '@/types/trainings';

import {
  ENROLLMENT_STATUS_LABELS,
  ENROLLMENT_STATUS_OPTIONS,
  TRAINING_PAGE_SIZE_OPTIONS,
} from '@/constants/trainings';

import {
  CheckCircle,
  LoaderCircle,
  MoreHorizontal,
  RotateCcw,
  User,
  Users,
  XCircle,
} from 'lucide-react';

const CARD =
  'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento ring-0 overflow-hidden p-0';
const HEAD_CLASS = 'text-dash-muted text-[11px] font-semibold tracking-wide uppercase';
const COLUMN_COUNT = 5;

interface TrainingEnrollmentTableProps {
  catalogPublicId: string;
  onEnrollmentUpdated?: () => void;
}

export function TrainingEnrollmentTable({
  catalogPublicId,
  onEnrollmentUpdated,
}: TrainingEnrollmentTableProps) {
  const [enrollments, setEnrollments] = useState<TrainingEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<EnrollmentStatus | 'semua'>('semua');
  const [limit, setLimit] = useState(10);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [cursorStack, setCursorStack] = useState<string[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!catalogPublicId) return;

    let cancelled = false;

    listCatalogEnrollments(catalogPublicId, {
      cursor,
      limit,
      status: status !== 'semua' ? status : undefined,
    })
      .then((res) => {
        if (!cancelled) {
          setEnrollments(res.training_enrollments ?? []);
          setNextCursor(res.next_cursor ?? null);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(toErrorMessage(err));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [catalogPublicId, cursor, limit, status, refreshKey]);

  const handleStatusFilterChange = (newStatus: EnrollmentStatus | 'semua') => {
    setLoading(true);
    setStatus(newStatus);
    setCursor(undefined);
    setCursorStack([]);
  };

  const handleLimitChange = (newLimit: number) => {
    setLoading(true);
    setLimit(newLimit);
    setCursor(undefined);
    setCursorStack([]);
  };

  const handleNextPage = () => {
    if (!nextCursor || loading) return;
    setLoading(true);
    setCursorStack((prev) => (cursor ? [...prev, cursor] : ['']));
    setCursor(nextCursor);
  };

  const handlePreviousPage = () => {
    if (cursorStack.length === 0 || loading) return;
    setLoading(true);
    const newStack = [...cursorStack];
    const prevCursor = newStack.pop();
    setCursorStack(newStack);
    setCursor(prevCursor === '' ? undefined : prevCursor);
  };

  const handleReload = () => {
    setLoading(true);
    setRefreshKey((k) => k + 1);
  };

  const handleStatusChange = async (
    enrollment: TrainingEnrollment,
    newStatus: EnrollmentStatus
  ) => {
    if (enrollment.status === newStatus) return;

    setUpdatingId(enrollment.public_id);
    try {
      await updateEnrollmentStatus(enrollment.public_id, { status: newStatus });
      toast.success(
        `Status pendaftaran untuk ${enrollment.user_public_id} diubah menjadi "${ENROLLMENT_STATUS_LABELS[newStatus]}".`
      );
      onEnrollmentUpdated?.();
      setLoading(true);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      toast.error(toErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Card className={CARD}>
      <div className="border-dash-border border-b p-6 pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Users className="text-dash-fg h-5 w-5" aria-hidden="true" />
              <h2 className="text-dash-fg text-base font-bold">Daftar Pendaftar Pelatihan</h2>
            </div>
            <p className="text-dash-muted mt-1 text-xs">
              Pengguna yang mendaftar pada program ini (GET /training-enrollments/catalog/
              {catalogPublicId})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={status === 'semua' ? null : status}
              onValueChange={(val) =>
                handleStatusFilterChange((val ?? 'semua') as EnrollmentStatus | 'semua')
              }
              items={ENROLLMENT_STATUS_OPTIONS}
            >
              <SelectTrigger className="h-10 w-[200px] rounded-2xl" size="sm">
                <SelectValue placeholder="Semua Status Pendaftaran" />
              </SelectTrigger>
              <SelectContent>
                {ENROLLMENT_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.label} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReload}
              disabled={loading}
              className="border-dash-border h-10 w-10 rounded-2xl p-0"
              aria-label="Muat ulang pendaftar"
            >
              <RotateCcw className={cn('h-4 w-4', loading && 'animate-spin')} aria-hidden="true" />
            </Button>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-xs font-medium text-rose-500" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table aria-busy={loading}>
          <TableHeader className="bg-dash-surface-2">
            <TableRow className="border-dash-border hover:bg-transparent">
              <TableHead scope="col" className={`${HEAD_CLASS} pl-6 sm:pl-8`}>
                ID Pendaftaran
              </TableHead>
              <TableHead scope="col" className={HEAD_CLASS}>
                Pengguna (ID)
              </TableHead>
              <TableHead scope="col" className={HEAD_CLASS}>
                Tanggal Daftar
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
              Array.from({ length: 4 }).map((_, idx) => (
                <TableRow
                  key={`enr-skeleton-${idx}`}
                  className="border-dash-border"
                  aria-hidden="true"
                >
                  {Array.from({ length: COLUMN_COUNT }).map((__, cIdx) => (
                    <TableCell key={`enr-skeleton-${idx}-${cIdx}`}>
                      <Skeleton className="bg-dash-surface-2 h-3.5 w-full rounded-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading &&
              enrollments.map((item) => {
                const isUpdating = updatingId === item.public_id;
                const regDate = item.register_date
                  ? formatDateOnly(item.register_date)
                  : formatUnixDateTime(item.created_at);

                return (
                  <TableRow
                    key={item.public_id}
                    className="border-dash-border hover:bg-dash-surface-2/60"
                  >
                    <TableCell className="py-3.5 pl-6 font-semibold sm:pl-8">
                      <span className="text-dash-fg font-mono text-xs">{item.public_id}</span>
                    </TableCell>

                    <TableCell className="py-3.5">
                      <div className="min-w-0">
                        {item.full_name && (
                          <p className="text-dash-fg truncate text-xs font-semibold">
                            {item.full_name}
                          </p>
                        )}
                        <Link
                          to={`/dashboard/users/${item.user_public_id}`}
                          className="text-brand-dark inline-flex items-center gap-1 text-xs font-medium hover:underline"
                        >
                          <User className="h-3 w-3" aria-hidden="true" />
                          <span>{item.user_public_id}</span>
                        </Link>
                      </div>
                    </TableCell>

                    <TableCell className="text-dash-muted py-3.5 text-xs font-medium">
                      {regDate}
                    </TableCell>

                    <TableCell className="py-3.5">
                      <StatusBadge label={ENROLLMENT_STATUS_LABELS[item.status] ?? item.status} />
                    </TableCell>

                    <TableCell className="py-3.5 pr-6 text-right sm:pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          disabled={isUpdating}
                          className="border-dash-border text-dash-muted hover:bg-dash-surface-2 hover:text-dash-fg focus-visible:border-dash-fg focus-visible:ring-dash-fg/40 inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
                          aria-label={`Aksi pendaftaran ${item.public_id}`}
                        >
                          {isUpdating ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                          )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            disabled={item.status === 'accepted'}
                            onClick={() => handleStatusChange(item, 'accepted')}
                            className="text-dash-fg hover:bg-dash-surface-2 cursor-pointer py-2 text-sm font-medium"
                          >
                            <CheckCircle className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                            Terima Pendaftaran
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={item.status === 'rejected'}
                            variant="destructive"
                            onClick={() => handleStatusChange(item, 'rejected')}
                            className="text-dash-fg hover:bg-dash-surface-2 cursor-pointer py-2 text-sm font-medium"
                          >
                            <XCircle className="h-4 w-4 text-rose-500" aria-hidden="true" />
                            Tolak Pendaftaran
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={item.status === 'pending'}
                            onClick={() => handleStatusChange(item, 'pending')}
                            className="text-dash-fg hover:bg-dash-surface-2 cursor-pointer py-2 text-sm font-medium"
                          >
                            <RotateCcw className="h-4 w-4" aria-hidden="true" />
                            Kembalikan ke Menunggu
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      {!loading && enrollments.length === 0 && (
        <Empty className="p-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users className="text-dash-muted h-8 w-8" aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>Belum Ada Pendaftar</EmptyTitle>
            <EmptyDescription>
              {status !== 'semua'
                ? 'Tidak ada pendaftar yang cocok dengan filter status saat ini.'
                : 'Belum ada pengguna yang mendaftar ke program pelatihan ini.'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {/* Pagination Footer */}
      <div className="border-dash-border flex flex-col justify-between gap-3 border-t p-4 sm:flex-row sm:items-center sm:px-8">
        <div className="flex items-center gap-2">
          <span className="text-dash-muted text-xs font-semibold">Baris per halaman</span>
          <Select
            value={String(limit)}
            onValueChange={(val) => handleLimitChange(Number(val ?? limit))}
          >
            <SelectTrigger id="enr-limit" className="h-9 w-[88px] rounded-full" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TRAINING_PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
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
                disabled={loading || cursorStack.length === 0}
                className="rounded-full"
                onClick={handlePreviousPage}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                text="Berikutnya"
                disabled={loading || !nextCursor}
                className="rounded-full"
                onClick={handleNextPage}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Card>
  );
}

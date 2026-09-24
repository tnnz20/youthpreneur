import { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { listAllEnrollments, updateEnrollmentStatus } from '@/lib/api/trainings';
import { cn, formatDateOnly, formatUnixDateTime, renderValue, toErrorMessage } from '@/lib/utils';

import { StatusBadge } from '@/components/dashboard/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
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
  Eye,
  GraduationCap,
  LoaderCircle,
  MoreHorizontal,
  RotateCcw,
  Search,
  User,
  Users,
  XCircle,
} from 'lucide-react';

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento';
const SELECT_CLASS =
  'text-dash-fg focus-visible:border-dash-fg w-full rounded-2xl border border-dash-border bg-dash-surface-2 px-3.5 py-0 text-xs focus-visible:ring-0 data-[size=default]:h-11 sm:text-sm';
const INPUT_CLASS =
  'text-dash-fg focus-visible:border-dash-fg h-11 rounded-2xl border border-dash-border bg-dash-surface-2 px-3.5 text-sm focus-visible:ring-0';
const LABEL_CLASS =
  'text-dash-muted mb-1.5 block text-[11px] font-semibold tracking-wide uppercase';
const HEAD_CLASS = 'text-dash-muted text-[11px] font-semibold tracking-wide uppercase';
const COLUMN_COUNT = 6;

export default function TrainingParticipantsAdminPage() {
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState<TrainingEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<EnrollmentStatus | 'semua'>('semua');
  const [limit, setLimit] = useState(20);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [cursorStack, setCursorStack] = useState<string[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    listAllEnrollments({
      cursor,
      limit,
      status: status !== 'semua' ? status : undefined,
      search: debouncedSearch.trim() || undefined,
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
  }, [cursor, limit, status, debouncedSearch, refreshKey]);

  const handleSearchChange = (val: string) => {
    setLoading(true);
    setSearch(val);
    setCursor(undefined);
    setCursorStack([]);
  };

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

  const handleResetFilters = () => {
    setLoading(true);
    setSearch('');
    setDebouncedSearch('');
    setStatus('semua');
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
        `Status pendaftaran ${enrollment.public_id} diubah menjadi "${ENROLLMENT_STATUS_LABELS[newStatus]}".`
      );
      setLoading(true);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      toast.error(toErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  const filtersActive = search.trim() !== '' || debouncedSearch.trim() !== '' || status !== 'semua';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="bg-dash-surface-2 border-dash-border flex h-12 w-12 items-center justify-center rounded-2xl border">
          <Users className="text-dash-fg h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-dash-fg text-2xl font-bold tracking-tight">Data Peserta</h1>
          <p className="text-dash-muted text-xs">
            Kelola seluruh data pendaftar dan persetujuan peserta program pelatihan
          </p>
        </div>
      </div>

      {/* Filter Card Matching TrainingTable UI */}
      <div className={`${CARD} space-y-4 p-5`}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="participant-filter-search" className={LABEL_CLASS}>
              Cari Peserta
            </label>
            <div className="relative">
              <Search
                className="text-dash-muted pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
                aria-hidden="true"
              />
              <Input
                id="participant-filter-search"
                type="search"
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Cari nama peserta..."
                className={`${INPUT_CLASS} pl-10`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="participant-filter-status" className={LABEL_CLASS}>
              Status Pendaftaran
            </label>
            <Select
              value={status === 'semua' ? null : status}
              onValueChange={(val) =>
                handleStatusFilterChange((val ?? 'semua') as EnrollmentStatus | 'semua')
              }
              items={ENROLLMENT_STATUS_OPTIONS}
            >
              <SelectTrigger id="participant-filter-status" className={SELECT_CLASS}>
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
              onClick={handleResetFilters}
              disabled={loading || !filtersActive}
              className="border-dash-border rounded-full"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset Filter
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReload}
              disabled={loading}
              className="border-dash-border rounded-full"
            >
              <RotateCcw
                className={cn('h-3.5 w-3.5', loading && 'animate-spin')}
                aria-hidden="true"
              />
              Muat Ulang
            </Button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <Card className={cn(CARD, 'dash-reveal overflow-hidden p-0')}>
        {loading && (
          <span role="status" className="sr-only">
            Memuat data peserta pelatihan...
          </span>
        )}
        <div className="overflow-x-auto">
          <Table aria-busy={loading}>
            <TableHeader className="bg-dash-surface-2">
              <TableRow className="border-dash-border hover:bg-transparent">
                <TableHead scope="col" className={`${HEAD_CLASS} pl-6 sm:pl-8`}>
                  Peserta Pelatihan
                </TableHead>
                <TableHead scope="col" className={HEAD_CLASS}>
                  Program Pelatihan
                </TableHead>
                <TableHead scope="col" className={HEAD_CLASS}>
                  ID Pendaftaran
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
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow
                    key={`parts-skeleton-${idx}`}
                    className="border-dash-border"
                    aria-hidden="true"
                  >
                    {Array.from({ length: COLUMN_COUNT }).map((__, cIdx) => (
                      <TableCell key={`parts-skeleton-${idx}-${cIdx}`}>
                        <Skeleton className="bg-dash-surface-2 h-3.5 w-full rounded-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!loading &&
                enrollments.map((item) => {
                  const isItemUpdating = updatingId === item.public_id;
                  const regDate = item.register_date
                    ? formatDateOnly(item.register_date)
                    : formatUnixDateTime(item.created_at);

                  return (
                    <TableRow
                      key={item.public_id}
                      className="border-dash-border hover:bg-dash-surface-2/60"
                    >
                      <TableCell className="py-3.5 pl-6 sm:pl-8">
                        <div className="min-w-0">
                          <p className="text-dash-fg truncate text-sm font-bold">
                            {renderValue(item.full_name ?? item.user_public_id)}
                          </p>
                          <Link
                            to={`/dashboard/users/${item.user_public_id}`}
                            className="text-dash-muted hover:text-brand-dark inline-flex items-center gap-1 text-xs transition-colors hover:underline"
                          >
                            <User className="h-3 w-3" aria-hidden="true" />
                            <span>ID: {item.user_public_id}</span>
                          </Link>
                        </div>
                      </TableCell>

                      <TableCell className="py-3.5 font-medium">
                        {item.catalog ? (
                          <Link
                            to={`/dashboard/trainings/${item.catalog.public_id}`}
                            className="text-dash-fg hover:text-brand-dark inline-flex items-center gap-2 text-xs font-semibold transition-colors hover:underline"
                          >
                            <GraduationCap className="text-dash-muted h-4 w-4 shrink-0" />
                            <span>{renderValue(item.catalog.title)}</span>
                          </Link>
                        ) : (
                          <span className="text-dash-muted text-xs">—</span>
                        )}
                      </TableCell>

                      <TableCell className="text-dash-muted py-3.5 font-mono text-xs">
                        {item.public_id}
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
                            disabled={isItemUpdating}
                            className="border-dash-border text-dash-muted hover:bg-dash-surface-2 hover:text-dash-fg focus-visible:border-dash-fg focus-visible:ring-dash-fg/40 inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
                            aria-label={`Aksi untuk pendaftaran ${item.public_id}`}
                          >
                            {isItemUpdating ? (
                              <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                            )}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            {item.catalog && (
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/dashboard/trainings/${item.catalog!.public_id}`)
                                }
                                className="text-dash-fg hover:bg-dash-surface-2 cursor-pointer py-2 text-sm font-medium"
                              >
                                <Eye className="h-4 w-4" aria-hidden="true" />
                                Lihat Program Pelatihan
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => navigate(`/dashboard/users/${item.user_public_id}`)}
                              className="text-dash-fg hover:bg-dash-surface-2 cursor-pointer py-2 text-sm font-medium"
                            >
                              <User className="h-4 w-4" aria-hidden="true" />
                              Lihat Pengguna
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              disabled={item.status === 'cancelled' || item.status === 'accepted'}
                              onClick={() => handleStatusChange(item, 'accepted')}
                              className="text-dash-fg hover:bg-dash-surface-2 cursor-pointer py-2 text-sm font-medium"
                            >
                              <CheckCircle
                                className="h-4 w-4 text-emerald-500"
                                aria-hidden="true"
                              />
                              Terima Pendaftaran
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              disabled={item.status === 'cancelled' || item.status === 'rejected'}
                              variant="destructive"
                              onClick={() => handleStatusChange(item, 'rejected')}
                              className="text-dash-fg hover:bg-dash-surface-2 cursor-pointer py-2 text-sm font-medium"
                            >
                              <XCircle className="h-4 w-4 text-rose-500" aria-hidden="true" />
                              Tolak Pendaftaran
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              disabled={item.status === 'cancelled' || item.status === 'pending'}
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
              <EmptyTitle>Belum Ada Peserta</EmptyTitle>
              <EmptyDescription>
                {filtersActive
                  ? 'Tidak ada peserta yang cocok dengan filter atau pencarian saat ini.'
                  : 'Belum ada pendaftaran peserta pelatihan pada sistem.'}
              </EmptyDescription>
            </EmptyHeader>
            {filtersActive && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="border-dash-border mx-auto mt-2 rounded-full"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset Filter
              </Button>
            )}
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
              <SelectTrigger id="parts-limit" className="h-9 w-[88px] rounded-full" size="sm">
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
    </div>
  );
}

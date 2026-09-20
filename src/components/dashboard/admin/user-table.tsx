import { useState } from 'react';

import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { formatUnixDateTime, renderValue, toErrorMessage } from '@/lib/utils';

import { StatusBadge } from '@/components/dashboard/shared/status-badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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

import type { UserState } from '@/hooks/use-users';

import type { User, UserGender } from '@/types/users';

import { KECAMATAN } from '@/constants/site';
import { GENDER_LABELS, GENDER_OPTIONS, USER_PAGE_SIZE_OPTIONS } from '@/constants/users';

import { Eye, MoreHorizontal, RotateCcw, SearchX, Trash2, UserCheck, UserX } from 'lucide-react';

interface UserTableProps {
  state: UserState;
}

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento';

const selectClassName =
  'text-dash-fg focus-visible:border-dash-fg w-full rounded-2xl border border-dash-border bg-dash-surface-2 px-3.5 py-0 text-xs focus-visible:ring-0 data-[size=default]:h-11 sm:text-sm';

const inputClassName =
  'text-dash-fg focus-visible:border-dash-fg h-11 rounded-2xl border border-dash-border bg-dash-surface-2 px-3.5 text-sm focus-visible:ring-0';

const LABEL_CLASS =
  'text-dash-muted mb-1.5 block text-[11px] font-semibold tracking-wide uppercase';

const HEAD_CLASS = 'text-dash-muted text-[11px] font-semibold tracking-wide uppercase';

const TABLE_COLUMN_COUNT = 8;

export function UserTable({ state }: UserTableProps) {
  const navigate = useNavigate();
  const [pendingDeactivate, setPendingDeactivate] = useState<User | null>(null);
  const [pendingActivate, setPendingActivate] = useState<User | null>(null);
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);

  const {
    users,
    filters,
    search,
    limit,
    loading,
    mutatingId,
    error,
    hasCursor,
    hasNextPage,
    hasPreviousPage,
    setSearch,
    setDistrict,
    setGender,
    setLimit,
    resetFilters,
    nextPage,
    previousPage,
    goToFirstPage,
    deactivate,
    activate,
    remove,
  } = state;

  const filtersActive =
    search.trim() !== '' || filters.district.trim() !== '' || filters.gender !== 'all';

  const confirmDeactivate = async () => {
    if (!pendingDeactivate) {
      return;
    }

    const target = pendingDeactivate;
    setPendingDeactivate(null);

    try {
      await deactivate(target.public_id);
      toast.success(`Pengguna ${target.email} dinonaktifkan.`);
    } catch (mutationError: unknown) {
      toast.error(toErrorMessage(mutationError));
    }
  };

  const confirmActivate = async () => {
    if (!pendingActivate) {
      return;
    }

    const target = pendingActivate;
    setPendingActivate(null);

    try {
      await activate(target.public_id);
      toast.success(`Pengguna ${target.email} diaktifkan.`);
    } catch (mutationError: unknown) {
      toast.error(toErrorMessage(mutationError));
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    const target = pendingDelete;
    setPendingDelete(null);

    try {
      await remove(target.public_id);
      toast.success(`Pengguna ${target.email} dihapus.`);
    } catch (mutationError: unknown) {
      toast.error(toErrorMessage(mutationError));
    }
  };

  return (
    <div className="space-y-5">
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
              className={inputClassName}
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
              <SelectTrigger id="user-district" className={selectClassName}>
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
              <SelectTrigger id="user-gender" className={selectClassName}>
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

      <div className={`${CARD} dash-reveal overflow-hidden`}>
        {loading && (
          <span role="status" className="sr-only">
            Memuat pengguna...
          </span>
        )}
        <Table aria-busy={loading}>
          <TableHeader className="bg-dash-surface-2">
            <TableRow className="border-dash-border hover:bg-transparent">
              <TableHead className={`${HEAD_CLASS} pl-6 sm:pl-8`}>Nama</TableHead>
              <TableHead className={HEAD_CLASS}>NIK</TableHead>
              <TableHead className={HEAD_CLASS}>Gender</TableHead>
              <TableHead className={HEAD_CLASS}>Kecamatan</TableHead>
              <TableHead className={HEAD_CLASS}>Telepon</TableHead>
              <TableHead className={HEAD_CLASS}>Status</TableHead>
              <TableHead className={HEAD_CLASS}>Diperbarui</TableHead>
              <TableHead className={`${HEAD_CLASS} pr-6 text-right sm:pr-8`}>Aksi</TableHead>
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
                  {Array.from({ length: TABLE_COLUMN_COUNT }).map((__, cellIndex) => (
                    <TableCell key={`skeleton-${index}-${cellIndex}`}>
                      <Skeleton className="bg-dash-surface-2 h-3.5 w-full rounded-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading &&
              users.map((user) => {
                const isMutating = mutatingId === user.public_id;

                return (
                  <TableRow
                    key={user.public_id}
                    className="border-dash-border hover:bg-dash-surface-2/60"
                  >
                    <TableCell className="py-3.5 font-bold">
                      {renderValue(user.profile?.full_name)}
                    </TableCell>
                    <TableCell className="text-dash-muted py-3.5 text-xs font-medium">
                      {renderValue(user.profile?.nik)}
                    </TableCell>
                    <TableCell className="text-dash-muted py-3.5 text-xs font-medium">
                      {user.profile?.gender ? GENDER_LABELS[user.profile.gender] : '—'}
                    </TableCell>
                    <TableCell className="text-dash-muted py-3.5 text-xs font-medium">
                      {renderValue(user.profile?.district)}
                    </TableCell>
                    <TableCell className="text-dash-muted py-3.5 text-xs font-medium">
                      {renderValue(user.profile?.phone)}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <StatusBadge label={user.is_active ? 'Aktif' : 'Non Aktif'} />
                    </TableCell>
                    <TableCell className="text-dash-muted py-3.5 text-xs font-medium">
                      {formatUnixDateTime(user.updated_at)}
                    </TableCell>
                    <TableCell className="py-3.5 pr-6 text-right sm:pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          disabled={isMutating}
                          className="border-dash-border text-dash-muted hover:bg-dash-surface-2 hover:text-dash-fg focus-visible:border-dash-fg focus-visible:ring-dash-fg/40 inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
                          aria-label={`Aksi untuk ${user.profile?.full_name ?? user.email}`}
                        >
                          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuItem
                            onClick={() => navigate(`/dashboard/users/${user.public_id}`)}
                            className="text-dash-fg hover:bg-dash-surface-2 cursor-pointer py-2 text-sm font-medium"
                          >
                            <Eye className="h-4 w-4" aria-hidden="true" />
                            Lihat Detail
                          </DropdownMenuItem>
                          {user.is_active ? (
                            <DropdownMenuItem
                              disabled={isMutating}
                              onClick={() => setPendingDeactivate(user)}
                              className="text-dash-fg hover:bg-dash-surface-2 cursor-pointer py-2 text-sm font-medium"
                            >
                              <UserX className="h-4 w-4" aria-hidden="true" />
                              Non Aktifkan Pengguna
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              disabled={isMutating}
                              onClick={() => setPendingActivate(user)}
                              className="text-dash-fg hover:bg-dash-surface-2 cursor-pointer py-2 text-sm font-medium"
                            >
                              <UserCheck className="h-4 w-4" aria-hidden="true" />
                              Aktifkan Pengguna
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            disabled={isMutating}
                            variant="destructive"
                            onClick={() => setPendingDelete(user)}
                            className="text-dash-fg hover:bg-dash-surface-2 cursor-pointer py-2 text-sm font-medium"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                            Delete Pengguna
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>

        {!loading && users.length === 0 && (
          <Empty className="p-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchX aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>
                {filtersActive
                  ? 'Pengguna Tidak Ditemukan'
                  : hasCursor
                    ? 'Halaman Tidak Tersedia'
                    : 'Belum Ada Pengguna'}
              </EmptyTitle>
              <EmptyDescription>
                {filtersActive
                  ? 'Tidak ada pengguna yang cocok dengan filter.'
                  : hasCursor
                    ? 'Halaman ini sudah tidak berisi data.'
                    : 'Belum ada pengguna terdaftar.'}
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
            ) : (
              hasCursor && (
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
              )
            )}
          </Empty>
        )}

        <div className="border-dash-border flex flex-col justify-between gap-3 border-t p-4 sm:flex-row sm:items-center sm:px-8">
          <div className="flex items-center gap-2">
            <span className="text-dash-muted text-xs font-semibold">Baris per halaman</span>
            <Select
              value={String(limit)}
              onValueChange={(value) => setLimit(Number(value ?? limit))}
            >
              <SelectTrigger id="user-limit" className="h-9 w-[88px] rounded-full" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {USER_PAGE_SIZE_OPTIONS.map((value) => (
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

      <AlertDialog
        open={pendingDeactivate !== null}
        onOpenChange={(open) => !open && setPendingDeactivate(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Non Aktifkan Pengguna</AlertDialogTitle>
            <AlertDialogDescription>
              Non aktifkan {pendingDeactivate?.profile?.full_name ?? pendingDeactivate?.email}?
              Pengguna tidak akan dapat masuk sampai diaktifkan kembali.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeactivate}>Non Aktifkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={pendingActivate !== null}
        onOpenChange={(open) => !open && setPendingActivate(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aktifkan Pengguna</AlertDialogTitle>
            <AlertDialogDescription>
              Aktifkan {pendingActivate?.profile?.full_name ?? pendingActivate?.email}? Pengguna
              akan dapat masuk kembali.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmActivate}>Aktifkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Pengguna</AlertDialogTitle>
            <AlertDialogDescription>
              Hapus {pendingDelete?.profile?.full_name ?? pendingDelete?.email} permanen? Tindakan
              ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

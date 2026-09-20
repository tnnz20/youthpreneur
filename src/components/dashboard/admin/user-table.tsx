import { useState } from 'react';

import { useNavigate } from 'react-router';
import { toast } from 'sonner';

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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  RotateCcw,
  Trash2,
  UserX,
} from 'lucide-react';

interface UserTableProps {
  state: UserState;
}

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento';

const selectClassName =
  'text-dash-fg focus-visible:border-dash-fg h-11 w-full rounded-2xl border border-dash-border bg-dash-surface-2 px-3.5 py-0 text-xs focus-visible:ring-0 data-[size=default]:h-11 sm:text-sm';

const LABEL_CLASS =
  'text-dash-muted mb-1.5 block text-[11px] font-semibold tracking-wide uppercase';

const HEAD_CLASS = 'text-dash-muted text-[11px] font-semibold tracking-wide uppercase';

const GENDER_LABELS: Record<UserGender, string> = {
  male: 'Laki-laki',
  female: 'Perempuan',
};

const GENDER_OPTIONS: { value: UserGender | 'all'; label: string }[] = [
  { value: 'all', label: 'Semua Gender' },
  { value: 'male', label: 'Laki-laki' },
  { value: 'female', label: 'Perempuan' },
];

function formatTimestamp(value: number): string {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function renderValue(value: string | null | undefined) {
  return value ? value : '—';
}

export function UserTable({ state }: UserTableProps) {
  const navigate = useNavigate();
  const [pendingDeactivate, setPendingDeactivate] = useState<User | null>(null);
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);

  const {
    users,
    filters,
    loading,
    mutatingId,
    error,
    hasNextPage,
    setDistrict,
    setGender,
    resetFilters,
    nextPage,
    deactivate,
    remove,
  } = state;

  const filtersActive = filters.district.trim() !== '' || filters.gender !== 'all';

  const confirmDeactivate = async () => {
    if (!pendingDeactivate) {
      return;
    }

    const target = pendingDeactivate;
    setPendingDeactivate(null);

    try {
      await deactivate(target.public_id);
      toast.success(`Pengguna ${target.email} dinonaktifkan.`);
    } catch {
      toast.error('Gagal menonaktifkan pengguna.');
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
    } catch {
      toast.error('Gagal menghapus pengguna.');
    }
  };

  return (
    <div className="space-y-5">
      <div className={`${CARD} space-y-4 p-5`}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-6">
            <label htmlFor="user-district" className={LABEL_CLASS}>
              Kecamatan
            </label>
            <Input
              id="user-district"
              type="text"
              value={filters.district}
              onChange={(event) => setDistrict(event.target.value)}
              placeholder="Cari kecamatan..."
              className="text-dash-fg focus-visible:border-dash-fg border-dash-border bg-dash-surface-2 h-11 rounded-2xl px-3.5 text-base focus-visible:ring-0 sm:text-sm"
            />
          </div>

          <div className="md:col-span-3">
            <label htmlFor="user-gender" className={LABEL_CLASS}>
              Gender
            </label>
            <Select
              value={filters.gender}
              onValueChange={(value) => setGender((value ?? 'all') as UserGender | 'all')}
            >
              <SelectTrigger id="user-gender" className={selectClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GENDER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <span className="text-dash-muted text-xs font-semibold">
            <strong className="text-dash-fg text-sm font-extrabold">{users.length}</strong> pengguna
            ditemukan
          </span>
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
        <Table>
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
                <TableRow key={`skeleton-${index}`} className="border-dash-border">
                  {Array.from({ length: 8 }).map((__, cellIndex) => (
                    <TableCell key={`skeleton-${index}-${cellIndex}`}>
                      <span className="bg-dash-surface-2 block h-3.5 w-full animate-pulse rounded-full" />
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
                      {formatTimestamp(user.updated_at)}
                    </TableCell>
                    <TableCell className="py-3.5 pr-6 text-right sm:pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          disabled={isMutating}
                          className="border-dash-border text-dash-muted hover:bg-dash-surface-2 hover:text-dash-fg inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors focus:outline-none disabled:opacity-50"
                          aria-label={`Aksi untuk ${user.profile?.full_name ?? user.email}`}
                        >
                          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuItem
                            onClick={() => navigate(`/admin/users/${user.public_id}`)}
                          >
                            <Eye className="h-4 w-4" aria-hidden="true" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={isMutating || !user.is_active}
                            onClick={() => setPendingDeactivate(user)}
                          >
                            <UserX className="h-4 w-4" aria-hidden="true" />
                            Non Aktifkan Pengguna
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={isMutating}
                            variant="destructive"
                            onClick={() => setPendingDelete(user)}
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
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <p className="text-dash-muted text-sm">
              {filtersActive
                ? 'Tidak ada pengguna yang cocok dengan filter.'
                : 'Belum ada pengguna terdaftar.'}
            </p>
            {filtersActive && (
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
            )}
          </div>
        )}

        <div className="border-dash-border flex items-center justify-between gap-3 border-t p-4 sm:px-8">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetFilters}
            disabled={loading}
            className="border-dash-border rounded-full"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Halaman Pertama
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={loading || !hasNextPage}
            className="border-dash-border rounded-full"
          >
            Halaman Berikutnya
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
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
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

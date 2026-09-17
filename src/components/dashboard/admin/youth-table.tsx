import { useState } from 'react';

import { toast } from 'sonner';

import { StatusBadge } from '@/components/dashboard/shared/status-badge';
import { ProfileDetailDialog } from '@/components/database/profile-detail-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

import { ALL_FILTER, type YouthDirectoryState } from '@/hooks/use-youth-directory';

import type { YouthProfile, YouthStatus } from '@/types/database';

import { KECAMATAN_FILTER_OPTIONS, STATUS_OPTIONS } from '@/constants/database';

import { Copy, Eye, MoreHorizontal, RotateCcw, Search } from 'lucide-react';

interface YouthTableProps {
  directory: YouthDirectoryState;
}

const CATEGORY_TONE: Record<string, string> = {
  Kewirausahaan: 'bg-amber-400/20 text-amber-700 dark:text-amber-300',
  'Kriya & Kreatif': 'bg-violet-400/20 text-violet-700 dark:text-violet-300',
  'Teknologi & Digital': 'bg-sky-400/20 text-sky-700 dark:text-sky-300',
  'Olahraga & Prestasi': 'bg-emerald-400/20 text-emerald-700 dark:text-emerald-300',
  'Sosial & Komunitas': 'bg-rose-400/20 text-rose-700 dark:text-rose-300',
};

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento';

const selectClassName =
  'text-dash-fg focus-visible:border-dash-fg h-11 w-full rounded-2xl border border-dash-border bg-dash-surface-2 px-3.5 py-0 text-xs focus-visible:ring-0 data-[size=default]:h-11 sm:text-sm';

const LABEL_CLASS =
  'text-dash-muted mb-1.5 block text-[11px] font-semibold tracking-wide uppercase';

const HEAD_CLASS = 'text-dash-muted text-[11px] font-semibold tracking-wide uppercase';

export function YouthTable({ directory }: YouthTableProps) {
  const [selectedProfile, setSelectedProfile] = useState<YouthProfile | null>(null);

  const {
    filtered,
    searchTerm,
    setSearchTerm,
    kecamatan,
    setKecamatan,
    status,
    setStatus,
    resetFilters,
    updateStatus,
  } = directory;

  const copyContact = async (profile: YouthProfile) => {
    try {
      await navigator.clipboard.writeText(profile.kontak);
      toast.success(`Kontak ${profile.nama} disalin (${profile.kontak}).`);
    } catch {
      toast.error('Gagal menyalin kontak.');
    }
  };

  return (
    <div className="space-y-5">
      <div className={`${CARD} space-y-4 p-5`}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-6">
            <label htmlFor="pemuda-search" className={LABEL_CLASS}>
              Pencarian
            </label>
            <div className="relative">
              <Search
                className="text-dash-muted absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
                aria-hidden="true"
              />
              <Input
                id="pemuda-search"
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Cari nama, usaha, atau produk..."
                className="text-dash-fg focus-visible:border-dash-fg border-dash-border bg-dash-surface-2 h-11 rounded-2xl pr-3.5 pl-10 text-base focus-visible:ring-0 sm:text-sm"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label htmlFor="pemuda-kecamatan" className={LABEL_CLASS}>
              Kecamatan
            </label>
            <Select value={kecamatan} onValueChange={(value) => setKecamatan(value ?? ALL_FILTER)}>
              <SelectTrigger id="pemuda-kecamatan" className={selectClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER}>Semua Kecamatan</SelectItem>
                {KECAMATAN_FILTER_OPTIONS.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-3">
            <label htmlFor="pemuda-status" className={LABEL_CLASS}>
              Status
            </label>
            <Select value={status} onValueChange={(value) => setStatus(value ?? ALL_FILTER)}>
              <SelectTrigger id="pemuda-status" className={selectClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-dash-muted text-xs font-semibold">
            <strong className="text-dash-fg text-sm font-extrabold">{filtered.length}</strong>{' '}
            profil ditemukan
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
      </div>

      <div className={`${CARD} dash-reveal overflow-hidden`}>
        <Table>
          <TableHeader className="bg-dash-surface-2">
            <TableRow className="border-dash-border hover:bg-transparent">
              <TableHead className={`${HEAD_CLASS} pl-6 sm:pl-8`}>Pemuda & Usaha</TableHead>
              <TableHead className={HEAD_CLASS}>Kecamatan</TableHead>
              <TableHead className={HEAD_CLASS}>Kategori</TableHead>
              <TableHead className={HEAD_CLASS}>Status</TableHead>
              <TableHead className={`${HEAD_CLASS} pr-6 text-right sm:pr-8`}>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((profile) => (
              <TableRow key={profile.id} className="border-dash-border hover:bg-dash-surface-2/60">
                <TableCell className="py-3.5 pl-6 sm:pl-8">
                  <p className="text-dash-fg font-bold">{profile.nama}</p>
                  <p className="text-dash-muted text-xs">{profile.usaha}</p>
                </TableCell>
                <TableCell className="text-dash-muted text-xs font-medium">
                  {profile.kecamatan}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${
                      CATEGORY_TONE[profile.kategori] ?? 'bg-dash-surface-2 text-dash-muted'
                    }`}
                  >
                    {profile.kategori}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge label={profile.status} />
                </TableCell>
                <TableCell className="py-3.5 pr-6 text-right sm:pr-8">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="border-dash-border text-dash-muted hover:bg-dash-surface-2 hover:text-dash-fg inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors focus:outline-none"
                      aria-label={`Aksi untuk ${profile.nama}`}
                    >
                      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setSelectedProfile(profile)}>
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        Lihat Profil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyContact(profile)}>
                        <Copy className="h-4 w-4" aria-hidden="true" />
                        Salin Kontak
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Ubah Status</DropdownMenuLabel>
                      {STATUS_OPTIONS.filter((option) => option.value !== ALL_FILTER).map(
                        (option) => (
                          <DropdownMenuItem
                            key={option.value}
                            disabled={profile.status === option.value}
                            onClick={() => updateStatus(profile.id, option.value as YouthStatus)}
                          >
                            {option.label}
                          </DropdownMenuItem>
                        )
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filtered.length === 0 && (
          <p className="text-dash-muted p-8 text-center text-sm">
            Tidak ada profil pemuda yang cocok dengan filter.
          </p>
        )}
      </div>

      <ProfileDetailDialog
        profile={selectedProfile}
        open={selectedProfile !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProfile(null);
          }
        }}
      />
    </div>
  );
}

import { toast } from 'sonner';

import { StatusBadge } from '@/components/dashboard/shared/status-badge';
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

import type { ProgramRegistrationState } from '@/hooks/use-program-registrations';
import type { TrainingProgramState } from '@/hooks/use-training-programs';
import { ALL_FILTER } from '@/hooks/use-youth-directory';

import type { RegistrationStatus } from '@/types/dashboard';

import { REGISTRATION_STATUS_OPTIONS } from '@/constants/dashboard';

import { Check, CheckCheck, Copy, MoreHorizontal, RotateCcw, Search, X } from 'lucide-react';

interface RegistrationTableProps {
  registrationState: ProgramRegistrationState;
  programState: TrainingProgramState;
}

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento';

const selectClassName =
  'text-dash-fg focus-visible:border-dash-fg h-11 w-full rounded-2xl border border-dash-border bg-dash-surface-2 px-3.5 py-0 text-xs focus-visible:ring-0 data-[size=default]:h-11 sm:text-sm';

const LABEL_CLASS =
  'text-dash-muted mb-1.5 block text-[11px] font-semibold tracking-wide uppercase';

const HEAD_CLASS = 'text-dash-muted text-[11px] font-semibold tracking-wide uppercase';

export function RegistrationTable({ registrationState, programState }: RegistrationTableProps) {
  const {
    filtered,
    searchTerm,
    setSearchTerm,
    status,
    setStatus,
    programId,
    setProgramId,
    resetFilters,
    setRegistrationStatus,
  } = registrationState;

  const updateStatus = (id: string, nextStatus: RegistrationStatus, nama: string) => {
    setRegistrationStatus(id, nextStatus);
    toast.success(`Pendaftaran ${nama} ditandai sebagai "${nextStatus}".`);
  };

  const copyContact = async (nama: string, kontak: string) => {
    try {
      await navigator.clipboard.writeText(kontak);
      toast.success(`Kontak ${nama} disalin (${kontak}).`);
    } catch {
      toast.error('Gagal menyalin kontak.');
    }
  };

  return (
    <div className="space-y-5">
      <div className={`${CARD} space-y-4 p-5`}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-6">
            <label htmlFor="daftar-search" className={LABEL_CLASS}>
              Pencarian
            </label>
            <div className="relative">
              <Search
                className="text-dash-muted absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
                aria-hidden="true"
              />
              <Input
                id="daftar-search"
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Cari nama pemuda atau program..."
                className="text-dash-fg focus-visible:border-dash-fg border-dash-border bg-dash-surface-2 h-11 rounded-2xl pr-3.5 pl-10 text-base focus-visible:ring-0 sm:text-sm"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label htmlFor="daftar-program" className={LABEL_CLASS}>
              Program
            </label>
            <Select value={programId} onValueChange={(value) => setProgramId(value ?? ALL_FILTER)}>
              <SelectTrigger id="daftar-program" className={selectClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER}>Semua Program</SelectItem>
                {programState.programs.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.judul}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-3">
            <label htmlFor="daftar-status" className={LABEL_CLASS}>
              Status
            </label>
            <Select value={status} onValueChange={(value) => setStatus(value ?? ALL_FILTER)}>
              <SelectTrigger id="daftar-status" className={selectClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER}>Semua Status</SelectItem>
                {REGISTRATION_STATUS_OPTIONS.map((option) => (
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
            <strong className="text-dash-fg text-sm font-extrabold">{filtered.length}</strong>{' '}
            pendaftaran ditemukan
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
      </div>

      <div className={`${CARD} dash-reveal overflow-hidden`}>
        <Table>
          <TableHeader className="bg-dash-surface-2">
            <TableRow className="border-dash-border hover:bg-transparent">
              <TableHead className={`${HEAD_CLASS} pl-6 sm:pl-8`}>Pemuda</TableHead>
              <TableHead className={HEAD_CLASS}>Program</TableHead>
              <TableHead className={HEAD_CLASS}>Tanggal</TableHead>
              <TableHead className={HEAD_CLASS}>Status</TableHead>
              <TableHead className={`${HEAD_CLASS} pr-6 text-right sm:pr-8`}>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((registration) => (
              <TableRow
                key={registration.id}
                className="border-dash-border hover:bg-dash-surface-2/60"
              >
                <TableCell className="py-3.5 pl-6 sm:pl-8">
                  <p className="text-dash-fg font-bold">{registration.nama}</p>
                  <p className="text-dash-muted text-xs">
                    {registration.kecamatan} · {registration.kontak}
                  </p>
                </TableCell>
                <TableCell className="py-3.5">
                  <p className="text-dash-muted line-clamp-2 max-w-[18rem] text-xs font-medium">
                    {registration.programJudul}
                  </p>
                </TableCell>
                <TableCell className="text-dash-muted py-3.5 text-xs font-medium">
                  {registration.tanggal}
                </TableCell>
                <TableCell className="py-3.5">
                  <StatusBadge label={registration.status} />
                </TableCell>
                <TableCell className="py-3.5 pr-6 text-right sm:pr-8">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="border-dash-border text-dash-muted hover:bg-dash-surface-2 hover:text-dash-fg inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors focus:outline-none"
                      aria-label={`Aksi untuk ${registration.nama}`}
                    >
                      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        disabled={registration.status === 'Disetujui'}
                        onClick={() =>
                          updateStatus(registration.id, 'Disetujui', registration.nama)
                        }
                      >
                        <Check className="h-4 w-4" aria-hidden="true" />
                        Setujui
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={registration.status === 'Ditolak'}
                        variant="destructive"
                        onClick={() => updateStatus(registration.id, 'Ditolak', registration.nama)}
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                        Tolak
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={registration.status === 'Disetujui'}
                        onClick={() =>
                          updateStatus(registration.id, 'Disetujui', registration.nama)
                        }
                      >
                        <Check className="h-4 w-4" aria-hidden="true" />
                        Setujui
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => copyContact(registration.nama, registration.kontak)}
                      >
                        <Copy className="h-4 w-4" aria-hidden="true" />
                        Salin Kontak
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={registration.status === 'Ditolak'}
                        variant="destructive"
                        onClick={() => updateStatus(registration.id, 'Ditolak', registration.nama)}
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                        Tolak
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={registration.status !== 'Disetujui'}
                        onClick={() => updateStatus(registration.id, 'Selesai', registration.nama)}
                      >
                        <CheckCheck className="h-4 w-4" aria-hidden="true" />
                        Tandai Selesai
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filtered.length === 0 && (
          <p className="text-dash-muted p-8 text-center text-sm">
            Tidak ada pendaftaran yang cocok dengan filter.
          </p>
        )}
      </div>
    </div>
  );
}

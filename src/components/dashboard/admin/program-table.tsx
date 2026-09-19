import { useState } from 'react';

import { toast } from 'sonner';

import { ProgramFormDialog } from '@/components/dashboard/admin/program-form-dialog';
import { Meter } from '@/components/dashboard/shared/meter';
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

import type { TrainingProgramState } from '@/hooks/use-training-programs';
import { ALL_FILTER } from '@/hooks/use-youth-directory';

import type { NewTrainingProgram, TrainingProgram } from '@/types/dashboard';

import { PROGRAM_CATEGORY_OPTIONS, PROGRAM_STATUS_OPTIONS } from '@/constants/dashboard';

import { CopyPlus, MoreHorizontal, Pencil, Plus, RotateCcw, Search, Trash2 } from 'lucide-react';

interface ProgramTableProps {
  programState: TrainingProgramState;
}

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento';

const selectClassName =
  'text-dash-fg focus-visible:border-dash-fg h-11 w-full rounded-2xl border border-dash-border bg-dash-surface-2 px-3.5 py-0 text-xs focus-visible:ring-0 data-[size=default]:h-11 sm:text-sm';

const LABEL_CLASS =
  'text-dash-muted mb-1.5 block text-[11px] font-semibold tracking-wide uppercase';

const HEAD_CLASS = 'text-dash-muted text-[11px] font-semibold tracking-wide uppercase';

export function ProgramTable({ programState }: ProgramTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TrainingProgram | null>(null);
  const [deleting, setDeleting] = useState<TrainingProgram | null>(null);

  const {
    filtered,
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
    status,
    setStatus,
    resetFilters,
    addProgram,
    updateProgram,
    removeProgram,
  } = programState;

  const handleSubmit = (input: NewTrainingProgram) => {
    if (editing) {
      updateProgram(editing.id, input);
      toast.success(`Program "${input.judul}" berhasil diperbarui.`);
      return;
    }

    addProgram(input);
    toast.success(`Program "${input.judul}" berhasil ditambahkan.`);
  };

  const handleDuplicate = (program: TrainingProgram) => {
    const { judul, deskripsi, kategori, mentor, jadwal, durasi, lokasi, kuota, status } = program;
    addProgram({
      judul: `${judul} (Salinan)`,
      deskripsi,
      kategori,
      mentor,
      jadwal,
      durasi,
      lokasi,
      kuota,
      status,
    });
    toast.success(`Program "${judul}" diduplikasi.`);
  };

  const handleDelete = () => {
    if (!deleting) {
      return;
    }

    removeProgram(deleting.id);
    toast.success(`Program "${deleting.judul}" telah dihapus.`);
    setDeleting(null);
  };

  return (
    <div className="space-y-5">
      <div className={`${CARD} space-y-4 p-5`}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-6">
            <label htmlFor="program-search" className={LABEL_CLASS}>
              Pencarian
            </label>
            <div className="relative">
              <Search
                className="text-dash-muted absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
                aria-hidden="true"
              />
              <Input
                id="program-search"
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Cari judul program, mentor, atau lokasi..."
                className="text-dash-fg focus-visible:border-dash-fg border-dash-border bg-dash-surface-2 h-11 rounded-2xl pr-3.5 pl-10 text-base focus-visible:ring-0 sm:text-sm"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label htmlFor="program-filter-kategori" className={LABEL_CLASS}>
              Kategori
            </label>
            <Select value={category} onValueChange={(value) => setCategory(value ?? ALL_FILTER)}>
              <SelectTrigger id="program-filter-kategori" className={selectClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER}>Semua Kategori</SelectItem>
                {PROGRAM_CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-3">
            <label htmlFor="program-filter-status" className={LABEL_CLASS}>
              Status
            </label>
            <Select value={status} onValueChange={(value) => setStatus(value ?? ALL_FILTER)}>
              <SelectTrigger id="program-filter-status" className={selectClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER}>Semua Status</SelectItem>
                {PROGRAM_STATUS_OPTIONS.map((option) => (
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
            program ditemukan
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="border-dash-border rounded-full"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset
            </Button>
            <Button
              type="button"
              variant="lime"
              size="sm"
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
              className="rounded-full"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Tambah Program
            </Button>
          </div>
        </div>
      </div>

      <div className={`${CARD} dash-reveal overflow-hidden`}>
        <Table>
          <TableHeader className="bg-dash-surface-2">
            <TableRow className="border-dash-border hover:bg-transparent">
              <TableHead className={`${HEAD_CLASS} pl-6 sm:pl-8`}>Program</TableHead>
              <TableHead className={HEAD_CLASS}>Kategori</TableHead>
              <TableHead className={HEAD_CLASS}>Jadwal</TableHead>
              <TableHead className={HEAD_CLASS}>Kuota</TableHead>
              <TableHead className={HEAD_CLASS}>Status</TableHead>
              <TableHead className={`${HEAD_CLASS} pr-6 text-right sm:pr-8`}>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((program) => {
              const badge =
                PROGRAM_CATEGORY_OPTIONS.find((option) => option.value === program.kategori)
                  ?.badge ?? 'bg-dash-surface-2 text-dash-muted';
              const percent =
                program.kuota > 0 ? Math.round((program.terdaftar / program.kuota) * 100) : 0;

              return (
                <TableRow
                  key={program.id}
                  className="border-dash-border hover:bg-dash-surface-2/60"
                >
                  <TableCell className="py-3.5 pl-6 whitespace-normal sm:pl-8">
                    <p className="text-dash-fg font-bold">{program.judul}</p>
                    <p className="text-dash-muted text-xs">
                      {program.mentor} · {program.lokasi}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${badge}`}
                    >
                      {program.kategori}
                    </span>
                  </TableCell>
                  <TableCell className="text-dash-muted text-xs font-medium">
                    {program.jadwal}
                    <span className="block">{program.durasi}</span>
                  </TableCell>
                  <TableCell>
                    <div className="w-28">
                      <p className="text-dash-fg text-xs font-semibold">
                        {program.terdaftar}/{program.kuota}
                      </p>
                      <Meter value={percent} className="mt-1.5" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge label={program.status} />
                  </TableCell>
                  <TableCell className="py-3.5 pr-6 text-right sm:pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="border-dash-border text-dash-muted hover:bg-dash-surface-2 hover:text-dash-fg inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors focus:outline-none"
                        aria-label={`Aksi untuk ${program.judul}`}
                      >
                        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditing(program);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                          Ubah
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(program)}>
                          <CopyPlus className="h-4 w-4" aria-hidden="true" />
                          Duplikat
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeleting(program)}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filtered.length === 0 && (
          <p className="text-dash-muted p-8 text-center text-sm">
            Belum ada program yang cocok dengan filter.
          </p>
        )}
      </div>

      <ProgramFormDialog
        key={`${editing?.id ?? 'new'}-${dialogOpen}`}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(null);
          }
        }}
      >
        <AlertDialogContent className="bg-dash-surface border-dash-border shadow-bento-lg rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-dash-fg text-lg font-bold">
              Hapus Program Pelatihan?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-dash-muted text-xs leading-relaxed">
              Program &quot;{deleting?.judul}&quot; akan dihapus dari daftar. Data pendaftar terkait
              tetap tersimpan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-full bg-rose-600 text-white hover:bg-rose-700"
            >
              Hapus Program
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

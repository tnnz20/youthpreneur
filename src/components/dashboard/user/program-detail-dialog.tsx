import { Meter } from '@/components/dashboard/shared/meter';
import { StatusBadge } from '@/components/dashboard/shared/status-badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

import type { TrainingProgram } from '@/types/dashboard';

import { PROGRAM_CATEGORY_OPTIONS } from '@/constants/dashboard';

import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';

interface ProgramDetailDialogProps {
  program: TrainingProgram | null;
  registered: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: (program: TrainingProgram) => void;
}

export function ProgramDetailDialog({
  program,
  registered,
  open,
  onOpenChange,
  onRegister,
}: ProgramDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="bg-dash-surface border-dash-border shadow-bento-lg max-h-[90vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-[2rem] border p-6 sm:max-w-lg sm:p-7"
      >
        {program && (
          <>
            <DialogClose className="text-dash-muted hover:bg-dash-surface-2 hover:text-dash-fg absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors">
              ✕<span className="sr-only">Tutup</span>
            </DialogClose>

            <div className="flex flex-wrap items-center gap-2 pr-8">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  PROGRAM_CATEGORY_OPTIONS.find((option) => option.value === program.kategori)
                    ?.badge ?? 'bg-dash-surface-2 text-dash-muted'
                }`}
              >
                {program.kategori}
              </span>
              <StatusBadge label={program.status} />
            </div>

            <div className="space-y-1">
              <DialogTitle className="text-dash-fg text-2xl leading-tight font-bold tracking-tight">
                {program.judul}
              </DialogTitle>
              <DialogDescription className="text-dash-muted text-xs font-semibold">
                Mentor: {program.mentor}
              </DialogDescription>
            </div>

            <p className="text-dash-muted text-sm leading-relaxed">{program.deskripsi}</p>

            <div className="border-dash-border/60 bg-dash-surface-2 grid grid-cols-1 gap-3 rounded-2xl border p-4 text-xs sm:grid-cols-3">
              <span className="text-dash-fg flex items-center gap-2 font-semibold">
                <CalendarDays className="text-dash-muted h-3.5 w-3.5" aria-hidden="true" />
                {program.jadwal}
              </span>
              <span className="text-dash-fg flex items-center gap-2 font-semibold">
                <Clock className="text-dash-muted h-3.5 w-3.5" aria-hidden="true" />
                {program.durasi}
              </span>
              <span className="text-dash-fg flex items-center gap-2 font-semibold">
                <MapPin className="text-dash-muted h-3.5 w-3.5" aria-hidden="true" />
                {program.lokasi}
              </span>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-xs font-semibold">
                <span className="text-dash-muted flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" aria-hidden="true" />
                  {program.terdaftar}/{program.kuota} peserta terdaftar
                </span>
                <span className="text-dash-fg">
                  {program.kuota > 0 ? Math.round((program.terdaftar / program.kuota) * 100) : 0}%
                </span>
              </div>
              <Meter value={program.kuota > 0 ? (program.terdaftar / program.kuota) * 100 : 0} />
            </div>

            <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-dash-border h-auto flex-1 rounded-full py-3"
              >
                Tutup
              </Button>
              <Button
                type="button"
                variant="lime"
                disabled={
                  registered || program.status !== 'Dibuka' || program.terdaftar >= program.kuota
                }
                onClick={() => onRegister(program)}
                className="h-auto flex-1 rounded-full py-3 disabled:opacity-60"
              >
                {registered ? 'Sudah Terdaftar' : 'Daftar Program'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

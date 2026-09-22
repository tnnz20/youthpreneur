import { useState } from 'react';

import { Meter } from '@/components/dashboard/shared/meter';
import { StatusBadge } from '@/components/dashboard/shared/status-badge';
import { ProgramDetailDialog } from '@/components/dashboard/user/program-detail-dialog';
import { TrainingThumbnail } from '@/components/shared/training-thumbnail';
import { Button } from '@/components/ui/button';

import type { TrainingProgram } from '@/types/dashboard';

import { PROGRAM_CATEGORY_OPTIONS } from '@/constants/dashboard';

import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';

interface ProgramCardProps {
  program: TrainingProgram;
  registered: boolean;
  onRegister: (program: TrainingProgram) => void;
}

export function ProgramCard({ program, registered, onRegister }: ProgramCardProps) {
  const [detailOpen, setDetailOpen] = useState(false);

  const badge =
    PROGRAM_CATEGORY_OPTIONS.find((option) => option.value === program.kategori)?.badge ??
    'bg-dash-surface-2 text-dash-muted';
  const percent = program.kuota > 0 ? Math.round((program.terdaftar / program.kuota) * 100) : 0;
  const full = program.terdaftar >= program.kuota;
  const canRegister = program.status === 'Dibuka' && !full && !registered;

  return (
    <>
      <div className="group border-dash-border/60 bg-dash-surface shadow-bento hover:shadow-bento-lg flex flex-col justify-between overflow-hidden rounded-[2rem] border transition-all duration-300 hover:-translate-y-1">
        <TrainingThumbnail
          src={program.image}
          alt={program.judul}
          category={program.kategori}
          aspectRatioClassName="h-44"
          className="border-dash-border/60 border-b"
        />
        <div className="p-5">
          <div className="mb-3 flex items-start justify-between gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${badge}`}
            >
              {program.kategori}
            </span>
            <StatusBadge label={program.status} />
          </div>

          <h3 className="text-dash-fg text-base leading-tight font-bold">{program.judul}</h3>
          <p className="text-dash-muted mt-1 text-xs font-medium">{program.mentor}</p>

          <p className="text-dash-muted mt-3 line-clamp-2 text-xs leading-relaxed">
            {program.deskripsi}
          </p>

          <div className="text-dash-muted mt-4 space-y-1.5 text-xs font-medium">
            <p className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              {program.jadwal}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {program.durasi}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {program.lokasi}
            </p>
          </div>
        </div>

        <div className="border-dash-border/60 border-t p-5 pt-4">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold">
            <span className="text-dash-muted flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              {program.terdaftar}/{program.kuota} peserta
            </span>
            <span className="text-dash-fg">{percent}%</span>
          </div>
          <Meter value={percent} className="mb-3" />

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDetailOpen(true)}
              className="border-dash-border h-auto flex-1 rounded-full py-2.5 text-xs"
            >
              Lihat Detail
            </Button>
            <Button
              type="button"
              variant={registered ? 'outline' : 'lime'}
              disabled={!canRegister}
              onClick={() => onRegister(program)}
              className="h-auto flex-1 rounded-full py-2.5 text-xs disabled:opacity-60"
            >
              {registered ? 'Terdaftar' : full ? 'Kuota Penuh' : 'Daftar'}
            </Button>
          </div>
        </div>
      </div>

      <ProgramDetailDialog
        program={program}
        registered={registered}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onRegister={(item) => {
          onRegister(item);
          setDetailOpen(false);
        }}
      />
    </>
  );
}

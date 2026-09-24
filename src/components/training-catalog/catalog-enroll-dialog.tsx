import { formatDateOnly, renderValue } from '@/lib/utils';

import { StatusBadge } from '@/components/dashboard/shared/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { TrainingCatalog } from '@/types/trainings';

import { TRAINING_STATUS_LABELS } from '@/constants/trainings';

import { CalendarDays, Info, LoaderCircle, MapPin, Users, X } from 'lucide-react';

import { getCategoryToneClass } from './constants';

interface CatalogEnrollDialogProps {
  catalog: TrainingCatalog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading: boolean;
  onConfirm: () => void;
}

export function CatalogEnrollDialog({
  catalog,
  open,
  onOpenChange,
  loading,
  onConfirm,
}: CatalogEnrollDialogProps) {
  if (!catalog) return null;

  const dateLabel =
    catalog.start_date && catalog.end_date
      ? `${formatDateOnly(catalog.start_date)} - ${formatDateOnly(catalog.end_date)}`
      : catalog.start_date
        ? `Mulai ${formatDateOnly(catalog.start_date)}`
        : 'Jadwal belum ditentukan';

  const statusLabel = catalog.training_status
    ? (TRAINING_STATUS_LABELS[catalog.training_status] ?? catalog.training_status)
    : 'Direncanakan';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="border-brand-dark shadow-solid-lg max-h-[90vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl border-2 bg-white p-6 sm:max-w-lg sm:p-7"
      >
        <div className="flex items-start justify-between gap-3">
          <DialogHeader className="gap-1.5 text-left">
            <DialogTitle className="text-brand-dark text-xl font-black tracking-tight sm:text-2xl">
              Konfirmasi Pendaftaran
            </DialogTitle>
            <DialogDescription className="text-brand-muted text-xs font-semibold">
              Apakah kamu yakin ingin mendaftar ke program pelatihan ini?
            </DialogDescription>
          </DialogHeader>
          <DialogClose
            disabled={loading}
            className="border-brand-dark text-brand-dark flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-white text-sm shadow-sm transition-colors hover:bg-black/5 disabled:opacity-50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Tutup</span>
          </DialogClose>
        </div>

        <div className="border-brand-dark/20 space-y-3 rounded-2xl border bg-stone-50 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="default"
              className={`border-brand-dark rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getCategoryToneClass(
                catalog.category
              )}`}
            >
              {catalog.category ?? 'Umum'}
            </Badge>
            <StatusBadge label={statusLabel} />
          </div>

          <div>
            <h4 className="text-brand-dark text-base leading-snug font-black">
              {renderValue(catalog.title)}
            </h4>
            <p className="text-brand-muted text-xs font-semibold">
              Mentor: {renderValue(catalog.mentor)}
            </p>
          </div>

          <div className="border-brand-dark/10 text-brand-dark space-y-2 border-t pt-3 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <CalendarDays className="text-brand-muted h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{dateLabel}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="text-brand-muted mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="leading-relaxed break-words">{renderValue(catalog.address)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="text-brand-muted h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>
                {catalog.max_slots
                  ? `${catalog.registered_count}/${catalog.max_slots} Kuota Terisi`
                  : `${catalog.registered_count} Peserta Terdaftar`}
              </span>
            </div>
          </div>
        </div>

        <div className="border-brand-dark/20 flex items-start gap-2.5 rounded-xl border bg-amber-50/70 p-3 text-xs text-amber-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
          <p className="leading-relaxed">
            Setelah diajukan, pendaftaranmu akan berstatus <strong>Menunggu Verifikasi</strong>{' '}
            (Pending) sampai disetujui oleh tim Dispora Tapin.
          </p>
        </div>

        <DialogFooter className="mt-2 flex flex-col-reverse gap-2 border-none bg-transparent p-0 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="border-brand-dark h-10 rounded-full px-5 text-xs font-bold hover:bg-black/5"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="neo"
            disabled={loading}
            onClick={onConfirm}
            className="h-10 rounded-full px-5 text-xs font-bold"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                <span>Mendaftar...</span>
              </>
            ) : (
              'Ya, Daftar Sekarang'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

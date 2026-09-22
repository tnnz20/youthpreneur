import { formatDateOnly, renderValue } from '@/lib/utils';

import { Meter } from '@/components/dashboard/shared/meter';
import { StatusBadge } from '@/components/dashboard/shared/status-badge';
import { TrainingThumbnail } from '@/components/shared/training-thumbnail';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import type { TrainingCatalog } from '@/types/trainings';

import { TRAINING_STATUS_LABELS } from '@/constants/trainings';

import { CalendarDays, ExternalLink, LoaderCircle, MapPin, Phone, Users, X } from 'lucide-react';

import { getCategoryToneClass } from './constants';

interface CatalogDetailDialogProps {
  catalog: TrainingCatalog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEnrolled: boolean;
  isEnrolling: boolean;
  onEnroll: (catalog: TrainingCatalog) => void;
}

export function CatalogDetailDialog({
  catalog,
  open,
  onOpenChange,
  isEnrolled,
  isEnrolling,
  onEnroll,
}: CatalogDetailDialogProps) {
  if (!catalog) return null;

  const isFull = catalog.max_slots !== null && catalog.registered_count >= catalog.max_slots;
  const isCompleted = catalog.training_status === 'completed';
  const percent = catalog.max_slots
    ? Math.min(100, Math.round((catalog.registered_count / catalog.max_slots) * 100))
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="border-brand-dark shadow-solid-lg max-h-[90vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl border-2 bg-white p-0 sm:max-w-lg"
      >
        <div className="relative">
          <TrainingThumbnail
            src={catalog.thumbnail}
            alt={catalog.title ?? 'Program Pelatihan'}
            category={catalog.category}
            aspectRatioClassName="h-48 sm:h-56"
            className="border-brand-dark border-b-2"
          />
          <DialogClose className="border-brand-dark text-brand-dark absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white/90 text-sm shadow-sm transition-colors hover:bg-white">
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Tutup</span>
          </DialogClose>
        </div>

        <div className="space-y-4 p-6 sm:p-7">
          {/* Header Row above Title: Badges & External Link */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="default"
                className={`border-brand-dark rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getCategoryToneClass(
                  catalog.category
                )}`}
              >
                {catalog.category ?? 'Umum'}
              </Badge>
              <StatusBadge
                label={
                  catalog.training_status
                    ? (TRAINING_STATUS_LABELS[catalog.training_status] ?? catalog.training_status)
                    : 'Direncanakan'
                }
              />
            </div>

            {catalog.link && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <a
                      href={catalog.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-dark hover:bg-brand-yellow/30 border-brand-dark inline-flex items-center gap-1.5 rounded-full border bg-white px-2.5 py-1 text-xs font-bold transition-colors"
                    />
                  }
                >
                  <span>Tautan Eksternal</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </TooltipTrigger>
                <TooltipContent>
                  <span>Link Tambahan</span>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          <div className="space-y-1">
            <DialogTitle className="text-brand-dark text-xl leading-snug font-black sm:text-2xl">
              {renderValue(catalog.title)}
            </DialogTitle>
            <DialogDescription className="text-brand-muted text-xs font-bold">
              Mentor: {renderValue(catalog.mentor)}
            </DialogDescription>
          </div>

          <p className="text-brand-dark/80 text-xs leading-relaxed sm:text-sm">
            {renderValue(catalog.description)}
          </p>

          {/* Info Box with Tooltips & Full Address */}
          <div className="border-brand-dark/20 grid grid-cols-1 gap-3 rounded-2xl border bg-stone-50 p-4 text-xs font-bold sm:grid-cols-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <div
                    tabIndex={0}
                    className="text-brand-dark focus-visible:ring-brand-dark flex cursor-help items-center gap-2 rounded outline-none focus-visible:ring-1"
                  />
                }
              >
                <CalendarDays className="text-brand-muted h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {catalog.start_date && catalog.end_date
                    ? `${formatDateOnly(catalog.start_date)} - ${formatDateOnly(catalog.end_date)}`
                    : catalog.start_date
                      ? `Mulai ${formatDateOnly(catalog.start_date)}`
                      : 'Jadwal belum ditentukan'}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>Tanggal</span>
              </TooltipContent>
            </Tooltip>

            {catalog.pic_phone && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <div
                      tabIndex={0}
                      className="text-brand-dark focus-visible:ring-brand-dark flex cursor-help items-center gap-2 rounded outline-none focus-visible:ring-1"
                    />
                  }
                >
                  <Phone className="text-brand-muted h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{catalog.pic_phone}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Nomor PIC</span>
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger
                render={
                  <div
                    tabIndex={0}
                    className="text-brand-dark focus-visible:ring-brand-dark flex cursor-help items-start gap-2 rounded outline-none focus-visible:ring-1 sm:col-span-2"
                  />
                }
              >
                <MapPin className="text-brand-muted mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="text-left leading-relaxed break-words whitespace-normal">
                  {renderValue(catalog.address)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>Alamat</span>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Slots / Progress */}
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-xs font-bold">
              <span className="text-brand-muted flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
                {catalog.max_slots
                  ? `${catalog.registered_count}/${catalog.max_slots} Peserta Terdaftar`
                  : `${catalog.registered_count} Peserta Terdaftar`}
              </span>
              <span className="text-brand-dark font-black">
                {catalog.max_slots ? `${percent}%` : 'Tanpa Kuota'}
              </span>
            </div>
            {catalog.max_slots ? <Meter value={percent} /> : null}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-brand-dark h-auto flex-1 rounded-full py-3 text-xs font-bold hover:bg-black/5"
            >
              Tutup
            </Button>
            <Button
              type="button"
              variant="neo"
              disabled={isEnrolled || isCompleted || isFull || isEnrolling}
              onClick={() => onEnroll(catalog)}
              className="h-auto flex-1 rounded-full py-3 text-xs font-bold disabled:opacity-60"
            >
              {isEnrolling ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : isEnrolled ? (
                'Sudah Terdaftar'
              ) : isCompleted ? (
                'Pelatihan Selesai'
              ) : isFull ? (
                'Kuota Penuh'
              ) : (
                'Daftar Sekarang'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

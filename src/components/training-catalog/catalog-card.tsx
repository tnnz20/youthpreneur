import { formatDateOnly, renderValue } from '@/lib/utils';

import { Meter } from '@/components/dashboard/shared/meter';
import { StatusBadge } from '@/components/dashboard/shared/status-badge';
import { TrainingThumbnail } from '@/components/shared/training-thumbnail';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import type { TrainingCatalog } from '@/types/trainings';

import { TRAINING_STATUS_LABELS } from '@/constants/trainings';

import { CalendarDays, LoaderCircle, MapPin, Users } from 'lucide-react';

import { getCategoryToneClass } from './constants';

interface CatalogCardProps {
  catalog: TrainingCatalog;
  isEnrolled: boolean;
  isEnrolling: boolean;
  onEnroll: (catalog: TrainingCatalog) => void;
  onSelect: (catalog: TrainingCatalog) => void;
}

export function CatalogCard({
  catalog,
  isEnrolled,
  isEnrolling,
  onEnroll,
  onSelect,
}: CatalogCardProps) {
  const percent = catalog.max_slots
    ? Math.min(100, Math.round((catalog.registered_count / catalog.max_slots) * 100))
    : 0;
  const isFull = catalog.max_slots !== null && catalog.registered_count >= catalog.max_slots;
  const isCompleted = catalog.training_status === 'completed';
  const canRegister = !isEnrolled && !isFull && !isCompleted;

  const dateLabel =
    catalog.start_date && catalog.end_date
      ? `${formatDateOnly(catalog.start_date)} - ${formatDateOnly(catalog.end_date)}`
      : catalog.start_date
        ? `Mulai ${formatDateOnly(catalog.start_date)}`
        : 'Jadwal belum ditentukan';

  const statusLabel = catalog.training_status
    ? (TRAINING_STATUS_LABELS[catalog.training_status] ?? catalog.training_status)
    : 'Direncanakan';

  const toneClass = getCategoryToneClass(catalog.category);

  return (
    <div className="group border-brand-dark shadow-solid hover:shadow-solid-lg flex flex-col justify-between overflow-hidden rounded-2xl border-2 bg-white transition-all duration-300 hover:-translate-y-1">
      <div>
        {/* Thumbnail banner with automatic fallback */}
        <TrainingThumbnail
          src={catalog.thumbnail}
          alt={catalog.title ?? 'Program Pelatihan'}
          category={catalog.category}
          aspectRatioClassName="h-48"
          className="border-brand-dark border-b-2"
        />

        <div className="p-5 sm:p-6">
          <div className="mb-3 flex items-start justify-between gap-2">
            <Badge
              variant="default"
              className={`border-brand-dark h-auto rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${toneClass}`}
            >
              {catalog.category ?? 'Umum'}
            </Badge>
            <StatusBadge label={statusLabel} />
          </div>

          <h2 className="text-brand-dark line-clamp-2 text-lg font-black tracking-tight">
            {renderValue(catalog.title)}
          </h2>
          <p className="text-brand-muted mt-1 text-xs font-semibold">
            Mentor: {renderValue(catalog.mentor)}
          </p>

          <p className="text-brand-muted mt-3 line-clamp-2 text-xs leading-relaxed">
            {renderValue(catalog.description)}
          </p>

          <div className="border-brand-dark/10 space-y-2 border-t pt-4 text-xs font-bold">
            <div className="text-brand-dark flex items-center gap-2">
              <CalendarDays className="text-brand-muted h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{dateLabel}</span>
            </div>
            <div className="text-brand-dark flex items-center gap-2">
              <MapPin className="text-brand-muted h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{renderValue(catalog.address)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-brand-dark/10 border-t p-5 sm:p-6">
        <div className="mb-4">
          <div className="mb-1.5 flex items-center justify-between gap-3 text-xs font-bold">
            <span className="text-brand-muted flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              {catalog.max_slots
                ? `${catalog.registered_count}/${catalog.max_slots} Peserta`
                : `${catalog.registered_count} Peserta`}
            </span>
            <span className="text-brand-dark font-black">
              {catalog.max_slots ? `${percent}%` : 'Tanpa Kuota'}
            </span>
          </div>
          {catalog.max_slots ? <Meter value={percent} /> : null}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onSelect(catalog)}
            className="border-brand-dark h-9 flex-1 rounded-full text-xs font-bold hover:bg-black/5"
          >
            Detail
          </Button>
          <Button
            type="button"
            variant={isEnrolled ? 'secondary' : 'neo'}
            size="sm"
            disabled={!canRegister || isEnrolling}
            onClick={() => onEnroll(catalog)}
            className="h-9 rounded-full px-4 text-xs font-bold"
          >
            {isEnrolling ? (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            ) : isEnrolled ? (
              'Terdaftar'
            ) : isCompleted ? (
              'Selesai'
            ) : isFull ? (
              'Kuota Penuh'
            ) : (
              'Daftar'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

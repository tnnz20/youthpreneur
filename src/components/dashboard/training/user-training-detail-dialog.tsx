import { useEffect, useState } from 'react';

import { Link } from 'react-router';

import { getTrainingCatalog } from '@/lib/api/trainings';
import { cn, formatDateOnly, renderValue } from '@/lib/utils';

import { StatusBadge } from '@/components/dashboard/shared/status-badge';
import { TrainingThumbnail } from '@/components/shared/training-thumbnail';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

import type { TrainingCatalog, TrainingEnrollment } from '@/types/trainings';

import { ENROLLMENT_STATUS_LABELS, TRAINING_STATUS_LABELS } from '@/constants/trainings';

import {
  Ban,
  CalendarDays,
  ExternalLink,
  GraduationCap,
  MapPin,
  Phone,
  User,
  Users,
  X,
} from 'lucide-react';

interface UserTrainingDetailDialogProps {
  enrollment: TrainingEnrollment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestCancel: (enrollment: TrainingEnrollment) => void;
}

export function UserTrainingDetailDialog({
  enrollment,
  open,
  onOpenChange,
  onRequestCancel,
}: UserTrainingDetailDialogProps) {
  const [catalog, setCatalog] = useState<TrainingCatalog | null>(null);
  const [loading, setLoading] = useState(false);

  const catalogPublicId = enrollment?.catalog?.public_id;

  useEffect(() => {
    if (!open || !catalogPublicId) return;

    let active = true;

    getTrainingCatalog(catalogPublicId)
      .then((data) => {
        if (active) {
          setCatalog(data);
        }
      })
      .catch(() => {
        if (active) {
          setCatalog(null);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [open, catalogPublicId]);

  if (!enrollment) return null;

  const isCancelled = Boolean(enrollment.deleted_at || enrollment.status === 'cancelled');
  const enrollmentStatusLabel = isCancelled
    ? 'Dibatalkan'
    : (ENROLLMENT_STATUS_LABELS[enrollment.status] ?? enrollment.status);

  const title =
    catalog?.title ?? enrollment.catalog?.title ?? enrollment.catalog?.name ?? 'Program Pelatihan';
  const category = catalog?.category ?? enrollment.catalog?.category ?? null;
  const trainingStatus = catalog?.training_status ?? enrollment.catalog?.training_status ?? null;
  const trainingStatusLabel = trainingStatus ? TRAINING_STATUS_LABELS[trainingStatus] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="border-dash-border bg-dash-surface shadow-bento-lg max-h-[90vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-[2rem] border p-0 sm:max-w-xl"
      >
        <div className="relative">
          <TrainingThumbnail
            src={catalog?.thumbnail ?? null}
            alt={title}
            category={category}
            aspectRatioClassName="h-44 sm:h-52"
            className="rounded-t-[2rem]"
          />
          <DialogClose className="text-dash-fg bg-dash-surface/80 hover:bg-dash-surface border-dash-border absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border text-sm backdrop-blur-xs transition-colors">
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Tutup</span>
          </DialogClose>
        </div>

        <div className="space-y-5 p-6 sm:p-7">
          <DialogHeader className="space-y-2 p-0 text-left">
            <div className="flex flex-wrap items-center gap-2">
              {category && (
                <Badge
                  variant="outline"
                  className="border-dash-border text-dash-muted text-[11px] font-semibold"
                >
                  {category}
                </Badge>
              )}
              <StatusBadge label={enrollmentStatusLabel} />
              {trainingStatusLabel && <StatusBadge label={trainingStatusLabel} />}
            </div>
            <DialogTitle className="text-dash-fg text-xl font-bold tracking-tight sm:text-2xl">
              {title}
            </DialogTitle>
            <DialogDescription className="text-dash-muted text-xs">
              ID Pendaftaran:{' '}
              <span className="font-mono font-semibold">{enrollment.public_id}</span>
              {catalogPublicId && (
                <>
                  {' '}
                  &bull; ID Katalog:{' '}
                  <span className="font-mono font-semibold">{catalogPublicId}</span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Quick Info Grid */}
          <div className="border-dash-border/60 bg-dash-surface-2 grid grid-cols-1 gap-3 rounded-2xl border p-4 text-xs sm:grid-cols-2">
            <div className="flex items-center gap-2.5">
              <CalendarDays className="text-dash-muted h-4 w-4 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-dash-muted text-[10px] font-semibold uppercase">
                  Tanggal Mendaftar
                </p>
                <p className="text-dash-fg font-medium">
                  {formatDateOnly(enrollment.register_date)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <GraduationCap className="text-dash-muted h-4 w-4 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-dash-muted text-[10px] font-semibold uppercase">
                  Status Pendaftaran
                </p>
                <p className="text-dash-fg font-medium">{enrollmentStatusLabel}</p>
              </div>
            </div>

            {loading ? (
              <>
                <Skeleton className="h-8 w-full rounded-md" />
                <Skeleton className="h-8 w-full rounded-md" />
              </>
            ) : (
              <>
                {catalog?.mentor && (
                  <div className="flex items-center gap-2.5">
                    <User className="text-dash-muted h-4 w-4 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-dash-muted text-[10px] font-semibold uppercase">
                        Mentor / Instruktur
                      </p>
                      <p className="text-dash-fg font-medium">{catalog.mentor}</p>
                    </div>
                  </div>
                )}

                {catalog?.max_slots && (
                  <div className="flex items-center gap-2.5">
                    <Users className="text-dash-muted h-4 w-4 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-dash-muted text-[10px] font-semibold uppercase">
                        Kuota Peserta
                      </p>
                      <p className="text-dash-fg font-medium">
                        {catalog.registered_count} / {catalog.max_slots} Peserta
                      </p>
                    </div>
                  </div>
                )}

                {catalog?.address && (
                  <div className="flex items-center gap-2.5 sm:col-span-2">
                    <MapPin className="text-dash-muted h-4 w-4 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-dash-muted text-[10px] font-semibold uppercase">
                        Lokasi / Alamat
                      </p>
                      <p className="text-dash-fg font-medium">{catalog.address}</p>
                    </div>
                  </div>
                )}

                {catalog?.pic_phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="text-dash-muted h-4 w-4 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-dash-muted text-[10px] font-semibold uppercase">
                        Kontak PIC
                      </p>
                      <p className="text-dash-fg font-medium">{catalog.pic_phone}</p>
                    </div>
                  </div>
                )}

                {(catalog?.start_date || catalog?.end_date) && (
                  <div className="flex items-center gap-2.5">
                    <CalendarDays className="text-dash-muted h-4 w-4 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-dash-muted text-[10px] font-semibold uppercase">
                        Pelaksanaan
                      </p>
                      <p className="text-dash-fg font-medium">
                        {catalog.start_date ? formatDateOnly(catalog.start_date) : '-'} s/d{' '}
                        {catalog.end_date ? formatDateOnly(catalog.end_date) : '-'}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Description */}
          {catalog?.description && (
            <div className="space-y-1.5">
              <h4 className="text-dash-muted text-[11px] font-semibold tracking-wide uppercase">
                Deskripsi Pelatihan
              </h4>
              <p className="text-dash-fg text-xs leading-relaxed">
                {renderValue(catalog.description)}
              </p>
            </div>
          )}

          {/* Additional Link */}
          {catalog?.link && (
            <div className="border-dash-border/60 bg-dash-surface-2 flex items-center justify-between rounded-xl border p-3 text-xs">
              <span className="text-dash-muted font-medium">Tautan Tambahan:</span>
              <a
                href={catalog.link}
                target="_blank"
                rel="noreferrer noopener"
                className="text-dash-fg inline-flex items-center gap-1 font-semibold hover:underline"
              >
                Kunjungi Tautan <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>
          )}

          {/* Actions */}
          <div className="border-dash-border/60 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <Link
              to="/training-catalog"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'border-dash-border rounded-full text-xs'
              )}
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Buka Katalog
            </Link>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={isCancelled || enrollment.status !== 'pending'}
                onClick={() => {
                  onOpenChange(false);
                  onRequestCancel(enrollment);
                }}
                className="rounded-full text-xs"
              >
                <Ban className="h-3.5 w-3.5" aria-hidden="true" />
                Batalkan Pendaftaran
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="border-dash-border rounded-full text-xs"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

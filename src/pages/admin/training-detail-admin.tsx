import { useCallback, useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

import {
  deleteTrainingCatalog,
  getTrainingCatalog,
  updateTrainingCatalog,
} from '@/lib/api/trainings';
import { cn, renderValue, resolveImageUrl, toErrorMessage } from '@/lib/utils';

import { StatusBadge } from '@/components/dashboard/shared/status-badge';
import { TrainingDeleteDialog } from '@/components/dashboard/training/training-delete-dialog';
import { TrainingDetailActionCard } from '@/components/dashboard/training/training-detail-action-card';
import { TrainingDetailInfoCard } from '@/components/dashboard/training/training-detail-info-card';
import { TrainingDetailQuotaCard } from '@/components/dashboard/training/training-detail-quota-card';
import { TrainingEnrollmentTable } from '@/components/dashboard/training/training-enrollment-table';
import { TrainingFormDialog } from '@/components/dashboard/training/training-form-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';

import type { CreateTrainingCatalogInput, TrainingCatalog } from '@/types/trainings';

import { TRAINING_STATUS_LABELS } from '@/constants/trainings';

import { ArrowLeft, GraduationCap, LoaderCircle } from 'lucide-react';

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento ring-0 p-6';

function DetailThumbnail({ src, title }: { src?: string | null; title?: string | null }) {
  const [failed, setFailed] = useState(false);
  const resolvedUrl = resolveImageUrl(src);

  if (!resolvedUrl || failed) {
    return (
      <div className="bg-dash-surface-2 border-dash-border flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border">
        <GraduationCap className="text-dash-fg h-7 w-7" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={resolvedUrl}
      alt={title ?? 'Thumbnail'}
      onError={() => setFailed(true)}
      className="border-dash-border h-14 w-14 shrink-0 rounded-2xl border object-cover"
    />
  );
}

export default function TrainingDetailAdminPage() {
  const { publicId } = useParams<{ publicId: string }>();
  const navigate = useNavigate();

  const [catalog, setCatalog] = useState<TrainingCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadCatalog = useCallback(() => {
    if (!publicId) return;

    getTrainingCatalog(publicId)
      .then((data) => {
        setCatalog(data);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(toErrorMessage(err));
      })
      .finally(() => setLoading(false));
  }, [publicId]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const handleEditSubmit = async (input: CreateTrainingCatalogInput) => {
    if (!catalog) return;

    const updated = await updateTrainingCatalog(catalog.public_id, input);
    setCatalog(updated);
    toast.success(`Program pelatihan "${updated.title}" berhasil diperbarui.`);
    setEditing(false);
  };

  const confirmDelete = async () => {
    if (!catalog) return;

    setDeleting(true);
    try {
      await deleteTrainingCatalog(catalog.public_id);
      toast.success(`Program pelatihan "${catalog.title}" berhasil dihapus.`);
      setPendingDelete(false);
      navigate('/dashboard/trainings');
    } catch (err: unknown) {
      toast.error(toErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const backButton = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => navigate('/dashboard/trainings')}
      className="border-dash-border rounded-full"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Kembali
    </Button>
  );

  if (loading) {
    return (
      <Card className={cn(CARD, 'flex flex-row items-center justify-center gap-3')}>
        <LoaderCircle className="text-dash-fg h-5 w-5 animate-spin" aria-hidden="true" />
        <span className="text-dash-muted text-sm font-semibold">
          Memuat data program pelatihan...
        </span>
      </Card>
    );
  }

  if (error || !catalog) {
    return (
      <Card className={cn(CARD, 'space-y-4')}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-dash-fg text-xl font-bold">
            Program Pelatihan Tidak Ditemukan
          </CardTitle>
          {backButton}
        </div>
        <p className="text-xs font-semibold text-rose-500">
          {error ?? 'Data program pelatihan tidak dapat ditemukan.'}
        </p>
      </Card>
    );
  }

  const statusLabel = catalog.training_status
    ? (TRAINING_STATUS_LABELS[catalog.training_status] ?? catalog.training_status)
    : 'Direncanakan';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <DetailThumbnail src={catalog.thumbnail} title={catalog.title} />
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-dash-fg text-2xl font-bold tracking-tight">
                {renderValue(catalog.title)}
              </h1>
              <StatusBadge label={statusLabel} />
            </div>
            <p className="text-dash-muted text-xs">ID: {catalog.public_id}</p>
          </div>
        </div>
        <div>{backButton}</div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(20rem,1fr)] xl:items-start">
        {/* Left Column */}
        <div className="space-y-6">
          <TrainingDetailInfoCard catalog={catalog} />
          <TrainingEnrollmentTable
            catalogPublicId={catalog.public_id}
            onEnrollmentUpdated={loadCatalog}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <TrainingDetailQuotaCard catalog={catalog} />
          <TrainingDetailActionCard
            catalog={catalog}
            onEdit={() => setEditing(true)}
            onDelete={() => setPendingDelete(true)}
            disabled={deleting}
          />
        </div>
      </div>

      {/* Dialogs */}
      <TrainingFormDialog
        open={editing}
        onOpenChange={setEditing}
        initial={catalog}
        onSubmit={handleEditSubmit}
      />

      <TrainingDeleteDialog
        pendingDelete={pendingDelete ? catalog : null}
        loading={deleting}
        onCancel={() => setPendingDelete(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

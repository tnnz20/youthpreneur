import { Meter } from '@/components/dashboard/shared/meter';
import { StatusBadge } from '@/components/dashboard/shared/status-badge';

import type { TrainingCatalog } from '@/types/trainings';

import { TRAINING_STATUS_LABELS } from '@/constants/trainings';

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento ring-0 p-6';
const LABEL_CLASS = 'text-dash-muted text-[11px] font-semibold tracking-wide uppercase';

interface TrainingDetailQuotaCardProps {
  catalog: TrainingCatalog;
}

export function TrainingDetailQuotaCard({ catalog }: TrainingDetailQuotaCardProps) {
  const quotaPercent = catalog.max_slots
    ? Math.min(100, Math.round((catalog.registered_count / catalog.max_slots) * 100))
    : 0;

  const statusLabel = catalog.training_status
    ? (TRAINING_STATUS_LABELS[catalog.training_status] ?? catalog.training_status)
    : 'Direncanakan';

  return (
    <div className={`${CARD} space-y-4`}>
      <h2 className="text-dash-fg text-base font-bold">Kapasitas & Kuota</h2>

      <div className="bg-dash-surface-2 border-dash-border/60 space-y-3 rounded-2xl border p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-dash-muted font-medium">Pendaftar Diterima</span>
          <span className="text-dash-fg font-bold">
            {catalog.registered_count} {catalog.max_slots ? `/ ${catalog.max_slots}` : 'Pendaftar'}
          </span>
        </div>

        {catalog.max_slots ? (
          <>
            <Meter value={quotaPercent} />
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-dash-muted">Persentase Kuota</span>
              <span className="text-dash-fg font-bold">{quotaPercent}%</span>
            </div>
          </>
        ) : (
          <p className="text-dash-muted text-xs">Program ini tidak membatasi kuota peserta.</p>
        )}
      </div>

      <div className="pt-2">
        <span className={LABEL_CLASS}>Status Program</span>
        <div className="mt-1.5">
          <StatusBadge label={statusLabel} />
        </div>
      </div>
    </div>
  );
}

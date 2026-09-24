import { useState } from 'react';

import { useUserTrainings } from '@/hooks/use-user-trainings';

import type { TrainingEnrollment } from '@/types/trainings';

import { UserTrainingCancelDialog } from './user-training-cancel-dialog';
import { UserTrainingDetailDialog } from './user-training-detail-dialog';
import { UserTrainingTableContent } from './user-training-table-content';
import { UserTrainingTableFilters } from './user-training-table-filters';

export function UserTrainingTable() {
  const state = useUserTrainings();
  const [selectedDetail, setSelectedDetail] = useState<TrainingEnrollment | null>(null);
  const [pendingCancel, setPendingCancel] = useState<TrainingEnrollment | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const { search, filters, cancel } = state;
  const filtersActive = search.trim() !== '' || filters.status !== 'all';

  const confirmCancel = async () => {
    if (!pendingCancel) return;

    setCancelling(true);
    try {
      await cancel(pendingCancel.public_id);
      setPendingCancel(null);
    } catch {
      // Error handled in hook toast
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="space-y-5">
      <UserTrainingTableFilters state={state} />

      <UserTrainingTableContent
        state={state}
        filtersActive={filtersActive}
        onSelectDetail={setSelectedDetail}
        onRequestCancel={setPendingCancel}
      />

      <UserTrainingDetailDialog
        key={selectedDetail?.public_id ?? 'empty'}
        enrollment={selectedDetail}
        open={Boolean(selectedDetail)}
        onOpenChange={(open) => {
          if (!open) setSelectedDetail(null);
        }}
        onRequestCancel={(enrollment) => {
          setSelectedDetail(null);
          setPendingCancel(enrollment);
        }}
      />

      <UserTrainingCancelDialog
        pendingCancel={pendingCancel}
        loading={cancelling}
        onCancel={() => setPendingCancel(null)}
        onConfirm={confirmCancel}
      />
    </div>
  );
}

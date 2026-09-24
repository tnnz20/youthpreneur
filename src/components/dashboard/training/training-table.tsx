import { useState } from 'react';

import { toast } from 'sonner';

import { toErrorMessage } from '@/lib/utils';

import { useTrainings } from '@/hooks/use-trainings';

import type { CreateTrainingCatalogInput, TrainingCatalog } from '@/types/trainings';

import { TrainingDeleteDialog } from './training-delete-dialog';
import { TrainingFormDialog } from './training-form-dialog';
import { TrainingTableContent } from './training-table-content';
import { TrainingTableFilters } from './training-table-filters';

export function TrainingTable() {
  const state = useTrainings();
  const [pendingDelete, setPendingDelete] = useState<TrainingCatalog | null>(null);
  const [pendingEdit, setPendingEdit] = useState<TrainingCatalog | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { filters, search, remove, create, update } = state;

  const filtersActive =
    search.trim() !== '' || filters.category !== 'semua' || filters.training_status !== 'semua';

  const confirmDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    const target = pendingDelete;
    setDeleting(true);

    try {
      await remove(target.public_id);
      toast.success(`Program pelatihan "${target.title ?? target.public_id}" berhasil dihapus.`);
      setPendingDelete(null);
    } catch (mutationError: unknown) {
      toast.error(toErrorMessage(mutationError));
    } finally {
      setDeleting(false);
    }
  };

  const handleFormSubmit = async (input: CreateTrainingCatalogInput) => {
    if (pendingEdit) {
      await update(pendingEdit.public_id, input);
      toast.success(`Program pelatihan "${input.title ?? pendingEdit.title}" berhasil diperbarui.`);
      setPendingEdit(null);
      return;
    }

    await create(input);
    toast.success(`Program pelatihan "${input.title}" berhasil ditambahkan.`);
  };

  return (
    <div className="space-y-5">
      <TrainingTableFilters state={state} onOpenCreate={() => setCreateDialogOpen(true)} />

      <TrainingTableContent
        state={state}
        filtersActive={filtersActive}
        onRequestDelete={setPendingDelete}
        onRequestEdit={setPendingEdit}
        onOpenCreate={() => setCreateDialogOpen(true)}
      />

      <TrainingDeleteDialog
        pendingDelete={pendingDelete}
        loading={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />

      <TrainingFormDialog
        open={createDialogOpen || pendingEdit !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCreateDialogOpen(false);
            setPendingEdit(null);
          }
        }}
        initial={pendingEdit}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}

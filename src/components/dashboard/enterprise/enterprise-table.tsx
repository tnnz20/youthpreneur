import { useState } from 'react';

import { toast } from 'sonner';

import { toErrorMessage } from '@/lib/utils';

import { useEnterprises } from '@/hooks/use-enterprises';

import type { Enterprise } from '@/types/enterprises';

import { EnterpriseDeleteDialog } from './enterprise-delete-dialog';
import { EnterpriseFormDialog } from './enterprise-form-dialog';
import { EnterpriseTableContent } from './enterprise-table-content';
import { EnterpriseTableFilters } from './enterprise-table-filters';

export function EnterpriseTable() {
  const state = useEnterprises();
  const [pendingDelete, setPendingDelete] = useState<Enterprise | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { filters, remove, create } = state;

  const filtersActive =
    filters.district.trim() !== '' ||
    filters.status !== 'all' ||
    filters.business_sector.trim() !== '';

  const confirmDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    const target = pendingDelete;
    setDeleting(true);

    try {
      await remove(target.public_id);
      toast.success(`Wirausaha ${target.name ?? target.business_sector} berhasil dihapus.`);
      setPendingDelete(null);
    } catch (mutationError: unknown) {
      toast.error(toErrorMessage(mutationError));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <EnterpriseTableFilters state={state} onOpenCreate={() => setCreateDialogOpen(true)} />

      <EnterpriseTableContent
        state={state}
        filtersActive={filtersActive}
        onRequestDelete={setPendingDelete}
        onOpenCreate={() => setCreateDialogOpen(true)}
      />

      <EnterpriseDeleteDialog
        pendingDelete={pendingDelete}
        loading={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />

      <EnterpriseFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={create}
      />
    </div>
  );
}

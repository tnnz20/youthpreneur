import { useState } from 'react';

import { toast } from 'sonner';

import { toErrorMessage } from '@/lib/utils';

import type { UserState } from '@/hooks/use-users';

import type { User } from '@/types/users';

import { UserTableContent } from './user-table-content';
import { UserTableDialogs } from './user-table-dialogs';
import { UserTableFilters } from './user-table-filters';

interface UserTableProps {
  state: UserState;
}

export function UserTable({ state }: UserTableProps) {
  const [pendingDeactivate, setPendingDeactivate] = useState<User | null>(null);
  const [pendingActivate, setPendingActivate] = useState<User | null>(null);
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);

  const { filters, search, deactivate, activate, remove } = state;

  const filtersActive =
    search.trim() !== '' || filters.district.trim() !== '' || filters.gender !== 'all';

  const confirmDeactivate = async () => {
    if (!pendingDeactivate) {
      return;
    }

    const target = pendingDeactivate;
    setPendingDeactivate(null);

    try {
      await deactivate(target.public_id);
      toast.success(`Pengguna ${target.email} dinonaktifkan.`);
    } catch (mutationError: unknown) {
      toast.error(toErrorMessage(mutationError));
    }
  };

  const confirmActivate = async () => {
    if (!pendingActivate) {
      return;
    }

    const target = pendingActivate;
    setPendingActivate(null);

    try {
      await activate(target.public_id);
      toast.success(`Pengguna ${target.email} diaktifkan.`);
    } catch (mutationError: unknown) {
      toast.error(toErrorMessage(mutationError));
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    const target = pendingDelete;
    setPendingDelete(null);

    try {
      await remove(target.public_id);
      toast.success(`Pengguna ${target.email} dihapus.`);
    } catch (mutationError: unknown) {
      toast.error(toErrorMessage(mutationError));
    }
  };

  return (
    <div className="space-y-5">
      <UserTableFilters state={state} />

      <UserTableContent
        state={state}
        filtersActive={filtersActive}
        onRequestActivate={setPendingActivate}
        onRequestDeactivate={setPendingDeactivate}
        onRequestDelete={setPendingDelete}
      />

      <UserTableDialogs
        pendingActivate={pendingActivate}
        pendingDeactivate={pendingDeactivate}
        pendingDelete={pendingDelete}
        onCancelActivate={() => setPendingActivate(null)}
        onCancelDeactivate={() => setPendingDeactivate(null)}
        onCancelDelete={() => setPendingDelete(null)}
        onConfirmActivate={confirmActivate}
        onConfirmDeactivate={confirmDeactivate}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
}

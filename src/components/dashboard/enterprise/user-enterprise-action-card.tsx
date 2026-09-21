import { useState } from 'react';

import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { deleteEnterprise } from '@/lib/api/enterprises';
import { toErrorMessage } from '@/lib/utils';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import type { Enterprise } from '@/types/enterprises';

import { Pencil, Trash2 } from 'lucide-react';

import { UserEnterpriseEditDialog } from './user-enterprise-edit-dialog';

interface UserEnterpriseActionCardProps {
  enterprise: Enterprise;
  onUpdated: (enterprise: Enterprise) => void;
  onDeleted?: () => void;
}

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento p-6';

export function UserEnterpriseActionCard({
  enterprise,
  onUpdated,
  onDeleted,
}: UserEnterpriseActionCardProps) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    setPendingDelete(false);
    setDeleting(true);

    try {
      await deleteEnterprise(enterprise.public_id);
      toast.success(
        `Usaha ${enterprise.enterprise_name ?? enterprise.name ?? enterprise.business_sector} berhasil dihapus.`
      );
      onDeleted?.();
      navigate('/dashboard/my-enterprises');
    } catch (mutationError: unknown) {
      toast.error(toErrorMessage(mutationError));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={`${CARD} space-y-4`}>
      <h2 className="text-dash-fg text-base font-bold">Aksi Usaha</h2>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setEditing(true)}
          disabled={deleting}
          className="border-dash-border h-auto rounded-full px-5 py-3"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Edit Data Usaha
        </Button>

        <Button
          type="button"
          variant="destructive"
          onClick={() => setPendingDelete(true)}
          disabled={deleting}
          className="h-auto rounded-full px-5 py-3"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Hapus Usaha
        </Button>
      </div>

      <UserEnterpriseEditDialog
        enterprise={enterprise}
        open={editing}
        onOpenChange={setEditing}
        onSuccess={onUpdated}
      />

      <AlertDialog open={pendingDelete} onOpenChange={setPendingDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Usaha</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data usaha{' '}
              <span className="text-dash-fg font-semibold">
                {enterprise.enterprise_name ?? enterprise.name ?? enterprise.business_sector}
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

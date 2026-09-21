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

import { Pencil, Trash2, User } from 'lucide-react';

import { AdminEnterpriseEditDialog } from './admin-enterprise-edit-dialog';

interface AdminEnterpriseActionCardProps {
  enterprise: Enterprise;
  onUpdated: (enterprise: Enterprise) => void;
  onDeleted?: () => void;
}

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento p-6';

export function AdminEnterpriseActionCard({
  enterprise,
  onUpdated,
  onDeleted,
}: AdminEnterpriseActionCardProps) {
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
        `Wirausaha ${enterprise.enterprise_name ?? enterprise.name ?? enterprise.business_sector} berhasil dihapus.`
      );
      onDeleted?.();
      navigate('/dashboard/enterprises');
    } catch (mutationError: unknown) {
      toast.error(toErrorMessage(mutationError));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={`${CARD} space-y-4`}>
      <h2 className="text-dash-fg text-base font-bold">Aksi Wirausaha</h2>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (enterprise.user_public_id) {
              navigate(`/dashboard/users/${enterprise.user_public_id}`);
            }
          }}
          disabled={deleting || !enterprise.user_public_id}
          className="border-dash-border h-auto rounded-full px-5 py-3"
        >
          <User className="h-4 w-4" aria-hidden="true" />
          Lihat Pengguna
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => setEditing(true)}
          disabled={deleting}
          className="border-dash-border h-auto rounded-full px-5 py-3"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Edit Data Wirausaha
        </Button>

        <Button
          type="button"
          variant="destructive"
          onClick={() => setPendingDelete(true)}
          disabled={deleting}
          className="h-auto rounded-full px-5 py-3"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Hapus Wirausaha
        </Button>
      </div>

      <AdminEnterpriseEditDialog
        enterprise={enterprise}
        open={editing}
        onOpenChange={setEditing}
        onSuccess={onUpdated}
      />

      <AlertDialog open={pendingDelete} onOpenChange={setPendingDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Wirausaha</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus wirausaha{' '}
              <span className="text-dash-fg font-semibold">
                {enterprise.enterprise_name ?? enterprise.name ?? enterprise.business_sector}
              </span>
              ? Tindakan ini dapat dibatalkan melalui pemulihan data sistem.
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

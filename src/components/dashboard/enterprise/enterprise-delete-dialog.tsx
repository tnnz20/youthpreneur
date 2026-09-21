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

import type { Enterprise } from '@/types/enterprises';

interface EnterpriseDeleteDialogProps {
  pendingDelete: Enterprise | null;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function EnterpriseDeleteDialog({
  pendingDelete,
  loading = false,
  onCancel,
  onConfirm,
}: EnterpriseDeleteDialogProps) {
  return (
    <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Wirausaha</AlertDialogTitle>
          <AlertDialogDescription>
            Hapus wirausaha{' '}
            <span className="text-dash-fg font-semibold">
              {pendingDelete?.enterprise_name ??
                pendingDelete?.name ??
                pendingDelete?.business_sector ??
                'ini'}
            </span>{' '}
            secara permanen? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
          >
            {loading ? 'Menghapus...' : 'Hapus'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

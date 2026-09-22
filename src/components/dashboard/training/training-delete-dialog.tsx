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

import type { TrainingCatalog } from '@/types/trainings';

interface TrainingDeleteDialogProps {
  pendingDelete: TrainingCatalog | null;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function TrainingDeleteDialog({
  pendingDelete,
  loading = false,
  onCancel,
  onConfirm,
}: TrainingDeleteDialogProps) {
  return (
    <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Program Pelatihan</AlertDialogTitle>
          <AlertDialogDescription>
            Hapus program pelatihan{' '}
            <span className="text-dash-fg font-semibold">
              {pendingDelete?.title ?? pendingDelete?.public_id ?? 'ini'}
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

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

import type { TrainingEnrollment } from '@/types/trainings';

interface UserTrainingCancelDialogProps {
  pendingCancel: TrainingEnrollment | null;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function UserTrainingCancelDialog({
  pendingCancel,
  loading = false,
  onCancel,
  onConfirm,
}: UserTrainingCancelDialogProps) {
  const title =
    pendingCancel?.catalog?.title ?? pendingCancel?.catalog?.name ?? 'Program Pelatihan';

  return (
    <AlertDialog open={pendingCancel !== null} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Batalkan Pendaftaran Pelatihan</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah kamu yakin ingin membatalkan keikutsertaan pada{' '}
            <span className="text-dash-fg font-semibold">{title}</span>? Kuotamu akan dilepaskan
            kembali untuk peserta lain.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Kembali</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
          >
            {loading ? 'Membatalkan...' : 'Ya, Batalkan'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

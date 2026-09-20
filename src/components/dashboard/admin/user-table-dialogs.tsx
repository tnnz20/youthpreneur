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

import type { User } from '@/types/users';

interface UserTableDialogsProps {
  pendingActivate: User | null;
  pendingDeactivate: User | null;
  pendingDelete: User | null;
  onCancelActivate: () => void;
  onCancelDeactivate: () => void;
  onCancelDelete: () => void;
  onConfirmActivate: () => void;
  onConfirmDeactivate: () => void;
  onConfirmDelete: () => void;
}

export function UserTableDialogs({
  pendingActivate,
  pendingDeactivate,
  pendingDelete,
  onCancelActivate,
  onCancelDeactivate,
  onCancelDelete,
  onConfirmActivate,
  onConfirmDeactivate,
  onConfirmDelete,
}: UserTableDialogsProps) {
  return (
    <>
      <AlertDialog
        open={pendingDeactivate !== null}
        onOpenChange={(open) => !open && onCancelDeactivate()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Non Aktifkan Pengguna</AlertDialogTitle>
            <AlertDialogDescription>
              Non aktifkan {pendingDeactivate?.profile?.full_name ?? pendingDeactivate?.email}?
              Pengguna tidak akan dapat masuk sampai diaktifkan kembali.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDeactivate}>Non Aktifkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={pendingActivate !== null}
        onOpenChange={(open) => !open && onCancelActivate()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aktifkan Pengguna</AlertDialogTitle>
            <AlertDialogDescription>
              Aktifkan {pendingActivate?.profile?.full_name ?? pendingActivate?.email}? Pengguna
              akan dapat masuk kembali.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmActivate}>Aktifkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && onCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Pengguna</AlertDialogTitle>
            <AlertDialogDescription>
              Hapus {pendingDelete?.profile?.full_name ?? pendingDelete?.email} permanen? Tindakan
              ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={onConfirmDelete}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

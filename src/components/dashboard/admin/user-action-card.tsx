import { type SubmitEvent, useState } from 'react';

import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import {
  deleteUser,
  resetUserPassword,
  updateUserProfile,
  updateUserStatus,
} from '@/lib/api/users';
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import type { User, UserGender, UserProfile } from '@/types/users';

import { KECAMATAN } from '@/constants/site';

import { KeyRound, Pencil, Trash2, UserCheck, UserX } from 'lucide-react';

interface UserActionCardProps {
  user: User;
  onUpdated: (user: User) => void;
  onDeleted: () => void;
}

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento p-6';

const fieldClassName =
  'text-dash-fg focus-visible:border-dash-fg border-dash-border bg-dash-surface-2 h-11 w-full rounded-2xl text-base focus-visible:ring-0 sm:text-sm';

const selectClassName =
  'text-dash-fg focus-visible:border-dash-fg border-dash-border bg-dash-surface-2 h-11 w-full rounded-2xl px-3.5 py-0 text-xs focus-visible:ring-0 data-[size=default]:h-11 sm:text-sm';

const LABEL_CLASS = 'text-dash-fg mb-1 text-xs font-semibold';

const DIALOG_CLASS =
  'bg-dash-surface border-dash-border shadow-bento-lg max-h-[90vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-[2rem] border p-6 sm:max-w-2xl sm:p-8';

const GENDER_SELECT_OPTIONS: { value: UserGender; label: string }[] = [
  { value: 'male', label: 'Laki-laki' },
  { value: 'female', label: 'Perempuan' },
];

function toForm(user: User): UserProfile {
  return {
    full_name: user.profile?.full_name ?? '',
    nik: user.profile?.nik ?? '',
    birth_date: user.profile?.birth_date ?? '',
    gender: user.profile?.gender ?? null,
    district: user.profile?.district ?? '',
    phone: user.profile?.phone ?? '',
    address: user.profile?.address ?? '',
  };
}

export function UserActionCard({ user, onUpdated, onDeleted }: UserActionCardProps) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [profileForm, setProfileForm] = useState<UserProfile>(() => toForm(user));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const openEdit = () => {
    setProfileForm(toForm(user));
    setFormError(null);
    setEditing(true);
  };

  const openReset = () => {
    setPassword('');
    setConfirmPassword('');
    setFormError(null);
    setResetting(true);
  };

  const handleProfileSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (profileForm.full_name.trim() === '') {
      setFormError('Nama lengkap wajib diisi.');
      return;
    }

    setSavingProfile(true);
    setFormError(null);

    try {
      const updated = await updateUserProfile(user.public_id, profileForm);
      onUpdated(updated);
      setEditing(false);
      toast.success('Profil pengguna berhasil diperbarui.');
    } catch (mutationError: unknown) {
      const message = toErrorMessage(mutationError);
      setFormError(message);
      toast.error(message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.length < 8) {
      setFormError('Kata sandi minimal 8 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setSavingPassword(true);
    setFormError(null);

    try {
      await resetUserPassword(user.public_id, password);
      setResetting(false);
      toast.success(`Kata sandi ${user.email} berhasil direset.`);
    } catch (mutationError: unknown) {
      const message = toErrorMessage(mutationError);
      setFormError(message);
      toast.error(message);
    } finally {
      setSavingPassword(false);
    }
  };

  const confirmStatus = async () => {
    const nextActive = !user.is_active;
    setPendingStatus(false);
    setMutating(true);

    try {
      const updated = await updateUserStatus(user.public_id, nextActive);
      onUpdated(updated);
      toast.success(
        nextActive ? `Pengguna ${user.email} diaktifkan.` : `Pengguna ${user.email} dinonaktifkan.`
      );
    } catch (mutationError: unknown) {
      toast.error(toErrorMessage(mutationError));
    } finally {
      setMutating(false);
    }
  };

  const confirmDelete = async () => {
    setPendingDelete(false);
    setMutating(true);

    try {
      await deleteUser(user.public_id);
      toast.success(`Pengguna ${user.email} dihapus.`);
      onDeleted();
      navigate('/dashboard/users');
    } catch (mutationError: unknown) {
      toast.error(toErrorMessage(mutationError));
      setMutating(false);
    }
  };

  return (
    <div className={`${CARD} space-y-4`}>
      <h2 className="text-dash-fg text-base font-bold">Aksi Pengguna</h2>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={openEdit}
          disabled={mutating}
          className="border-dash-border h-auto rounded-full px-5 py-3"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Edit Profile
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => setPendingStatus(true)}
          disabled={mutating}
          className="border-dash-border h-auto rounded-full px-5 py-3"
        >
          {user.is_active ? (
            <UserX className="h-4 w-4" aria-hidden="true" />
          ) : (
            <UserCheck className="h-4 w-4" aria-hidden="true" />
          )}
          Ubah Status
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={openReset}
          disabled={mutating}
          className="border-dash-border h-auto rounded-full px-5 py-3"
        >
          <KeyRound className="h-4 w-4" aria-hidden="true" />
          Reset Password
        </Button>

        <Button
          type="button"
          variant="destructive"
          onClick={() => setPendingDelete(true)}
          disabled={mutating}
          className="h-auto rounded-full px-5 py-3"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete Pengguna
        </Button>
      </div>

      <Dialog open={editing} onOpenChange={(open) => !open && setEditing(false)}>
        <DialogContent showCloseButton={false} className={DIALOG_CLASS}>
          <DialogClose className="text-dash-muted hover:bg-dash-surface-2 hover:text-dash-fg absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors">
            ✕<span className="sr-only">Tutup</span>
          </DialogClose>

          <div className="space-y-1">
            <DialogTitle className="text-dash-fg text-2xl font-bold tracking-tight">
              Edit Profil Pengguna
            </DialogTitle>
            <DialogDescription className="text-dash-muted text-xs leading-relaxed">
              Perbarui data profil {user.email}.
            </DialogDescription>
          </div>

          <form className="space-y-3.5" onSubmit={handleProfileSubmit}>
            <div>
              <Label htmlFor="user-full-name" className={LABEL_CLASS}>
                Nama Lengkap *
              </Label>
              <Input
                id="user-full-name"
                required
                value={profileForm.full_name}
                onChange={(event) =>
                  setProfileForm({ ...profileForm, full_name: event.target.value })
                }
                placeholder="Nama lengkap pengguna"
                className={fieldClassName}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="user-nik" className={LABEL_CLASS}>
                  NIK
                </Label>
                <Input
                  id="user-nik"
                  value={profileForm.nik ?? ''}
                  onChange={(event) => setProfileForm({ ...profileForm, nik: event.target.value })}
                  className={fieldClassName}
                />
              </div>

              <div>
                <Label htmlFor="user-birth-date" className={LABEL_CLASS}>
                  Tanggal Lahir
                </Label>
                <Input
                  id="user-birth-date"
                  type="date"
                  value={profileForm.birth_date ?? ''}
                  onChange={(event) =>
                    setProfileForm({ ...profileForm, birth_date: event.target.value })
                  }
                  className={fieldClassName}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="user-gender" className={LABEL_CLASS}>
                  Jenis Kelamin
                </Label>
                <Select
                  value={profileForm.gender}
                  onValueChange={(value) =>
                    setProfileForm({ ...profileForm, gender: (value ?? null) as UserGender | null })
                  }
                >
                  <SelectTrigger id="user-gender" className={selectClassName}>
                    <SelectValue placeholder="Pilih jenis kelamin..." />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_SELECT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="user-district" className={LABEL_CLASS}>
                  Kecamatan
                </Label>
                <Select
                  value={profileForm.district || null}
                  onValueChange={(value) =>
                    setProfileForm({ ...profileForm, district: value ?? '' })
                  }
                >
                  <SelectTrigger id="user-district" className={selectClassName}>
                    <SelectValue placeholder="Pilih kecamatan..." />
                  </SelectTrigger>
                  <SelectContent>
                    {KECAMATAN.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="user-phone" className={LABEL_CLASS}>
                Telepon
              </Label>
              <Input
                id="user-phone"
                type="tel"
                value={profileForm.phone ?? ''}
                onChange={(event) => setProfileForm({ ...profileForm, phone: event.target.value })}
                className={fieldClassName}
              />
            </div>

            <div>
              <Label htmlFor="user-address" className={LABEL_CLASS}>
                Alamat
              </Label>
              <Textarea
                id="user-address"
                rows={3}
                value={profileForm.address ?? ''}
                onChange={(event) =>
                  setProfileForm({ ...profileForm, address: event.target.value })
                }
                className="text-dash-fg focus-visible:border-dash-fg border-dash-border bg-dash-surface-2 min-h-24 w-full rounded-2xl text-base focus-visible:ring-0 sm:text-sm"
              />
            </div>

            {formError && (
              <p role="alert" className="text-xs font-semibold text-rose-500">
                {formError}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(false)}
                disabled={savingProfile}
                className="border-dash-border h-auto flex-1 rounded-full py-3"
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="lime"
                disabled={savingProfile}
                className="h-auto flex-1 rounded-full py-3"
              >
                {savingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={resetting} onOpenChange={(open) => !open && setResetting(false)}>
        <DialogContent
          showCloseButton={false}
          className="bg-dash-surface border-dash-border shadow-bento-lg max-w-[calc(100%-2rem)] rounded-[2rem] border p-6 sm:max-w-md sm:p-8"
        >
          <DialogClose className="text-dash-muted hover:bg-dash-surface-2 hover:text-dash-fg absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors">
            ✕<span className="sr-only">Tutup</span>
          </DialogClose>

          <div className="space-y-1">
            <DialogTitle className="text-dash-fg text-2xl font-bold tracking-tight">
              Reset Kata Sandi
            </DialogTitle>
            <DialogDescription className="text-dash-muted text-xs leading-relaxed">
              Tetapkan kata sandi baru untuk {user.email}.
            </DialogDescription>
          </div>

          <form className="space-y-3.5" onSubmit={handlePasswordSubmit}>
            <div>
              <Label htmlFor="user-new-password" className={LABEL_CLASS}>
                Kata Sandi Baru *
              </Label>
              <Input
                id="user-new-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={fieldClassName}
              />
            </div>

            <div>
              <Label htmlFor="user-confirm-password" className={LABEL_CLASS}>
                Konfirmasi Kata Sandi *
              </Label>
              <Input
                id="user-confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={fieldClassName}
              />
            </div>

            {formError && (
              <p role="alert" className="text-xs font-semibold text-rose-500">
                {formError}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => setResetting(false)}
                disabled={savingPassword}
                className="border-dash-border h-auto flex-1 rounded-full py-3"
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="lime"
                disabled={savingPassword}
                className="h-auto flex-1 rounded-full py-3"
              >
                {savingPassword ? 'Menyimpan...' : 'Reset Kata Sandi'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={pendingStatus} onOpenChange={(open) => !open && setPendingStatus(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {user.is_active ? 'Non Aktifkan Pengguna' : 'Aktifkan Pengguna'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {user.is_active
                ? `Non aktifkan ${user.profile?.full_name ?? user.email}? Pengguna tidak akan dapat masuk sampai diaktifkan kembali.`
                : `Aktifkan ${user.profile?.full_name ?? user.email}? Pengguna akan dapat masuk kembali.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatus}>
              {user.is_active ? 'Non Aktifkan' : 'Aktifkan'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={pendingDelete} onOpenChange={(open) => !open && setPendingDelete(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Pengguna</AlertDialogTitle>
            <AlertDialogDescription>
              Hapus {user.profile?.full_name ?? user.email} permanen? Tindakan ini tidak dapat
              dibatalkan.
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

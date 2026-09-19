import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

import type { YouthProfile } from '@/types/database';

interface ProfileDetailDialogProps {
  profile: YouthProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDetailDialog({ profile, open, onOpenChange }: ProfileDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="border-brand-dark bg-brand-bg shadow-solid-lg max-h-[90vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl border-2 p-6 sm:max-w-lg sm:p-8"
      >
        {profile && (
          <>
            <DialogClose className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-black/20 text-sm transition hover:bg-black/10">
              ✕<span className="sr-only">Tutup</span>
            </DialogClose>

            <div className="flex items-center gap-3.5">
              <div
                className={`border-brand-dark shadow-solid-sm rounded-full border px-3 py-1 text-xs font-black ${profile.badgeColor}`}
              >
                {profile.kategori}
              </div>
              <div className="rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                {profile.status}
              </div>
            </div>

            <div className="space-y-1">
              <DialogTitle className="text-brand-dark text-2xl leading-tight font-black">
                {profile.nama}
              </DialogTitle>
              <DialogDescription className="text-sm font-extrabold text-amber-700">
                {profile.usaha}
              </DialogDescription>
            </div>

            <div className="text-brand-muted flex items-center gap-2 text-xs font-bold">
              <span>📍 {profile.kecamatan}</span>
              <span>•</span>
              <span>
                ID BADAPATAN: <span className="text-brand-dark">{profile.id}</span>
              </span>
            </div>

            <div className="space-y-3 rounded-2xl border border-black/20 bg-white p-4">
              <h4 className="text-brand-dark text-xs font-black tracking-wider uppercase">
                Deskripsi & Portofolio:
              </h4>
              <p className="text-brand-dark/80 text-xs leading-relaxed sm:text-sm">
                {profile.deskripsi}
              </p>
            </div>

            <div className="bg-brand-yellow/20 space-y-2 rounded-2xl border border-black/20 p-4 text-xs">
              <div className="flex justify-between gap-4">
                <span className="text-brand-muted">Komoditas / Fokus:</span>
                <span className="text-brand-dark text-right font-bold">{profile.produk}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-brand-muted">Dukungan Dispora:</span>
                <span className="text-brand-dark text-right font-bold">
                  Inkubasi & Pendampingan NIB
                </span>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Button
                type="button"
                variant="neo"
                onClick={() => {
                  onOpenChange(false);
                  toast.success(
                    'Kontak diteruskan. Silakan gunakan WhatsApp resmi untuk berjejaring secara santun.'
                  );
                }}
                className="h-auto flex-1 rounded-xl py-3 text-xs sm:text-sm"
              >
                Hubungi Kontak Pemuda
              </Button>
              <Button
                type="button"
                variant="neoOutline"
                onClick={() => onOpenChange(false)}
                className="h-auto rounded-xl px-5 py-3 text-xs sm:text-sm"
              >
                Tutup
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

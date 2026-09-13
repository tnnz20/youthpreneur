import type { SubmitEvent } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { KECAMATAN } from '@/constants/site';

interface ActionModalProps {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onSubmitted: () => void;
}

const fieldClassName =
  'h-auto w-full rounded-xl border border-black/30 bg-white px-3.5 py-2 text-xs text-brand-dark shadow-none transition focus-visible:border-brand-dark focus-visible:ring-0 sm:text-sm dark:bg-white';

export function ActionModal({ open, title, description, onClose, onSubmitted }: ActionModalProps) {
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmitted();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="max-w-md rounded-3xl border-2 border-brand-dark bg-brand-bg p-6 shadow-solid-lg sm:max-w-md sm:p-8"
        showCloseButton={false}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-brand-dark bg-brand-yellow text-xl font-bold shadow-solid-sm">
          <Star className="h-5 w-5 fill-current" aria-hidden="true" />
        </div>

        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-brand-dark">{title}</DialogTitle>
          <DialogDescription className="text-xs leading-relaxed text-brand-muted sm:text-sm">
            {description}
          </DialogDescription>
        </DialogHeader>

        <form className="mt-1 space-y-3.5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="action-name" className="mb-1 block text-xs font-bold text-brand-dark">
              Nama Lengkap
            </label>
            <Input
              id="action-name"
              type="text"
              required
              placeholder="Contoh: Muhammad Rian"
              className={fieldClassName}
            />
          </div>

          <div>
            <label
              htmlFor="action-kecamatan"
              className="mb-1 block text-xs font-bold text-brand-dark"
            >
              Kecamatan Asal di Tapin
            </label>
            <Select name="kecamatan" required>
              <SelectTrigger
                id="action-kecamatan"
                className="h-auto w-full rounded-xl border border-black/30 bg-white px-3.5 py-2 text-xs text-brand-dark focus-visible:border-brand-dark focus-visible:ring-0 sm:text-sm dark:bg-white"
              >
                <SelectValue placeholder="Pilih Kecamatan..." />
              </SelectTrigger>
              <SelectContent>
                {KECAMATAN.map((kecamatan) => (
                  <SelectItem key={kecamatan} value={kecamatan}>
                    {kecamatan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="action-whatsapp"
              className="mb-1 block text-xs font-bold text-brand-dark"
            >
              Nomor WhatsApp Aktif
            </label>
            <Input
              id="action-whatsapp"
              type="tel"
              required
              placeholder="08xxxxxxxxxx"
              className={fieldClassName}
            />
          </div>

          <div>
            <label
              htmlFor="action-interest"
              className="mb-1 block text-xs font-bold text-brand-dark"
            >
              Rencana Ide / Komoditas Usaha
            </label>
            <Input
              id="action-interest"
              type="text"
              placeholder="Misal: Keripik Salak, Kopi Robusta, Anyaman Purun"
              className={fieldClassName}
            />
          </div>

          <Button type="submit" variant="neo" className="mt-2 h-auto w-full rounded-xl py-3">
            Kirim Data
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

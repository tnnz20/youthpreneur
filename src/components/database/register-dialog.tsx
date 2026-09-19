import { type SubmitEvent, useState } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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

import type { NewYouthProfile, YouthCategory } from '@/types/database';

import { CATEGORY_OPTIONS, KECAMATAN_FILTER_OPTIONS } from '@/constants/database';

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (profile: NewYouthProfile) => void;
}

const EMPTY_FORM = {
  nama: '',
  kecamatan: '',
  kategori: 'Kewirausahaan' as YouthCategory,
  usaha: '',
  kontak: '',
  deskripsi: '',
};

const fieldClassName =
  'text-brand-dark focus-visible:border-brand-dark w-full rounded-xl border border-black/30 bg-white px-3.5 py-2.5 text-base focus-visible:ring-0 sm:text-sm';

const inputClassName = `${fieldClassName} h-12`;

export function RegisterDialog({ open, onOpenChange, onSubmit }: RegisterDialogProps) {
  const [form, setForm] = useState(EMPTY_FORM);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(form);
    toast.success(`Terima kasih ${form.nama}! Data berhasil tersimpan di sistem BADAPATAN.`);
    setForm(EMPTY_FORM);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="border-brand-dark bg-brand-bg shadow-solid-lg max-h-[90vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl border-2 p-6 sm:max-w-lg sm:p-8"
      >
        <DialogClose className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-black/20 text-sm transition hover:bg-black/10">
          ✕<span className="sr-only">Tutup</span>
        </DialogClose>

        <div className="border-brand-dark bg-brand-yellow shadow-solid-sm flex h-12 w-12 items-center justify-center rounded-2xl border-2 text-xl font-bold">
          📝
        </div>

        <div className="space-y-1">
          <DialogTitle className="text-brand-dark text-2xl font-black">
            Formulir Mandiri BADAPATAN
          </DialogTitle>
          <DialogDescription className="text-brand-muted text-xs leading-relaxed">
            Daftarkan profil wirausaha muda, atlet, talenta seni, atau organisasi kepemudaan Anda ke
            dalam Bank Data Pemuda Dispora Tapin.
          </DialogDescription>
        </div>

        <form className="space-y-3.5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="daftar-nama" className="text-brand-dark mb-1 block text-xs font-bold">
              Nama Lengkap Pemuda *
            </label>
            <Input
              id="daftar-nama"
              type="text"
              required
              value={form.nama}
              onChange={(event) => setForm({ ...form, nama: event.target.value })}
              placeholder="Contoh: Muhammad Akhmad"
              className={inputClassName}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="daftar-kecamatan"
                className="text-brand-dark mb-1 block text-xs font-bold"
              >
                Kecamatan Domisili di Tapin *
              </label>
              <Select
                required
                value={form.kecamatan}
                onValueChange={(value) => setForm({ ...form, kecamatan: value ?? '' })}
              >
                <SelectTrigger
                  id="daftar-kecamatan"
                  className="text-brand-dark focus-visible:border-brand-dark h-12 w-full rounded-xl border border-black/30 bg-white px-3.5 py-0 text-xs focus-visible:ring-0 data-[size=default]:h-12 sm:text-sm"
                >
                  <SelectValue placeholder="Pilih Kecamatan..." />
                </SelectTrigger>
                <SelectContent>
                  {KECAMATAN_FILTER_OPTIONS.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="daftar-kategori"
                className="text-brand-dark mb-1 block text-xs font-bold"
              >
                Kategori Potensi *
              </label>
              <Select
                value={form.kategori}
                onValueChange={(value) =>
                  setForm({ ...form, kategori: (value ?? 'Kewirausahaan') as YouthCategory })
                }
              >
                <SelectTrigger
                  id="daftar-kategori"
                  className="text-brand-dark focus-visible:border-brand-dark h-12 w-full rounded-xl border border-black/30 bg-white px-3.5 py-0 text-xs focus-visible:ring-0 data-[size=default]:h-12 sm:text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.filter((option) => option.value !== 'ALL').map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label htmlFor="daftar-usaha" className="text-brand-dark mb-1 block text-xs font-bold">
              Nama Usaha / Cabang Olahraga / Organisasi *
            </label>
            <Input
              id="daftar-usaha"
              type="text"
              required
              value={form.usaha}
              onChange={(event) => setForm({ ...form, usaha: event.target.value })}
              placeholder="Contoh: Keripik Cabai Hiyung / Atlet Dayung Tapin"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="daftar-wa" className="text-brand-dark mb-1 block text-xs font-bold">
              Nomor WhatsApp Aktif *
            </label>
            <Input
              id="daftar-wa"
              type="tel"
              required
              value={form.kontak}
              onChange={(event) => setForm({ ...form, kontak: event.target.value })}
              placeholder="08xxxxxxxxxx"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="daftar-desc" className="text-brand-dark mb-1 block text-xs font-bold">
              Deskripsi Usaha / Prestasi & Kebutuhan Pembinaan
            </label>
            <textarea
              id="daftar-desc"
              rows={3}
              value={form.deskripsi}
              onChange={(event) => setForm({ ...form, deskripsi: event.target.value })}
              placeholder="Jelaskan produk unggulan, omzet rata-rata, izin usaha yang telah dimiliki, atau prestasi yang pernah diraih..."
              className={fieldClassName}
            />
          </div>

          <Button type="submit" variant="neo" className="mt-2 h-auto w-full rounded-xl py-3.5">
            Simpan Data ke BADAPATAN
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

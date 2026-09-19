import { type SubmitEvent, useState } from 'react';

import { toast } from 'sonner';

import { Meter } from '@/components/dashboard/shared/meter';
import { Button } from '@/components/ui/button';
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

import type { CurrentUser, ProgramCategory } from '@/types/dashboard';

import { PROGRAM_CATEGORY_OPTIONS } from '@/constants/dashboard';
import { KECAMATAN_FILTER_OPTIONS } from '@/constants/database';

import { RotateCcw, Save } from 'lucide-react';

interface ProfileFormProps {
  profile: CurrentUser;
  onSubmit: (input: CurrentUser) => void;
}

const NIB_OPTIONS: CurrentUser['statusNib'][] = ['Belum', 'Proses', 'Sudah'];

const PROFILE_FIELDS: { key: keyof CurrentUser; label: string }[] = [
  { key: 'nama', label: 'Nama lengkap' },
  { key: 'usaha', label: 'Nama usaha' },
  { key: 'kecamatan', label: 'Kecamatan' },
  { key: 'kategori', label: 'Kategori potensi' },
  { key: 'kontak', label: 'Nomor WhatsApp' },
  { key: 'produk', label: 'Produk unggulan' },
  { key: 'deskripsi', label: 'Deskripsi usaha' },
];

const fieldClassName =
  'text-dash-fg focus-visible:border-dash-fg border-dash-border bg-dash-surface-2 h-11 w-full rounded-2xl text-base focus-visible:ring-0 sm:text-sm';

const selectClassName =
  'text-dash-fg focus-visible:border-dash-fg border-dash-border bg-dash-surface-2 h-11 w-full rounded-2xl px-3.5 py-0 text-xs focus-visible:ring-0 data-[size=default]:h-11 sm:text-sm';

const LABEL_CLASS = 'text-dash-fg mb-1 text-xs font-semibold';

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento';

export function ProfileForm({ profile, onSubmit }: ProfileFormProps) {
  const [form, setForm] = useState<CurrentUser>(profile);

  const missing = PROFILE_FIELDS.filter((field) => String(form[field.key]).trim() === '');
  const kelengkapan = Math.round(
    ((PROFILE_FIELDS.length - missing.length) / PROFILE_FIELDS.length) * 100
  );

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ ...form, kelengkapan });
    toast.success('Profil usaha berhasil diperbarui.');
  };

  return (
    <form className="space-y-5 lg:space-y-6" onSubmit={handleSubmit}>
      <div className={`${CARD} p-5 sm:p-6`}>
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-dash-fg text-sm font-bold">Kelengkapan Profil</p>
          <span className="bg-dash-accent text-dash-accent-fg rounded-full px-2.5 py-1 text-xs font-extrabold tabular-nums">
            {kelengkapan}%
          </span>
        </div>
        <Meter value={kelengkapan} className="h-2" />
        {missing.length === 0 ? (
          <p className="text-dash-muted mt-2 text-xs font-medium">
            Semua data inti sudah lengkap. Profil siap diverifikasi Dispora.
          </p>
        ) : (
          <p className="text-dash-muted mt-2 text-xs font-medium">
            Belum lengkap:{' '}
            <span className="text-dash-fg font-semibold">
              {missing.map((field) => field.label).join(', ')}
            </span>
          </p>
        )}
      </div>

      <div className={`${CARD} space-y-4 p-5 sm:p-6`}>
        <h2 className="text-dash-fg text-base font-bold">Data Pemuda & Usaha</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="profil-nama" className={LABEL_CLASS}>
              Nama Lengkap *
            </Label>
            <Input
              id="profil-nama"
              required
              value={form.nama}
              onChange={(event) => setForm({ ...form, nama: event.target.value })}
              className={fieldClassName}
            />
          </div>

          <div>
            <Label htmlFor="profil-usaha" className={LABEL_CLASS}>
              Nama Usaha *
            </Label>
            <Input
              id="profil-usaha"
              required
              value={form.usaha}
              onChange={(event) => setForm({ ...form, usaha: event.target.value })}
              className={fieldClassName}
            />
          </div>

          <div>
            <Label htmlFor="profil-kecamatan" className={LABEL_CLASS}>
              Kecamatan *
            </Label>
            <Select
              value={form.kecamatan}
              onValueChange={(value) => setForm({ ...form, kecamatan: value ?? '' })}
            >
              <SelectTrigger id="profil-kecamatan" className={selectClassName}>
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
            <Label htmlFor="profil-kategori" className={LABEL_CLASS}>
              Kategori Potensi *
            </Label>
            <Select
              value={form.kategori}
              onValueChange={(value) =>
                setForm({ ...form, kategori: (value ?? 'Kewirausahaan') as ProgramCategory })
              }
            >
              <SelectTrigger id="profil-kategori" className={selectClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROGRAM_CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="profil-kontak" className={LABEL_CLASS}>
              Nomor WhatsApp *
            </Label>
            <Input
              id="profil-kontak"
              type="tel"
              required
              value={form.kontak}
              onChange={(event) => setForm({ ...form, kontak: event.target.value })}
              className={fieldClassName}
            />
          </div>

          <div>
            <Label htmlFor="profil-nib" className={LABEL_CLASS}>
              Status NIB
            </Label>
            <Select
              value={form.statusNib}
              onValueChange={(value) =>
                setForm({ ...form, statusNib: (value ?? 'Belum') as CurrentUser['statusNib'] })
              }
            >
              <SelectTrigger id="profil-nib" className={selectClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NIB_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="profil-produk" className={LABEL_CLASS}>
            Produk Unggulan
          </Label>
          <Input
            id="profil-produk"
            value={form.produk}
            onChange={(event) => setForm({ ...form, produk: event.target.value })}
            className={fieldClassName}
          />
        </div>

        <div>
          <Label htmlFor="profil-deskripsi" className={LABEL_CLASS}>
            Deskripsi Usaha
          </Label>
          <Textarea
            id="profil-deskripsi"
            rows={4}
            value={form.deskripsi}
            onChange={(event) => setForm({ ...form, deskripsi: event.target.value })}
            className="text-dash-fg focus-visible:border-dash-fg border-dash-border bg-dash-surface-2 min-h-28 w-full rounded-2xl text-base focus-visible:ring-0 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setForm(profile);
            toast.info('Perubahan formulir dibatalkan.');
          }}
          className="border-dash-border h-auto rounded-full px-5 py-3"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset
        </Button>
        <Button type="submit" variant="lime" className="h-auto rounded-full px-6 py-3">
          <Save className="h-4 w-4" aria-hidden="true" />
          Simpan Profil
        </Button>
      </div>
    </form>
  );
}

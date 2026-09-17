import { type SubmitEvent, useState } from 'react';

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

import type {
  NewTrainingProgram,
  ProgramCategory,
  ProgramStatus,
  TrainingProgram,
} from '@/types/dashboard';

import { PROGRAM_CATEGORY_OPTIONS, PROGRAM_STATUS_OPTIONS } from '@/constants/dashboard';

interface ProgramFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: TrainingProgram | null;
  onSubmit: (input: NewTrainingProgram) => void;
}

const EMPTY_FORM: NewTrainingProgram = {
  judul: '',
  deskripsi: '',
  kategori: 'Kewirausahaan',
  mentor: '',
  jadwal: '',
  durasi: '',
  lokasi: '',
  kuota: 20,
  status: 'Segera',
};

const fieldClassName =
  'text-dash-fg focus-visible:border-dash-fg border-dash-border bg-dash-surface-2 h-11 w-full rounded-2xl text-base focus-visible:ring-0 sm:text-sm';

const selectClassName =
  'text-dash-fg focus-visible:border-dash-fg border-dash-border bg-dash-surface-2 h-11 w-full rounded-2xl px-3.5 py-0 text-xs focus-visible:ring-0 data-[size=default]:h-11 sm:text-sm';

const LABEL_CLASS = 'text-dash-fg mb-1 text-xs font-semibold';

function toForm(program: TrainingProgram | null): NewTrainingProgram {
  if (!program) {
    return EMPTY_FORM;
  }

  const { judul, deskripsi, kategori, mentor, jadwal, durasi, lokasi, kuota, status } = program;
  return { judul, deskripsi, kategori, mentor, jadwal, durasi, lokasi, kuota, status };
}

export function ProgramFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: ProgramFormDialogProps) {
  const [form, setForm] = useState<NewTrainingProgram>(() => toForm(initial));

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="bg-dash-surface border-dash-border shadow-bento-lg max-h-[90vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-[2rem] border p-6 sm:max-w-2xl sm:p-8"
      >
        <DialogClose className="text-dash-muted hover:bg-dash-surface-2 hover:text-dash-fg absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors">
          ✕<span className="sr-only">Tutup</span>
        </DialogClose>

        <div className="space-y-1">
          <DialogTitle className="text-dash-fg text-2xl font-bold tracking-tight">
            {initial ? 'Ubah Program Pelatihan' : 'Tambah Program Pelatihan'}
          </DialogTitle>
          <DialogDescription className="text-dash-muted text-xs leading-relaxed">
            Lengkapi informasi program yang akan diselenggarakan Dispora Kabupaten Tapin.
          </DialogDescription>
        </div>

        <form className="space-y-3.5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="program-judul" className={LABEL_CLASS}>
              Judul Program *
            </Label>
            <Input
              id="program-judul"
              required
              value={form.judul}
              onChange={(event) => setForm({ ...form, judul: event.target.value })}
              placeholder="Contoh: Inkubasi Bisnis Cabai Hiyung"
              className={fieldClassName}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="program-kategori" className={LABEL_CLASS}>
                Kategori *
              </Label>
              <Select
                value={form.kategori}
                onValueChange={(value) =>
                  setForm({ ...form, kategori: (value ?? 'Kewirausahaan') as ProgramCategory })
                }
              >
                <SelectTrigger id="program-kategori" className={selectClassName}>
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
              <Label htmlFor="program-mentor" className={LABEL_CLASS}>
                Mentor / Fasilitator *
              </Label>
              <Input
                id="program-mentor"
                required
                value={form.mentor}
                onChange={(event) => setForm({ ...form, mentor: event.target.value })}
                placeholder="Nama mentor"
                className={fieldClassName}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="program-jadwal" className={LABEL_CLASS}>
                Jadwal Mulai *
              </Label>
              <Input
                id="program-jadwal"
                required
                value={form.jadwal}
                onChange={(event) => setForm({ ...form, jadwal: event.target.value })}
                placeholder="Contoh: 12 Feb 2026"
                className={fieldClassName}
              />
            </div>

            <div>
              <Label htmlFor="program-durasi" className={LABEL_CLASS}>
                Durasi *
              </Label>
              <Input
                id="program-durasi"
                required
                value={form.durasi}
                onChange={(event) => setForm({ ...form, durasi: event.target.value })}
                placeholder="Contoh: 6 Pekan"
                className={fieldClassName}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="program-lokasi" className={LABEL_CLASS}>
                Lokasi *
              </Label>
              <Input
                id="program-lokasi"
                required
                value={form.lokasi}
                onChange={(event) => setForm({ ...form, lokasi: event.target.value })}
                placeholder="Tempat pelaksanaan"
                className={fieldClassName}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="program-kuota" className={LABEL_CLASS}>
                  Kuota *
                </Label>
                <Input
                  id="program-kuota"
                  type="number"
                  min={1}
                  required
                  value={form.kuota}
                  onChange={(event) => setForm({ ...form, kuota: Number(event.target.value) || 0 })}
                  className={fieldClassName}
                />
              </div>

              <div>
                <Label htmlFor="program-status" className={LABEL_CLASS}>
                  Status *
                </Label>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    setForm({ ...form, status: (value ?? 'Segera') as ProgramStatus })
                  }
                >
                  <SelectTrigger id="program-status" className={selectClassName}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROGRAM_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="program-deskripsi" className={LABEL_CLASS}>
              Deskripsi Program
            </Label>
            <Textarea
              id="program-deskripsi"
              rows={3}
              value={form.deskripsi}
              onChange={(event) => setForm({ ...form, deskripsi: event.target.value })}
              placeholder="Ringkasan materi, syarat peserta, dan hasil yang diharapkan..."
              className="text-dash-fg focus-visible:border-dash-fg border-dash-border bg-dash-surface-2 min-h-24 w-full rounded-2xl text-base focus-visible:ring-0 sm:text-sm"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-dash-border h-auto flex-1 rounded-full py-3"
            >
              Batal
            </Button>
            <Button type="submit" variant="lime" className="h-auto flex-1 rounded-full py-3">
              {initial ? 'Simpan Perubahan' : 'Tambah Program'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

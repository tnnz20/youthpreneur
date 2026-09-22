import { type DragEvent, type SubmitEvent, useRef, useState } from 'react';

import { createTrainingCatalogSchema } from '@/schema/trainings';
import { toast } from 'sonner';

import { uploadTrainingThumbnail } from '@/lib/api/trainings';
import { resolveImageUrl, toErrorMessage } from '@/lib/utils';

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
  CreateTrainingCatalogInput,
  TrainingCatalog,
  TrainingCategory,
  TrainingStatus,
} from '@/types/trainings';

import {
  TRAINING_CATEGORIES,
  TRAINING_STATUS_LABELS,
  TRAINING_STATUS_OPTIONS,
} from '@/constants/trainings';

import { ImageUp, LoaderCircle, Trash2, X } from 'lucide-react';

const CATEGORY_ITEMS = TRAINING_CATEGORIES.map((cat) => ({ label: cat, value: cat }));

interface TrainingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: TrainingCatalog | null;
  onSubmit: (input: CreateTrainingCatalogInput) => Promise<unknown>;
}

interface FormState {
  title: string;
  description: string;
  pic_phone: string;
  category: string;
  max_slots: string;
  training_status: string;
  link: string;
  address: string;
  thumbnail: string;
  start_date: string;
  end_date: string;
  mentor: string;
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  pic_phone: '',
  category: '',
  max_slots: '',
  training_status: 'planned',
  link: '',
  address: '',
  thumbnail: '',
  start_date: '',
  end_date: '',
  mentor: '',
};

function toFormState(catalog?: TrainingCatalog | null): FormState {
  if (!catalog) {
    return EMPTY_FORM;
  }

  return {
    title: catalog.title ?? '',
    description: catalog.description ?? '',
    pic_phone: catalog.pic_phone ?? '',
    category: catalog.category ?? '',
    max_slots: catalog.max_slots !== null ? String(catalog.max_slots) : '',
    training_status: catalog.training_status ?? 'planned',
    link: catalog.link ?? '',
    address: catalog.address ?? '',
    thumbnail: catalog.thumbnail ?? '',
    start_date: catalog.start_date ?? '',
    end_date: catalog.end_date ?? '',
    mentor: catalog.mentor ?? '',
  };
}

const fieldClassName =
  'text-dash-fg focus-visible:border-dash-fg border-dash-border bg-dash-surface-2 h-11 w-full rounded-2xl text-base focus-visible:ring-0 sm:text-sm';

const selectClassName =
  'text-dash-fg focus-visible:border-dash-fg border-dash-border bg-dash-surface-2 h-11 w-full rounded-2xl px-3.5 py-0 text-xs focus-visible:ring-0 data-[size=default]:h-11 sm:text-sm';

const LABEL_CLASS = 'text-dash-fg mb-1 text-xs font-semibold';

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MiB

export function TrainingFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: TrainingFormDialogProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(initial));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setForm(toFormState(initial));
    setErrors({});
    setIsDragOver(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!submitting) {
      if (!nextOpen) {
        resetForm();
      }
      onOpenChange(nextOpen);
    }
  };

  const handleProcessFile = async (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Format file tidak didukung. Harap pilih gambar PNG, JPG, atau JPEG.');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error('Ukuran file terlalu besar. Maksimum ukuran adalah 5 MB.');
      return;
    }

    setUploadingImage(true);
    try {
      const response = await uploadTrainingThumbnail(file);
      setForm((prev) => ({ ...prev, thumbnail: response.thumbnail_url }));
      toast.success('Thumbnail berhasil diunggah.');
    } catch (err: unknown) {
      toast.error(`Gagal mengunggah thumbnail: ${toErrorMessage(err)}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      void handleProcessFile(files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploadingImage && !submitting) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (uploadingImage || submitting) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      void handleProcessFile(files[0]);
    }
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const parsed = createTrainingCatalogSchema.safeParse({
      title: form.title,
      description: form.description,
      pic_phone: form.pic_phone,
      category: form.category || null,
      max_slots: form.max_slots ? Number(form.max_slots) : null,
      training_status: form.training_status || null,
      link: form.link,
      address: form.address,
      thumbnail: form.thumbnail,
      start_date: form.start_date,
      end_date: form.end_date,
      mentor: form.mentor,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path[0];
        if (typeof path === 'string' && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      }
      setErrors(fieldErrors);
      toast.error('Mohon periksa kembali formulir isian Anda.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: parsed.data.title,
        description: parsed.data.description,
        pic_phone: parsed.data.pic_phone,
        category: (parsed.data.category as TrainingCategory) ?? null,
        max_slots: parsed.data.max_slots,
        training_status: (parsed.data.training_status as TrainingStatus) ?? null,
        link: parsed.data.link,
        address: parsed.data.address,
        thumbnail: parsed.data.thumbnail,
        start_date: parsed.data.start_date,
        end_date: parsed.data.end_date,
        mentor: parsed.data.mentor,
      });
      onOpenChange(false);
      resetForm();
    } catch (err: unknown) {
      toast.error(toErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="bg-dash-surface border-dash-border shadow-bento-lg max-h-[90vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-[2rem] border p-6 sm:max-w-3xl sm:p-8"
      >
        <DialogClose
          disabled={submitting}
          className="text-dash-muted hover:bg-dash-surface-2 hover:text-dash-fg absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors disabled:opacity-50"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Tutup</span>
        </DialogClose>

        <div className="space-y-1">
          <DialogTitle className="text-dash-fg text-2xl font-bold tracking-tight">
            {initial ? 'Ubah Program Pelatihan' : 'Tambah Program Pelatihan'}
          </DialogTitle>
          <DialogDescription className="text-dash-muted text-xs leading-relaxed">
            Lengkapi data katalog pelatihan resmi Dispora Kabupaten Tapin.
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <Label className={LABEL_CLASS}>
              Thumbnail Pelatihan{' '}
              <span className="text-dash-muted text-[11px] font-normal">
                (Rekomendasi 16:9 / 1200 × 675 px)
              </span>
            </Label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
            />

            {form.thumbnail ? (
              <div className="border-dash-border bg-dash-surface-2 relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border p-3 sm:flex-row sm:justify-start sm:gap-4">
                <img
                  src={resolveImageUrl(form.thumbnail)}
                  alt="Thumbnail Pelatihan"
                  className="h-28 w-44 rounded-xl object-cover"
                />
                <div className="mt-2 space-y-1.5 text-center sm:mt-0 sm:text-left">
                  <p className="text-dash-fg text-xs font-semibold">Thumbnail aktif terpasang</p>
                  <p className="text-dash-muted text-[11px]">
                    Rekomendasi rasio:{' '}
                    <span className="text-dash-fg font-medium">16:9 (1200 × 675 px)</span>
                  </p>
                  <p className="text-dash-muted max-w-xs truncate text-[11px]">
                    URL: <span className="font-mono">{form.thumbnail}</span>
                  </p>
                  <div className="flex gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={submitting || uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-dash-border h-8 rounded-full text-xs"
                    >
                      Ganti Gambar
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={submitting || uploadingImage}
                      onClick={() => setForm((prev) => ({ ...prev, thumbnail: '' }))}
                      className="h-8 rounded-full text-xs"
                    >
                      <Trash2 className="mr-1 h-3.5 w-3.5" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !uploadingImage && fileInputRef.current?.click()}
                className={`border-dash-border bg-dash-surface-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
                  isDragOver ? 'border-primary bg-primary/5' : 'hover:border-dash-fg/40'
                }`}
              >
                {uploadingImage ? (
                  <div className="flex flex-col items-center gap-2">
                    <LoaderCircle className="text-primary h-8 w-8 animate-spin" />
                    <span className="text-dash-fg text-xs font-semibold">
                      Mengunggah thumbnail...
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-dash-surface border-dash-border flex h-11 w-11 items-center justify-center rounded-full border shadow-sm">
                      <ImageUp className="text-dash-muted h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-dash-fg text-xs font-semibold">
                        Tarik dan lepas gambar ke sini, atau{' '}
                        <span className="text-primary underline">pilih file</span>
                      </p>
                      <p className="text-dash-muted mt-1 text-[11px]">
                        Rekomendasi rasio: 16:9 (1200 × 675 px) • Format didukung: PNG, JPG, JPEG
                        (Maks. 5 MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            {errors.thumbnail && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.thumbnail}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="training-title" className={LABEL_CLASS}>
                Judul Pelatihan
              </Label>
              <Input
                id="training-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Contoh: Pelatihan Digital Marketing"
                className={fieldClassName}
                disabled={submitting}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="training-category" className={LABEL_CLASS}>
                Kategori
              </Label>
              <Select
                value={form.category || null}
                onValueChange={(val) => setForm({ ...form, category: val ?? '' })}
                items={CATEGORY_ITEMS}
                disabled={submitting}
              >
                <SelectTrigger id="training-category" className={selectClassName}>
                  <SelectValue placeholder="Pilih Kategori Pelatihan" />
                </SelectTrigger>
                <SelectContent>
                  {TRAINING_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.category}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <Label htmlFor="training-mentor" className={LABEL_CLASS}>
                Nama Mentor / Narasumber
              </Label>
              <Input
                id="training-mentor"
                value={form.mentor}
                onChange={(e) => setForm({ ...form, mentor: e.target.value })}
                placeholder="Nama mentor"
                className={fieldClassName}
                disabled={submitting}
              />
              {errors.mentor && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.mentor}</p>
              )}
            </div>

            <div>
              <Label htmlFor="training-pic" className={LABEL_CLASS}>
                Nomor Telepon PIC
              </Label>
              <Input
                id="training-pic"
                value={form.pic_phone}
                onChange={(e) => setForm({ ...form, pic_phone: e.target.value })}
                placeholder="08xxxxxxxxxx"
                className={fieldClassName}
                disabled={submitting}
              />
              {errors.pic_phone && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.pic_phone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="training-slots" className={LABEL_CLASS}>
                Kuota Peserta (Maksimal)
              </Label>
              <Input
                id="training-slots"
                type="number"
                min="1"
                value={form.max_slots}
                onChange={(e) => setForm({ ...form, max_slots: e.target.value })}
                placeholder="Kosongkan jika tak terbatas"
                className={fieldClassName}
                disabled={submitting}
              />
              {errors.max_slots && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.max_slots}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <Label htmlFor="training-status" className={LABEL_CLASS}>
                Status Pelatihan
              </Label>
              <Select
                value={form.training_status || null}
                onValueChange={(val) => setForm({ ...form, training_status: val ?? 'planned' })}
                items={TRAINING_STATUS_LABELS}
                disabled={submitting}
              >
                <SelectTrigger id="training-status" className={selectClassName}>
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  {TRAINING_STATUS_OPTIONS.filter((opt) => opt.value !== null).map((opt) => (
                    <SelectItem key={opt.value!} value={opt.value!}>
                      {TRAINING_STATUS_LABELS[opt.value!]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.training_status && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.training_status}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="training-start-date" className={LABEL_CLASS}>
                Tanggal Mulai
              </Label>
              <Input
                id="training-start-date"
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className={fieldClassName}
                disabled={submitting}
              />
              {errors.start_date && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.start_date}</p>
              )}
            </div>

            <div>
              <Label htmlFor="training-end-date" className={LABEL_CLASS}>
                Tanggal Selesai
              </Label>
              <Input
                id="training-end-date"
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className={fieldClassName}
                disabled={submitting}
              />
              {errors.end_date && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.end_date}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="training-address" className={LABEL_CLASS}>
                Lokasi / Alamat
              </Label>
              <Input
                id="training-address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Alamat pelaksanaan pelatihan"
                className={fieldClassName}
                disabled={submitting}
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.address}</p>
              )}
            </div>

            <div>
              <Label htmlFor="training-link" className={LABEL_CLASS}>
                Tautan Eksternal / Pendaftaran
              </Label>
              <Input
                id="training-link"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="https://..."
                className={fieldClassName}
                disabled={submitting}
              />
              {errors.link && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.link}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="training-description" className={LABEL_CLASS}>
              Deskripsi Pelatihan
            </Label>
            <Textarea
              id="training-description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Jelaskan gambaran umum, materi, atau persyaratan program pelatihan ini..."
              rows={3}
              className="border-dash-border bg-dash-surface-2 text-dash-fg focus-visible:border-dash-fg w-full rounded-2xl p-3 text-sm focus-visible:ring-0"
              disabled={submitting}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.description}</p>
            )}
          </div>

          <div className="border-dash-border flex items-center justify-end gap-3 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={submitting}
              className="border-dash-border h-11 rounded-full px-5 text-xs sm:text-sm"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={submitting || uploadingImage}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-full px-6 text-xs font-semibold sm:text-sm"
            >
              {submitting ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : initial ? (
                'Simpan Perubahan'
              ) : (
                'Tambah Pelatihan'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

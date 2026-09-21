import { type SubmitEvent, useState } from 'react';

import { createEnterpriseSchema } from '@/schema/enterprises';
import { toast } from 'sonner';

import { toErrorMessage } from '@/lib/utils';

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

import type { CreateEnterpriseInput } from '@/types/enterprises';

import {
  BUSINESS_DIGITIZATION_LABELS,
  BUSINESS_DIGITIZATION_OPTIONS,
  BUSINESS_SECTOR_LABELS,
  BUSINESS_SECTOR_OPTIONS,
  GENERAL_STATUS_LABELS,
  GENERAL_STATUS_OPTIONS,
  INTERVENTION_NEEDS_LABELS,
  INTERVENTION_NEEDS_OPTIONS,
  LEGAL_STATUS_LABELS,
  LEGAL_STATUS_OPTIONS,
  PROCESS_STATUS_LABELS,
  PROCESS_STATUS_OPTIONS,
} from '@/constants/enterprises';
import { KECAMATAN } from '@/constants/site';

import { LoaderCircle, X } from 'lucide-react';

const KECAMATAN_ITEMS = KECAMATAN.map((kec) => ({ label: kec, value: kec }));

interface EnterpriseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: CreateEnterpriseInput) => Promise<unknown>;
}

interface FormState {
  enterprise_name: string;
  business_sector: string;
  description: string;
  address: string;
  focus_commodity: string;
  district: string;
  legal_status: string;
  business_digitization: string;
  intervention_needs: string;
  training_status: string;
  mentoring_status: string;
  capital_access: string;
  partnership: string;
  initial_turnover: string;
  current_turnover: string;
}

const EMPTY_FORM: FormState = {
  enterprise_name: '',
  business_sector: '',
  description: '',
  address: '',
  focus_commodity: '',
  district: '',
  legal_status: '',
  business_digitization: '',
  intervention_needs: '',
  training_status: '',
  mentoring_status: '',
  capital_access: '',
  partnership: '',
  initial_turnover: '0',
  current_turnover: '0',
};

const fieldClassName =
  'text-dash-fg focus-visible:border-dash-fg border-dash-border bg-dash-surface-2 h-11 w-full rounded-2xl text-base focus-visible:ring-0 sm:text-sm';

const selectClassName =
  'text-dash-fg focus-visible:border-dash-fg border-dash-border bg-dash-surface-2 h-11 w-full rounded-2xl px-3.5 py-0 text-xs focus-visible:ring-0 data-[size=default]:h-11 sm:text-sm';

const LABEL_CLASS = 'text-dash-fg mb-1 text-xs font-semibold';

export function EnterpriseFormDialog({ open, onOpenChange, onSubmit }: EnterpriseFormDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const rawInput = {
      enterprise_name: form.enterprise_name.trim(),
      business_sector: form.business_sector.trim(),
      description: form.description.trim() || null,
      address: form.address.trim() || null,
      focus_commodity: form.focus_commodity.trim() || null,
      district: form.district.trim() || null,
      legal_status: form.legal_status || null,
      business_digitization: form.business_digitization || null,
      intervention_needs: form.intervention_needs.trim() || null,
      training_status: form.training_status || null,
      mentoring_status: form.mentoring_status || null,
      capital_access: form.capital_access || null,
      partnership: form.partnership || null,
      initial_turnover: form.initial_turnover.trim() || '0',
      current_turnover: form.current_turnover.trim() || '0',
    };

    const parseResult = createEnterpriseSchema.safeParse(rawInput);

    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parseResult.error.issues) {
        const path = issue.path[0];
        if (typeof path === 'string' && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      }
      setErrors(fieldErrors);
      toast.error('Mohon periksa kembali isian formulir.');
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      await onSubmit(parseResult.data);
      toast.success('Wirausaha berhasil ditambahkan.');
      onOpenChange(false);
      setForm(EMPTY_FORM);
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
        className="bg-dash-surface border-dash-border shadow-bento-lg max-h-[90vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-[2rem] border p-6 sm:max-w-2xl sm:p-8"
      >
        <DialogClose
          disabled={submitting}
          className="text-dash-muted hover:bg-dash-surface-2 hover:text-dash-fg absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors disabled:pointer-events-none"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Tutup</span>
        </DialogClose>

        <div className="space-y-1">
          <DialogTitle className="text-dash-fg text-2xl font-bold tracking-tight">
            Tambahkan Wirausaha
          </DialogTitle>
          <DialogDescription className="text-dash-muted text-xs leading-relaxed">
            Daftarkan unit usaha baru ke dalam database ekosistem BADAPATAN Tapin.
          </DialogDescription>
        </div>

        <form className="space-y-3.5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="ent-name" className={LABEL_CLASS}>
                Nama Usaha *
              </Label>
              <Input
                id="ent-name"
                value={form.enterprise_name}
                onChange={(e) => setForm({ ...form, enterprise_name: e.target.value })}
                placeholder="Contoh: Sambal Hiyung Barokah"
                className={fieldClassName}
                disabled={submitting}
              />
              {errors.enterprise_name && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.enterprise_name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="ent-sector" className={LABEL_CLASS}>
                Sektor Usaha *
              </Label>
              <Select
                value={form.business_sector || null}
                onValueChange={(val) => setForm({ ...form, business_sector: val ?? '' })}
                items={BUSINESS_SECTOR_LABELS}
                disabled={submitting}
              >
                <SelectTrigger id="ent-sector" className={selectClassName}>
                  <SelectValue placeholder="Pilih Sektor Usaha" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_SECTOR_OPTIONS.map((sector) => (
                    <SelectItem key={sector.value} value={sector.value}>
                      {sector.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.business_sector && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.business_sector}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="ent-district" className={LABEL_CLASS}>
                Kecamatan
              </Label>
              <Select
                value={form.district || null}
                onValueChange={(val) => setForm({ ...form, district: val ?? '' })}
                items={KECAMATAN_ITEMS}
                disabled={submitting}
              >
                <SelectTrigger id="ent-district" className={selectClassName}>
                  <SelectValue placeholder="Pilih Kecamatan" />
                </SelectTrigger>
                <SelectContent>
                  {KECAMATAN.map((kec) => (
                    <SelectItem key={kec} value={kec}>
                      {kec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.district && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.district}</p>
              )}
            </div>

            <div>
              <Label htmlFor="ent-legal" className={LABEL_CLASS}>
                Status Legalitas
              </Label>
              <Select
                value={form.legal_status || null}
                onValueChange={(val) => setForm({ ...form, legal_status: val ?? '' })}
                items={LEGAL_STATUS_LABELS}
                disabled={submitting}
              >
                <SelectTrigger id="ent-legal" className={selectClassName}>
                  <SelectValue placeholder="Pilih Status Legalitas" />
                </SelectTrigger>
                <SelectContent>
                  {LEGAL_STATUS_OPTIONS.filter((opt) => opt.value !== null).map((opt) => (
                    <SelectItem key={opt.value!} value={opt.value!}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.legal_status && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.legal_status}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="ent-digitization" className={LABEL_CLASS}>
                Tingkat Digitalisasi
              </Label>
              <Select
                value={form.business_digitization || null}
                onValueChange={(val) => setForm({ ...form, business_digitization: val ?? '' })}
                items={BUSINESS_DIGITIZATION_LABELS}
                disabled={submitting}
              >
                <SelectTrigger id="ent-digitization" className={selectClassName}>
                  <SelectValue placeholder="Pilih Digitalisasi" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_DIGITIZATION_OPTIONS.filter((opt) => opt.value !== null).map((opt) => (
                    <SelectItem key={opt.value!} value={opt.value!}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.business_digitization && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.business_digitization}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="ent-training" className={LABEL_CLASS}>
                Status Pelatihan
              </Label>
              <Select
                value={form.training_status || null}
                onValueChange={(val) => setForm({ ...form, training_status: val ?? '' })}
                items={PROCESS_STATUS_LABELS}
                disabled={submitting}
              >
                <SelectTrigger id="ent-training" className={selectClassName}>
                  <SelectValue placeholder="Pilih Status Pelatihan" />
                </SelectTrigger>
                <SelectContent>
                  {PROCESS_STATUS_OPTIONS.filter((opt) => opt.value !== null).map((opt) => (
                    <SelectItem key={opt.value!} value={opt.value!}>
                      {opt.label}
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
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="ent-mentoring" className={LABEL_CLASS}>
                Status Pendampingan
              </Label>
              <Select
                value={form.mentoring_status || null}
                onValueChange={(val) => setForm({ ...form, mentoring_status: val ?? '' })}
                items={PROCESS_STATUS_LABELS}
                disabled={submitting}
              >
                <SelectTrigger id="ent-mentoring" className={selectClassName}>
                  <SelectValue placeholder="Pilih Status Pendampingan" />
                </SelectTrigger>
                <SelectContent>
                  {PROCESS_STATUS_OPTIONS.filter((opt) => opt.value !== null).map((opt) => (
                    <SelectItem key={opt.value!} value={opt.value!}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.mentoring_status && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.mentoring_status}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="ent-capital" className={LABEL_CLASS}>
                Akses Permodalan
              </Label>
              <Select
                value={form.capital_access || null}
                onValueChange={(val) => setForm({ ...form, capital_access: val ?? '' })}
                items={GENERAL_STATUS_LABELS}
                disabled={submitting}
              >
                <SelectTrigger id="ent-capital" className={selectClassName}>
                  <SelectValue placeholder="Pilih Akses Permodalan" />
                </SelectTrigger>
                <SelectContent>
                  {GENERAL_STATUS_OPTIONS.filter((opt) => opt.value !== null).map((opt) => (
                    <SelectItem key={opt.value!} value={opt.value!}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.capital_access && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.capital_access}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="ent-partnership" className={LABEL_CLASS}>
                Kemitraan Usaha
              </Label>
              <Select
                value={form.partnership || null}
                onValueChange={(val) => setForm({ ...form, partnership: val ?? '' })}
                items={GENERAL_STATUS_LABELS}
                disabled={submitting}
              >
                <SelectTrigger id="ent-partnership" className={selectClassName}>
                  <SelectValue placeholder="Pilih Kemitraan" />
                </SelectTrigger>
                <SelectContent>
                  {GENERAL_STATUS_OPTIONS.filter((opt) => opt.value !== null).map((opt) => (
                    <SelectItem key={opt.value!} value={opt.value!}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.partnership && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.partnership}</p>
              )}
            </div>

            <div>
              <Label htmlFor="ent-initial-turnover" className={LABEL_CLASS}>
                Omzet Awal (Rp)
              </Label>
              <Input
                id="ent-initial-turnover"
                type="number"
                min="0"
                step="any"
                value={form.initial_turnover}
                onChange={(e) => setForm({ ...form, initial_turnover: e.target.value })}
                placeholder="0"
                className={fieldClassName}
                disabled={submitting}
              />
              {errors.initial_turnover && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.initial_turnover}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="ent-current-turnover" className={LABEL_CLASS}>
                Omzet Saat Ini (Rp)
              </Label>
              <Input
                id="ent-current-turnover"
                type="number"
                min="0"
                step="any"
                value={form.current_turnover}
                onChange={(e) => setForm({ ...form, current_turnover: e.target.value })}
                placeholder="0"
                className={fieldClassName}
                disabled={submitting}
              />
              {errors.current_turnover && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.current_turnover}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="ent-intervention" className={LABEL_CLASS}>
                Kebutuhan Intervensi
              </Label>
              <Select
                value={form.intervention_needs || null}
                onValueChange={(val) => setForm({ ...form, intervention_needs: val ?? '' })}
                items={INTERVENTION_NEEDS_LABELS}
                disabled={submitting}
              >
                <SelectTrigger id="ent-intervention" className={selectClassName}>
                  <SelectValue placeholder="Pilih Kebutuhan Intervensi" />
                </SelectTrigger>
                <SelectContent>
                  {INTERVENTION_NEEDS_OPTIONS.filter((opt) => opt.value !== null).map((opt) => (
                    <SelectItem key={opt.value!} value={opt.value!}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.intervention_needs && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.intervention_needs}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="border-dash-border h-auto flex-1 rounded-full py-3"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="lime"
              disabled={submitting}
              className="h-auto flex-1 rounded-full py-3"
            >
              {submitting ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Menyimpan...
                </>
              ) : (
                'Tambahkan Wirausaha'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { type SubmitEvent, useState } from 'react';

import { adminUpdateEnterpriseSchema } from '@/schema/enterprises';
import { toast } from 'sonner';

import { updateEnterprise } from '@/lib/api/enterprises';
import { toErrorMessage } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type {
  BusinessDigitization,
  BusinessSector,
  Enterprise,
  EnterpriseStatus,
  GeneralStatus,
  InterventionNeeds,
  LegalStatus,
  ProcessStatus,
  UpdateEnterpriseInput,
} from '@/types/enterprises';

import {
  BUSINESS_DIGITIZATION_LABELS,
  BUSINESS_DIGITIZATION_OPTIONS,
  BUSINESS_SECTOR_LABELS,
  BUSINESS_SECTOR_OPTIONS,
  ENTERPRISE_STATUS_LABELS,
  ENTERPRISE_STATUS_OPTIONS,
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

interface AdminEnterpriseEditDialogProps {
  enterprise: Enterprise | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updated: Enterprise) => void;
  onSubmit?: (input: UpdateEnterpriseInput) => Promise<Enterprise>;
}

interface FormState {
  business_sector: string;
  district: string;
  status: EnterpriseStatus;
  legal_status: string;
  business_digitization: string;
  intervention_needs: string;
  training_status: string;
  mentoring_status: string;
  capital_access: string;
  partnership: string;
}

const selectClassName =
  'text-dash-fg focus-visible:border-dash-fg border-dash-border bg-dash-surface-2 h-11 w-full rounded-2xl px-3.5 py-0 text-xs focus-visible:ring-0 data-[size=default]:h-11 sm:text-sm';

const LABEL_CLASS = 'text-dash-fg mb-1 text-xs font-semibold';

function toFormState(enterprise: Enterprise | null): FormState {
  if (!enterprise) {
    return {
      business_sector: '',
      district: '',
      status: 'active',
      legal_status: '',
      business_digitization: '',
      intervention_needs: '',
      training_status: '',
      mentoring_status: '',
      capital_access: '',
      partnership: '',
    };
  }

  return {
    business_sector: enterprise.business_sector,
    district: enterprise.district ?? '',
    status: enterprise.status,
    legal_status: enterprise.legal_status ?? '',
    business_digitization: enterprise.business_digitization ?? '',
    intervention_needs: enterprise.intervention_needs ?? '',
    training_status: enterprise.training_status ?? '',
    mentoring_status: enterprise.mentoring_status ?? '',
    capital_access: enterprise.capital_access ?? '',
    partnership: enterprise.partnership ?? '',
  };
}

interface AdminEnterpriseEditFormProps {
  enterprise: Enterprise;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updated: Enterprise) => void;
  onSubmit?: (input: UpdateEnterpriseInput) => Promise<Enterprise>;
}

function AdminEnterpriseEditForm({
  enterprise,
  onOpenChange,
  onSuccess,
  onSubmit,
}: AdminEnterpriseEditFormProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(enterprise));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!enterprise) {
      return;
    }

    const rawInput = {
      business_sector: form.business_sector.trim(),
      district: form.district.trim() || null,
      status: form.status,
      legal_status: form.legal_status || null,
      business_digitization: form.business_digitization || null,
      intervention_needs: form.intervention_needs.trim() || null,
      training_status: form.training_status || null,
      mentoring_status: form.mentoring_status || null,
      capital_access: form.capital_access || null,
      partnership: form.partnership || null,
    };

    const parseResult = adminUpdateEnterpriseSchema.safeParse(rawInput);

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
      const updatePayload: UpdateEnterpriseInput = {
        business_sector: parseResult.data.business_sector as BusinessSector,
        district: parseResult.data.district,
        status: parseResult.data.status,
        legal_status: parseResult.data.legal_status as LegalStatus | null,
        business_digitization: parseResult.data
          .business_digitization as BusinessDigitization | null,
        intervention_needs: parseResult.data.intervention_needs as InterventionNeeds | null,
        training_status: parseResult.data.training_status as ProcessStatus | null,
        mentoring_status: parseResult.data.mentoring_status as ProcessStatus | null,
        capital_access: parseResult.data.capital_access as GeneralStatus | null,
        partnership: parseResult.data.partnership as GeneralStatus | null,
      };

      const updated = onSubmit
        ? await onSubmit(updatePayload)
        : await updateEnterprise(enterprise.public_id, updatePayload);

      toast.success('Data wirausaha berhasil diperbarui.');
      onSuccess(updated);
      onOpenChange(false);
    } catch (mutationError: unknown) {
      toast.error(toErrorMessage(mutationError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <DialogClose
        disabled={submitting}
        className="text-dash-muted hover:bg-dash-surface-2 hover:text-dash-fg absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors disabled:pointer-events-none"
      >
        <X className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Tutup</span>
      </DialogClose>

      <div className="space-y-1">
        <DialogTitle className="text-dash-fg text-2xl font-bold tracking-tight">
          Edit Data Wirausaha
        </DialogTitle>
        <DialogDescription className="text-dash-muted text-xs leading-relaxed">
          Perbarui data asesmen dan status wirausaha{' '}
          {enterprise?.enterprise_name ?? enterprise?.name ?? enterprise?.public_id}.
        </DialogDescription>
      </div>

      <form className="space-y-3.5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="admin-ent-sector" className={LABEL_CLASS}>
              Sektor Usaha *
            </Label>
            <Select
              value={form.business_sector || null}
              onValueChange={(val) => setForm({ ...form, business_sector: val ?? '' })}
              items={BUSINESS_SECTOR_LABELS}
              disabled={submitting}
            >
              <SelectTrigger id="admin-ent-sector" className={selectClassName}>
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

          <div>
            <Label htmlFor="admin-ent-district" className={LABEL_CLASS}>
              Kecamatan
            </Label>
            <Select
              value={form.district || null}
              onValueChange={(val) => setForm({ ...form, district: val ?? '' })}
              disabled={submitting}
            >
              <SelectTrigger id="admin-ent-district" className={selectClassName}>
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
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="admin-ent-status" className={LABEL_CLASS}>
              Status Usaha *
            </Label>
            <Select
              value={form.status}
              onValueChange={(val) =>
                setForm({ ...form, status: (val ?? 'active') as EnterpriseStatus })
              }
              items={ENTERPRISE_STATUS_LABELS}
              disabled={submitting}
            >
              <SelectTrigger id="admin-ent-status" className={selectClassName}>
                <SelectValue placeholder="Pilih Status Usaha" />
              </SelectTrigger>
              <SelectContent>
                {ENTERPRISE_STATUS_OPTIONS.filter((opt) => opt.value !== null).map((opt) => (
                  <SelectItem key={opt.value!} value={opt.value!}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.status}</p>
            )}
          </div>

          <div>
            <Label htmlFor="admin-ent-legal" className={LABEL_CLASS}>
              Status Legalitas
            </Label>
            <Select
              value={form.legal_status || null}
              onValueChange={(val) => setForm({ ...form, legal_status: val ?? '' })}
              items={LEGAL_STATUS_LABELS}
              disabled={submitting}
            >
              <SelectTrigger id="admin-ent-legal" className={selectClassName}>
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
            <Label htmlFor="admin-ent-digitization" className={LABEL_CLASS}>
              Tingkat Digitalisasi
            </Label>
            <Select
              value={form.business_digitization || null}
              onValueChange={(val) => setForm({ ...form, business_digitization: val ?? '' })}
              items={BUSINESS_DIGITIZATION_LABELS}
              disabled={submitting}
            >
              <SelectTrigger id="admin-ent-digitization" className={selectClassName}>
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
            <Label htmlFor="admin-ent-training" className={LABEL_CLASS}>
              Status Pelatihan
            </Label>
            <Select
              value={form.training_status || null}
              onValueChange={(val) => setForm({ ...form, training_status: val ?? '' })}
              items={PROCESS_STATUS_LABELS}
              disabled={submitting}
            >
              <SelectTrigger id="admin-ent-training" className={selectClassName}>
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
            <Label htmlFor="admin-ent-mentoring" className={LABEL_CLASS}>
              Status Pendampingan
            </Label>
            <Select
              value={form.mentoring_status || null}
              onValueChange={(val) => setForm({ ...form, mentoring_status: val ?? '' })}
              items={PROCESS_STATUS_LABELS}
              disabled={submitting}
            >
              <SelectTrigger id="admin-ent-mentoring" className={selectClassName}>
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
            <Label htmlFor="admin-ent-capital" className={LABEL_CLASS}>
              Akses Permodalan
            </Label>
            <Select
              value={form.capital_access || null}
              onValueChange={(val) => setForm({ ...form, capital_access: val ?? '' })}
              items={GENERAL_STATUS_LABELS}
              disabled={submitting}
            >
              <SelectTrigger id="admin-ent-capital" className={selectClassName}>
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
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.capital_access}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="admin-ent-partnership" className={LABEL_CLASS}>
              Kemitraan Usaha
            </Label>
            <Select
              value={form.partnership || null}
              onValueChange={(val) => setForm({ ...form, partnership: val ?? '' })}
              items={GENERAL_STATUS_LABELS}
              disabled={submitting}
            >
              <SelectTrigger id="admin-ent-partnership" className={selectClassName}>
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
            <Label htmlFor="admin-ent-intervention" className={LABEL_CLASS}>
              Kebutuhan Intervensi
            </Label>
            <Select
              value={form.intervention_needs || null}
              onValueChange={(val) => setForm({ ...form, intervention_needs: val ?? '' })}
              items={INTERVENTION_NEEDS_LABELS}
              disabled={submitting}
            >
              <SelectTrigger id="admin-ent-intervention" className={selectClassName}>
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
              'Simpan Perubahan'
            )}
          </Button>
        </div>
      </form>
    </>
  );
}

export function AdminEnterpriseEditDialog({
  enterprise,
  open,
  onOpenChange,
  onSuccess,
  onSubmit,
}: AdminEnterpriseEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="bg-dash-surface border-dash-border shadow-bento-lg max-h-[90vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-[2rem] border p-6 sm:max-w-2xl sm:p-8"
      >
        {enterprise ? (
          <AdminEnterpriseEditForm
            key={enterprise.public_id}
            enterprise={enterprise}
            onOpenChange={onOpenChange}
            onSuccess={onSuccess}
            onSubmit={onSubmit}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

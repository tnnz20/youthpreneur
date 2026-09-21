import { type SubmitEvent, useState } from 'react';

import { userUpdateEnterpriseSchema } from '@/schema/enterprises';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { BusinessSector, Enterprise, UpdateEnterpriseInput } from '@/types/enterprises';

import { BUSINESS_SECTOR_LABELS, BUSINESS_SECTOR_OPTIONS } from '@/constants/enterprises';

import { LoaderCircle, X } from 'lucide-react';

interface UserEnterpriseEditDialogProps {
  enterprise: Enterprise | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updated: Enterprise) => void;
  onSubmit?: (input: UpdateEnterpriseInput) => Promise<Enterprise>;
}

interface FormState {
  enterprise_name: string;
  business_sector: string;
  initial_turnover: string;
  current_turnover: string;
}

const fieldClassName =
  'text-dash-fg focus-visible:border-dash-fg border-dash-border bg-dash-surface-2 h-11 w-full rounded-2xl text-base focus-visible:ring-0 sm:text-sm';

const selectClassName =
  'text-dash-fg focus-visible:border-dash-fg border-dash-border bg-dash-surface-2 h-11 w-full rounded-2xl px-3.5 py-0 text-xs focus-visible:ring-0 data-[size=default]:h-11 sm:text-sm';

const LABEL_CLASS = 'text-dash-fg mb-1 text-xs font-semibold';

function toFormState(enterprise: Enterprise | null): FormState {
  if (!enterprise) {
    return {
      enterprise_name: '',
      business_sector: '',
      initial_turnover: '0',
      current_turnover: '0',
    };
  }

  return {
    enterprise_name: enterprise.enterprise_name ?? enterprise.name ?? '',
    business_sector: enterprise.business_sector,
    initial_turnover: enterprise.initial_turnover,
    current_turnover: enterprise.current_turnover,
  };
}

interface UserEnterpriseEditFormProps {
  enterprise: Enterprise;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updated: Enterprise) => void;
  onSubmit?: (input: UpdateEnterpriseInput) => Promise<Enterprise>;
}

function UserEnterpriseEditForm({
  enterprise,
  onOpenChange,
  onSuccess,
  onSubmit,
}: UserEnterpriseEditFormProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(enterprise));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!enterprise) {
      return;
    }

    const rawInput = {
      enterprise_name: form.enterprise_name.trim(),
      business_sector: form.business_sector.trim(),
      initial_turnover: form.initial_turnover.trim() || '0',
      current_turnover: form.current_turnover.trim() || '0',
    };

    const parseResult = userUpdateEnterpriseSchema.safeParse(rawInput);

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
        enterprise_name: parseResult.data.enterprise_name,
        business_sector: parseResult.data.business_sector as BusinessSector,
        initial_turnover: parseResult.data.initial_turnover,
        current_turnover: parseResult.data.current_turnover,
      };

      const updated = onSubmit
        ? await onSubmit(updatePayload)
        : await updateEnterprise(enterprise.public_id, updatePayload);

      toast.success('Data usaha berhasil diperbarui.');
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
          Edit Data Usaha
        </DialogTitle>
        <DialogDescription className="text-dash-muted text-xs leading-relaxed">
          Perbarui nama usaha, sektor usaha, dan data omzet Anda.
        </DialogDescription>
      </div>

      <form className="space-y-3.5" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="user-ent-name" className={LABEL_CLASS}>
            Nama Usaha
          </Label>
          <Input
            id="user-ent-name"
            value={form.enterprise_name}
            onChange={(e) => setForm({ ...form, enterprise_name: e.target.value })}
            placeholder="Nama usaha Anda"
            className={fieldClassName}
            disabled={submitting}
          />
          {errors.enterprise_name && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.enterprise_name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="user-ent-sector" className={LABEL_CLASS}>
            Sektor Usaha *
          </Label>
          <Select
            value={form.business_sector || null}
            onValueChange={(val) => setForm({ ...form, business_sector: val ?? '' })}
            items={BUSINESS_SECTOR_LABELS}
            disabled={submitting}
          >
            <SelectTrigger id="user-ent-sector" className={selectClassName}>
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
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.business_sector}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="user-ent-initial-turnover" className={LABEL_CLASS}>
              Omzet Awal (Rp)
            </Label>
            <Input
              id="user-ent-initial-turnover"
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

          <div>
            <Label htmlFor="user-ent-current-turnover" className={LABEL_CLASS}>
              Omzet Saat Ini (Rp)
            </Label>
            <Input
              id="user-ent-current-turnover"
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

export function UserEnterpriseEditDialog({
  enterprise,
  open,
  onOpenChange,
  onSuccess,
  onSubmit,
}: UserEnterpriseEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="bg-dash-surface border-dash-border shadow-bento-lg max-h-[90vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-[2rem] border p-6 sm:max-w-xl sm:p-8"
      >
        {enterprise ? (
          <UserEnterpriseEditForm
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

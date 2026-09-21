import { z } from 'zod';

import { BUSINESS_SECTORS, INTERVENTION_NEEDS } from '@/constants/enterprises';

const turnoverRegex = /^\d+(\.\d+)?$/;

export { BUSINESS_SECTORS, INTERVENTION_NEEDS };

export const createEnterpriseSchema = z.object({
  enterprise_name: z
    .string({ message: 'Nama wirausaha wajib diisi.' })
    .trim()
    .min(1, { message: 'Nama wirausaha wajib diisi.' })
    .max(255, { message: 'Nama wirausaha maksimal 255 karakter.' }),
  business_sector: z.enum(BUSINESS_SECTORS, {
    message: 'Sektor usaha wajib dipilih.',
  }),
  description: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
  address: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
  focus_commodity: z
    .string()
    .trim()
    .max(255, { message: 'Komoditas fokus maksimal 255 karakter.' })
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
  legal_status: z
    .enum(['complete', 'in_progress', 'none'], {
      message: 'Status legalitas tidak valid.',
    })
    .optional()
    .nullable(),
  business_digitization: z
    .enum(['high', 'medium', 'low'], {
      message: 'Tingkat digitalisasi tidak valid.',
    })
    .optional()
    .nullable(),
  intervention_needs: z
    .enum(INTERVENTION_NEEDS, {
      message: 'Kebutuhan intervensi tidak valid.',
    })
    .optional()
    .nullable(),
  training_status: z
    .enum(['completed', 'ongoing', 'planned'], {
      message: 'Status pelatihan tidak valid.',
    })
    .optional()
    .nullable(),
  mentoring_status: z
    .enum(['completed', 'ongoing', 'planned'], {
      message: 'Status pendampingan tidak valid.',
    })
    .optional()
    .nullable(),
  capital_access: z
    .enum(['yes', 'no', 'in_progress'], {
      message: 'Status akses modal tidak valid.',
    })
    .optional()
    .nullable(),
  partnership: z
    .enum(['yes', 'no', 'in_progress'], {
      message: 'Status kemitraan tidak valid.',
    })
    .optional()
    .nullable(),
  initial_turnover: z
    .string()
    .trim()
    .regex(turnoverRegex, { message: 'Omzet awal harus berupa angka non-negatif.' })
    .default('0'),
  current_turnover: z
    .string()
    .trim()
    .regex(turnoverRegex, { message: 'Omzet saat ini harus berupa angka non-negatif.' })
    .default('0'),
  district: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
});

export type CreateEnterpriseSchemaInput = z.input<typeof createEnterpriseSchema>;
export type CreateEnterpriseSchemaOutput = z.output<typeof createEnterpriseSchema>;

export const adminUpdateEnterpriseSchema = z.object({
  enterprise_name: z
    .string()
    .trim()
    .min(1, { message: 'Nama wirausaha tidak boleh kosong.' })
    .max(255, { message: 'Nama wirausaha maksimal 255 karakter.' })
    .optional(),
  business_sector: z
    .enum(BUSINESS_SECTORS, {
      message: 'Sektor usaha wajib dipilih.',
    })
    .optional(),
  description: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
  address: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
  focus_commodity: z
    .string()
    .trim()
    .max(255, { message: 'Komoditas fokus maksimal 255 karakter.' })
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
  dispora_support: z
    .string()
    .trim()
    .max(255, { message: 'Dukungan Dispora maksimal 255 karakter.' })
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
  district: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
  status: z
    .enum(['active', 'inactive'], {
      message: 'Status wirausaha tidak valid.',
    })
    .optional(),
  legal_status: z
    .enum(['complete', 'in_progress', 'none'], {
      message: 'Status legalitas tidak valid.',
    })
    .optional()
    .nullable(),
  business_digitization: z
    .enum(['high', 'medium', 'low'], {
      message: 'Tingkat digitalisasi tidak valid.',
    })
    .optional()
    .nullable(),
  intervention_needs: z
    .enum(INTERVENTION_NEEDS, {
      message: 'Kebutuhan intervensi tidak valid.',
    })
    .optional()
    .nullable(),
  training_status: z
    .enum(['completed', 'ongoing', 'planned'], {
      message: 'Status pelatihan tidak valid.',
    })
    .optional()
    .nullable(),
  mentoring_status: z
    .enum(['completed', 'ongoing', 'planned'], {
      message: 'Status pendampingan tidak valid.',
    })
    .optional()
    .nullable(),
  capital_access: z
    .enum(['yes', 'no', 'in_progress'], {
      message: 'Status akses modal tidak valid.',
    })
    .optional()
    .nullable(),
  partnership: z
    .enum(['yes', 'no', 'in_progress'], {
      message: 'Status kemitraan tidak valid.',
    })
    .optional()
    .nullable(),
  initial_turnover: z
    .string()
    .trim()
    .regex(turnoverRegex, { message: 'Omzet awal harus berupa angka non-negatif.' })
    .optional(),
  current_turnover: z
    .string()
    .trim()
    .regex(turnoverRegex, { message: 'Omzet saat ini harus berupa angka non-negatif.' })
    .optional(),
});

export type AdminUpdateEnterpriseSchemaInput = z.input<typeof adminUpdateEnterpriseSchema>;
export type AdminUpdateEnterpriseSchemaOutput = z.output<typeof adminUpdateEnterpriseSchema>;

export const userUpdateEnterpriseSchema = z.object({
  enterprise_name: z
    .string()
    .trim()
    .min(1, { message: 'Nama usaha tidak boleh kosong.' })
    .max(255, { message: 'Nama usaha maksimal 255 karakter.' })
    .optional(),
  business_sector: z
    .enum(BUSINESS_SECTORS, {
      message: 'Sektor usaha wajib dipilih.',
    })
    .optional(),
  description: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
  address: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
  focus_commodity: z
    .string()
    .trim()
    .max(255, { message: 'Komoditas fokus maksimal 255 karakter.' })
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
  district: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
  initial_turnover: z
    .string()
    .trim()
    .regex(turnoverRegex, { message: 'Omzet awal harus berupa angka non-negatif.' })
    .optional(),
  current_turnover: z
    .string()
    .trim()
    .regex(turnoverRegex, { message: 'Omzet saat ini harus berupa angka non-negatif.' })
    .optional(),
});

export type UserUpdateEnterpriseSchemaInput = z.input<typeof userUpdateEnterpriseSchema>;
export type UserUpdateEnterpriseSchemaOutput = z.output<typeof userUpdateEnterpriseSchema>;

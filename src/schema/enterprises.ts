import { z } from 'zod';

const turnoverRegex = /^\d+(\.\d+)?$/;

export const BUSINESS_SECTORS = [
  'Kuliner',
  'Perdagangan Ritel',
  'Agribisnis & Ketahanan Pangan',
  'Jasa & Layanan Publik',
  'Fashion & Konveksi',
  'E-Commerce & Ekonomi Kreatif',
] as const;

export const INTERVENTION_NEEDS = [
  'Pelatihan',
  'Mentoring',
  'Digitalisasi',
  'Legalitas',
  'Permodalan',
  'Kemitraan',
  'Pemasaran',
] as const;

export const createEnterpriseSchema = z.object({
  name: z
    .string()
    .trim()
    .max(255, { message: 'Nama usaha maksimal 255 karakter.' })
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
  business_sector: z.enum(BUSINESS_SECTORS, {
    message: 'Sektor usaha wajib dipilih.',
  }),
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

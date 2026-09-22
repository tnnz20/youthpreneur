import { z } from 'zod';

import { TRAINING_CATEGORIES } from '@/constants/trainings';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createTrainingCatalogSchema = z
  .object({
    title: z
      .string()
      .trim()
      .max(255, { message: 'Judul pelatihan maksimal 255 karakter.' })
      .optional()
      .nullable()
      .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
    description: z
      .string()
      .trim()
      .optional()
      .nullable()
      .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
    pic_phone: z
      .string()
      .trim()
      .max(50, { message: 'Nomor telepon PIC maksimal 50 karakter.' })
      .optional()
      .nullable()
      .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
    category: z
      .enum(TRAINING_CATEGORIES, {
        message: 'Kategori pelatihan tidak valid.',
      })
      .optional()
      .nullable(),
    max_slots: z
      .union([
        z.number().int().positive({ message: 'Kuota maksimal harus bilangan positif.' }),
        z.string().regex(/^\d+$/, { message: 'Kuota harus berupa angka.' }).transform(Number),
        z.null(),
        z.literal(''),
      ])
      .optional()
      .nullable()
      .transform((val) => (typeof val === 'number' && val > 0 ? val : null)),
    training_status: z
      .enum(['planned', 'ongoing', 'completed'], {
        message: 'Status pelatihan tidak valid.',
      })
      .optional()
      .nullable(),
    link: z
      .string()
      .trim()
      .max(255, { message: 'Tautan maksimal 255 karakter.' })
      .optional()
      .nullable()
      .refine((val) => !val || /^https?:\/\//i.test(val), {
        message: 'Tautan harus diawali dengan http:// atau https://.',
      })
      .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
    address: z
      .string()
      .trim()
      .optional()
      .nullable()
      .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
    thumbnail: z
      .string()
      .trim()
      .max(255, { message: 'URL thumbnail maksimal 255 karakter.' })
      .optional()
      .nullable()
      .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
    start_date: z
      .string()
      .trim()
      .optional()
      .nullable()
      .refine((val) => !val || dateRegex.test(val), {
        message: 'Format tanggal mulai tidak valid (gunakan YYYY-MM-DD).',
      })
      .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
    end_date: z
      .string()
      .trim()
      .optional()
      .nullable()
      .refine((val) => !val || dateRegex.test(val), {
        message: 'Format tanggal selesai tidak valid (gunakan YYYY-MM-DD).',
      })
      .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
    mentor: z
      .string()
      .trim()
      .max(255, { message: 'Nama mentor maksimal 255 karakter.' })
      .optional()
      .nullable()
      .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return data.end_date >= data.start_date;
      }
      return true;
    },
    {
      message: 'Tanggal selesai harus sama dengan atau setelah tanggal mulai.',
      path: ['end_date'],
    }
  );

export const updateTrainingCatalogStatusSchema = z.object({
  training_status: z.enum(['planned', 'ongoing', 'completed'], {
    message: 'Status pelatihan wajib dipilih (planned, ongoing, atau completed).',
  }),
});

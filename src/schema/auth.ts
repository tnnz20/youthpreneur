import { DateTime } from 'luxon';
import { z } from 'zod';

import { KECAMATAN } from '@/constants/site';

const password = z
  .string()
  .min(8, { message: 'Kata sandi minimal 8 karakter.' })
  .max(72, { message: 'Kata sandi maksimal 72 karakter.' });

const phone = z
  .string()
  .trim()
  .regex(/^(\+62|62|0)8\d{7,11}$/, {
    message: 'Nomor WhatsApp tidak valid.',
  });

const birthDate = z.string().refine(
  (value) => {
    const date = DateTime.fromFormat(value, 'yyyy-MM-dd');
    return date.isValid && date <= DateTime.now().startOf('day');
  },
  { message: 'Tanggal lahir tidak valid.' }
);

export const loginSchema = z.object({
  email: z.email({ message: 'Format email tidak valid.' }),
  password,
});

export const registerCredentialsSchema = z
  .object({
    email: z.email({ message: 'Format email tidak valid.' }),
    password,
    confirmPassword: z.string().min(1, { message: 'Ulangi kata sandi wajib diisi.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak cocok.',
    path: ['confirmPassword'],
  });

export const registerProfileSchema = z.object({
  full_name: z.string().trim().min(1, { message: 'Nama lengkap wajib diisi.' }),
  nik: z.string().trim().min(1, { message: 'NIK wajib diisi.' }),
  birth_date: birthDate,
  gender: z.enum(['male', 'female'], { message: 'Jenis kelamin wajib dipilih.' }),
  district: z.enum(KECAMATAN, { message: 'Kecamatan wajib dipilih.' }),
  phone,
  address: z.string().trim().min(1, { message: 'Alamat wajib diisi.' }),
  terms: z.literal(true, { message: 'Anda harus menyetujui syarat & ketentuan.' }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterCredentialsInput = z.infer<typeof registerCredentialsSchema>;
export type RegisterProfileInput = z.infer<typeof registerProfileSchema>;

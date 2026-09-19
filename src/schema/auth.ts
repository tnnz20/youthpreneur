import { z } from 'zod';

const password = z
  .string()
  .min(8, { message: 'Kata sandi minimal 8 karakter.' })
  .max(72, { message: 'Kata sandi maksimal 72 karakter.' });

const optionalDistrict = z
  .string()
  .trim()
  .transform((value) => (value.length === 0 ? undefined : value))
  .optional();

const optionalPhone = z
  .string()
  .trim()
  .refine((value) => value.length === 0 || /^(\+62|62|0)8\d{7,11}$/.test(value), {
    message: 'Nomor WhatsApp tidak valid.',
  })
  .transform((value) => (value.length === 0 ? undefined : value))
  .optional();

export const loginSchema = z.object({
  email: z.email({ message: 'Format email tidak valid.' }),
  password,
});

export const registerSchema = z
  .object({
    full_name: z.string().trim().min(1, { message: 'Nama lengkap wajib diisi.' }),
    email: z.email({ message: 'Format email tidak valid.' }),
    district: optionalDistrict,
    phone: optionalPhone,
    password,
    confirmPassword: z.string(),
    terms: z.literal(true, { message: 'Anda harus menyetujui syarat & ketentuan.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak cocok.',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

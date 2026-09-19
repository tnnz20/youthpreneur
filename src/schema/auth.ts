import { z } from 'zod';

const password = z
  .string()
  .min(8, { message: 'Kata sandi minimal 8 karakter.' })
  .max(72, { message: 'Kata sandi maksimal 72 karakter.' });

export const loginSchema = z.object({
  email: z.email({ message: 'Format email tidak valid.' }),
  password,
});

export const registerSchema = z
  .object({
    full_name: z.string().trim().min(1, { message: 'Nama lengkap wajib diisi.' }),
    email: z.email({ message: 'Format email tidak valid.' }),
    district: z.string().optional(),
    phone: z.string().trim().optional(),
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

export type LoginPayload = LoginInput;

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  district?: string;
  phone?: string;
}

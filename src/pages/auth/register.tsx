import { type SubmitEvent, useState } from 'react';

import { registerSchema } from '@/schema/auth';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { registerUser } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { KECAMATAN } from '@/constants/site';

import { Eye, EyeOff, UserPlus } from 'lucide-react';

const inputClass =
  'text-brand-dark focus-visible:border-brand-dark h-12 w-full rounded-xl border border-black/30 bg-white px-3.5 text-base focus-visible:ring-0 sm:text-sm';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = registerSchema.safeParse({
      full_name: fullName,
      email,
      phone,
      district,
      password,
      confirmPassword,
      terms,
    });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? 'Data pendaftaran tidak valid.');
      return;
    }

    setSubmitting(true);

    try {
      await registerUser({
        email: result.data.email,
        password: result.data.password,
        full_name: result.data.full_name,
        district: result.data.district || undefined,
        phone: result.data.phone || undefined,
      });
      toast.success(`Akun berhasil dibuat! Selamat datang, ${result.data.full_name}.`);
      navigate('/auth/login');
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Pendaftaran gagal. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Card className="border-brand-dark shadow-solid-lg w-full max-w-md gap-0 rounded-3xl border-2 bg-white p-6 py-6 ring-0 sm:p-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="border-brand-dark bg-brand-yellow shadow-solid-sm flex h-12 w-12 items-center justify-center rounded-2xl border-2">
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-brand-dark text-2xl font-black tracking-tight">Daftar Akun</h1>
            <p className="text-brand-muted text-xs font-medium">
              Bergabung dengan wirausaha pemuda Kabupaten Tapin
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="register-full-name"
              className="text-brand-dark mb-1 block text-xs font-bold"
            >
              Nama Lengkap
            </label>
            <Input
              id="register-full-name"
              type="text"
              required
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Nama sesuai KTP"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="text-brand-dark mb-1 block text-xs font-bold"
            >
              Email
            </label>
            <Input
              id="register-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@email.com"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="register-phone"
              className="text-brand-dark mb-1 block text-xs font-bold"
            >
              Nomor WhatsApp
            </label>
            <Input
              id="register-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="08xxxxxxxxxx"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="register-district"
              className="text-brand-dark mb-1 block text-xs font-bold"
            >
              Kecamatan
            </label>
            <Select
              items={KECAMATAN.map((item) => ({ label: item, value: item }))}
              value={district}
              onValueChange={(value) => setDistrict(value as string)}
            >
              <SelectTrigger
                id="register-district"
                className="text-brand-dark focus-visible:border-brand-dark h-12 w-full rounded-xl border border-black/30 bg-white px-3.5 text-base focus-visible:ring-0 data-[size=default]:h-12 sm:text-sm"
              >
                <SelectValue placeholder="Pilih kecamatan" />
              </SelectTrigger>
              <SelectContent className="border-brand-dark rounded-xl border-2">
                {KECAMATAN.map((item) => (
                  <SelectItem key={item} value={item} className="text-brand-dark font-medium">
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="text-brand-dark mb-1 block text-xs font-bold"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <Input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimal 8 karakter"
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                className="text-brand-muted hover:text-brand-dark absolute top-1/2 right-3 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="register-confirm-password"
              className="text-brand-dark mb-1 block text-xs font-bold"
            >
              Konfirmasi Kata Sandi
            </label>
            <Input
              id="register-confirm-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Ulangi kata sandi"
              className={inputClass}
            />
          </div>

          <label
            htmlFor="register-terms"
            className="text-brand-dark flex items-start gap-2 text-xs font-medium"
          >
            <input
              id="register-terms"
              type="checkbox"
              required
              checked={terms}
              onChange={(event) => setTerms(event.target.checked)}
              className="accent-brand-dark mt-0.5 h-4 w-4 rounded border-black/30"
            />
            <span>
              Saya setuju dengan{' '}
              <Link to="/" className="font-bold underline underline-offset-2">
                Syarat &amp; Ketentuan
              </Link>{' '}
              program Youthpreneur Tapin.
            </span>
          </label>

          <Button
            type="submit"
            variant="neo"
            disabled={submitting}
            className="h-auto w-full rounded-xl py-3"
          >
            {submitting ? 'Memproses...' : 'Buat Akun'}
          </Button>
        </form>

        <p className="text-brand-muted mt-6 text-center text-xs">
          Sudah punya akun?{' '}
          <Link to="/auth/login" className="text-brand-dark font-bold underline underline-offset-2">
            Masuk
          </Link>
        </p>
      </Card>
    </section>
  );
}

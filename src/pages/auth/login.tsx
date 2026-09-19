import { type SubmitEvent, useState } from 'react';

import { loginSchema } from '@/schema/auth';
import { useSession } from '@/hooks/use-session';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { loginUser } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { markAuthenticated } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? 'Data masuk tidak valid.');
      return;
    }

    setSubmitting(true);

    try {
      const user = await loginUser(result.data);
      markAuthenticated();
      const name = user.profile.full_name ?? user.email;
      toast.success(`Berhasil masuk! Selamat datang kembali, ${name}.`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Gagal masuk. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Card className="border-brand-dark shadow-solid-lg w-full max-w-md gap-0 rounded-3xl border-2 bg-white p-6 py-6 ring-0 sm:p-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="border-brand-dark bg-brand-yellow shadow-solid-sm flex h-12 w-12 items-center justify-center rounded-2xl border-2">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-brand-dark text-2xl font-black tracking-tight">Masuk</h1>
            <p className="text-brand-muted text-xs font-medium">
              Portal wirausaha pemuda Kabupaten Tapin
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="login-email" className="text-brand-dark mb-1 block text-xs font-bold">
              Email
            </label>
            <Input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@email.com"
              className="text-brand-dark focus-visible:border-brand-dark h-12 w-full rounded-xl border border-black/30 bg-white px-3.5 text-base focus-visible:ring-0 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="text-brand-dark mb-1 block text-xs font-bold"
            >
              Kata Sandi
            </label>
            <Input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Masukkan kata sandi"
              className="text-brand-dark focus-visible:border-brand-dark h-12 w-full rounded-xl border border-black/30 bg-white px-3.5 text-base focus-visible:ring-0 sm:text-sm"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label
              htmlFor="login-remember"
              className="text-brand-dark flex items-center gap-2 font-medium"
            >
              <input
                id="login-remember"
                type="checkbox"
                className="accent-brand-dark h-4 w-4 rounded border-black/30"
              />
              Ingat saya
            </label>
            <Button
              type="button"
              variant="link"
              onClick={() => toast.info('Fitur pemulihan kata sandi segera hadir.')}
              className="text-brand-dark h-auto p-0 text-xs font-semibold underline underline-offset-2"
            >
              Lupa kata sandi?
            </Button>
          </div>

          <Button
            type="submit"
            variant="neo"
            disabled={submitting}
            className="h-auto w-full rounded-xl py-3"
          >
            {submitting ? 'Memproses...' : 'Masuk ke Akun'}
          </Button>
        </form>

        <p className="text-brand-muted mt-6 text-center text-xs">
          Belum punya akun?{' '}
          <Link
            to="/auth/register"
            className="text-brand-dark font-bold underline underline-offset-2"
          >
            Daftar kelas gratis
          </Link>
        </p>
      </Card>
    </section>
  );
}

import { useState, type SubmitEvent } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success(`Berhasil masuk! Selamat datang kembali, ${identity}.`);
    setIdentity('');
    setPassword('');
  };

  return (
    <section className="flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Card className="w-full max-w-md gap-0 rounded-3xl border-2 border-brand-dark bg-white p-6 py-6 ring-0 shadow-solid-lg sm:p-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-brand-dark bg-brand-yellow shadow-solid-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-brand-dark">Masuk</h1>
            <p className="text-xs font-medium text-brand-muted">
              Portal wirausaha pemuda Kabupaten Tapin
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="login-identity"
              className="mb-1 block text-xs font-bold text-brand-dark"
            >
              Email atau Nomor WhatsApp
            </label>
            <Input
              id="login-identity"
              type="text"
              required
              autoComplete="username"
              value={identity}
              onChange={(event) => setIdentity(event.target.value)}
              placeholder="nama@email.com atau 08xxxxxxxxxx"
              className="h-auto w-full rounded-xl border border-black/30 bg-white px-3.5 py-2.5 text-sm text-brand-dark focus-visible:border-brand-dark focus-visible:ring-0"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-1 block text-xs font-bold text-brand-dark"
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
              className="h-auto w-full rounded-xl border border-black/30 bg-white px-3.5 py-2.5 text-sm text-brand-dark focus-visible:border-brand-dark focus-visible:ring-0"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label
              htmlFor="login-remember"
              className="flex items-center gap-2 font-medium text-brand-dark"
            >
              <input
                id="login-remember"
                type="checkbox"
                className="h-4 w-4 rounded border-black/30 accent-brand-dark"
              />
              Ingat saya
            </label>
            <Button
              type="button"
              variant="link"
              onClick={() => toast.info('Fitur pemulihan kata sandi segera hadir.')}
              className="h-auto p-0 text-xs font-semibold text-brand-dark underline underline-offset-2"
            >
              Lupa kata sandi?
            </Button>
          </div>

          <Button type="submit" variant="neo" className="h-auto w-full rounded-xl py-3">
            Masuk ke Akun
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-brand-muted">
          Belum punya akun?{' '}
          <Link to="/" className="font-bold text-brand-dark underline underline-offset-2">
            Daftar kelas gratis
          </Link>
        </p>
      </Card>
    </section>
  );
}

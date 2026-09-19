import { type SubmitEvent, useState } from 'react';

import { registerCredentialsSchema, registerProfileSchema } from '@/schema/auth';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { registerUser } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';

import { RegisterCredentialsStep } from '@/components/auth/register-credentials-step';
import { RegisterProfileStep } from '@/components/auth/register-profile-step';
import { RegisterProgress, StepBackIcon, StepNextIcon } from '@/components/auth/register-progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { UserPlus } from 'lucide-react';

const initialValues = {
  email: '',
  password: '',
  confirmPassword: '',
  full_name: '',
  nik: '',
  birth_date: '',
  gender: '' as 'male' | 'female' | '',
  district: '',
  phone: '',
  address: '',
  terms: false,
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [values, setValues] = useState(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (field: string, value: string | boolean) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const nextStep = () => {
    const result = registerCredentialsSchema.safeParse(values);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? 'Data kredensial tidak valid.');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const credentials = registerCredentialsSchema.safeParse(values);
    if (!credentials.success) {
      setStep(1);
      toast.error(credentials.error.issues[0]?.message ?? 'Data kredensial tidak valid.');
      return;
    }
    const profile = registerProfileSchema.safeParse(values);
    if (!profile.success) {
      toast.error(profile.error.issues[0]?.message ?? 'Data profil tidak valid.');
      return;
    }

    setSubmitting(true);
    try {
      await registerUser({ ...credentials.data, ...profile.data });
      toast.success(`Akun berhasil dibuat! Selamat datang, ${profile.data.full_name}.`);
      navigate('/auth/login');
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Pendaftaran gagal. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        <RegisterProgress step={step} />
      </div>
      <Card className="border-brand-dark shadow-solid-lg w-full max-w-3xl gap-0 rounded-3xl border-2 bg-white p-6 ring-0 sm:p-10">
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
        <form className="space-y-6" onSubmit={handleSubmit}>
          {step === 1 ? (
            <RegisterCredentialsStep
              email={values.email}
              password={values.password}
              confirmPassword={values.confirmPassword}
              showPassword={showPassword}
              onChange={update}
              onTogglePassword={() => setShowPassword((current) => !current)}
            />
          ) : (
            <RegisterProfileStep values={values} onChange={update} />
          )}
          <div className="flex gap-3">
            {step === 2 && (
              <Button
                type="button"
                variant="neoOutline"
                onClick={() => setStep(1)}
                className="h-auto flex-1 rounded-xl py-3"
              >
                <StepBackIcon className="h-4 w-4" /> Kembali
              </Button>
            )}
            {step === 1 ? (
              <Button
                type="button"
                variant="neo"
                onClick={nextStep}
                className="h-auto flex-1 rounded-xl py-3"
              >
                Lanjut <StepNextIcon className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="neo"
                disabled={submitting}
                className="h-auto flex-1 rounded-xl py-3"
              >
                {submitting ? 'Memproses...' : 'Buat Akun'}
              </Button>
            )}
          </div>
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

import { Input } from '@/components/ui/input';

import { Eye, EyeOff } from 'lucide-react';

const inputClass =
  'text-brand-dark focus-visible:border-brand-dark h-12 w-full rounded-xl border border-black/30 bg-white px-3.5 text-base focus-visible:ring-0 sm:text-sm';

interface RegisterCredentialsStepProps {
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  onChange: (field: 'email' | 'password' | 'confirmPassword', value: string) => void;
  onTogglePassword: () => void;
}

export function RegisterCredentialsStep({
  email,
  password,
  confirmPassword,
  showPassword,
  onChange,
  onTogglePassword,
}: RegisterCredentialsStepProps) {
  return (
    <div className="space-y-4">
      <Field label="Email" htmlFor="register-email">
        <Input
          id="register-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => onChange('email', event.target.value)}
          placeholder="nama@email.com"
          className={inputClass}
        />
      </Field>
      <Field label="Kata Sandi" htmlFor="register-password">
        <PasswordInput
          id="register-password"
          value={password}
          showPassword={showPassword}
          onChange={(value) => onChange('password', value)}
          onTogglePassword={onTogglePassword}
          placeholder="Minimal 8 karakter"
        />
      </Field>
      <Field label="Ulangi Kata Sandi" htmlFor="register-confirm-password">
        <PasswordInput
          id="register-confirm-password"
          value={confirmPassword}
          showPassword={showPassword}
          onChange={(value) => onChange('confirmPassword', value)}
          onTogglePassword={onTogglePassword}
          placeholder="Ulangi kata sandi"
        />
      </Field>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-brand-dark mb-1 block text-xs font-bold">
        {label}
      </label>
      {children}
    </div>
  );
}

function PasswordInput({
  id,
  value,
  showPassword,
  onChange,
  onTogglePassword,
  placeholder,
}: {
  id: string;
  value: string;
  showPassword: boolean;
  onChange: (value: string) => void;
  onTogglePassword: () => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? 'text' : 'password'}
        required
        autoComplete="new-password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${inputClass} pr-11`}
      />
      <button
        type="button"
        onClick={onTogglePassword}
        aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
        className="text-brand-muted hover:text-brand-dark absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

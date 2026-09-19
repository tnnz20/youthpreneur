import type { ReactNode } from 'react';

export function AuthField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
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

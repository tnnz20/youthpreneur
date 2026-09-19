import type { ReactNode } from 'react';

import { Navigate } from 'react-router';

import { useSession } from '@/hooks/use-session';

import { LoaderCircle } from 'lucide-react';

function SessionFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <LoaderCircle className="text-brand-yellow h-16 w-16 animate-spin" aria-hidden="true" />
      <span className="text-sm font-semibold">Sedang Memuat...</span>
    </div>
  );
}

interface AuthGuardProps {
  children: ReactNode;
}

export function RequireAuth({ children }: AuthGuardProps) {
  const { status } = useSession();

  if (status === 'loading') {
    return <SessionFallback />;
  }

  if (status === 'anonymous') {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}

export function RedirectIfAuthenticated({ children }: AuthGuardProps) {
  const { status } = useSession();

  if (status === 'loading') {
    return <SessionFallback />;
  }

  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

interface RequireRoleProps {
  role: 'admin' | 'member';
  children: ReactNode;
}

export function RequireRole({ role, children }: RequireRoleProps) {
  const { status, role: currentRole } = useSession();

  if (status === 'loading') {
    return <SessionFallback />;
  }

  if (status === 'anonymous') {
    return <Navigate to="/auth/login" replace />;
  }

  if (currentRole !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

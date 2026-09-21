import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { toast } from 'sonner';

import { getCurrentUser, refreshSession } from '@/lib/api/auth';

import { SessionContext, type SessionStatus } from '@/hooks/use-session';

import type { AuthUser } from '@/types/auth';

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [status, setStatus] = useState<SessionStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let active = true;

    refreshSession()
      .then(async (authenticated) => {
        if (!active) return;

        if (!authenticated) {
          setUser(null);
          setStatus('anonymous');
          return;
        }

        const currentUser = await getCurrentUser();

        if (active) {
          setUser(currentUser);
          setStatus('authenticated');
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
          setStatus('anonymous');
          toast.error('Gagal memeriksa sesi. Silakan muat ulang halaman.');
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setStatus('anonymous');
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, []);

  const markAuthenticated = useCallback((authenticatedUser: AuthUser) => {
    setUser(authenticatedUser);
    setStatus('authenticated');
  }, []);

  const markAnonymous = useCallback(() => {
    setUser(null);
    setStatus('anonymous');
  }, []);

  const value = useMemo(
    () => ({ status, user, role: user?.role ?? null, markAuthenticated, markAnonymous }),
    [markAnonymous, markAuthenticated, status, user]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { toast } from 'sonner';

import { refreshSession } from '@/lib/api/auth';

import { SessionContext, type SessionStatus } from '@/hooks/use-session';

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [status, setStatus] = useState<SessionStatus>('loading');

  useEffect(() => {
    let active = true;

    refreshSession()
      .then((authenticated) => {
        if (active) {
          setStatus(authenticated ? 'authenticated' : 'anonymous');
        }
      })
      .catch(() => {
        if (active) {
          setStatus('anonymous');
          toast.error('Gagal memeriksa sesi. Silakan muat ulang halaman.');
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const markAuthenticated = useCallback(() => setStatus('authenticated'), []);
  const markAnonymous = useCallback(() => setStatus('anonymous'), []);
  const value = useMemo(
    () => ({ status, markAuthenticated, markAnonymous }),
    [markAnonymous, markAuthenticated, status]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

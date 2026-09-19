import { createContext, useContext } from 'react';

import type { AuthUser } from '@/types/auth';

export type SessionStatus = 'loading' | 'authenticated' | 'anonymous';

export interface SessionContextValue {
  status: SessionStatus;
  user: AuthUser | null;
  role: AuthUser['role'] | null;
  markAuthenticated: (user: AuthUser) => void;
  markAnonymous: () => void;
}

export const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }

  return context;
}

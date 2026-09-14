import { createContext, useContext } from 'react';

import type { SiteContextValue } from '@/types/site';

export const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite() {
  const context = useContext(SiteContext);

  if (!context) {
    throw new Error('useSite must be used within SiteProvider');
  }

  return context;
}

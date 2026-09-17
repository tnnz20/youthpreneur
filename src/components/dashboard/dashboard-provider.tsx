import type { ReactNode } from 'react';

import { DashboardContext } from '@/hooks/use-dashboard';
import { useProgramRegistrations } from '@/hooks/use-program-registrations';
import { useTrainingPrograms } from '@/hooks/use-training-programs';
import { useUserProfile } from '@/hooks/use-user-profile';

export function DashboardProvider({ children }: { children: ReactNode }) {
  const programs = useTrainingPrograms();
  const registrations = useProgramRegistrations();
  const profile = useUserProfile();

  return (
    <DashboardContext.Provider value={{ programs, registrations, profile }}>
      {children}
    </DashboardContext.Provider>
  );
}

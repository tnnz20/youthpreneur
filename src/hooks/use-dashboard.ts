import { createContext, useContext } from 'react';

import type { ProgramRegistrationState } from '@/hooks/use-program-registrations';
import type { TrainingProgramState } from '@/hooks/use-training-programs';
import type { UserProfileState } from '@/hooks/use-user-profile';

export interface DashboardContextValue {
  programs: TrainingProgramState;
  registrations: ProgramRegistrationState;
  profile: UserProfileState;
}

export const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error('useDashboard harus dipakai di dalam DashboardProvider');
  }

  return context;
}

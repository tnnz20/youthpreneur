import { useCallback, useState } from 'react';

import type { CurrentUser } from '@/types/dashboard';

import { CURRENT_USER } from '@/constants/dashboard';

export function useUserProfile() {
  const [profile, setProfile] = useState<CurrentUser>(CURRENT_USER);

  const updateProfile = useCallback((input: CurrentUser) => {
    setProfile(input);
  }, []);

  return { profile, updateProfile };
}

export type UserProfileState = ReturnType<typeof useUserProfile>;

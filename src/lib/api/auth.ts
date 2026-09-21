import type { AuthUser, LoginRequest, RegisterRequest } from '@/types/auth';

import { ApiError, apiRequest, refreshSession } from './client';

export { refreshSession };

export function loginUser(input: LoginRequest): Promise<AuthUser> {
  return apiRequest<AuthUser>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function registerUser(input: RegisterRequest): Promise<AuthUser> {
  return apiRequest<AuthUser>('/users', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    return await apiRequest<AuthUser>('/auth/me');
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

export function logoutUser(): Promise<void> {
  return apiRequest<void>('/auth/logout', { method: 'POST' });
}

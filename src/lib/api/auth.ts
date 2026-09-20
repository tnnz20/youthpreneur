import type { AuthUser, LoginRequest, RegisterRequest } from '@/types/auth';

import { API_BASE_URL, ApiError, apiRequest } from './client';

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

let refreshInFlight: Promise<boolean> | null = null;

async function requestSessionRefresh(): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (response.status === 204) {
    return true;
  }

  if (response.status === 401 || response.status === 429) {
    return false;
  }

  throw new Error(`Pemeriksaan sesi gagal (${response.status}).`);
}

export function refreshSession(): Promise<boolean> {
  refreshInFlight ??= requestSessionRefresh().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
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

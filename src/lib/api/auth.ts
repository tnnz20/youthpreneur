import { API_BASE_URL, apiRequest } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  district?: string;
  phone?: string;
}

export interface AuthUser {
  public_id: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: number;
  updated_at: number;
  profile: {
    full_name?: string;
    district?: string;
    phone?: string;
  };
}

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

export function logoutUser(): Promise<void> {
  return apiRequest<void>('/auth/logout', { method: 'POST' });
}

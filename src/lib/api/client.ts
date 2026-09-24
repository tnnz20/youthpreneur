export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

let refreshInFlight: Promise<boolean> | null = null;

async function requestSessionRefresh(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.status === 204 || response.ok) {
      return true;
    }

    if (response.status === 401 || response.status === 429) {
      return false;
    }

    throw new Error(`Pemeriksaan sesi gagal (${response.status}).`);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Pemeriksaan sesi gagal')) {
      throw error;
    }

    return false;
  }
}

export function refreshSession(): Promise<boolean> {
  refreshInFlight ??= requestSessionRefresh().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

export async function apiRequest<T>(path: string, init?: RequestInit, retry = true): Promise<T> {
  if (
    refreshInFlight &&
    !path.startsWith('/auth/refresh') &&
    !path.startsWith('/auth/login') &&
    !path.startsWith('/auth/logout')
  ) {
    await refreshInFlight.catch(() => false);
  }

  const headers = new Headers(init?.headers);

  if (
    init?.body !== undefined &&
    !(init.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (
    response.status === 401 &&
    retry &&
    !path.startsWith('/auth/refresh') &&
    !path.startsWith('/auth/login') &&
    !path.startsWith('/auth/logout')
  ) {
    const refreshed = await refreshSession().catch(() => false);

    if (refreshed) {
      return apiRequest<T>(path, init, false);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
  }

  if (!response.ok) {
    let message = `Permintaan gagal (${response.status}).`;

    const data = (await response.json().catch(() => undefined)) as { error?: unknown } | undefined;

    if (typeof data?.error === 'string' && data.error.length > 0) {
      message = data.error;
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

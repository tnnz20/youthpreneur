import { DateTime } from 'luxon';

import { API_BASE_URL } from '@/lib/api/client';

export { cn } from 'cn';

export function resolveImageUrl(url: string | null | undefined): string {
  if (!url || !url.trim()) return '';
  const trimmed = url.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }
  const base = API_BASE_URL.replace(/\/+$/, '');
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${base}${path}`;
}

export function formatUnixDateTime(value: number): string {
  return DateTime.fromSeconds(value).setLocale('id').toFormat('dd LLL yyyy, HH:mm');
}

export function formatDateOnly(value: string): string {
  return DateTime.fromISO(value).setLocale('id').toFormat('dd LLL yyyy');
}

export function renderValue(value: string | null | undefined): string {
  return value ? value : '—';
}

export function formatCurrency(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }
  const num = Number(value);
  if (Number.isNaN(num)) {
    return String(value);
  }
  return `Rp ${num.toLocaleString('id-ID')}`;
}

export function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
}

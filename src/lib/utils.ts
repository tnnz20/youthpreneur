import { DateTime } from 'luxon';

export { cn } from 'cn';

export function formatUnixDateTime(value: number): string {
  return DateTime.fromSeconds(value).setLocale('id').toFormat('dd LLL yyyy, HH:mm');
}

export function formatDateOnly(value: string): string {
  return DateTime.fromISO(value).setLocale('id').toFormat('dd LLL yyyy');
}

export function renderValue(value: string | null | undefined): string {
  return value ? value : '—';
}

export function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
}

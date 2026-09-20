import { DateTime } from 'luxon';

export { cn } from 'cn';

export function formatUnixDateTime(value: number): string {
  return DateTime.fromSeconds(value).setLocale('id').toFormat('dd LLL yyyy, HH:mm');
}

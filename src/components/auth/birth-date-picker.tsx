import { DateTime } from 'luxon';

import { Input } from '@/components/ui/input';

import { CalendarDays } from 'lucide-react';

interface BirthDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function BirthDatePicker({ value, onChange }: BirthDatePickerProps) {
  const displayValue = value
    ? DateTime.fromFormat(value, 'yyyy-MM-dd').toFormat('dd LLLL yyyy')
    : '';

  return (
    <div className="relative">
      <Input
        id="register-birth-date"
        type="date"
        required
        max={DateTime.now().toFormat('yyyy-MM-dd')}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={displayValue ? `Tanggal lahir ${displayValue}` : 'Tanggal lahir'}
        className="text-brand-dark focus-visible:border-brand-dark h-12 w-full rounded-xl border border-black/30 bg-white px-3.5 text-base focus-visible:ring-0 sm:text-sm"
      />
      <CalendarDays
        className="text-brand-muted pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2"
        aria-hidden="true"
      />
    </div>
  );
}

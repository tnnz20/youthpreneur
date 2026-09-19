import * as React from 'react';

import { DateTime } from 'luxon';

import { authInputClass } from '@/components/auth/auth-form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { CalendarDays } from 'lucide-react';

interface BirthDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const triggerClass = `${authInputClass} flex items-center justify-between text-left font-normal data-placeholder:text-brand-muted`;

export function BirthDatePicker({ value, onChange }: BirthDatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const selected = value ? DateTime.fromFormat(value, 'yyyy-MM-dd').toJSDate() : undefined;
  const today = DateTime.now().startOf('day').toJSDate();

  const displayValue = value
    ? DateTime.fromFormat(value, 'yyyy-MM-dd').setLocale('id').toFormat('dd MMMM yyyy')
    : '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id="register-birth-date"
        data-placeholder={value ? undefined : ''}
        className={triggerClass}
      >
        <span className="truncate">{displayValue || 'Pilih tanggal'}</span>
        <CalendarDays
          className="text-brand-muted pointer-events-none ml-2 h-4 w-4 shrink-0"
          aria-hidden="true"
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          disabled={{ after: today }}
          startMonth={new Date(1920, 0)}
          endMonth={today}
          autoFocus
          onSelect={(date) => {
            onChange(date ? DateTime.fromJSDate(date).toFormat('yyyy-MM-dd') : '');
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

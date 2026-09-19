import * as React from 'react';

import { DateTime } from 'luxon';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { CalendarDays } from 'lucide-react';

interface BirthDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const triggerClass =
  'text-brand-dark focus-visible:border-brand-dark focus-visible:ring-0 h-12 w-full justify-start rounded-xl border border-black/30 bg-white px-3.5 text-left text-base font-normal data-placeholder:text-brand-muted sm:text-sm';

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
        <CalendarDays
          className="text-brand-muted pointer-events-none mr-2 h-4 w-4"
          aria-hidden="true"
        />
        {displayValue || 'Pilih tanggal'}
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

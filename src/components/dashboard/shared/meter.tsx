import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface MeterProps {
  value: number;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
}

export function Meter({ value, className, trackClassName, fillClassName }: MeterProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const target = Math.min(Math.max(value, 0), 100);
    const frame = window.requestAnimationFrame(() => setWidth(target));

    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return (
    <div
      className={cn(
        'bg-dash-surface-2 h-1.5 w-full overflow-hidden rounded-full',
        trackClassName,
        className
      )}
    >
      <div
        className={cn(
          'bg-dash-accent h-full rounded-full transition-[width] duration-700 ease-out',
          fillClassName
        )}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

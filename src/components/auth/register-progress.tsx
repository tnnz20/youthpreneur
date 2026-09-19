import { ArrowLeft, ArrowRight } from 'lucide-react';

interface RegisterProgressProps {
  step: 1 | 2;
}

export function RegisterProgress({ step }: RegisterProgressProps) {
  return (
    <div className="mb-8 flex items-center gap-3">
      {[
        { number: 1, label: 'Kredensial Pengguna' },
        { number: 2, label: 'Profil Pengguna' },
      ].map((item, index) => (
        <div key={item.number} className="flex min-w-0 flex-1 items-center gap-2">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black ${
              step >= item.number
                ? 'border-brand-dark bg-brand-yellow text-brand-dark'
                : 'text-brand-muted border-black/20 bg-white'
            }`}
          >
            {item.number}
          </div>
          <span
            className={`truncate text-[11px] font-bold ${
              step >= item.number ? 'text-brand-dark' : 'text-brand-muted'
            }`}
          >
            {item.label}
          </span>
          {index === 0 && <div className="h-px grow bg-black/10" />}
        </div>
      ))}
    </div>
  );
}

export const StepBackIcon = ArrowLeft;
export const StepNextIcon = ArrowRight;

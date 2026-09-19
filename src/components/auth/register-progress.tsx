interface RegisterProgressProps {
  step: 1 | 2;
}

export function RegisterProgress({ step }: RegisterProgressProps) {
  return (
    <div className="mx-auto mb-8 flex w-full max-w-md items-center gap-3">
      {[
        { number: 1, label: 'Kredensial Pengguna' },
        { number: 2, label: 'Profil Pengguna' },
      ].map((item, index) => (
        <div key={item.number} className="flex min-w-0 flex-1 items-center gap-2">
          <div
            aria-hidden="true"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black ${
              step >= item.number
                ? 'border-brand-dark bg-brand-yellow text-brand-dark'
                : 'text-brand-muted border-black/20 bg-white'
            }`}
          >
            {item.number}
          </div>
          <span
            aria-current={step === item.number ? 'step' : undefined}
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

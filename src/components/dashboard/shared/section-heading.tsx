import type { ReactNode } from 'react';

interface SectionHeadingProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function SectionHeading({ title, description, children }: SectionHeadingProps) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-dash-fg text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        {description && (
          <p className="text-dash-muted mt-0.5 max-w-2xl text-xs font-medium sm:text-sm">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  );
}

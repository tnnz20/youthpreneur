import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="border-dash-border bg-dash-surface/60 shadow-bento flex flex-col items-center justify-center rounded-[2rem] border border-dashed p-10 text-center backdrop-blur-md">
      <div className="border-dash-border mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed">
        <span className="bg-dash-accent text-dash-accent-fg flex h-9 w-9 items-center justify-center rounded-full font-bold">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <h3 className="text-dash-fg text-base font-bold">{title}</h3>
      <p className="text-dash-muted mx-auto mt-1.5 max-w-md text-xs font-medium">{description}</p>
    </div>
  );
}

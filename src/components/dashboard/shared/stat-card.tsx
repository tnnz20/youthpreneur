import { cn } from '@/lib/utils';

import type { DashboardStat, StatTone } from '@/types/dashboard';

import type { LucideIcon } from 'lucide-react';

export type StatVariant = 'white' | 'lime' | 'panel';

const DOT_CLASSES: Record<StatTone, string> = {
  yellow: 'bg-amber-400',
  purple: 'bg-violet-400',
  blue: 'bg-sky-400',
  mint: 'bg-teal-400',
  peach: 'bg-rose-400',
};

const TONE_ICON_CLASSES: Record<StatTone, string> = {
  yellow: 'bg-amber-400/25 text-amber-700 dark:text-amber-300',
  purple: 'bg-violet-400/25 text-violet-700 dark:text-violet-300',
  blue: 'bg-sky-400/25 text-sky-700 dark:text-sky-300',
  mint: 'bg-teal-400/25 text-teal-700 dark:text-teal-300',
  peach: 'bg-rose-400/25 text-rose-700 dark:text-rose-300',
};

const SURFACE_CLASSES: Record<StatVariant, string> = {
  white: 'bg-dash-surface border-dash-border/60',
  lime: 'bg-dash-accent border-transparent',
  panel: 'bg-dash-panel border-transparent',
};

const FOREGROUND_CLASSES: Record<StatVariant, string> = {
  white: 'text-dash-fg',
  lime: 'text-dash-fg',
  panel: 'text-dash-panel-fg',
};

const MUTED_CLASSES: Record<StatVariant, string> = {
  white: 'text-dash-muted',
  lime: 'text-dash-fg/70',
  panel: 'text-dash-panel-muted',
};

const VARIANT_ICON_CLASSES: Record<Exclude<StatVariant, 'white'>, string> = {
  lime: 'bg-black/10 text-dash-fg',
  panel: 'bg-white/10 text-dash-panel-fg',
};

interface StatCardProps {
  stat: DashboardStat;
  icon: LucideIcon;
  variant?: StatVariant;
}

export function StatCard({ stat, icon: Icon, variant = 'white' }: StatCardProps) {
  const iconClasses =
    variant === 'white' ? TONE_ICON_CLASSES[stat.tone] : VARIANT_ICON_CLASSES[variant];

  return (
    <div
      className={cn(
        'dash-reveal group shadow-bento hover:shadow-bento-lg flex h-full flex-col justify-between rounded-[2rem] border p-5 transition-shadow duration-300',
        SURFACE_CLASSES[variant]
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div
          className={cn('flex items-center gap-2 text-sm font-bold', FOREGROUND_CLASSES[variant])}
        >
          <span className="bg-dash-fg h-2 w-2 rounded-sm" aria-hidden="true" />
          <span>{stat.label}</span>
        </div>
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110',
            iconClasses
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <p
        className={cn(
          'my-4 text-3xl font-extrabold tracking-tight lg:text-4xl',
          FOREGROUND_CLASSES[variant]
        )}
      >
        {stat.value}
      </p>

      <div className={cn('flex items-center gap-2 text-xs font-semibold', MUTED_CLASSES[variant])}>
        <span className={cn('h-2 w-2 rounded-full', DOT_CLASSES[stat.tone])} aria-hidden="true" />
        <span>{stat.detail}</span>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';

import { useDashboard } from '@/hooks/use-dashboard';

import { PROGRAM_CATEGORY_OPTIONS } from '@/constants/dashboard';

const CHART_COLORS = [
  'var(--dash-chart-1)',
  'var(--dash-chart-2)',
  'var(--dash-chart-3)',
  'var(--dash-chart-4)',
  'var(--dash-chart-5)',
  'var(--dash-chart-6)',
  'var(--dash-chart-7)',
];

interface SpreadSlice {
  label: string;
  count: number;
  color: string;
}

export function RegistrationSpreadChart() {
  const { programs, registrations } = useDashboard();
  const [breakdown, setBreakdown] = useState<'kategori' | 'kecamatan'>('kategori');
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [pinnedLabel, setPinnedLabel] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 700;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const elapsed = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
      setProgress(1 - Math.pow(1 - elapsed, 3));
      if (elapsed < 1) frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handleBreakdownChange = (option: 'kategori' | 'kecamatan') => {
    setBreakdown(option);
    setHoverLabel(null);
    setPinnedLabel(null);
  };

  const totalRegistrations = registrations.registrations.length;

  const slices = useMemo<SpreadSlice[]>(() => {
    if (breakdown === 'kategori') {
      return PROGRAM_CATEGORY_OPTIONS.map((option, index) => ({
        label: option.label,
        count: registrations.registrations.filter((registration) => {
          const program = programs.programs.find((item) => item.id === registration.programId);
          return program?.kategori === option.value;
        }).length,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }));
    }

    return Object.entries(
      registrations.registrations.reduce<Record<string, number>>((accumulator, registration) => {
        accumulator[registration.kecamatan] = (accumulator[registration.kecamatan] ?? 0) + 1;
        return accumulator;
      }, {})
    )
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7)
      .map((item, index) => ({ ...item, color: CHART_COLORS[index % CHART_COLORS.length] }));
  }, [breakdown, programs.programs, registrations.registrations]);

  const visibleSlices = slices.filter((slice) => slice.count > 0);
  const highlightedLabel = hoverLabel ?? pinnedLabel;

  const gradient = useMemo(() => {
    const percents = visibleSlices.map(
      (slice) => (slice.count / Math.max(totalRegistrations, 1)) * 100 * progress
    );

    const stops = visibleSlices.map((slice, index) => {
      const start = percents.slice(0, index).reduce((sum, value) => sum + value, 0);
      const end = start + percents[index];
      const color =
        highlightedLabel && highlightedLabel !== slice.label
          ? `color-mix(in oklab, ${slice.color} 25%, transparent)`
          : slice.color;
      return `${color} ${start}% ${end}%`;
    });

    const covered = percents.reduce((sum, value) => sum + value, 0);
    const allStops = covered < 100 ? [...stops, `transparent ${covered}% 100%`] : stops;

    return `conic-gradient(${allStops.join(', ')})`;
  }, [visibleSlices, totalRegistrations, progress, highlightedLabel]);

  const activeSlice = highlightedLabel
    ? visibleSlices.find((slice) => slice.label === highlightedLabel)
    : null;

  const ariaSummary = visibleSlices
    .map((slice) => `${slice.label} ${slice.count} pendaftar`)
    .join(', ');

  return (
    <div className="bg-dash-panel text-dash-panel-fg dash-reveal flex w-full flex-col rounded-[2rem] p-6 lg:flex-1">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold">Sebaran Pendaftaran</h2>
          <p className="text-dash-panel-muted text-xs font-medium">
            Total {totalRegistrations} pendaftaran
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-white/5 p-1">
          {(['kategori', 'kecamatan'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleBreakdownChange(option)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold capitalize transition-colors ${
                breakdown === option
                  ? 'bg-dash-accent text-dash-accent-fg'
                  : 'text-dash-panel-muted hover:text-dash-panel-fg'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
        <div className="relative h-44 w-44 shrink-0">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: gradient }}
            role="img"
            aria-label={`Sebaran pendaftaran per ${breakdown}: ${ariaSummary}`}
          />
          <div className="bg-dash-panel absolute inset-4 flex flex-col items-center justify-center rounded-full text-center">
            {activeSlice ? (
              <>
                <span className="text-dash-panel-muted max-w-[7rem] truncate text-[10px] font-semibold">
                  {activeSlice.label}
                </span>
                <span className="text-dash-panel-fg text-2xl font-extrabold tracking-tight tabular-nums">
                  {activeSlice.count}
                </span>
                <span className="text-dash-panel-muted text-[10px] font-medium tabular-nums">
                  {Math.round((activeSlice.count / Math.max(totalRegistrations, 1)) * 100)}% dari
                  total
                </span>
              </>
            ) : (
              <>
                <span className="text-dash-panel-fg text-3xl font-extrabold tracking-tight tabular-nums">
                  {totalRegistrations}
                </span>
                <span className="text-dash-panel-muted text-[10px] font-medium">pendaftaran</span>
              </>
            )}
          </div>
        </div>

        <div className="w-full min-w-0 flex-1 space-y-1.5">
          {visibleSlices.map((slice) => {
            const percent = Math.round((slice.count / Math.max(totalRegistrations, 1)) * 100);
            const highlighted = highlightedLabel === slice.label;

            return (
              <button
                key={slice.label}
                type="button"
                aria-pressed={pinnedLabel === slice.label}
                onMouseEnter={() => setHoverLabel(slice.label)}
                onMouseLeave={() => setHoverLabel(null)}
                onFocus={() => setHoverLabel(slice.label)}
                onBlur={() => setHoverLabel(null)}
                onClick={() => setPinnedLabel(pinnedLabel === slice.label ? null : slice.label)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors ${
                  highlighted ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: slice.color }}
                  aria-hidden="true"
                />
                <span className="text-dash-panel-fg min-w-0 flex-1 truncate text-xs font-semibold">
                  {slice.label}
                </span>
                <span className="text-dash-panel-muted text-[10px] font-medium tabular-nums">
                  {percent}%
                </span>
                <span className="text-dash-panel-fg w-6 text-right text-xs font-extrabold tabular-nums">
                  {slice.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-dash-panel-muted text-[11px] font-semibold">
          {breakdown === 'kategori' ? 'Per kategori potensi' : '7 kecamatan teratas'}
        </span>
        <span className="text-dash-accent rounded-full bg-black px-3 py-1 text-[11px] font-bold">
          {visibleSlices.length} sumber
        </span>
      </div>
    </div>
  );
}

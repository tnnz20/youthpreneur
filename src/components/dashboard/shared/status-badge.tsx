const TONE_CLASSES: Record<string, { badge: string; dot: string; pulse?: boolean }> = {
  Dibuka: { badge: 'bg-dash-accent text-dash-accent-fg', dot: 'bg-dash-accent-fg' },
  Segera: {
    badge: 'border border-dash-border bg-dash-surface-2 text-dash-muted',
    dot: 'bg-dash-muted',
    pulse: true,
  },
  Ditutup: { badge: 'bg-dash-fg text-dash-bg', dot: 'bg-dash-bg' },
  Menunggu: {
    badge: 'border border-dash-border bg-dash-surface-2 text-dash-fg',
    dot: 'bg-amber-400',
    pulse: true,
  },
  'Menunggu Konfirmasi': {
    badge: 'border border-dash-border bg-dash-surface-2 text-dash-fg',
    dot: 'bg-amber-400',
    pulse: true,
  },
  Disetujui: { badge: 'bg-dash-accent text-dash-accent-fg', dot: 'bg-dash-accent-fg' },
  Diterima: { badge: 'bg-dash-accent text-dash-accent-fg', dot: 'bg-dash-accent-fg' },
  Ditolak: { badge: 'bg-dash-fg text-dash-bg', dot: 'bg-rose-400' },
  Dibatalkan: {
    badge: 'border border-dash-border bg-dash-surface-2 text-dash-muted',
    dot: 'bg-rose-400',
  },
  Selesai: { badge: 'bg-dash-accent/60 text-dash-accent-fg', dot: 'bg-dash-accent-fg' },
  Aktif: { badge: 'bg-dash-accent text-dash-accent-fg', dot: 'bg-dash-accent-fg' },
  'Non Aktif': {
    badge: 'border border-dash-border bg-dash-surface-2 text-dash-muted',
    dot: 'bg-rose-400',
  },
  'Tidak Aktif': {
    badge: 'border border-dash-border bg-dash-surface-2 text-dash-muted',
    dot: 'bg-rose-400',
  },
  Lengkap: { badge: 'bg-dash-accent/40 text-dash-fg', dot: 'bg-emerald-500' },
  'Dalam Proses': {
    badge: 'border border-dash-border bg-dash-surface-2 text-dash-fg',
    dot: 'bg-amber-400',
    pulse: true,
  },
  'Belum Ada': {
    badge: 'border border-dash-border bg-dash-surface-2 text-dash-muted',
    dot: 'bg-dash-muted',
  },
  'Sedang Berjalan': {
    badge: 'border border-dash-border bg-dash-surface-2 text-dash-fg',
    dot: 'bg-sky-400',
    pulse: true,
  },
  Direncanakan: {
    badge: 'border border-dash-border bg-dash-surface-2 text-dash-muted',
    dot: 'bg-dash-muted',
  },
};

interface StatusBadgeProps {
  label: string;
  className?: string;
}

export function StatusBadge({ label, className = '' }: StatusBadgeProps) {
  const tone = TONE_CLASSES[label] ?? {
    badge: 'border border-dash-border text-dash-muted',
    dot: 'bg-dash-muted',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold whitespace-nowrap ${tone.badge} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot} ${tone.pulse ? 'dash-pulse' : ''}`}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

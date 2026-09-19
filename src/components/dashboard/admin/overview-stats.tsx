import { useEffect, useState } from 'react';

import { Link } from 'react-router';

import { RegistrationSpreadChart } from '@/components/dashboard/admin/registration-spread-chart';
import { StatCard, type StatVariant } from '@/components/dashboard/shared/stat-card';
import { StatusBadge } from '@/components/dashboard/shared/status-badge';

import { useDashboard } from '@/hooks/use-dashboard';

import {
  DASHBOARD_STATS,
  PROGRAM_CATEGORY_OPTIONS,
  REGISTRATION_STATUS_OPTIONS,
} from '@/constants/dashboard';

import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  ClipboardCheck,
  Plus,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';

const STAT_ICONS = [Users, BookOpen, ClipboardCheck, BadgeCheck];
const STAT_VARIANTS: StatVariant[] = ['white', 'lime', 'panel', 'white'];

const CATEGORY_META = Object.fromEntries(
  PROGRAM_CATEGORY_OPTIONS.map((option) => [option.value, option])
);

const STATUS_SEGMENT_CLASSES: Record<string, string> = {
  Disetujui: 'bg-emerald-400',
  Menunggu: 'bg-amber-400',
  Ditolak: 'bg-rose-400',
  Selesai: 'bg-dash-accent',
};

export function OverviewStats() {
  const { programs, registrations } = useDashboard();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const totalRegistrations = registrations.registrations.length;

  const statusCounts = REGISTRATION_STATUS_OPTIONS.map((option) => ({
    value: option.value,
    count: registrations.registrations.filter((item) => item.status === option.value).length,
  }));

  const programFillRates = programs.programs
    .map((program) => ({
      id: program.id,
      judul: program.judul,
      terdaftar: program.terdaftar,
      kuota: program.kuota,
      percent: program.kuota > 0 ? Math.round((program.terdaftar / program.kuota) * 100) : 0,
    }))
    .sort((a, b) => b.percent - a.percent);

  const recentRegistrations = [...registrations.registrations].slice(0, 5);

  return (
    <div className="space-y-5 lg:space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {DASHBOARD_STATS.map((stat, index) => (
          <div
            key={stat.label}
            className="dash-reveal"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <StatCard stat={stat} icon={STAT_ICONS[index]} variant={STAT_VARIANTS[index]} />
          </div>
        ))}
      </div>

      <div
        className="bg-dash-accent text-dash-accent-fg dash-reveal shadow-bento flex flex-col items-start justify-between gap-4 rounded-[2rem] p-5 sm:flex-row sm:items-center sm:p-6"
        style={{ animationDelay: '240ms' }}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-extrabold">Kelola program pelatihan</p>
            <p className="text-dash-accent-fg/70 text-xs font-medium">
              {programs.programs.length} program terdaftar · tambah atau ubah jadwal dari sini
            </p>
          </div>
        </div>
        <Link
          to="/dashboard/trainings"
          className="bg-dash-fg text-dash-bg inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-opacity hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Tambah Program
        </Link>
      </div>

      <div className="flex flex-col items-stretch gap-5 lg:flex-row lg:gap-6">
        <RegistrationSpreadChart />

        <div
          className="dash-reveal flex w-full flex-col justify-between gap-4 lg:max-w-sm"
          style={{ animationDelay: '120ms' }}
        >
          <div className="bg-dash-panel text-dash-panel-fg flex flex-1 flex-col justify-center gap-3 rounded-[2rem] p-6">
            <div className="flex items-center gap-2 text-sm font-bold">
              <TrendingUp className="text-dash-accent h-4 w-4" aria-hidden="true" />
              Ringkasan Verifikasi
            </div>

            <div
              className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/5"
              role="img"
              aria-label="Proporsi status verifikasi pendaftaran"
            >
              {statusCounts
                .filter((item) => item.count > 0)
                .map((item) => {
                  const pct = Math.round((item.count / Math.max(totalRegistrations, 1)) * 100);

                  return (
                    <div
                      key={item.value}
                      title={`${item.value}: ${item.count} (${pct}%)`}
                      className={`h-full cursor-help transition-opacity hover:opacity-70 ${STATUS_SEGMENT_CLASSES[item.value] ?? 'bg-white/30'}`}
                      style={{ width: `${pct}%` }}
                    />
                  );
                })}
            </div>

            {statusCounts.map((item) => {
              const pct = Math.round((item.count / Math.max(totalRegistrations, 1)) * 100);

              return (
                <div
                  key={item.value}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${STATUS_SEGMENT_CLASSES[item.value] ?? 'bg-white/30'}`}
                      aria-hidden="true"
                    />
                    <span className="text-dash-panel-muted text-xs font-medium">{item.value}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-dash-panel-muted text-[10px] font-semibold tabular-nums">
                      {pct}%
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${
                        item.value === 'Disetujui'
                          ? 'text-dash-accent bg-black'
                          : 'text-dash-panel-fg bg-black'
                      }`}
                    >
                      {item.count}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="bg-dash-panel text-dash-panel-fg relative overflow-hidden rounded-[2rem] p-5">
            <div className="bg-dash-accent/20 pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full blur-2xl" />
            <div className="text-dash-panel-muted relative flex items-center gap-2 text-[11px] font-semibold">
              <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
              Pendaftaran menunggu verifikasi
            </div>
            <p className="relative mt-2 text-2xl font-extrabold tracking-tight">
              {statusCounts.find((item) => item.value === 'Menunggu')?.count ?? 0} pemuda
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
        <div className="border-dash-border/60 bg-dash-surface shadow-bento dash-reveal rounded-[2rem] border p-5 sm:p-6 lg:col-span-5">
          <h2 className="text-dash-fg mb-4 text-base font-bold">Keterisian Program</h2>
          <div className="max-h-72 space-y-4 overflow-y-auto pr-1">
            {programFillRates.map((item) => (
              <div key={item.id} className="group">
                <div className="mb-1.5 flex justify-between gap-3 text-xs font-semibold">
                  <span className="text-dash-fg line-clamp-1">{item.judul}</span>
                  <span className="text-dash-muted whitespace-nowrap tabular-nums">
                    {item.terdaftar}/{item.kuota} · {item.percent}%
                  </span>
                </div>
                <div className="bg-dash-surface-2 h-1.5 w-full overflow-hidden rounded-full">
                  <div
                    className={`h-full rounded-full transition-[width] duration-700 ease-out ${
                      item.percent >= 100
                        ? 'bg-rose-400'
                        : 'bg-dash-accent group-hover:bg-dash-accent-strong'
                    }`}
                    style={{ width: mounted ? `${Math.min(item.percent, 100)}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="border-dash-border/60 bg-dash-surface shadow-bento dash-reveal rounded-[2rem] border p-5 sm:p-6 lg:col-span-7"
          style={{ animationDelay: '120ms' }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-dash-fg text-base font-bold">Pendaftaran Terbaru</h2>
            <Link
              to="/dashboard/users"
              className="text-dash-muted hover:text-dash-fg flex items-center gap-1 text-xs font-semibold transition-colors"
            >
              Lihat semua <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentRegistrations.map((registration) => {
              const program = programs.programs.find((item) => item.id === registration.programId);
              const meta = program ? CATEGORY_META[program.kategori] : undefined;

              return (
                <div
                  key={registration.id}
                  className="border-dash-border/60 bg-dash-surface-2 hover:shadow-bento flex items-center gap-3 rounded-2xl border p-3.5 transition-shadow"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[10px] font-extrabold ${meta?.badge ?? 'bg-dash-accent text-dash-accent-fg'}`}
                  >
                    {registration.nama
                      .split(' ')
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join('')
                      .toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-dash-fg truncate text-sm font-bold">{registration.nama}</p>
                    <p className="text-dash-muted truncate text-[11px] font-medium">
                      {registration.programJudul}
                    </p>
                  </div>
                  <span className="text-dash-muted hidden shrink-0 text-[11px] font-medium sm:block">
                    {registration.kecamatan} · {registration.tanggal}
                  </span>
                  <StatusBadge label={registration.status} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

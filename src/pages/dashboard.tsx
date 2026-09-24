import { Link } from 'react-router';

import { SectionHeading } from '@/components/dashboard/shared/section-heading';
import { StatusBadge } from '@/components/dashboard/shared/status-badge';
import { Progress } from '@/components/ui/progress';

import { useDashboard } from '@/hooks/use-dashboard';

import { PROGRAM_CATEGORY_OPTIONS } from '@/constants/dashboard';

import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Clock3,
  GraduationCap,
  TrendingUp,
  XCircle,
} from 'lucide-react';

const CATEGORY_META = Object.fromEntries(
  PROGRAM_CATEGORY_OPTIONS.map((option) => [option.value, option])
);

export default function DashboardPage() {
  const { profile, registrations, programs } = useDashboard();

  const userRegistrations = registrations.registrations.filter(
    (reg) => reg.nama === profile.profile.nama
  );

  const approvedCount = userRegistrations.filter((r) => r.status === 'Disetujui').length;
  const pendingCount = userRegistrations.filter((r) => r.status === 'Menunggu').length;
  const completedCount = userRegistrations.filter((r) => r.status === 'Selesai').length;
  const rejectedCount = userRegistrations.filter((r) => r.status === 'Ditolak').length;

  const enrolledPrograms = userRegistrations.map((reg) => {
    const prog = programs.programs.find((p) => p.id === reg.programId);
    let progressPercent = 0;
    if (reg.status === 'Selesai') progressPercent = 100;
    else if (reg.status === 'Disetujui') progressPercent = 65;
    else if (reg.status === 'Menunggu') progressPercent = 20;

    return {
      id: reg.id,
      judul: reg.programJudul,
      status: reg.status,
      kategori: prog?.kategori ?? 'Kewirausahaan',
      durasi: prog?.durasi ?? '4 Pekan',
      progressPercent,
    };
  });

  const averageProgress =
    enrolledPrograms.length > 0
      ? Math.round(
          enrolledPrograms.reduce((total, item) => total + item.progressPercent, 0) /
            enrolledPrograms.length
        )
      : 0;

  const statusTiles = [
    {
      label: 'Disetujui',
      detail: 'Siap mengikuti pelatihan',
      count: approvedCount,
      icon: BadgeCheck,
      chip: 'bg-emerald-500/12 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300',
    },
    {
      label: 'Menunggu',
      detail: 'Pemeriksaan berkas',
      count: pendingCount,
      icon: Clock3,
      chip: 'bg-amber-500/12 text-amber-700 ring-amber-500/25 dark:text-amber-300',
    },
    {
      label: 'Selesai',
      detail: 'Sertifikat inkubasi terbit',
      count: completedCount,
      icon: GraduationCap,
      chip: 'bg-dash-accent text-dash-accent-fg ring-dash-accent/40',
    },
    {
      label: 'Ditolak',
      detail: 'Berkas belum memenuhi syarat',
      count: rejectedCount,
      icon: XCircle,
      chip: 'bg-rose-500/12 text-rose-700 ring-rose-500/25 dark:text-rose-300',
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Dashboard Pemuda"
        description={`Statistik keikutsertaan program pelatihan, perkembangan pembinaan, dan perizinan usaha ${profile.profile.usaha}.`}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
        <div className="border-dash-border/60 bg-dash-surface shadow-bento dash-reveal flex flex-col justify-between rounded-[2rem] border p-5 sm:p-6 lg:col-span-7">
          <div>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="text-dash-fg h-4 w-4" aria-hidden="true" />
                <h3 className="text-dash-fg text-base font-bold">Progres Modul Pelatihan</h3>
              </div>
              <Link
                to="/dashboard/my-trainings"
                className="text-dash-muted hover:text-dash-fg flex items-center gap-1 text-xs font-semibold transition-colors"
              >
                Rincian <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="border-dash-border/60 bg-dash-surface-2 mb-5 flex items-center gap-4 rounded-2xl border p-4 shadow-xs">
              <div className="bg-dash-accent text-dash-accent-fg flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-extrabold">
                {averageProgress}%
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-dash-fg text-sm font-bold">Rata-rata progres modul</p>
                <p className="text-dash-muted text-[11px] font-medium">
                  {enrolledPrograms.length} program diikuti
                </p>
                <Progress value={averageProgress} className="mt-2 h-1.5" />
              </div>
            </div>

            {enrolledPrograms.length === 0 ? (
              <div className="border-dash-border/60 flex flex-col items-center rounded-2xl border border-dashed p-8 text-center">
                <span className="bg-dash-accent text-dash-accent-fg mb-3 flex h-10 w-10 items-center justify-center rounded-full">
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="text-dash-fg text-sm font-bold">Belum ada program diikuti</p>
                <p className="text-dash-muted mt-1 text-xs font-medium">
                  Jelajahi katalog dan daftar program pelatihan pertama Anda.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {enrolledPrograms.map((item) => {
                  const meta = CATEGORY_META[item.kategori];

                  return (
                    <div
                      key={item.id}
                      className="border-dash-border/60 bg-dash-surface-2 hover:shadow-bento rounded-2xl border p-4 shadow-xs transition-shadow"
                    >
                      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[10px] font-extrabold ${meta?.badge ?? 'bg-dash-accent text-dash-accent-fg'}`}
                          >
                            {item.judul.slice(0, 2).toUpperCase()}
                          </span>
                          <p className="text-dash-fg truncate text-xs font-bold sm:text-sm">
                            {item.judul}
                          </p>
                        </div>
                        <StatusBadge label={item.status} />
                      </div>
                      <div className="mb-2 flex items-center justify-between text-[11px]">
                        <span className="text-dash-muted font-medium">
                          {meta?.label ?? item.kategori} · {item.durasi}
                        </span>
                        <span className="text-dash-fg font-extrabold">{item.progressPercent}%</span>
                      </div>
                      <Progress value={item.progressPercent} className="h-2" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-dash-border/60 mt-5 border-t pt-4">
            <p className="text-dash-muted text-xs">
              Kurikulum inkubasi dipantau berkala oleh fasilitator Dinas Pemuda dan Olahraga
              Kabupaten Tapin.
            </p>
          </div>
        </div>

        <div className="border-dash-border/60 bg-dash-surface shadow-bento dash-reveal flex flex-col justify-between rounded-[2rem] border p-5 sm:p-6 lg:col-span-5">
          <div>
            <div className="mb-5 flex items-center gap-2">
              <TrendingUp className="text-dash-fg h-4 w-4" aria-hidden="true" />
              <h3 className="text-dash-fg text-base font-bold">Ringkasan Status Verifikasi</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {statusTiles.map((tile) => (
                <div
                  key={tile.label}
                  className="border-dash-border/60 bg-dash-surface-2 hover:shadow-bento rounded-2xl border p-4 shadow-xs transition-shadow"
                >
                  <span
                    className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ring-1 ${tile.chip}`}
                  >
                    <tile.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="text-dash-fg text-2xl font-extrabold tracking-tight">
                    {tile.count}
                  </p>
                  <p className="text-dash-fg mt-0.5 text-xs font-bold">{tile.label}</p>
                  <p className="text-dash-muted text-[11px] font-medium">{tile.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <Link
              to="/training-catalog"
              className="bg-dash-fg text-dash-bg flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-xs font-bold transition-opacity hover:opacity-90"
            >
              Jelajahi Program Lainnya
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

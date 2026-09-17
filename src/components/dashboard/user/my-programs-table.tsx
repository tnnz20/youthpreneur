import { useState } from 'react';

import { EmptyState } from '@/components/dashboard/shared/empty-state';
import { StatusBadge } from '@/components/dashboard/shared/status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { ProgramRegistrationState } from '@/hooks/use-program-registrations';
import { ALL_FILTER } from '@/hooks/use-youth-directory';

import { REGISTRATION_STATUS_OPTIONS } from '@/constants/dashboard';

import { ClipboardList } from 'lucide-react';

interface MyProgramsTableProps {
  registrationState: ProgramRegistrationState;
}

const HEAD_CLASS = 'text-dash-muted text-[11px] font-semibold tracking-wide uppercase';

export function MyProgramsTable({ registrationState }: MyProgramsTableProps) {
  const { myRegistrations } = registrationState;
  const [filter, setFilter] = useState<string>(ALL_FILTER);

  if (myRegistrations.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Belum Ada Program Diikuti"
        description="Kamu belum mendaftar program pelatihan apa pun. Buka katalog program untuk mulai mendaftar."
      />
    );
  }

  const filters = [
    { value: ALL_FILTER, label: 'Semua' },
    ...REGISTRATION_STATUS_OPTIONS.map((option) => ({ value: option.value, label: option.value })),
  ];

  const visible = myRegistrations.filter((item) => filter === ALL_FILTER || item.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((option) => {
          const count =
            option.value === ALL_FILTER
              ? myRegistrations.length
              : myRegistrations.filter((item) => item.status === option.value).length;
          const active = filter === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                active
                  ? 'bg-dash-fg text-dash-bg shadow-md'
                  : 'border-dash-border/60 bg-dash-surface text-dash-muted hover:text-dash-fg border'
              }`}
            >
              {option.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                  active
                    ? 'bg-dash-accent text-dash-accent-fg'
                    : 'bg-dash-surface-2 text-dash-muted'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="border-dash-border bg-dash-surface/60 shadow-bento rounded-[2rem] border border-dashed p-10 text-center">
          <p className="text-dash-fg text-sm font-bold">Tidak ada program di kategori ini</p>
          <p className="text-dash-muted mt-1 text-xs font-medium">
            Coba pilih status lain pada filter di atas.
          </p>
        </div>
      ) : (
        <div className="border-dash-border/60 bg-dash-surface shadow-bento overflow-hidden rounded-[2rem] border">
          <Table>
            <TableHeader className="bg-dash-surface-2">
              <TableRow className="border-dash-border hover:bg-transparent">
                <TableHead className={`${HEAD_CLASS} pl-6 sm:pl-8`}>Program</TableHead>
                <TableHead className={HEAD_CLASS}>Tanggal Daftar</TableHead>
                <TableHead className={`${HEAD_CLASS} pr-6 text-right sm:pr-8`}>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((registration) => (
                <TableRow
                  key={registration.id}
                  className="border-dash-border hover:bg-dash-surface-2/60"
                >
                  <TableCell className="text-dash-fg py-3.5 pl-6 font-bold whitespace-normal sm:pl-8">
                    {registration.programJudul}
                  </TableCell>
                  <TableCell className="text-dash-muted text-xs font-medium">
                    {registration.tanggal}
                  </TableCell>
                  <TableCell className="py-3.5 pr-6 text-right sm:pr-8">
                    <StatusBadge label={registration.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

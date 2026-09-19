import { SectionHeading } from '@/components/dashboard/shared/section-heading';

import { useSession } from '@/hooks/use-session';

const ROLE_LABEL: Record<string, string> = {
  admin: 'Admin Dispora',
  member: 'Pemuda Wirausaha',
};

export default function DashboardProfilePage() {
  const { user } = useSession();

  const rows = [
    { label: 'Nama Lengkap', value: user?.profile.full_name ?? '-' },
    { label: 'Email', value: user?.email ?? '-' },
    { label: 'Peran', value: ROLE_LABEL[user?.role ?? ''] ?? '-' },
    { label: 'ID Pengguna', value: user?.public_id ?? '-' },
  ];

  return (
    <>
      <SectionHeading
        title="Akun Saya"
        description="Informasi akun yang terdaftar pada ekosistem BADAPATAN Kabupaten Tapin."
      />
      <div className="border-dash-border/60 bg-dash-surface shadow-bento rounded-[2rem] border p-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label}>
              <dt className="text-dash-muted text-[11px] font-semibold tracking-wide uppercase">
                {row.label}
              </dt>
              <dd className="text-dash-fg mt-1 truncate text-sm font-bold">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}

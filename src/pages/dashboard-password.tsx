import { EmptyState } from '@/components/dashboard/shared/empty-state';
import { SectionHeading } from '@/components/dashboard/shared/section-heading';

import { KeyRound } from 'lucide-react';

export default function DashboardPasswordPage() {
  return (
    <>
      <SectionHeading
        title="Ganti Password"
        description="Perbarui kata sandi akun untuk menjaga keamanan akses dashboard Anda."
      />
      <EmptyState
        icon={KeyRound}
        title="Fitur Segera Hadir"
        description="Penggantian kata sandi akan tersedia setelah layanan autentikasi Dispora Tapin diaktifkan."
      />
    </>
  );
}

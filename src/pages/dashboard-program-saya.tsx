import { SectionHeading } from '@/components/dashboard/shared/section-heading';
import { MyProgramsTable } from '@/components/dashboard/user/my-programs-table';

import { useDashboard } from '@/hooks/use-dashboard';

export default function DashboardProgramSayaPage() {
  const { registrations } = useDashboard();

  return (
    <>
      <SectionHeading
        title="Program Saya"
        description="Riwayat dan status pendaftaran program pelatihan yang kamu ikuti."
      />
      <MyProgramsTable registrationState={registrations} />
    </>
  );
}

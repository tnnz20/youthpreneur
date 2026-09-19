import { RegistrationTable } from '@/components/dashboard/admin/registration-table';
import { SectionHeading } from '@/components/dashboard/shared/section-heading';

import { useDashboard } from '@/hooks/use-dashboard';

export default function AdminPendaftaranPage() {
  const { programs, registrations } = useDashboard();

  return (
    <>
      <SectionHeading
        title="Pendaftaran & Verifikasi"
        description="Tinjau pendaftaran pemuda, setujui atau tolak, dan tandai program yang telah selesai."
      />
      <RegistrationTable registrationState={registrations} programState={programs} />
    </>
  );
}

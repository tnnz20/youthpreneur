import { SectionHeading } from '@/components/dashboard/shared/section-heading';
import { ProfileForm } from '@/components/dashboard/user/profile-form';

import { useDashboard } from '@/hooks/use-dashboard';

export default function DashboardProfilPage() {
  const { profile } = useDashboard();

  return (
    <>
      <SectionHeading
        title="Profil Usaha"
        description="Perbarui data pemuda dan usaha agar tercatat resmi pada Bank Data Pemuda Tapin."
      />
      <ProfileForm profile={profile.profile} onSubmit={profile.updateProfile} />
    </>
  );
}

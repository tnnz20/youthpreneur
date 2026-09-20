import { UserTable } from '@/components/dashboard/admin/user-table';
import { SectionHeading } from '@/components/dashboard/shared/section-heading';

import { useUsers } from '@/hooks/use-users';

export default function AdminUsersManagementPage() {
  const state = useUsers();

  return (
    <>
      <SectionHeading
        title="Manajemen Pengguna"
        description="Tinjau, non aktifkan, dan hapus pengguna terdaftar pada sistem Youthpreneur."
      />
      <UserTable state={state} />
    </>
  );
}

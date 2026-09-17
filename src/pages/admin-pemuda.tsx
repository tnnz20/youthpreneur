import { YouthTable } from '@/components/dashboard/admin/youth-table';
import { SectionHeading } from '@/components/dashboard/shared/section-heading';

import { useYouthDirectory } from '@/hooks/use-youth-directory';

export default function AdminPemudaPage() {
  const directory = useYouthDirectory();

  return (
    <>
      <SectionHeading
        title="Kelola Data Pemuda"
        description="Cari, saring, tinjau profil, dan perbarui status binaan pemuda pada Bank Data Pemuda Tapin."
      />
      <YouthTable directory={directory} />
    </>
  );
}

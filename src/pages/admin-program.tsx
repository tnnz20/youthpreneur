import { ProgramTable } from '@/components/dashboard/admin/program-table';
import { SectionHeading } from '@/components/dashboard/shared/section-heading';

import { useDashboard } from '@/hooks/use-dashboard';

export default function AdminProgramPage() {
  const { programs } = useDashboard();

  return (
    <>
      <SectionHeading
        title="Kelola Program Pelatihan"
        description="Tambah, ubah, dan atur status program pelatihan yang diselenggarakan Dispora Kabupaten Tapin."
      />
      <ProgramTable programState={programs} />
    </>
  );
}

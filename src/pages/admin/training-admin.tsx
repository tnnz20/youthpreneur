import { SectionHeading } from '@/components/dashboard/shared/section-heading';
import { TrainingTable } from '@/components/dashboard/training/training-table';

export default function TrainingAdminPage() {
  return (
    <>
      <SectionHeading
        title="Kelola Program Pelatihan"
        description="Tambah, pantau perkembangan kuota, dan atur status program pelatihan yang diselenggarakan Dispora Kabupaten Tapin."
      />
      <TrainingTable />
    </>
  );
}

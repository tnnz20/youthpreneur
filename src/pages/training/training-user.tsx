import { SectionHeading } from '@/components/dashboard/shared/section-heading';
import { UserTrainingTable } from '@/components/dashboard/training/user-training-table';

export default function TrainingUserPage() {
  return (
    <>
      <SectionHeading
        title="Pelatihan Saya"
        description="Pantau riwayat pendaftaran dan keikutsertaan program pelatihan resmi Dispora Kabupaten Tapin."
      />
      <UserTrainingTable />
    </>
  );
}

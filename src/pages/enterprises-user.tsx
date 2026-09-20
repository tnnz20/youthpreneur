import { EnterpriseTable } from '@/components/dashboard/enterprise/enterprise-table';
import { SectionHeading } from '@/components/dashboard/shared/section-heading';

export default function EnterprisesUserPage() {
  return (
    <>
      <SectionHeading
        title="Daftar Usaha Saya"
        description="Kelola data unit usaha Anda yang terdaftar pada ekosistem BADAPATAN Dispora Kabupaten Tapin."
      />
      <EnterpriseTable />
    </>
  );
}

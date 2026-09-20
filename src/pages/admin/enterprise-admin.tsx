import { EnterpriseAdminTable } from '@/components/dashboard/admin/enterprise-admin-table';
import { SectionHeading } from '@/components/dashboard/shared/section-heading';

export default function EnterpriseAdminPage() {
  return (
    <>
      <SectionHeading
        title="Kelola Wirausaha"
        description="Tinjau, pantau perkembangan, dan kelola seluruh unit wirausaha binaan terdaftar pada ekosistem BADAPATAN."
      />
      <EnterpriseAdminTable />
    </>
  );
}

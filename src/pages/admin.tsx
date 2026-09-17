import { OverviewStats } from '@/components/dashboard/admin/overview-stats';
import { SectionHeading } from '@/components/dashboard/shared/section-heading';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        title="Dashboard BADAPATAN"
        description="Ringkasan dan statistik komprehensif data pemuda wirausaha, program pelatihan, dan verifikasi pendaftaran Dispora Kabupaten Tapin."
      />

      <OverviewStats />
    </div>
  );
}

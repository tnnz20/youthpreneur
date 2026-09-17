import { useState } from 'react';

import { CtaSection } from '@/components/database/cta-section';
import { DirectorySection } from '@/components/database/directory-section';
import { KecamatanSection } from '@/components/database/kecamatan-section';
import { RegisterDialog } from '@/components/database/register-dialog';
import { StatisticsSection } from '@/components/database/statistics-section';

import { useYouthDirectory } from '@/hooks/use-youth-directory';

export default function DatabasePage() {
  const directory = useYouthDirectory();
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <>
      <DirectorySection directory={directory} />
      <KecamatanSection
        onSelectDistrict={directory.setKecamatan}
        onReset={directory.resetFilters}
      />
      <StatisticsSection onRegister={() => setRegisterOpen(true)} />
      <CtaSection onRegister={() => setRegisterOpen(true)} />
      <RegisterDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onSubmit={directory.addProfile}
      />
    </>
  );
}

import { Suspense, lazy } from 'react';

import { useSession } from '@/hooks/use-session';

import { LoaderCircle } from 'lucide-react';

const AdminPage = lazy(() => import('@/pages/admin'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <LoaderCircle className="text-dash-muted h-8 w-8 animate-spin" aria-hidden="true" />
    </div>
  );
}

export default function DashboardIndexPage() {
  const { role } = useSession();

  return (
    <Suspense fallback={<PageFallback />}>
      {role === 'admin' ? <AdminPage /> : <DashboardPage />}
    </Suspense>
  );
}

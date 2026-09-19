import { useEffect } from 'react';

import { Outlet, useLocation } from 'react-router';

import { DashboardProvider } from '@/components/dashboard/dashboard-provider';
import { DashboardSidebar } from '@/components/dashboard/shared/dashboard-sidebar';
import { DashboardTopbar } from '@/components/dashboard/shared/dashboard-topbar';

import { ADMIN_NAV, USER_NAV } from '@/constants/dashboard';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return null;
}

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  const items = isAdmin ? ADMIN_NAV : USER_NAV;
  const areaLabel = isAdmin ? 'Panel Admin Dispora' : 'Dashboard Pemuda';

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    window.localStorage.removeItem('youthpreneur-theme');
  }, []);

  return (
    <DashboardProvider>
      <ScrollToTop />
      <div className="bg-dash-bg text-dash-fg font-jakarta selection:bg-dash-accent selection:text-dash-accent-fg flex min-h-screen w-full gap-5 p-3 sm:p-4 lg:gap-6 lg:p-5">
        <DashboardSidebar items={items} areaLabel={areaLabel} />
        <div className="flex min-w-0 flex-1 flex-col gap-5 lg:gap-6">
          <DashboardTopbar items={items} areaLabel={areaLabel} />
          <main className="grow">
            <Outlet />
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}

import { useState } from 'react';

import { type DashboardNavItem, SidebarNav } from '@/components/dashboard/shared/dashboard-sidebar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { useNavBadges } from '@/hooks/use-nav-badges';

import { Menu } from 'lucide-react';

interface DashboardTopbarProps {
  items: DashboardNavItem[];
  areaLabel: string;
}

export function DashboardTopbar({ items, areaLabel }: DashboardTopbarProps) {
  const badges = useNavBadges();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="dash-reveal flex items-center justify-between lg:hidden">
      {/* Mobile menu trigger & title */}
      <div className="flex items-center gap-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            className="border-dash-border/80 bg-dash-surface shadow-pill text-dash-fg hover:bg-dash-surface-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors focus:outline-none"
            aria-label="Buka menu dashboard"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </SheetTrigger>
          <SheetContent side="left" className="border-dash-border bg-dash-surface w-80 p-5">
            <SheetHeader className="border-dash-border border-b pb-3">
              <SheetTitle className="text-dash-fg text-base font-bold tracking-tight">
                {areaLabel}
              </SheetTitle>
            </SheetHeader>
            <div className="pt-3">
              <SidebarNav items={items} badges={badges} onNavigate={() => setMobileOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        <span className="text-dash-muted text-xs font-bold tracking-wider uppercase">
          {areaLabel}
        </span>
      </div>
    </header>
  );
}

import { useState } from 'react';

import { DashboardFooterMenu } from '@/components/dashboard/shared/dashboard-footer-menu';
import { type DashboardNavItem, SidebarNav } from '@/components/dashboard/shared/dashboard-sidebar';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { Menu } from 'lucide-react';

interface DashboardTopbarProps {
  items: DashboardNavItem[];
  areaLabel: string;
}

export function DashboardTopbar({ items, areaLabel }: DashboardTopbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="dash-reveal flex items-center justify-between lg:hidden">
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
            <div className="grow pt-3">
              <SidebarNav items={items} onNavigate={() => setMobileOpen(false)} />
            </div>
            <SheetFooter className="border-dash-border mt-4 border-t p-0 pt-3">
              <DashboardFooterMenu
                align="start"
                onNavigate={() => setMobileOpen(false)}
                className="bg-dash-surface-2"
              />
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <span className="text-dash-muted text-xs font-bold tracking-wider uppercase">
          {areaLabel}
        </span>
      </div>
    </header>
  );
}

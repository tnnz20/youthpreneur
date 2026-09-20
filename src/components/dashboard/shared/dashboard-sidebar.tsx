import { Link, NavLink } from 'react-router';

import { cn } from '@/lib/utils';

import { DashboardFooterMenu } from '@/components/dashboard/shared/dashboard-footer-menu';

import type { DashboardNavItem } from '@/constants/dashboard';

export type { DashboardNavItem };

interface SidebarNavProps {
  items: DashboardNavItem[];
  onNavigate?: () => void;
}

export function SidebarNav({ items, onNavigate }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-1.5 text-[15px] font-semibold">
      {items.map((item) => {
        const Icon = item.icon;
        const isIndex = item.to.split('/').filter(Boolean).length === 1;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={isIndex}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 px-4 py-3 transition-all duration-200',
                isActive
                  ? 'bg-dash-fg text-dash-bg rounded-full shadow-md'
                  : 'text-dash-muted hover:bg-dash-surface-2 hover:text-dash-fg rounded-2xl hover:translate-x-0.5'
              )
            }
          >
            <Icon
              className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
              aria-hidden="true"
            />
            <span className="flex-1 truncate">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

interface DashboardSidebarProps {
  items: DashboardNavItem[];
  areaLabel: string;
}

export function DashboardSidebar({ items, areaLabel }: DashboardSidebarProps) {
  return (
    <aside className="border-dash-border/60 bg-dash-surface shadow-bento sticky top-5 hidden h-[calc(100vh-2.5rem)] w-72 shrink-0 flex-col justify-between overflow-y-auto rounded-[2rem] border p-5 lg:flex">
      <div className="flex flex-col space-y-6">
        <Link to="/" className="group flex items-center gap-3 px-2 pt-1">
          <img
            src="/assets/logo-youth.webp"
            alt="Logo Youthpreneur Tapin"
            className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <span className="min-w-0">
            <span className="text-dash-fg block text-xl leading-none font-bold tracking-tight">
              Youthpreneur
            </span>
            <span className="text-dash-muted mt-1 block truncate text-[10px] font-semibold tracking-wide uppercase">
              {areaLabel}
            </span>
          </span>
        </Link>

        <SidebarNav items={items} />
      </div>

      <div className="border-dash-border/60 mt-6 border-t pt-3">
        <DashboardFooterMenu className="w-full cursor-pointer" />
      </div>
    </aside>
  );
}

import { useState } from 'react';

import { Link, NavLink, useLocation } from 'react-router';

import { cn } from '@/lib/utils';

import { DashboardFooterMenu } from '@/components/dashboard/shared/dashboard-footer-menu';

import type { DashboardNavItem } from '@/constants/dashboard';

import { ChevronDown } from 'lucide-react';

export type { DashboardNavItem };

interface SidebarNavProps {
  items: DashboardNavItem[];
  onNavigate?: () => void;
}

function isSubItemActive(
  pathname: string,
  childTo: string,
  allChildren?: DashboardNavItem['children']
): boolean {
  if (pathname === childTo) return true;

  if (childTo !== '/dashboard' && pathname.startsWith(`${childTo}/`)) {
    const hasMoreSpecificSibling = allChildren?.some(
      (sibling) =>
        sibling.to !== childTo &&
        sibling.to.startsWith(`${childTo}/`) &&
        (pathname === sibling.to || pathname.startsWith(`${sibling.to}/`))
    );
    return !hasMoreSpecificSibling;
  }

  return false;
}

function SidebarNavCollapsible({
  item,
  onNavigate,
}: {
  item: DashboardNavItem;
  onNavigate?: () => void;
}) {
  const location = useLocation();
  const Icon = item.icon;

  const isAnyChildActive = Boolean(
    item.children?.some((child) => isSubItemActive(location.pathname, child.to, item.children))
  );

  const [expanded, setExpanded] = useState<boolean | null>(null);
  const isOpen = expanded ?? isAnyChildActive;

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setExpanded(!isOpen)}
        className={cn(
          'group flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-200',
          isAnyChildActive
            ? 'bg-dash-surface-2/70 text-dash-fg font-bold'
            : 'text-dash-muted hover:bg-dash-surface-2 hover:text-dash-fg hover:translate-x-0.5'
        )}
        aria-expanded={isOpen}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Icon
            className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110"
            aria-hidden="true"
          />
          <span className="truncate">{item.label}</span>
        </div>
        <ChevronDown
          className={cn(
            'text-dash-muted group-hover:text-dash-fg h-4 w-4 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {/* Collapsible Content with Tree Guide Line */}
      <div
        className={cn(
          'grid transition-all duration-200 ease-in-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'pointer-events-none grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="border-dash-border mt-1 ml-6.5 space-y-1 border-l py-1 pl-3">
            {item.children?.map((child) => {
              const active = isSubItemActive(location.pathname, child.to, item.children);

              return (
                <NavLink
                  key={child.to}
                  to={child.to}
                  onClick={onNavigate}
                  className={cn(
                    'block truncate rounded-xl px-3 py-2 text-sm transition-all duration-150',
                    active
                      ? 'bg-dash-fg text-dash-bg font-semibold shadow-xs'
                      : 'text-dash-muted hover:bg-dash-surface-2 hover:text-dash-fg hover:translate-x-0.5'
                  )}
                >
                  {child.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SidebarNav({ items, onNavigate }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-1.5 text-[15px] font-semibold">
      {items.map((item) => {
        if (item.children && item.children.length > 0) {
          return <SidebarNavCollapsible key={item.label} item={item} onNavigate={onNavigate} />;
        }

        const Icon = item.icon;
        const targetTo = item.to ?? '#';
        const isIndex = targetTo.split('/').filter(Boolean).length === 1;

        return (
          <NavLink
            key={targetTo}
            to={targetTo}
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

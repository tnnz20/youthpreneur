import { Link, NavLink, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { logoutUser } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { cn } from '@/lib/utils';

import { useNavBadges } from '@/hooks/use-nav-badges';
import { useSession } from '@/hooks/use-session';

import type { LucideIcon } from 'lucide-react';
import { LogOut } from 'lucide-react';

export interface DashboardNavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

interface SidebarNavProps {
  items: DashboardNavItem[];
  badges?: Record<string, number>;
  onNavigate?: () => void;
}

export function SidebarNav({ items, badges, onNavigate }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-1.5 text-[15px] font-semibold">
      {items.map((item) => {
        const Icon = item.icon;
        const isIndex = item.to.split('/').filter(Boolean).length === 1;
        const badge = badges?.[item.to] ?? 0;

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
            {badge > 0 && (
              <span className="bg-dash-accent text-dash-accent-fg rounded-full px-2 py-0.5 text-[10px] font-extrabold">
                {badge}
              </span>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

interface DashboardSidebarProps {
  items: DashboardNavItem[];
  areaLabel: string;
  badges?: Record<string, number>;
}

export function DashboardSidebar({ items, areaLabel, badges }: DashboardSidebarProps) {
  const navBadges = useNavBadges();
  const navigate = useNavigate();
  const { markAnonymous } = useSession();
  const resolvedBadges = badges ?? navBadges;

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 401)) {
        toast.error('Gagal keluar. Coba lagi.');
        return;
      }
    }

    markAnonymous();
    navigate('/auth/login', { replace: true });
  };

  return (
    <aside className="border-dash-border/60 bg-dash-surface shadow-bento sticky top-5 hidden h-[calc(100vh-2.5rem)] w-64 shrink-0 flex-col justify-between overflow-y-auto rounded-[2rem] border p-5 lg:flex">
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

        <SidebarNav items={items} badges={resolvedBadges} />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleLogout}
          className="text-dash-muted group flex cursor-pointer items-center gap-2.5 rounded-2xl px-3 py-2 text-sm font-semibold transition-colors hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
        >
          <LogOut
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
          Keluar
        </button>
      </div>
    </aside>
  );
}

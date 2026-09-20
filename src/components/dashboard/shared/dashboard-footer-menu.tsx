import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { logoutUser } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { cn } from '@/lib/utils';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useSession } from '@/hooks/use-session';

import { ROLE_LABEL } from '@/constants/dashboard';

import { KeyRound, LogOut, UserRound } from 'lucide-react';

interface DashboardFooterMenuProps {
  align?: 'start' | 'end' | 'center';
  className?: string;
  onNavigate?: () => void;
}

export function DashboardFooterMenu({
  align = 'end',
  className,
  onNavigate,
}: DashboardFooterMenuProps) {
  const navigate = useNavigate();
  const { user, markAnonymous } = useSession();

  const fullName = user?.profile.full_name ?? user?.email ?? 'Pengguna';
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

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
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            'group hover:bg-dash-surface-2 flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition-colors focus:outline-none',
            className
          )}
        >
          <Avatar className="border-dash-border size-9 border">
            <AvatarFallback className="bg-dash-accent text-dash-accent-fg text-xs font-bold">
              {initials || <UserRound className="h-4 w-4" aria-hidden="true" />}
            </AvatarFallback>
          </Avatar>
          <span className="min-w-0 flex-1">
            <span className="text-dash-fg block truncate text-sm font-bold">{fullName}</span>
            <span className="text-dash-muted block truncate text-[11px] font-semibold">
              {user?.role ? ROLE_LABEL[user.role] : (user?.email ?? '-')}
            </span>
          </span>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={align}
          sideOffset={8}
          className="border-dash-border bg-dash-surface w-56 rounded-2xl p-1.5"
        >
          <div className="px-2 py-1.5">
            <p className="text-dash-fg truncate text-sm font-bold">{fullName}</p>
            <p className="text-dash-muted truncate text-[11px] font-medium">{user?.email}</p>
          </div>

          <DropdownMenuSeparator className="bg-dash-border" />

          <DropdownMenuItem
            className="text-dash-fg focus:bg-dash-surface-2 focus:text-dash-fg cursor-pointer rounded-xl px-2 py-2 font-semibold"
            render={<Link to="/dashboard/profile" onClick={onNavigate} />}
          >
            <UserRound className="h-4 w-4" aria-hidden="true" />
            Akun Saya
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-dash-fg focus:bg-dash-surface-2 focus:text-dash-fg cursor-pointer rounded-xl px-2 py-2 font-semibold"
            render={<Link to="/dashboard/password" onClick={onNavigate} />}
          >
            <KeyRound className="h-4 w-4" aria-hidden="true" />
            Ganti Password
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-dash-border" />

          <DropdownMenuItem
            variant="destructive"
            className="w-full cursor-pointer justify-start rounded-xl px-2 py-2 font-semibold"
            render={
              <AlertDialogTrigger>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Keluar
              </AlertDialogTrigger>
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent className="border-dash-border bg-dash-surface shadow-bento-lg rounded-[2rem] border">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle className="text-dash-fg text-lg font-bold tracking-tight">
            Keluar dari akun?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-dash-muted text-sm font-medium">
            Anda akan keluar dari sesi ini dan perlu masuk kembali untuk mengakses dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleLogout}>
            Keluar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

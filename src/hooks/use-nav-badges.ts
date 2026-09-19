import { useDashboard } from '@/hooks/use-dashboard';

export function useNavBadges(): Record<string, number> {
  const { registrations } = useDashboard();

  return {
    '/admin/pendaftaran': registrations.registrations.filter((item) => item.status === 'Menunggu')
      .length,
    '/dashboard/program-saya': registrations.myRegistrations.length,
  };
}

import type { UserGender } from '@/types/users';

export const GENDER_LABELS: Record<UserGender, string> = {
  male: 'Laki-laki',
  female: 'Perempuan',
};

export const GENDER_OPTIONS: { value: UserGender | 'all'; label: string }[] = [
  { value: 'all', label: 'Semua Gender' },
  { value: 'male', label: 'Laki-laki' },
  { value: 'female', label: 'Perempuan' },
];

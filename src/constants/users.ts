import type { UserGender } from '@/types/users';

export const GENDER_LABELS: Record<UserGender, string> = {
  male: 'Laki-laki',
  female: 'Perempuan',
};

export const GENDER_OPTIONS: { value: UserGender | null; label: string }[] = [
  { value: null, label: 'Semua Jenis Kelamin' },
  { value: 'male', label: 'Laki-laki' },
  { value: 'female', label: 'Perempuan' },
];

export const USER_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

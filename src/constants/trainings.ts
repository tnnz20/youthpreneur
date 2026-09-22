import type { EnrollmentStatus, TrainingCategory, TrainingStatus } from '@/types/trainings';

export const TRAINING_CATEGORIES = [
  'Wirausaha & Agribisnis',
  'Kriya & Kreativitas',
  'Digital & IPTEK',
  'Olahraga & Prestasi',
  'Komunitas & Pemuda',
] as const;

export const TRAINING_CATEGORY_OPTIONS: { value: TrainingCategory | null; label: string }[] = [
  { value: null, label: 'Semua Kategori' },
  ...TRAINING_CATEGORIES.map((category) => ({ value: category, label: category })),
];

export const TRAINING_STATUS_LABELS: Record<TrainingStatus, string> = {
  planned: 'Direncanakan',
  ongoing: 'Sedang Berjalan',
  completed: 'Selesai',
};

export const TRAINING_STATUS_OPTIONS: { value: TrainingStatus | null; label: string }[] = [
  { value: null, label: 'Semua Status' },
  { value: 'planned', label: 'Direncanakan' },
  { value: 'ongoing', label: 'Sedang Berjalan' },
  { value: 'completed', label: 'Selesai' },
];

export const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  pending: 'Menunggu Konfirmasi',
  accepted: 'Diterima',
  rejected: 'Ditolak',
};

export const ENROLLMENT_STATUS_OPTIONS: { value: EnrollmentStatus | null; label: string }[] = [
  { value: null, label: 'Semua Status Pendaftaran' },
  { value: 'pending', label: 'Menunggu Konfirmasi' },
  { value: 'accepted', label: 'Diterima' },
  { value: 'rejected', label: 'Ditolak' },
];

export const TRAINING_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

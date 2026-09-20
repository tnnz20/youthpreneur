import type {
  BusinessDigitization,
  BusinessSector,
  EnterpriseStatus,
  GeneralStatus,
  InterventionNeeds,
  LegalStatus,
  ProcessStatus,
} from '@/types/enterprises';

export const ENTERPRISE_STATUS_LABELS: Record<EnterpriseStatus, string> = {
  active: 'Aktif',
  inactive: 'Tidak Aktif',
};

export const ENTERPRISE_STATUS_OPTIONS: { value: EnterpriseStatus | null; label: string }[] = [
  { value: null, label: 'Semua Status' },
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Tidak Aktif' },
];

export const LEGAL_STATUS_LABELS: Record<LegalStatus, string> = {
  complete: 'Lengkap',
  in_progress: 'Dalam Proses',
  none: 'Belum Ada',
};

export const LEGAL_STATUS_OPTIONS: { value: LegalStatus | null; label: string }[] = [
  { value: null, label: 'Semua Legalitas' },
  { value: 'complete', label: 'Lengkap' },
  { value: 'in_progress', label: 'Dalam Proses' },
  { value: 'none', label: 'Belum Ada' },
];

export const BUSINESS_DIGITIZATION_LABELS: Record<BusinessDigitization, string> = {
  high: 'Tinggi',
  medium: 'Sedang',
  low: 'Rendah',
};

export const BUSINESS_DIGITIZATION_OPTIONS: {
  value: BusinessDigitization | null;
  label: string;
}[] = [
  { value: null, label: 'Semua Digitalisasi' },
  { value: 'high', label: 'Tinggi' },
  { value: 'medium', label: 'Sedang' },
  { value: 'low', label: 'Rendah' },
];

export const PROCESS_STATUS_LABELS: Record<ProcessStatus, string> = {
  completed: 'Selesai',
  ongoing: 'Sedang Berjalan',
  planned: 'Direncanakan',
};

export const PROCESS_STATUS_OPTIONS: { value: ProcessStatus | null; label: string }[] = [
  { value: null, label: 'Semua Status Proses' },
  { value: 'planned', label: 'Direncanakan' },
  { value: 'ongoing', label: 'Sedang Berjalan' },
  { value: 'completed', label: 'Selesai' },
];

export const GENERAL_STATUS_LABELS: Record<GeneralStatus, string> = {
  yes: 'Ya',
  no: 'Tidak',
  in_progress: 'Dalam Proses',
};

export const GENERAL_STATUS_OPTIONS: { value: GeneralStatus | null; label: string }[] = [
  { value: null, label: 'Semua Status' },
  { value: 'yes', label: 'Ya' },
  { value: 'no', label: 'Tidak' },
  { value: 'in_progress', label: 'Dalam Proses' },
];

export const BUSINESS_SECTOR_LABELS: Record<BusinessSector, string> = {
  Kuliner: 'Kuliner',
  'Perdagangan Ritel': 'Perdagangan Ritel',
  'Agribisnis & Ketahanan Pangan': 'Agribisnis & Ketahanan Pangan',
  'Jasa & Layanan Publik': 'Jasa & Layanan Publik',
  'Fashion & Konveksi': 'Fashion & Konveksi',
  'E-Commerce & Ekonomi Kreatif': 'E-Commerce & Ekonomi Kreatif',
};

export const BUSINESS_SECTOR_OPTIONS: { value: BusinessSector; label: string }[] = [
  { value: 'Kuliner', label: 'Kuliner' },
  { value: 'Perdagangan Ritel', label: 'Perdagangan Ritel' },
  { value: 'Agribisnis & Ketahanan Pangan', label: 'Agribisnis & Ketahanan Pangan' },
  { value: 'Jasa & Layanan Publik', label: 'Jasa & Layanan Publik' },
  { value: 'Fashion & Konveksi', label: 'Fashion & Konveksi' },
  { value: 'E-Commerce & Ekonomi Kreatif', label: 'E-Commerce & Ekonomi Kreatif' },
];

export const INTERVENTION_NEEDS_LABELS: Record<InterventionNeeds, string> = {
  Pelatihan: 'Pelatihan',
  Mentoring: 'Mentoring',
  Digitalisasi: 'Digitalisasi',
  Legalitas: 'Legalitas',
  Permodalan: 'Permodalan',
  Kemitraan: 'Kemitraan',
  Pemasaran: 'Pemasaran',
};

export const INTERVENTION_NEEDS_OPTIONS: {
  value: InterventionNeeds | null;
  label: string;
}[] = [
  { value: null, label: 'Pilih Kebutuhan Intervensi' },
  { value: 'Pelatihan', label: 'Pelatihan' },
  { value: 'Mentoring', label: 'Mentoring' },
  { value: 'Digitalisasi', label: 'Digitalisasi' },
  { value: 'Legalitas', label: 'Legalitas' },
  { value: 'Permodalan', label: 'Permodalan' },
  { value: 'Kemitraan', label: 'Kemitraan' },
  { value: 'Pemasaran', label: 'Pemasaran' },
];

export const ENTERPRISE_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

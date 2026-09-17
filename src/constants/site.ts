import type { NavLinkItem } from '@/types/site';

export const BRAND = {
  name: 'YOUTHPRENEUR',
  suffix: 'TAPIN',
  organizer: 'Dinas Pemuda dan Olahraga Kabupaten Tapin',
  slogan: 'Membangun Pemuda, Menggerakkan Kewirausahaan, Memajukan Tapin.',
  phone: '+62 821 7364 8887',
  email: 'youthpreneur@tapinkab.go.id',
  copyright: '© 2026 Dinas Pemuda dan Olahraga Kabupaten Tapin. YOUTHPRENEUR TAPIN.',
} as const;

export const NAV_LINKS: NavLinkItem[] = [
  { label: 'Beranda', to: '/' },
  { label: 'Kategori', to: '/#kategori' },
  { label: 'Mentor', to: '/#mentor' },
  { label: 'Database Pemuda', to: '/database' },
  { label: 'Tentang Kami', to: '/about' },
];

export const KECAMATAN = [
  'Tapin Utara',
  'Tapin Tengah',
  'Tapin Selatan',
  'Bakarangan',
  'Binuang',
  'Hatungun',
  'Lokpaikat',
  'Piani',
  'Salam Babaris',
  'Candi Laras Utara',
  'Candi Laras Selatan',
  'Bungur',
] as const;

import type {
  CurrentUser,
  DashboardStat,
  ProgramCategory,
  ProgramRegistration,
  ProgramStatus,
  RegistrationStatus,
  TrainingProgram,
} from '@/types/dashboard';

import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  UserRound,
  Users,
} from 'lucide-react';

export const PROGRAM_CATEGORY_OPTIONS: { value: ProgramCategory; label: string; badge: string }[] =
  [
    {
      value: 'Kewirausahaan',
      label: 'Wirausaha & Agribisnis',
      badge: 'bg-amber-400/20 text-amber-700 dark:text-amber-300',
    },
    {
      value: 'Kriya & Kreatif',
      label: 'Kriya & Kreativitas',
      badge: 'bg-violet-400/20 text-violet-700 dark:text-violet-300',
    },
    {
      value: 'Teknologi & Digital',
      label: 'Digital & IPTEK',
      badge: 'bg-sky-400/20 text-sky-700 dark:text-sky-300',
    },
    {
      value: 'Olahraga & Prestasi',
      label: 'Olahraga & Prestasi',
      badge: 'bg-emerald-400/20 text-emerald-700 dark:text-emerald-300',
    },
    {
      value: 'Sosial & Komunitas',
      label: 'Komunitas & Pemuda',
      badge: 'bg-rose-400/20 text-rose-700 dark:text-rose-300',
    },
  ];

export const PROGRAM_STATUS_OPTIONS: { value: ProgramStatus; label: string }[] = [
  { value: 'Dibuka', label: 'Pendaftaran Dibuka' },
  { value: 'Segera', label: 'Segera Hadir' },
  { value: 'Ditutup', label: 'Ditutup' },
];

export const REGISTRATION_STATUS_OPTIONS: { value: RegistrationStatus; label: string }[] = [
  { value: 'Menunggu', label: 'Menunggu Verifikasi' },
  { value: 'Disetujui', label: 'Disetujui' },
  { value: 'Ditolak', label: 'Ditolak' },
  { value: 'Selesai', label: 'Selesai' },
];

export const TRAINING_PROGRAMS: TrainingProgram[] = [
  {
    id: 'PRG-001',
    judul: 'Inkubasi Bisnis Cabai Hiyung',
    deskripsi:
      'Pendampingan intensif hulu-hilir komoditas cabai Hiyung: budidaya, pengolahan sambal, kemasan, hingga legalitas P-IRT dan NIB.',
    kategori: 'Kewirausahaan',
    mentor: 'Ir. Hamdani Yusuf',
    jadwal: '12 Feb 2026',
    durasi: '6 Pekan',
    lokasi: 'Balai Penyuluhan Tapin Selatan',
    kuota: 30,
    terdaftar: 24,
    status: 'Dibuka',
  },
  {
    id: 'PRG-002',
    judul: 'Digital Marketing untuk UMKM Pemuda',
    deskripsi:
      'Kelas praktik foto produk, copywriting, iklan TikTok Shop, dan pengelolaan toko daring untuk pemuda wirausaha Tapin.',
    kategori: 'Teknologi & Digital',
    mentor: 'Fajar Rahman',
    jadwal: '18 Feb 2026',
    durasi: '4 Pekan',
    lokasi: 'Ruhui Creative Studio Lokpaikat',
    kuota: 40,
    terdaftar: 37,
    status: 'Dibuka',
  },
  {
    id: 'PRG-003',
    judul: 'Kriya Anyaman Purun Ekspor',
    deskripsi:
      'Pelatihan desain tas dan produk purun berstandar ekspor, termasuk ecoprint dan teknik pewarnaan alami.',
    kategori: 'Kriya & Kreatif',
    mentor: 'Muhammad Zaini',
    jadwal: '25 Feb 2026',
    durasi: '8 Pekan',
    lokasi: 'Sanggar Purun Bakarangan',
    kuota: 25,
    terdaftar: 25,
    status: 'Ditutup',
  },
  {
    id: 'PRG-004',
    judul: 'Sekolah Mekanik & Manajemen Tim Balap',
    deskripsi:
      'Pembinaan atlet dan mekanik muda sirkuit Balipat: perawatan motor, keselamatan lintasan, dan manajemen tim.',
    kategori: 'Olahraga & Prestasi',
    mentor: 'Rizky Pratama',
    jadwal: '2 Mar 2026',
    durasi: '10 Pekan',
    lokasi: 'Sirkuit Balipat Binuang',
    kuota: 20,
    terdaftar: 9,
    status: 'Segera',
  },
  {
    id: 'PRG-005',
    judul: 'Budidaya Madu Kelulut Meratus',
    deskripsi:
      'Teknik budidaya lebah trigona tanpa sengat, panen higienis, dan pemasaran madu ke rantai retail modern.',
    kategori: 'Kewirausahaan',
    mentor: 'Ahmad Baihaki',
    jadwal: '9 Mar 2026',
    durasi: '5 Pekan',
    lokasi: 'Kawasan Bendungan Tapin, Piani',
    kuota: 25,
    terdaftar: 14,
    status: 'Dibuka',
  },
  {
    id: 'PRG-006',
    judul: 'Manajemen Wisata Rawa Berbasis Komunitas',
    deskripsi:
      'Pengelolaan paket wisata susur rawa, konservasi burung air, dan standar pelayanan pemandu wisata lokal.',
    kategori: 'Sosial & Komunitas',
    mentor: 'Wahyu Ramadhan',
    jadwal: '16 Mar 2026',
    durasi: '4 Pekan',
    lokasi: 'Candi Laras Selatan',
    kuota: 30,
    terdaftar: 11,
    status: 'Dibuka',
  },
  {
    id: 'PRG-007',
    judul: 'Roasting & Bisnis Kopi Spesialti',
    deskripsi:
      'Kurikulum profil roasting, kontrol kualitas, penyeduhan, dan strategi penetapan harga kopi spesialti Tapin.',
    kategori: 'Kewirausahaan',
    mentor: 'Noor Latifah',
    jadwal: '23 Mar 2026',
    durasi: '3 Pekan',
    lokasi: 'Kebun Kopi Hatungun',
    kuota: 20,
    terdaftar: 20,
    status: 'Ditutup',
  },
  {
    id: 'PRG-008',
    judul: 'Fotografi Produk & Konten Kreator',
    deskripsi:
      'Dasar pencahayaan, komposisi, editing, hingga produksi konten video pendek untuk promosi produk pemuda.',
    kategori: 'Teknologi & Digital',
    mentor: 'Maulida Hasanah',
    jadwal: '30 Mar 2026',
    durasi: '3 Pekan',
    lokasi: 'Rantau Digital Hub, Tapin Utara',
    kuota: 35,
    terdaftar: 18,
    status: 'Segera',
  },
];

export const CURRENT_USER: CurrentUser = {
  nama: 'Ahmad Fauzi',
  usaha: 'Kripik Cabai Hiyung Fauzi',
  kecamatan: 'Tapin Selatan',
  kategori: 'Kewirausahaan',
  kontak: '0812-3456-7890',
  produk: 'Keripik & Abon Cabai Hiyung Kemasan',
  deskripsi:
    'Usaha olahan cabai Hiyung skala rumahan yang sedang mengurus sertifikasi P-IRT dan perluasan pemasaran daring.',
  statusNib: 'Proses',
  kelengkapan: 72,
};

export const PROGRAM_REGISTRATIONS: ProgramRegistration[] = [
  {
    id: 'REG-001',
    programId: 'PRG-001',
    programJudul: 'Inkubasi Bisnis Cabai Hiyung',
    nama: 'Ahmad Fauzi',
    kecamatan: 'Tapin Selatan',
    kontak: '0812-3456-7890',
    tanggal: '3 Feb 2026',
    status: 'Disetujui',
  },
  {
    id: 'REG-002',
    programId: 'PRG-002',
    programJudul: 'Digital Marketing untuk UMKM Pemuda',
    nama: 'Ahmad Fauzi',
    kecamatan: 'Tapin Selatan',
    kontak: '0812-3456-7890',
    tanggal: '5 Feb 2026',
    status: 'Menunggu',
  },
  {
    id: 'REG-003',
    programId: 'PRG-005',
    programJudul: 'Budidaya Madu Kelulut Meratus',
    nama: 'Ahmad Fauzi',
    kecamatan: 'Tapin Selatan',
    kontak: '0812-3456-7890',
    tanggal: '7 Feb 2026',
    status: 'Selesai',
  },
  {
    id: 'REG-004',
    programId: 'PRG-002',
    programJudul: 'Digital Marketing untuk UMKM Pemuda',
    nama: 'Siti Rahmah',
    kecamatan: 'Tapin Selatan',
    kontak: '0812-5544-1234',
    tanggal: '6 Feb 2026',
    status: 'Disetujui',
  },
  {
    id: 'REG-005',
    programId: 'PRG-003',
    programJudul: 'Kriya Anyaman Purun Ekspor',
    nama: 'Muhammad Zaini',
    kecamatan: 'Bakarangan',
    kontak: '0852-8921-8765',
    tanggal: '6 Feb 2026',
    status: 'Disetujui',
  },
  {
    id: 'REG-006',
    programId: 'PRG-004',
    programJudul: 'Sekolah Mekanik & Manajemen Tim Balap',
    nama: 'Rizky Pratama',
    kecamatan: 'Binuang',
    kontak: '0821-9988-3456',
    tanggal: '8 Feb 2026',
    status: 'Menunggu',
  },
  {
    id: 'REG-007',
    programId: 'PRG-001',
    programJudul: 'Inkubasi Bisnis Cabai Hiyung',
    nama: 'Nabila Ananda',
    kecamatan: 'Tapin Utara',
    kontak: '0813-7766-5544',
    tanggal: '9 Feb 2026',
    status: 'Menunggu',
  },
  {
    id: 'REG-008',
    programId: 'PRG-006',
    programJudul: 'Manajemen Wisata Rawa Berbasis Komunitas',
    nama: 'Wahyu Ramadhan',
    kecamatan: 'Candi Laras Selatan',
    kontak: '0812-4455-6677',
    tanggal: '9 Feb 2026',
    status: 'Disetujui',
  },
  {
    id: 'REG-009',
    programId: 'PRG-002',
    programJudul: 'Digital Marketing untuk UMKM Pemuda',
    nama: 'Fajar Rahman',
    kecamatan: 'Lokpaikat',
    kontak: '0857-4433-2211',
    tanggal: '10 Feb 2026',
    status: 'Ditolak',
  },
  {
    id: 'REG-010',
    programId: 'PRG-007',
    programJudul: 'Roasting & Bisnis Kopi Spesialti',
    nama: 'Noor Latifah',
    kecamatan: 'Hatungun',
    kontak: '0853-2211-7788',
    tanggal: '10 Feb 2026',
    status: 'Disetujui',
  },
  {
    id: 'REG-011',
    programId: 'PRG-008',
    programJudul: 'Fotografi Produk & Konten Kreator',
    nama: 'Maulida Hasanah',
    kecamatan: 'Tapin Utara',
    kontak: '0811-9988-7766',
    tanggal: '11 Feb 2026',
    status: 'Menunggu',
  },
  {
    id: 'REG-012',
    programId: 'PRG-005',
    programJudul: 'Budidaya Madu Kelulut Meratus',
    nama: 'Ahmad Baihaki',
    kecamatan: 'Piani',
    kontak: '0878-1122-3344',
    tanggal: '11 Feb 2026',
    status: 'Selesai',
  },
  {
    id: 'REG-013',
    programId: 'PRG-004',
    programJudul: 'Sekolah Mekanik & Manajemen Tim Balap',
    nama: 'Dedi Irawan',
    kecamatan: 'Salam Babaris',
    kontak: '0896-5544-1122',
    tanggal: '12 Feb 2026',
    status: 'Menunggu',
  },
  {
    id: 'REG-014',
    programId: 'PRG-008',
    programJudul: 'Fotografi Produk & Konten Kreator',
    nama: 'Gusti Ayu Maulida',
    kecamatan: 'Candi Laras Utara',
    kontak: '0822-6677-8899',
    tanggal: '12 Feb 2026',
    status: 'Ditolak',
  },
];

export const DASHBOARD_STATS: DashboardStat[] = [
  { label: 'Total Pemuda Terdata', value: '1.284', detail: '+38 bulan ini', tone: 'yellow' },
  { label: 'Program Pelatihan Aktif', value: '8', detail: '3 segera dibuka', tone: 'purple' },
  { label: 'Pendaftaran Menunggu', value: '5', detail: 'Perlu verifikasi', tone: 'peach' },
  { label: 'Pemuda Punya NIB', value: '412', detail: '32% dari total', tone: 'mint' },
];

export const ADMIN_NAV: { label: string; to: string; icon: LucideIcon }[] = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Data Pemuda', to: '/admin/pemuda', icon: Users },
  { label: 'Program Pelatihan', to: '/admin/program', icon: BookOpen },
  { label: 'Pendaftaran', to: '/admin/pendaftaran', icon: ClipboardCheck },
];

export const USER_NAV: { label: string; to: string; icon: LucideIcon }[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Katalog Program', to: '/dashboard/program', icon: GraduationCap },
  { label: 'Program Saya', to: '/dashboard/program-saya', icon: ClipboardList },
  { label: 'Profil Usaha', to: '/dashboard/profil', icon: UserRound },
];

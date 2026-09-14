import type { Benefit, DatasetRow, ProfileRole, Stakeholder } from '@/types/about';

import {
  Banknote,
  BookOpen,
  Briefcase,
  Coins,
  Dumbbell,
  GraduationCap,
  Handshake,
  Landmark,
  Lightbulb,
  Medal,
  Megaphone,
  Sprout,
  Trophy,
  UserRound,
} from 'lucide-react';

export const PROFILE_ROLES: ProfileRole[] = [
  {
    icon: Medal,
    title: 'Pemberdayaan & Potensi Pemuda',
    description:
      'Mengembangkan bakat, kreativitas, wawasan kebangsaan, dan kapasitas generasi penerus Tapin.',
    tag: 'Potensi Generasi',
    tagColor: 'text-amber-800',
    iconBg: 'bg-brand-yellow',
  },
  {
    icon: Trophy,
    title: 'Pembinaan Prestasi Olahraga',
    description:
      'Pembibitan atlet muda daerah berjenjang dan pemajuan budaya hidup aktif masyarakat Tapin.',
    tag: 'Prestasi & Sport',
    tagColor: 'text-blue-800',
    iconBg: 'bg-brand-blue',
  },
  {
    icon: Lightbulb,
    title: 'Kepemimpinan & Wirausaha',
    description:
      'Menumbuhkan jiwa kepemimpinan mandiri, literasi digital, dan wirausaha muda berbasis komoditas.',
    tag: 'Kemandirian Usaha',
    tagColor: 'text-purple-800',
    iconBg: 'bg-brand-purple',
  },
  {
    icon: Handshake,
    title: 'Pelayanan Kepemudaan',
    description:
      'Pelayanan prima, fasilitasi legalitas, beasiswa kepemudaan, dan advokasi kemitraan strategis.',
    tag: 'Layanan Prima',
    tagColor: 'text-emerald-800',
    iconBg: 'bg-brand-mint',
  },
  {
    icon: Dumbbell,
    title: 'Sarana & Prasarana',
    description:
      'Pengelolaan dan optimalisasi fasilitas olahraga, ruang kreasi, dan gelanggang pemuda daerah.',
    tag: 'Infrastruktur',
    tagColor: 'text-rose-800',
    iconBg: 'bg-brand-peach',
  },
];

export const DATASET_ROWS: DatasetRow[] = [
  { label: 'Pendataan Potensi & Minat Usaha', status: 'Terverifikasi', color: 'text-emerald-700' },
  { label: 'Pemetaan Komoditas 12 Kecamatan', status: 'Real-Time', color: 'text-blue-700' },
  {
    label: 'Rekam Jejak Pelatihan & Sertifikasi',
    status: 'Terintegrasi',
    color: 'text-purple-700',
  },
  { label: 'Katalog Promosi & Showcase Produk', status: 'Akses Publik', color: 'text-amber-700' },
];

export const BENEFITS: Benefit[] = [
  {
    icon: BookOpen,
    title: 'Ruang Belajar',
    description: 'Modul bisnis praktis, inkubasi, dan literasi teknologi terkini.',
    color: 'bg-brand-yellow',
  },
  {
    icon: Sprout,
    title: 'Ruang Berkembang',
    description: 'Pendampingan mentor teruji untuk peningkatan mutu komoditas.',
    color: 'bg-brand-blue',
  },
  {
    icon: Handshake,
    title: 'Ruang Berkolaborasi',
    description: 'Jejaring kemitraan lintas komunitas pemuda dan pelaku usaha.',
    color: 'bg-brand-purple',
  },
  {
    icon: Megaphone,
    title: 'Promosikan Usaha',
    description: 'Showcase digital, etalase produk, dan peluang kurasi pameran.',
    color: 'bg-brand-peach',
  },
  {
    icon: Coins,
    title: 'Ciptakan Peluang Ekonomi',
    description:
      'Membuka akses pembiayaan, perluasan pasar komoditas Tapin, dan kemandirian ekonomi pemuda.',
    color: 'bg-brand-mint',
    wide: true,
  },
];

export const STAKEHOLDERS: Stakeholder[] = [
  {
    icon: Landmark,
    title: 'Pemerintah',
    description: 'Regulasi & Fasilitasi Kebijakan',
    color: 'bg-brand-yellow',
  },
  {
    icon: UserRound,
    title: 'Pemuda',
    description: 'Aktor Utama & Penggerak Inovasi',
    color: 'bg-brand-blue',
  },
  {
    icon: Handshake,
    title: 'Komunitas',
    description: 'Kreativitas & Solidaritas Pemuda',
    color: 'bg-brand-purple',
  },
  {
    icon: Briefcase,
    title: 'Dunia Usaha',
    description: 'Akses Pasar & Akselerasi Mentor',
    color: 'bg-brand-peach',
  },
  {
    icon: GraduationCap,
    title: 'Perguruan Tinggi',
    description: 'Riset, IPTEK & Alih Keterampilan',
    color: 'bg-brand-mint',
  },
  {
    icon: Banknote,
    title: 'Lembaga Keuangan',
    description: 'Akses Permodalan & Pembiayaan',
    color: 'bg-amber-200',
  },
  {
    icon: Sprout,
    title: 'Mitra Pembangunan',
    description: 'Program CSR & Mitra Daerah',
    color: 'bg-sky-200',
    wide: true,
  },
];

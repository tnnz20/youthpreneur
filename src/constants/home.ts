import type {
  Article,
  Category,
  Course,
  Feature,
  Mentor,
  Metric,
  Official,
  Testimonial,
} from '@/types/home';

import { BookOpen, Compass, Megaphone, Store, Users, Video } from 'lucide-react';

export const METRICS: Metric[] = [
  { value: '15k+', label: 'Pemuda Lulus Pelatihan' },
  { value: '8+', label: 'Tahun Membina Daerah' },
  { value: '450+', label: 'UMKM Binaan Naik Kelas' },
  { value: '38', label: 'Provinsi Terjangkau' },
];

export const FEATURES: Feature[] = [
  {
    title: 'Mentor Praktisi Berpengalaman',
    description: '300+ Pengusaha daerah sukses memandu langsung',
    icon: Store,
    color: 'bg-blue-600',
  },
  {
    title: 'Kelas Live Interaktif & Praktek',
    description: 'Bukan sekadar teori, langsung kurasi produk & legalitas',
    icon: Video,
    color: 'bg-sky-500',
  },
  {
    title: 'Akses Komunitas & Pembiayaan',
    description: 'Koneksi perbankan, angel investor & pameran dagang',
    icon: Users,
    color: 'bg-rose-400',
  },
];

export const CATEGORIES: Category[] = [
  {
    name: 'Agribisnis & Pangan',
    subtitle: 'Kopi, Rempah, Hortikultura',
    color: 'bg-brand-purple',
    icon: BookOpen,
  },
  {
    name: 'Kriya & Seni Etnik',
    subtitle: 'Batik, Tenun, Anyaman Bambu',
    color: 'bg-brand-blue',
    icon: Store,
  },
  {
    name: 'Kuliner & Oleh-Oleh',
    subtitle: 'Snack Kering, Frozen Food, Minuman',
    color: 'bg-brand-peach',
    icon: Megaphone,
  },
  {
    name: 'Digital & Jasa Wisata',
    subtitle: 'Desa Wisata, Agensi Kreatif Lokal',
    color: 'bg-brand-yellow',
    icon: Compass,
  },
];

export const COURSES: Course[] = [
  {
    title: 'Digital Marketing & TikTok Shop untuk Produk Olahan Lokal',
    mentor: 'Mentor: Dimas Anggoro (Praktisi F&B)',
    image:
      'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://placehold.co/400x300/FEE78A/141416?text=Digital+Marketing',
    rating: '5.0',
    stars: 5,
    reviews: '24,410',
    slotAvailable: true,
    bestSeller: true,
  },
  {
    title: 'Desain Kemasan Modern & Strategi Masuk Ritel Modern',
    mentor: 'Mentor: Maya Larasati (Brand Director)',
    image:
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://placehold.co/400x300/DDD6FE/141416?text=Branding+Desain',
    rating: '4.8',
    stars: 4,
    reviews: '18,340',
    slotAvailable: false,
  },
  {
    title: 'Manajemen Rantai Pasok Kopi & Rempah Desa Berkelanjutan',
    mentor: 'Mentor: Hendra Ginting (Agronomis)',
    image:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://placehold.co/400x300/BAE6FD/141416?text=Agribisnis+Kopi',
    rating: '4.9',
    stars: 5,
    reviews: '35,110',
    slotAvailable: true,
  },
  {
    title: 'Pencatatan Keuangan Digital & Akses Modal Usaha KUR',
    mentor: 'Mentor: Budi Wicaksono (Konsultan Finansial)',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://placehold.co/400x300/FECDD3/141416?text=Keuangan+UMKM',
    rating: '4.9',
    stars: 5,
    reviews: '19,700',
    slotAvailable: false,
    bestSeller: true,
  },
];

export const MENTORS: Mentor[] = [
  {
    name: 'Bagas Pratama',
    role: 'Founder Keripik Singkong Jawa',
    rating: '5.0',
    mentees: '(75.8k binaan)',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    fallback: 'https://placehold.co/200x200/FEE78A/141416?text=Bagas',
    rim: 'bg-amber-200',
  },
  {
    name: 'Theresia Wulandari',
    role: 'Konsultan Ekspor Komoditas Kopi',
    rating: '4.9',
    mentees: '(116.6k binaan)',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    fallback: 'https://placehold.co/200x200/BAE6FD/141416?text=Theresia',
    rim: 'bg-sky-200',
  },
  {
    name: 'Lestari Alexander',
    role: 'Spesialis Live TikTok & E-Commerce',
    rating: '4.8',
    mentees: '(125.8k binaan)',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    fallback: 'https://placehold.co/200x200/FECDD3/141416?text=Lestari',
    rim: 'bg-pink-200',
  },
  {
    name: 'Darmawan Santoso',
    role: 'Praktisi Keuangan & Legalitas NIB/PIRT',
    rating: '5.0',
    mentees: '(176.8k binaan)',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    fallback: 'https://placehold.co/200x200/FEE78A/141416?text=Darmawan',
    rim: 'bg-amber-300',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Faris Hidayat',
    origin: 'Alumni Asal Brebes',
    quote:
      '"Sebelumnya bawang merah di kampung kami selalu anjlok saat panen raya. Melalui pelatihan pengolahan pasta bawang & pemasaran online di YOUTHPRENEUR TAPIN, kini kami mempekerjakan 18 ibu rumah tangga dan tembus supermarket!"',
    image:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    fallback: 'https://placehold.co/100x100/141416/FFFFFF?text=Faris',
  },
  {
    name: 'Nurfida Safitri',
    origin: 'Alumni Asal Toraja',
    quote:
      '"Modul branding dan digital storytelling sangat mengubah cara kami menjual kopi Toraja secara D2C. Kami belajar legalitas ekspor sampai akhirnya dapat kontrak buyer dari Singapura. Sangat direkomendasikan!"',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    fallback: 'https://placehold.co/100x100/141416/FFFFFF?text=Nurfida',
  },
];

export const ARTICLES: Article[] = [
  {
    title: '10 Realitas yang Wajib Diketahui Pemuda Sebelum Memulai Bisnis di Daerah',
    modalTitle: 'Artikel: 10 Fakta Memulai Bisnis di Luar Kota Besar',
    date: '04/10/2026',
    readTime: '7 menit baca',
    image:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://placehold.co/400x250/141416/FFFFFF?text=Artikel+Bisnis',
  },
  {
    title: 'Panduan Lengkap Mengurus NIB, P-IRT, & Sertifikasi Halal Gratis 2026',
    modalTitle: 'Artikel: Panduan NIB & Sertifikasi Halal Gratis',
    date: '12/09/2026',
    readTime: '5 menit baca',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://placehold.co/400x250/141416/FFFFFF?text=Panduan+Legalitas',
  },
  {
    title: 'Temukan Potensi Komoditas Desa yang Paling Diminati Pasar Luar Negeri',
    modalTitle: 'Artikel: Komoditas Desa yang Laris Manis di Luar Negeri',
    date: '19/08/2026',
    readTime: '6 menit baca',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://placehold.co/400x250/141416/FFFFFF?text=Ekspor+Komoditas',
  },
];

export const OFFICIALS: Official[] = [
  {
    name: 'H. Yamani',
    role: 'Bupati Tapin',
    image: '/assets/bupati.webp',
    accentColor: 'bg-brand-yellow',
    badgeVariant: 'neoYellow',
  },
  {
    name: 'H. Juanda',
    role: 'Wakil Bupati Tapin',
    image: '/assets/wakil-bupati.webp',
    accentColor: 'bg-brand-blue',
    badgeVariant: 'neoMint',
  },
];

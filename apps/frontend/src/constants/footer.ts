import type { FooterColumn, SocialLink } from '@/types/footer';

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Menu',
    links: [
      { label: 'Kategori Usaha', to: '/#kategori' },
      { label: 'Program Pelatihan', to: '/#kursus' },
    ],
    actions: [
      {
        label: 'Beasiswa Pemuda',
        modalTitle: 'Program Beasiswa Daerah',
        modalDescription: 'Ikuti seleksi beasiswa pelatihan wirausaha pemuda Kabupaten Tapin.',
      },
      {
        label: 'Sertifikasi BNSP',
        modalTitle: 'Sertifikasi Resmi',
        modalDescription: 'Dapatkan sertifikasi kompetensi resmi untuk memperkuat usaha Anda.',
      },
    ],
  },
  {
    title: 'Program',
    links: [
      { label: 'Tentang Kami', to: '/about' },
      { label: 'Kabar Daerah', to: '/#blog' },
      { label: 'Jadi Mentor', to: '/#mentor' },
    ],
    actions: [
      {
        label: 'Mitra Pemda & CSR',
        modalTitle: 'Kemitraan Pemda & CSR',
        modalDescription: 'Sinergikan program CSR dan kemitraan daerah bersama Dispora Tapin.',
      },
    ],
  },
];

export const SOCIALS: SocialLink[] = [
  { label: 'Facebook', short: 'f' },
  { label: 'Instagram', short: 'ig' },
  { label: 'LinkedIn', short: 'in' },
  { label: 'YouTube', short: 'yt' },
];

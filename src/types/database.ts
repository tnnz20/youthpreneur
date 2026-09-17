export type YouthCategory =
  | 'Kewirausahaan'
  | 'Kriya & Kreatif'
  | 'Teknologi & Digital'
  | 'Olahraga & Prestasi'
  | 'Sosial & Komunitas';

export type YouthStatus = 'Binaan Aktif' | 'Memiliki NIB' | 'Juara Daerah';

export interface YouthProfile {
  id: string;
  nama: string;
  usaha: string;
  kecamatan: string;
  kategori: YouthCategory;
  status: YouthStatus;
  badgeColor: string;
  icon: string;
  produk: string;
  deskripsi: string;
  kontak: string;
}

export interface CategoryOption {
  value: string;
  label: string;
  hover: string;
}

export interface StatusOption {
  value: string;
  label: string;
}

export interface KecamatanInfo {
  name: string;
  focus: string;
  description: string;
  count: string;
  dot: string;
  accent: string;
}

export interface SectorStat {
  label: string;
  value: number;
  detail: string;
  bar: string;
}

export interface NewYouthProfile {
  nama: string;
  kecamatan: string;
  kategori: YouthCategory;
  usaha: string;
  kontak: string;
  deskripsi: string;
}

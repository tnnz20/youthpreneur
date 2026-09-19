export type ProgramCategory =
  | 'Kewirausahaan'
  | 'Kriya & Kreatif'
  | 'Teknologi & Digital'
  | 'Olahraga & Prestasi'
  | 'Sosial & Komunitas';

export type ProgramStatus = 'Dibuka' | 'Segera' | 'Ditutup';

export type RegistrationStatus = 'Menunggu' | 'Disetujui' | 'Ditolak' | 'Selesai';

export interface TrainingProgram {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: ProgramCategory;
  mentor: string;
  jadwal: string;
  durasi: string;
  lokasi: string;
  kuota: number;
  terdaftar: number;
  status: ProgramStatus;
}

export interface ProgramRegistration {
  id: string;
  programId: string;
  programJudul: string;
  nama: string;
  kecamatan: string;
  kontak: string;
  tanggal: string;
  status: RegistrationStatus;
}

export interface CurrentUser {
  nama: string;
  usaha: string;
  kecamatan: string;
  kategori: ProgramCategory;
  kontak: string;
  produk: string;
  deskripsi: string;
  statusNib: 'Sudah' | 'Proses' | 'Belum';
  kelengkapan: number;
}

export type StatTone = 'yellow' | 'purple' | 'blue' | 'mint' | 'peach';

export interface DashboardStat {
  label: string;
  value: string;
  detail: string;
  tone: StatTone;
}

export interface NewTrainingProgram {
  judul: string;
  deskripsi: string;
  kategori: ProgramCategory;
  mentor: string;
  jadwal: string;
  durasi: string;
  lokasi: string;
  kuota: number;
  status: ProgramStatus;
}

import { DateTime } from 'luxon';

import { API_BASE_URL } from '@/lib/api/client';

export { cn } from 'cn';

export function resolveImageUrl(url: string | null | undefined): string {
  if (!url || !url.trim()) return '';
  const trimmed = url.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }
  const base = API_BASE_URL.replace(/\/+$/, '');
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${base}${path}`;
}

export function formatUnixDateTime(value: number): string {
  return DateTime.fromSeconds(value).setLocale('id').toFormat('dd LLL yyyy, HH:mm');
}

export function formatDateOnly(value: string): string {
  return DateTime.fromISO(value).setLocale('id').toFormat('dd LLL yyyy');
}

export function renderValue(value: string | null | undefined): string {
  return value ? value : '—';
}

export function formatCurrency(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }
  const num = Number(value);
  if (Number.isNaN(num)) {
    return String(value);
  }
  return `Rp ${num.toLocaleString('id-ID')}`;
}

const ERROR_TRANSLATIONS: [RegExp, string][] = [
  // Network
  [
    /failed to fetch|network\s*error|load failed|network request failed/i,
    'Gagal terhubung ke server. Periksa koneksi internet Anda.',
  ],

  // Auth
  [/invalid email or password|invalid credentials/i, 'Email atau kata sandi tidak valid.'],
  [
    /missing, invalid, or expired access token|invalid or expired token|token expired|invalid token|^unauthorized$/i,
    'Sesi Anda telah berakhir. Silakan masuk kembali.',
  ],
  [/user is inactive|account is inactive|inactive user/i, 'Akun Anda sedang dinonaktifkan.'],
  [
    /^forbidden$|insufficient permission|access denied/i,
    'Anda tidak memiliki izin untuk melakukan aksi ini.',
  ],

  // Training & Enrollment
  [
    /already enrolled|already registered|active enrollment/i,
    'Anda sudah terdaftar dalam pelatihan ini.',
  ],
  [/catalog is full|catalog full/i, 'Kuota pendaftaran pelatihan sudah penuh.'],
  [
    /catalog is completed|catalog is closed|catalog completed|training is completed/i,
    'Program pelatihan ini telah selesai atau ditutup.',
  ],
  [
    /only member can enroll|non-member users cannot enroll|user is not a member/i,
    'Hanya akun pemuda (member) yang dapat mendaftar pelatihan.',
  ],
  [/catalog not found|catalog does not exist/i, 'Program pelatihan tidak ditemukan.'],
  [/enrollment not found/i, 'Data pendaftaran pelatihan tidak ditemukan.'],
  [/enrollment.*(cancelled|not active)/i, 'Pendaftaran sudah dibatalkan atau tidak aktif.'],

  // Enterprises & Users
  [/enterprise not found/i, 'Data wirausaha tidak ditemukan.'],
  [/user not found/i, 'Pengguna tidak ditemukan.'],
  [
    /email already registered|email already exists|email already in use/i,
    'Email ini sudah terdaftar. Silakan gunakan email lain.',
  ],

  // General HTTP & Validation
  [
    /too many requests|rate limit exceeded/i,
    'Terlalu banyak permintaan. Silakan coba beberapa saat lagi.',
  ],
  [
    /internal server error|database error/i,
    'Terjadi gangguan pada server. Silakan coba lagi nanti.',
  ],
  [/^conflict$/i, 'Data yang dimasukkan mengalami konflik dengan data yang sudah ada.'],
  [/^not found$/i, 'Data tidak ditemukan.'],
  [
    /^bad request$|invalid request payload|invalid json|invalid request/i,
    'Permintaan tidak valid. Silakan periksa kembali data Anda.',
  ],
  [/password must contain/i, 'Kata sandi harus terdiri dari 8 hingga 72 karakter.'],
  [/birth_date cannot be in the future/i, 'Tanggal lahir tidak boleh di masa mendatang.'],
];

export function toErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Terjadi kesalahan yang tidak diketahui.';
  }

  const rawMessage = error.message.trim();
  for (const [pattern, translation] of ERROR_TRANSLATIONS) {
    if (pattern.test(rawMessage)) {
      return translation;
    }
  }

  return rawMessage || 'Terjadi kesalahan yang tidak diketahui.';
}

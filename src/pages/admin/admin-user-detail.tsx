import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router';

import { getUser } from '@/lib/api/users';
import { formatUnixDateTime } from '@/lib/utils';

import { Button } from '@/components/ui/button';

import type { User } from '@/types/users';

import { ArrowLeft, LoaderCircle } from 'lucide-react';

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento p-6';

const LABEL_CLASS = 'text-dash-muted text-[11px] font-semibold tracking-wide uppercase';

const VALUE_CLASS = 'text-dash-fg mt-1 text-sm font-semibold';

const GENDER_LABELS: Record<string, string> = {
  male: 'Laki-laki',
  female: 'Perempuan',
};

function renderValue(value: string | null | undefined) {
  return value ? value : '—';
}

export default function AdminUserDetailPage() {
  const { publicId } = useParams<{ publicId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicId) {
      return;
    }

    getUser(publicId)
      .then((result) => {
        setUser(result);
        setError(null);
        setLoading(false);
      })
      .catch((loadError: unknown) => {
        setUser(null);
        setError(
          loadError instanceof Error ? loadError.message : 'Terjadi kesalahan yang tidak diketahui.'
        );
        setLoading(false);
      });
  }, [publicId]);

  const backButton = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => navigate('/dashboard/users')}
      className="border-dash-border rounded-full"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Kembali
    </Button>
  );

  if (loading) {
    return (
      <div className={`${CARD} flex items-center justify-center gap-3`}>
        <LoaderCircle className="text-dash-fg h-5 w-5 animate-spin" aria-hidden="true" />
        <span className="text-dash-muted text-sm font-semibold">Memuat pengguna...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={`${CARD} space-y-4 text-center`}>
        <h1 className="text-dash-fg text-xl font-extrabold">Gagal Memuat Pengguna</h1>
        <p className="text-dash-muted text-sm">{error ?? 'Pengguna tidak ditemukan.'}</p>
        {backButton}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-dash-fg text-2xl font-extrabold tracking-tight sm:text-3xl">
            Detail Pengguna
          </h1>
          <p className="text-dash-muted mt-0.5 text-xs font-medium sm:text-sm">{user.email}</p>
        </div>
        {backButton}
      </div>

      <div className={CARD}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className={LABEL_CLASS}>Nama Lengkap</p>
            <p className={VALUE_CLASS}>{renderValue(user.profile?.full_name)}</p>
          </div>
          <div>
            <p className={LABEL_CLASS}>Email</p>
            <p className={VALUE_CLASS}>{user.email}</p>
          </div>
          <div>
            <p className={LABEL_CLASS}>Status</p>
            <p className={VALUE_CLASS}>{user.is_active ? 'Aktif' : 'Non Aktif'}</p>
          </div>
          <div>
            <p className={LABEL_CLASS}>NIK</p>
            <p className={VALUE_CLASS}>{renderValue(user.profile?.nik)}</p>
          </div>
          <div>
            <p className={LABEL_CLASS}>Gender</p>
            <p className={VALUE_CLASS}>
              {user.profile?.gender ? GENDER_LABELS[user.profile.gender] : '—'}
            </p>
          </div>
          <div>
            <p className={LABEL_CLASS}>Kecamatan</p>
            <p className={VALUE_CLASS}>{renderValue(user.profile?.district)}</p>
          </div>
          <div>
            <p className={LABEL_CLASS}>Telepon</p>
            <p className={VALUE_CLASS}>{renderValue(user.profile?.phone)}</p>
          </div>
          <div>
            <p className={LABEL_CLASS}>Terakhir Diperbarui</p>
            <p className={VALUE_CLASS}>{formatUnixDateTime(user.updated_at)}</p>
          </div>
          <div className="sm:col-span-2">
            <p className={LABEL_CLASS}>Alamat</p>
            <p className={VALUE_CLASS}>{renderValue(user.profile?.address)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

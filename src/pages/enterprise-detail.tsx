import { useCallback, useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router';

import { getEnterprise } from '@/lib/api/enterprises';
import { cn, formatCurrency, formatUnixDateTime, renderValue, toErrorMessage } from '@/lib/utils';

import { StatusBadge } from '@/components/dashboard/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { Enterprise } from '@/types/enterprises';

import {
  BUSINESS_DIGITIZATION_LABELS,
  ENTERPRISE_STATUS_LABELS,
  GENERAL_STATUS_LABELS,
  INTERVENTION_NEEDS_LABELS,
  LEGAL_STATUS_LABELS,
  PROCESS_STATUS_LABELS,
} from '@/constants/enterprises';

import { ArrowLeft, Building2, LoaderCircle } from 'lucide-react';

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento ring-0 p-6';
const LABEL_CLASS = 'text-dash-muted text-[11px] font-semibold tracking-wide uppercase';
const VALUE_CLASS = 'text-dash-fg mt-1 text-sm font-semibold';

export default function EnterpriseDetailPage() {
  const { publicId } = useParams<{ publicId: string }>();
  const navigate = useNavigate();
  const [enterprise, setEnterprise] = useState<Enterprise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEnterprise = useCallback(() => {
    if (!publicId) {
      return;
    }

    getEnterprise(publicId)
      .then((result) => {
        setEnterprise(result);
        setError(null);
      })
      .catch((loadError: unknown) => {
        setError(toErrorMessage(loadError));
      })
      .finally(() => setLoading(false));
  }, [publicId]);

  useEffect(() => {
    loadEnterprise();
  }, [loadEnterprise]);

  const backButton = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => navigate('/dashboard/my-enterprises')}
      className="border-dash-border rounded-full"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Kembali
    </Button>
  );

  if (loading) {
    return (
      <Card className={cn(CARD, 'flex flex-row items-center justify-center gap-3')}>
        <LoaderCircle className="text-dash-fg h-5 w-5 animate-spin" aria-hidden="true" />
        <span className="text-dash-muted text-sm font-semibold">Memuat data wirausaha...</span>
      </Card>
    );
  }

  if (error || !enterprise) {
    return (
      <Card className={cn(CARD, 'space-y-4')}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-dash-fg text-xl font-bold">
            Wirausaha Tidak Ditemukan
          </CardTitle>
          {backButton}
        </div>
        <p className="text-xs font-semibold text-rose-500">
          {error ?? 'Data wirausaha tidak dapat ditemukan.'}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-dash-surface-2 border-dash-border flex h-12 w-12 items-center justify-center rounded-2xl border">
            <Building2 className="text-dash-fg h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-dash-fg text-2xl font-bold tracking-tight">
                {enterprise.name ?? enterprise.business_sector}
              </h1>
              <StatusBadge
                label={ENTERPRISE_STATUS_LABELS[enterprise.status] ?? enterprise.status}
              />
            </div>
            <p className="text-dash-muted text-xs">ID Wirausaha: {enterprise.public_id}</p>
          </div>
        </div>
        <div>{backButton}</div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className={cn(CARD, 'space-y-5')}>
          <CardHeader className="border-dash-border border-b p-0 pb-3">
            <CardTitle className="text-dash-fg text-base font-bold">Informasi Usaha</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className={LABEL_CLASS}>Nama Usaha</span>
                <p className={VALUE_CLASS}>{renderValue(enterprise.name)}</p>
              </div>
              <div>
                <span className={LABEL_CLASS}>Sektor Usaha</span>
                <p className={VALUE_CLASS}>{renderValue(enterprise.business_sector)}</p>
              </div>
              <div>
                <span className={LABEL_CLASS}>Kecamatan</span>
                <p className={VALUE_CLASS}>{renderValue(enterprise.district)}</p>
              </div>
              <div>
                <span className={LABEL_CLASS}>Status Usaha</span>
                <p className={VALUE_CLASS}>
                  {ENTERPRISE_STATUS_LABELS[enterprise.status] ?? enterprise.status}
                </p>
              </div>
              <div>
                <span className={LABEL_CLASS}>Omzet Awal</span>
                <p className={VALUE_CLASS}>{formatCurrency(enterprise.initial_turnover)}</p>
              </div>
              <div>
                <span className={LABEL_CLASS}>Omzet Saat Ini</span>
                <p className={VALUE_CLASS}>{formatCurrency(enterprise.current_turnover)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(CARD, 'space-y-5')}>
          <CardHeader className="border-dash-border border-b p-0 pb-3">
            <CardTitle className="text-dash-fg text-base font-bold">
              Legalitas & Asesmen Program
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className={LABEL_CLASS}>Status Legalitas</span>
                <p className={VALUE_CLASS}>
                  {enterprise.legal_status ? LEGAL_STATUS_LABELS[enterprise.legal_status] : '—'}
                </p>
              </div>
              <div>
                <span className={LABEL_CLASS}>Tingkat Digitalisasi</span>
                <p className={VALUE_CLASS}>
                  {enterprise.business_digitization
                    ? BUSINESS_DIGITIZATION_LABELS[enterprise.business_digitization]
                    : '—'}
                </p>
              </div>
              <div>
                <span className={LABEL_CLASS}>Status Pelatihan</span>
                <p className={VALUE_CLASS}>
                  {enterprise.training_status
                    ? PROCESS_STATUS_LABELS[enterprise.training_status]
                    : '—'}
                </p>
              </div>
              <div>
                <span className={LABEL_CLASS}>Status Pendampingan</span>
                <p className={VALUE_CLASS}>
                  {enterprise.mentoring_status
                    ? PROCESS_STATUS_LABELS[enterprise.mentoring_status]
                    : '—'}
                </p>
              </div>
              <div>
                <span className={LABEL_CLASS}>Akses Modal</span>
                <p className={VALUE_CLASS}>
                  {enterprise.capital_access
                    ? GENERAL_STATUS_LABELS[enterprise.capital_access]
                    : '—'}
                </p>
              </div>
              <div>
                <span className={LABEL_CLASS}>Kemitraan</span>
                <p className={VALUE_CLASS}>
                  {enterprise.partnership ? GENERAL_STATUS_LABELS[enterprise.partnership] : '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className={cn(CARD, 'space-y-4')}>
        <CardHeader className="border-dash-border border-b p-0 pb-3">
          <CardTitle className="text-dash-fg text-base font-bold">
            Kebutuhan Intervensi & Riwayat Data
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div>
            <span className={LABEL_CLASS}>Kebutuhan Intervensi Usaha</span>
            <p className={`${VALUE_CLASS} mt-2 leading-relaxed`}>
              {enterprise.intervention_needs
                ? (INTERVENTION_NEEDS_LABELS[enterprise.intervention_needs] ??
                  enterprise.intervention_needs)
                : '—'}
            </p>
          </div>
          <div className="border-dash-border mt-4 grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-2">
            <div>
              <span className={LABEL_CLASS}>Waktu Pendaftaran</span>
              <p className="text-dash-muted mt-1 text-xs font-medium">
                {formatUnixDateTime(enterprise.created_at)}
              </p>
            </div>
            <div>
              <span className={LABEL_CLASS}>Terakhir Diperbarui</span>
              <p className="text-dash-muted mt-1 text-xs font-medium">
                {formatUnixDateTime(enterprise.updated_at)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

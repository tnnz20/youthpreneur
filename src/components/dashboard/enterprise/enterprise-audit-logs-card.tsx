import { useCallback, useEffect, useState } from 'react';

import { listEnterpriseAuditLogs } from '@/lib/api/enterprises';
import { cn, formatCurrency, formatUnixDateTime, toErrorMessage } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import type { EnterpriseAuditEvent } from '@/types/enterprises';

import {
  BUSINESS_DIGITIZATION_LABELS,
  BUSINESS_SECTOR_LABELS,
  ENTERPRISE_STATUS_LABELS,
  GENERAL_STATUS_LABELS,
  INTERVENTION_NEEDS_LABELS,
  LEGAL_STATUS_LABELS,
  PROCESS_STATUS_LABELS,
} from '@/constants/enterprises';

import {
  CheckCircle2,
  History,
  LoaderCircle,
  Pencil,
  PlusCircle,
  RotateCcw,
  Trash2,
} from 'lucide-react';

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento ring-0 p-6';

const FIELD_LABELS: Record<string, string> = {
  enterprise_name: 'Nama Usaha',
  name: 'Nama Usaha',
  business_sector: 'Sektor Usaha',
  status: 'Status Usaha',
  district: 'Kecamatan',
  address: 'Alamat',
  description: 'Deskripsi',
  focus_commodity: 'Komoditas Fokus',
  legal_status: 'Status Legalitas',
  business_digitization: 'Tingkat Digitalisasi',
  intervention_needs: 'Kebutuhan Intervensi',
  training_status: 'Status Pelatihan',
  mentoring_status: 'Status Pendampingan',
  capital_access: 'Akses Modal',
  partnership: 'Kemitraan',
  initial_turnover: 'Omzet Awal',
  current_turnover: 'Omzet Saat Ini',
  dispora_support: 'Dukungan Dispora',
};

function formatFieldLabel(key: string): string {
  return FIELD_LABELS[key] ?? key;
}

function formatFieldValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  const strValue = String(value);

  if (key === 'initial_turnover' || key === 'current_turnover') {
    return formatCurrency(strValue);
  }

  if (key === 'status') {
    return ENTERPRISE_STATUS_LABELS[strValue as keyof typeof ENTERPRISE_STATUS_LABELS] ?? strValue;
  }
  if (key === 'legal_status') {
    return LEGAL_STATUS_LABELS[strValue as keyof typeof LEGAL_STATUS_LABELS] ?? strValue;
  }
  if (key === 'business_sector') {
    return BUSINESS_SECTOR_LABELS[strValue as keyof typeof BUSINESS_SECTOR_LABELS] ?? strValue;
  }
  if (key === 'business_digitization') {
    return (
      BUSINESS_DIGITIZATION_LABELS[strValue as keyof typeof BUSINESS_DIGITIZATION_LABELS] ??
      strValue
    );
  }
  if (key === 'training_status' || key === 'mentoring_status') {
    return PROCESS_STATUS_LABELS[strValue as keyof typeof PROCESS_STATUS_LABELS] ?? strValue;
  }
  if (key === 'capital_access' || key === 'partnership') {
    return GENERAL_STATUS_LABELS[strValue as keyof typeof GENERAL_STATUS_LABELS] ?? strValue;
  }
  if (key === 'intervention_needs') {
    return (
      INTERVENTION_NEEDS_LABELS[strValue as keyof typeof INTERVENTION_NEEDS_LABELS] ?? strValue
    );
  }

  return strValue;
}

function getActionConfig(action: string) {
  switch (action.toLowerCase()) {
    case 'create':
      return {
        label: 'Dibuat',
        badgeClass:
          'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        dotClass: 'bg-emerald-500 ring-emerald-500/20',
        icon: PlusCircle,
      };
    case 'update':
      return {
        label: 'Diperbarui',
        badgeClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
        dotClass: 'bg-sky-500 ring-sky-500/20',
        icon: Pencil,
      };
    case 'delete':
      return {
        label: 'Dihapus',
        badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        dotClass: 'bg-rose-500 ring-rose-500/20',
        icon: Trash2,
      };
    default:
      return {
        label: action,
        badgeClass: 'bg-dash-surface-2 text-dash-fg border-dash-border',
        dotClass: 'bg-dash-muted ring-dash-border',
        icon: CheckCircle2,
      };
  }
}

interface EnterpriseAuditLogsCardProps {
  enterprisePublicId: string;
  className?: string;
}

export function EnterpriseAuditLogsCard({
  enterprisePublicId,
  className,
}: EnterpriseAuditLogsCardProps) {
  const [events, setEvents] = useState<EnterpriseAuditEvent[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLogs = useCallback(() => {
    let isMounted = true;

    listEnterpriseAuditLogs(enterprisePublicId, { limit: 10 })
      .then((response) => {
        if (!isMounted) return;
        setEvents(response.events);
        setNextCursor(response.next_cursor ?? null);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setError(toErrorMessage(err));
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [enterprisePublicId]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const loadMore = async () => {
    if (!nextCursor || loadingMore) {
      return;
    }

    setLoadingMore(true);
    try {
      const response = await listEnterpriseAuditLogs(enterprisePublicId, {
        cursor: nextCursor,
        limit: 10,
      });
      setEvents((prev) => [...prev, ...response.events]);
      setNextCursor(response.next_cursor ?? null);
    } catch (err: unknown) {
      setError(toErrorMessage(err));
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    return fetchAuditLogs();
  }, [fetchAuditLogs]);

  return (
    <Card className={cn(CARD, 'space-y-4', className)}>
      <CardHeader className="border-dash-border flex flex-row items-center justify-between border-b p-0 pb-3">
        <div className="space-y-0.5">
          <CardTitle className="text-dash-fg flex items-center gap-2 text-base font-bold">
            <History className="h-4 w-4" aria-hidden="true" />
            Riwayat Aktivitas
          </CardTitle>
          <p className="text-dash-muted text-[11px] font-medium">
            Log perubahan dan riwayat audit wirausaha
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={handleRefresh}
          disabled={loading || loadingMore}
          className="text-dash-muted hover:text-dash-fg h-7 w-7 rounded-full"
          aria-label="Segarkan riwayat aktivitas"
        >
          <RotateCcw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} aria-hidden="true" />
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="space-y-4 py-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex gap-3">
                <Skeleton className="h-4 w-4 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-4 text-center">
            <p className="text-xs font-semibold text-rose-500">{error}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="border-dash-border mt-3 rounded-full text-xs"
            >
              Coba Lagi
            </Button>
          </div>
        ) : events.length === 0 ? (
          <div className="py-6 text-center">
            <History className="text-dash-muted/40 mx-auto h-7 w-7" aria-hidden="true" />
            <p className="text-dash-muted mt-2 text-xs font-medium">
              Belum ada riwayat aktivitas yang tercatat.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="before:bg-dash-border relative pl-5 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-[1.5px]">
              {events.map((event, index) => {
                const config = getActionConfig(event.action);
                const Icon = config.icon;
                const hasChangedFields =
                  event.changed_fields && Object.keys(event.changed_fields).length > 0;

                return (
                  <div
                    key={event.id}
                    className={cn('relative pb-5', index === events.length - 1 && 'pb-0')}
                  >
                    <div
                      className={cn(
                        'absolute top-1 -left-5 flex h-4 w-4 items-center justify-center rounded-full ring-4',
                        config.dotClass
                      )}
                    >
                      <Icon className="h-2.5 w-2.5 text-white" aria-hidden="true" />
                    </div>

                    <div className="space-y-1.5 pl-1.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase',
                            config.badgeClass
                          )}
                        >
                          {config.label}
                        </span>
                        <span className="text-dash-muted text-[11px]">
                          {formatUnixDateTime(event.created_at)}
                        </span>
                      </div>

                      <div className="text-dash-fg text-xs">
                        <span className="font-semibold">{event.actor_name ?? 'Pengguna'}</span>
                        {event.actor_email && (
                          <span className="text-dash-muted ml-1 text-[11px]">
                            ({event.actor_email})
                          </span>
                        )}
                      </div>

                      {hasChangedFields && (
                        <div className="border-dash-border/60 bg-dash-surface-2 mt-2 space-y-1.5 rounded-xl border p-2.5 text-[11px]">
                          {Object.entries(event.changed_fields!).map(([fieldKey, val]) => (
                            <div
                              key={fieldKey}
                              className="flex items-baseline justify-between gap-2"
                            >
                              <span className="text-dash-muted font-medium">
                                {formatFieldLabel(fieldKey)}
                              </span>
                              <span className="text-dash-fg max-w-[14rem] truncate font-semibold">
                                {formatFieldValue(fieldKey, val)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {nextCursor && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={loadMore}
                disabled={loadingMore}
                className="border-dash-border w-full rounded-full text-xs"
              >
                {loadingMore ? (
                  <>
                    <LoaderCircle className="mr-2 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    Memuat...
                  </>
                ) : (
                  'Muat Lebih Banyak'
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

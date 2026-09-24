import { formatDateOnly, renderValue } from '@/lib/utils';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { TrainingCatalog } from '@/types/trainings';

import { Calendar, ExternalLink, MapPin, Phone } from 'lucide-react';

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento ring-0 p-6';
const LABEL_CLASS = 'text-dash-muted text-[11px] font-semibold tracking-wide uppercase';
const VALUE_CLASS = 'text-dash-fg mt-1 text-sm font-semibold';

interface TrainingDetailInfoCardProps {
  catalog: TrainingCatalog;
}

export function TrainingDetailInfoCard({ catalog }: TrainingDetailInfoCardProps) {
  const dateRange =
    catalog.start_date && catalog.end_date
      ? `${formatDateOnly(catalog.start_date)} - ${formatDateOnly(catalog.end_date)}`
      : catalog.start_date
        ? `Mulai ${formatDateOnly(catalog.start_date)}`
        : 'Jadwal belum ditentukan';

  return (
    <Card className={`${CARD} space-y-5`}>
      <CardHeader className="border-dash-border border-b p-0 pb-3">
        <CardTitle className="text-dash-fg text-base font-bold">
          Informasi Program Pelatihan
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <span className={LABEL_CLASS}>Kategori Pelatihan</span>
            <p className={VALUE_CLASS}>{renderValue(catalog.category)}</p>
          </div>

          <div>
            <span className={LABEL_CLASS}>Mentor / Pengajar</span>
            <p className={VALUE_CLASS}>{renderValue(catalog.mentor)}</p>
          </div>

          <div>
            <span className={LABEL_CLASS}>Jadwal Pelaksanaan</span>
            <div className="flex items-center gap-1.5 pt-1">
              <Calendar className="text-dash-muted h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="text-dash-fg text-sm font-semibold">{dateRange}</span>
            </div>
          </div>

          <div>
            <span className={LABEL_CLASS}>Lokasi / Alamat</span>
            <div className="flex items-start gap-1.5 pt-1">
              <MapPin className="text-dash-muted mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="text-dash-fg text-sm font-semibold">
                {renderValue(catalog.address)}
              </span>
            </div>
          </div>

          <div>
            <span className={LABEL_CLASS}>Kontak PIC</span>
            <div className="flex items-center gap-1.5 pt-1">
              <Phone className="text-dash-muted h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="text-dash-fg text-sm font-semibold">
                {renderValue(catalog.pic_phone)}
              </span>
            </div>
          </div>

          <div>
            <span className={LABEL_CLASS}>Tautan Kelas / Form</span>
            {catalog.link ? (
              <a
                href={catalog.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-dark inline-flex items-center gap-1 pt-1 text-sm font-semibold hover:underline"
              >
                Buka Tautan <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : (
              <p className={VALUE_CLASS}>—</p>
            )}
          </div>
        </div>

        {catalog.description && (
          <div className="border-dash-border/60 mt-4 border-t pt-4">
            <span className={LABEL_CLASS}>Deskripsi Program</span>
            <p className="text-dash-fg mt-1 text-sm leading-relaxed whitespace-pre-line">
              {catalog.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

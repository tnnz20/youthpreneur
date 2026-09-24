import { Button } from '@/components/ui/button';

import type { TrainingCatalog } from '@/types/trainings';

import { ExternalLink, Pencil, Trash2 } from 'lucide-react';

const CARD = 'rounded-[2rem] border border-dash-border/60 bg-dash-surface shadow-bento ring-0 p-6';

interface TrainingDetailActionCardProps {
  catalog: TrainingCatalog;
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

export function TrainingDetailActionCard({
  catalog,
  onEdit,
  onDelete,
  disabled = false,
}: TrainingDetailActionCardProps) {
  return (
    <div className={`${CARD} space-y-4`}>
      <h2 className="text-dash-fg text-base font-bold">Aksi Program</h2>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onEdit}
          disabled={disabled}
          className="border-dash-border h-auto rounded-full px-5 py-3"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Edit Data Program
        </Button>

        {catalog.link && (
          <Button
            type="button"
            variant="outline"
            onClick={() => window.open(catalog.link!, '_blank', 'noopener,noreferrer')}
            disabled={disabled}
            className="border-dash-border h-auto rounded-full px-5 py-3"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Kunjungi Tautan Kelas
          </Button>
        )}

        <Button
          type="button"
          variant="destructive"
          onClick={onDelete}
          disabled={disabled}
          className="h-auto rounded-full px-5 py-3"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Hapus Program Pelatihan
        </Button>
      </div>
    </div>
  );
}

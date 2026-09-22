import { Button } from '@/components/ui/button';

import { GraduationCap } from 'lucide-react';

interface CatalogEmptyStateProps {
  filtersActive: boolean;
  onResetFilters: () => void;
}

export function CatalogEmptyState({ filtersActive, onResetFilters }: CatalogEmptyStateProps) {
  return (
    <div className="border-brand-dark shadow-solid rounded-3xl border-2 bg-white p-12 text-center">
      <div className="bg-brand-yellow border-brand-dark mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-2">
        <GraduationCap className="text-brand-dark h-8 w-8" aria-hidden="true" />
      </div>
      <h2 className="text-brand-dark text-xl font-black tracking-tight">Program Tidak Ditemukan</h2>
      <p className="text-brand-muted mx-auto mt-2 max-w-md text-xs leading-relaxed sm:text-sm">
        {filtersActive
          ? 'Tidak ada program pelatihan yang cocok dengan filter atau kata kunci saat ini. Coba ubah kata kunci atau reset filter.'
          : 'Belum ada katalog pelatihan resmi yang dipublikasikan pada sistem.'}
      </p>
      {filtersActive && (
        <Button
          type="button"
          variant="neo"
          onClick={onResetFilters}
          className="mt-6 rounded-full px-6 py-2.5 text-xs font-bold"
        >
          Reset Semua Filter
        </Button>
      )}
    </div>
  );
}

export const selectTriggerClass =
  'text-brand-dark border-brand-dark/25 focus-visible:border-brand-dark h-11 w-full rounded-xl bg-white px-3.5 py-0 text-xs font-bold focus-visible:ring-0 data-[size=default]:h-11 sm:text-sm';

export const quickCategoryPillBase =
  'cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all';

export const ORDER_OPTIONS = [
  { value: 'desc', label: 'Terbaru Ditambahkan' },
  { value: 'asc', label: 'Urutan Awal (Lama)' },
] as const;

export function getCategoryToneClass(category?: string | null): string {
  const cat = (category ?? '').toLowerCase();

  if (cat.includes('digital') || cat.includes('teknologi') || cat.includes('iptek')) {
    return 'bg-brand-yellow text-brand-dark';
  }
  if (cat.includes('agri') || cat.includes('wirausaha') || cat.includes('usaha')) {
    return 'bg-brand-purple text-brand-dark';
  }
  if (cat.includes('kriya') || cat.includes('kreatif')) {
    return 'bg-brand-blue text-brand-dark';
  }
  if (cat.includes('olahraga') || cat.includes('prestasi')) {
    return 'bg-brand-mint text-brand-dark';
  }
  if (cat.includes('komunitas') || cat.includes('sosial') || cat.includes('pemuda')) {
    return 'bg-brand-peach text-brand-dark';
  }

  return 'bg-brand-yellow text-brand-dark';
}

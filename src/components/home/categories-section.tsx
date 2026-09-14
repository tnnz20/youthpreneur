import { toast } from 'sonner';

import { SectionHeading } from '@/components/shared/section-heading';
import { Button } from '@/components/ui/button';

import { CATEGORIES } from '@/constants/home';

export function CategoriesSection() {
  const filterByCategory = (category: string) => {
    toast.info(`Memfilter modul pelatihan bidang: ${category}`);
    document.getElementById('kursus')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="kategori" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Kategori Bidang Usaha"
          description="Temukan jalur bisnis yang paling cocok dengan komoditas dan potensi daerah asalmu."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.name} className="group relative cursor-pointer">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => filterByCategory(category.name)}
                  className={`border-brand-dark shadow-solid-sm hover:text-brand-dark h-auto w-full flex-col gap-0 rounded-2xl border-2 p-6 text-center transition-all group-hover:-translate-y-1 hover:bg-transparent! ${category.color}`}
                >
                  <h3 className="text-brand-dark text-lg font-black">{category.name}</h3>
                  <p className="text-brand-dark/70 mt-1 text-xs">{category.subtitle}</p>
                </Button>
                <div className="border-brand-dark bg-brand-yellow pointer-events-none absolute -bottom-4 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-2 shadow-sm">
                  <Icon className="text-brand-dark h-4 w-4" aria-hidden="true" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

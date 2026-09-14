import { SectionHeading } from '@/components/shared/section-heading';
import { SmartImage } from '@/components/shared/smart-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ARTICLES } from '@/constants/home';
import { useSite } from '@/hooks/use-site';

export function BlogSection() {
  const { openModal } = useSite();

  return (
    <section id="blog" className="border-t border-black/10 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Artikel & Panduan Wirausaha"
          description="Wawasan terhangat seputar permodalan, perizinan usaha, dan tren bisnis daerah."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {ARTICLES.map((article) => (
            <Card
              key={article.title}
              className="group flex flex-col gap-0 overflow-hidden rounded-2xl border-2 border-brand-dark bg-white py-0 ring-0 transition-all hover:-translate-y-1"
            >
              <div className="h-44 overflow-hidden border-b-2 border-brand-dark bg-stone-100">
                <SmartImage
                  src={article.image}
                  fallbackSrc={article.fallback}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="flex flex-1 flex-col justify-between p-5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => openModal(article.modalTitle)}
                  className="h-auto w-full justify-start whitespace-normal p-0 text-left text-base font-bold leading-snug text-brand-dark hover:bg-transparent group-hover:underline"
                >
                  {article.title}
                </Button>
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3 text-[11px] text-brand-muted">
                  <span>{article.date}</span>
                  <span className="font-medium">{article.readTime}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            type="button"
            onClick={() => openModal('Koleksi Artikel Lengkap')}
            className="h-auto rounded-full bg-brand-dark px-8 py-3 text-sm font-bold text-white shadow-sm transition-transform hover:bg-black active:scale-95"
          >
            Baca Selengkapnya
          </Button>
        </div>
      </div>
    </section>
  );
}

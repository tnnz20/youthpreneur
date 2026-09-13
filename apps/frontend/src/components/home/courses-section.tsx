import { ArrowRight, Star } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';
import { SmartImage } from '@/components/shared/smart-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { COURSES } from '@/constants/home';
import { useSite } from '@/hooks/use-site';

export function CoursesSection() {
  const { openModal } = useSite();

  return (
    <section id="kursus" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Program Pelatihan Terpopuler"
          description="Kurikulum praktis berbasis studi kasus nyata komoditas daerah, dari pengemasan hingga ekspor."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {COURSES.map((course) => (
            <Card
              key={course.title}
              className="group flex flex-col gap-0 overflow-hidden rounded-2xl border-2 border-brand-dark bg-white py-0 ring-0 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden border-b-2 border-brand-dark bg-stone-100">
                {course.bestSeller ? (
                  <Badge
                    variant="neoYellow"
                    className="absolute left-3 top-3 z-10 h-auto rounded-md px-2.5 py-1 text-[10px] uppercase tracking-wider"
                  >
                    BEST SELLER
                  </Badge>
                ) : null}
                <SmartImage
                  src={course.image}
                  fallbackSrc={course.fallback}
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <CardContent className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h3 className="line-clamp-2 text-base font-bold leading-snug text-brand-dark sm:text-[17px]">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-xs font-medium text-brand-muted">{course.mentor}</p>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-3">
                  <div className="mb-2 flex items-center gap-1 text-xs">
                    <span className="font-bold text-brand-dark">{course.rating}</span>
                    <div className="flex text-amber-500" aria-hidden="true">
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          className={`h-3 w-3 ${index < course.stars ? 'fill-current' : ''}`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-brand-muted">({course.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-brand-dark">{course.price}</span>
                      <span className="ml-1 text-xs text-brand-muted line-through">
                        {course.originalPrice}
                      </span>
                      {course.tag ? (
                        <Badge
                          variant="outline"
                          className="ml-1 h-auto rounded border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600"
                        >
                          {course.tag}
                        </Badge>
                      ) : null}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => openModal(`Daftar Kelas: ${course.title}`)}
                      aria-label={`Daftar kelas ${course.title}`}
                      className="rounded-full text-brand-dark hover:bg-black/5"
                    >
                      <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            type="button"
            onClick={() => openModal('Katalog 60+ Program Wirausaha Daerah')}
            className="h-auto rounded-full bg-brand-dark px-8 py-3 text-sm font-bold text-white shadow-sm transition-transform hover:bg-black active:scale-95"
          >
            Lihat Semua Program Pelatihan
          </Button>
        </div>
      </div>
    </section>
  );
}

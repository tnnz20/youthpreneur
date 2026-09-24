import { Link } from 'react-router';

import { SectionHeading } from '@/components/shared/section-heading';
import { SmartImage } from '@/components/shared/smart-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { useSite } from '@/hooks/use-site';

import { COURSES } from '@/constants/home';

import { ArrowRight, Star } from 'lucide-react';

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
              className="group border-brand-dark flex flex-col gap-0 overflow-hidden rounded-2xl border-2 bg-white py-0 ring-0 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="border-brand-dark relative h-48 overflow-hidden border-b-2 bg-stone-100">
                {course.bestSeller ? (
                  <Badge
                    variant="neoYellow"
                    className="absolute top-3 left-3 z-10 h-auto rounded-md px-2.5 py-1 text-[10px] tracking-wider uppercase"
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
                  <h3 className="text-brand-dark line-clamp-2 text-base leading-snug font-bold sm:text-[17px]">
                    {course.title}
                  </h3>
                  <p className="text-brand-muted mt-2 text-xs font-medium">{course.mentor}</p>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-3">
                  <div className="mb-2 flex items-center gap-1 text-xs">
                    <span className="text-brand-dark font-bold">{course.rating}</span>
                    <div className="flex text-amber-500" aria-hidden="true">
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          className={`h-3 w-3 ${index < course.stars ? 'fill-current' : ''}`}
                        />
                      ))}
                    </div>
                    <span className="text-brand-muted text-[11px]">({course.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="default"
                      className={`border-brand-dark h-auto rounded-full border-2 px-2.5 py-1 text-[11px] font-bold ${
                        course.slotAvailable
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-brand-peach text-brand-dark'
                      }`}
                    >
                      {course.slotAvailable ? 'Slot Tersedia' : 'Slot Penuh'}
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={!course.slotAvailable}
                      onClick={() => openModal(`Daftar Kelas: ${course.title}`)}
                      aria-label={
                        course.slotAvailable
                          ? `Daftar kelas ${course.title}`
                          : `Kelas ${course.title} sudah penuh`
                      }
                      className="text-brand-dark rounded-full hover:bg-black/5"
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
          <Link
            to="/training-catalog"
            className="bg-brand-dark inline-block h-auto rounded-full px-8 py-3 text-sm font-bold text-white shadow-sm transition-transform hover:bg-black active:scale-95"
          >
            Lihat Semua Program Pelatihan
          </Link>
        </div>
      </div>
    </section>
  );
}

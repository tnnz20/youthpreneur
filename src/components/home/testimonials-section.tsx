import { toast } from 'sonner';

import { SectionHeading } from '@/components/shared/section-heading';
import { SmartImage } from '@/components/shared/smart-image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { TESTIMONIALS } from '@/constants/home';

import { ChevronLeft, ChevronRight, Sparkles, Star } from 'lucide-react';

export function TestimonialsSection() {
  return (
    <section id="testimoni" className="bg-white/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Cerita Sukses Alumni"
          description="Dari pemuda desa biasa menjadi pemilik bisnis beromset ratusan juta rupiah per bulan."
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {TESTIMONIALS.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="border-brand-dark bg-brand-yellow shadow-solid-sm relative flex flex-col gap-6 rounded-2xl border-2 p-6 py-6 ring-0 sm:flex-row sm:p-8"
            >
              <div className="text-brand-dark absolute top-4 right-4">
                <Sparkles className="h-7 w-7" />
              </div>

              <div className="flex shrink-0 items-center gap-4 border-b border-black/15 pb-4 sm:w-40 sm:flex-col sm:items-start sm:gap-2 sm:border-r sm:border-b-0 sm:pr-4 sm:pb-0">
                <Avatar className="border-brand-dark h-14 w-14 border-2 bg-white after:hidden">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback>
                    <SmartImage
                      src={testimonial.fallback}
                      fallbackSrc={testimonial.fallback}
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                    />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-brand-dark text-base font-extrabold">{testimonial.name}</h4>
                  <p className="text-brand-dark/70 text-xs font-medium">{testimonial.origin}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs font-bold">
                    <span>5</span>
                    <div className="flex text-black" aria-hidden="true">
                      <Star className="h-3 w-3 fill-current" />
                      <Star className="h-3 w-3 fill-current" />
                      <Star className="h-3 w-3 fill-current" />
                      <Star className="h-3 w-3 fill-current" />
                      <Star className="h-3 w-3 fill-current" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 items-center pr-4">
                <p className="text-brand-dark/90 text-sm leading-relaxed font-normal sm:text-base">
                  {testimonial.quote}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => toast.info('Menampilkan testimoni sebelumnya')}
            aria-label="Sebelumnya"
            className="bg-brand-dark h-8 w-8 rounded-full text-xs text-white hover:bg-black active:scale-90"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <span className="text-brand-dark text-xs font-semibold">2 dari 1,200+ Cerita</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => toast.info('Menampilkan testimoni berikutnya')}
            aria-label="Selanjutnya"
            className="bg-brand-dark h-8 w-8 rounded-full text-xs text-white hover:bg-black active:scale-90"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}

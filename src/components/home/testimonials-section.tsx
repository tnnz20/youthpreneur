import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Sparkles, Star } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';
import { SmartImage } from '@/components/shared/smart-image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TESTIMONIALS } from '@/constants/home';

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
              className="relative flex flex-col gap-6 rounded-2xl border-2 border-brand-dark bg-brand-yellow p-6 py-6 shadow-solid-sm ring-0 sm:flex-row sm:p-8"
            >
              <div className="absolute right-4 top-4 text-brand-dark">
                <Sparkles className="h-7 w-7" />
              </div>

              <div className="flex shrink-0 items-center gap-4 border-b border-black/15 pb-4 sm:w-40 sm:flex-col sm:items-start sm:gap-2 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
                <Avatar className="h-14 w-14 border-2 border-brand-dark bg-white after:hidden">
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
                  <h4 className="text-base font-extrabold text-brand-dark">{testimonial.name}</h4>
                  <p className="text-xs font-medium text-brand-dark/70">{testimonial.origin}</p>
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
                <p className="text-sm font-normal leading-relaxed text-brand-dark/90 sm:text-base">
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
            className="h-8 w-8 rounded-full bg-brand-dark text-xs text-white hover:bg-black active:scale-90"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <span className="text-xs font-semibold text-brand-dark">2 dari 1,200+ Cerita</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => toast.info('Menampilkan testimoni berikutnya')}
            aria-label="Selanjutnya"
            className="h-8 w-8 rounded-full bg-brand-dark text-xs text-white hover:bg-black active:scale-90"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}

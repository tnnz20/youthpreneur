import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { toast } from 'sonner';
import { SectionHeading } from '@/components/shared/section-heading';
import { SmartImage } from '@/components/shared/smart-image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MENTORS } from '@/constants/home';

export function MentorsSection() {
  return (
    <section id="mentor" className="border-t border-black/10 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Mentor & Praktisi Pendamping"
          description="Belajar langsung dari mereka yang telah berhasil merintis bisnis miliaran rupiah dari pelosok daerah."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MENTORS.map((mentor) => (
            <Card
              key={mentor.name}
              className="flex flex-col items-center gap-0 rounded-2xl border-2 border-brand-dark bg-white py-0 text-center ring-0 transition-all hover:-translate-y-1"
            >
              <div className="p-6">
                <Avatar
                  className={`mb-4 h-28 w-28 border-2 border-brand-dark p-1 after:hidden ${mentor.rim}`}
                >
                  <AvatarImage src={mentor.image} alt={mentor.name} />
                  <AvatarFallback>
                    <SmartImage
                      src={mentor.fallback}
                      fallbackSrc={mentor.fallback}
                      alt={mentor.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-extrabold text-brand-dark">{mentor.name}</h3>
                <p className="mt-0.5 text-xs font-medium text-brand-muted">{mentor.role}</p>
                <div className="mt-4 flex w-full items-center justify-center gap-1.5 border-t border-gray-100 pt-3 text-xs">
                  <span className="font-bold text-brand-dark">{mentor.rating}</span>
                  <Star className="h-3 w-3 fill-current text-amber-500" aria-hidden="true" />
                  <span className="text-brand-muted">{mentor.mentees}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            onClick={() => toast.info('Menampilkan mentor sebelumnya')}
            aria-label="Sebelumnya"
            className="h-10 w-10 rounded-full bg-brand-dark text-white hover:bg-black"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            onClick={() => toast.info('Menampilkan mentor berikutnya')}
            aria-label="Selanjutnya"
            className="h-10 w-10 rounded-full bg-brand-dark text-white hover:bg-black"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}

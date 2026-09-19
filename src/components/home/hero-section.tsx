import { type SubmitEvent, useState } from 'react';

import { toast } from 'sonner';

import { SmartImage } from '@/components/shared/smart-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Check, Sparkles, Star } from 'lucide-react';

export function HeroSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      return;
    }
    toast.success(`Pendaftaran awal berhasil untuk ${email}! Silakan cek email/WhatsApp.`);
    setEmail('');
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-6 lg:col-span-6 xl:col-span-6">
            <Badge
              variant="outline"
              className="inline-flex h-auto items-center gap-2 rounded-full border-amber-300 bg-amber-100/70 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-amber-900 uppercase"
            >
              <Sparkles className="h-3.5 w-3.5 fill-amber-600 stroke-none" />
              Inkubasi Wirausaha Muda Daerah 2026
            </Badge>

            <h1 className="text-brand-dark text-4xl leading-[1.12] font-black tracking-tight sm:text-5xl lg:text-[56px]">
              Bangun Bisnis Hebat <br className="hidden sm:inline" />
              dari Potensi Daerahmu
            </h1>

            <p className="text-brand-muted max-w-lg text-base leading-relaxed font-normal sm:text-lg">
              Kami percaya pemuda daerah adalah motor ekonomi nusantara. Kuasai strategi produk,
              pemasaran digital, permodalan, hingga ekspor komoditas lokal langsung bersama mentor
              praktisi teruji.
            </p>

            <div className="max-w-md pt-2">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-stretch gap-2 p-1.5 transition-all focus-within:border-black sm:flex-row sm:gap-0 sm:rounded-full sm:border sm:border-black/30 sm:bg-white sm:shadow-sm"
              >
                <label htmlFor="hero-email" className="sr-only">
                  Email atau WhatsApp
                </label>
                <Input
                  id="hero-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Masukkan email atau WhatsApp kamu"
                  className="text-brand-dark h-auto w-full rounded-full border border-black/20 bg-white px-5 py-3 text-sm placeholder:text-gray-400 focus-visible:ring-0 sm:rounded-none sm:border-none sm:bg-transparent sm:py-2.5 sm:shadow-none"
                />
                <Button
                  type="submit"
                  className="bg-brand-dark h-auto rounded-full px-7 py-3 text-xs font-bold whitespace-nowrap text-white shadow-sm transition-transform hover:bg-black active:scale-95 sm:text-sm"
                >
                  Daftar Kelas Gratis
                </Button>
              </form>

              <div className="text-brand-dark/70 mt-4 flex items-center gap-2 text-xs font-medium">
                <div className="flex text-amber-500" aria-hidden="true">
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                </div>
                <span className="text-brand-dark font-bold">4.9+ Rating</span>
                <span>• Lebih dari 25,000+ pemuda telah memulai usaha</span>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center lg:col-span-6 xl:col-span-6">
            <div className="text-brand-dark absolute -top-6 right-8 hidden opacity-90 sm:block">
              <Sparkles className="h-10 w-10" />
            </div>

            <div className="text-brand-dark absolute bottom-6 -left-4 opacity-80">
              <Sparkles className="h-8 w-8" />
            </div>

            <div className="relative w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[410px]">
              <div className="border-brand-dark bg-brand-yellow shadow-solid-lg relative h-[410px] w-full overflow-hidden rounded-t-full rounded-b-[100px] border-2 sm:h-120">
                <SmartImage
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                  fallbackSrc="https://placehold.co/600x800/FEE78A/141416?text=Wirausaha+Muda"
                  alt="Pemuda Pengusaha Daerah Sukses"
                  className="h-full w-full object-cover object-top pt-6"
                />
              </div>

              <div className="animate-float border-brand-dark bg-brand-yellow shadow-solid-sm absolute top-10 -right-2 z-10 flex items-center gap-2.5 rounded-xl border-2 px-3 py-2 sm:-right-6 sm:px-4 sm:py-2.5">
                <div className="border-brand-dark/20 flex h-7 w-7 items-center justify-center rounded-full border bg-white text-sm font-black text-amber-500">
                  <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-brand-dark text-[13px] leading-tight font-extrabold sm:text-sm">
                    99.24%
                  </div>
                  <div className="text-brand-dark/80 text-[10px] font-medium sm:text-[11px]">
                    Rekomendasi Alumni
                  </div>
                </div>
              </div>

              <div className="animate-float-delayed border-brand-dark bg-brand-yellow shadow-solid-sm absolute bottom-16 -left-3 z-10 flex items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 sm:-left-8 sm:px-4 sm:py-3">
                <div className="border-brand-dark/20 flex h-7 w-7 items-center justify-center rounded-full border bg-white text-xs font-black text-emerald-600">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-brand-dark text-[13px] leading-tight font-extrabold sm:text-sm">
                    3.200+ Usaha Baru
                  </div>
                  <div className="text-brand-dark/80 text-[10px] font-medium sm:text-[11px]">
                    Aktif &amp; Beromset Sejak 2024
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

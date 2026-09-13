import { useState, type SubmitEvent } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { BRAND } from '@/constants/site';
import { FOOTER_COLUMNS, SOCIALS } from '@/constants/footer';
import { useSite } from '@/hooks/use-site';

export function Footer() {
  const { openModal } = useSite();
  const [email, setEmail] = useState('');

  const handleSubscribe = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      return;
    }
    toast.success(`Email ${email} berhasil didaftarkan ke buletin mingguan.`);
    setEmail('');
  };

  return (
    <footer className="border-t border-black/15 bg-brand-footer pb-12 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 pb-12 md:grid-cols-12 lg:gap-8">
          <div className="space-y-4 md:col-span-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-brand-dark bg-brand-yellow text-lg font-extrabold shadow-solid-sm">
                YT
              </div>
              <div>
                <div className="text-xl font-black leading-none tracking-tight text-brand-dark">
                  {BRAND.name}
                  <span className="text-amber-500"> {BRAND.suffix}</span>
                </div>
                <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                  {BRAND.organizer}
                </div>
              </div>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-brand-muted">
              Inisiatif inkubasi mandiri pemuda nusantara untuk melahirkan wirausaha tangguh
              berbasis komoditas lokal dan kearifan daerah Tapin.
            </p>

            <div className="space-y-1.5 pt-2 text-xs text-brand-dark/80">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-dark" aria-hidden="true" />
                <span>{BRAND.phone} (WhatsApp Halo Youthpreneur)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-dark" aria-hidden="true" />
                <span>{BRAND.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-dark text-xs font-bold text-white transition hover:opacity-80"
                >
                  {social.short}
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="space-y-3 md:col-span-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-brand-dark">
                {column.title}
              </h4>
              <ul className="space-y-2 text-xs text-brand-muted">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="transition hover:text-brand-dark">
                      {link.label}
                    </Link>
                  </li>
                ))}
                {column.actions.map((action) => (
                  <li key={action.label}>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => openModal(action.modalTitle, action.modalDescription)}
                      className="h-auto justify-start p-0 text-xs font-normal text-brand-muted underline-offset-4 hover:text-brand-dark"
                    >
                      {action.label}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-4 md:col-span-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-dark">
              Berlangganan Kabar & Beasiswa
            </h4>
            <p className="text-xs text-brand-muted">
              Dapatkan info inkubasi, pembukaan beasiswa, dan panduan usaha mingguan gratis.
            </p>

            <form className="space-y-2" onSubmit={handleSubscribe}>
              <label htmlFor="newsletter-email" className="sr-only">
                Email aktif
              </label>
              <Input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Ketik email aktif kamu"
                className="h-auto w-full rounded-xl border border-black/25 bg-white px-4 py-2.5 text-xs text-brand-dark focus-visible:border-brand-dark focus-visible:ring-0"
              />
              <Button
                type="submit"
                variant="neo"
                className="h-auto w-full rounded-xl py-2.5 text-xs"
              >
                Langganan Sekarang
              </Button>
            </form>
          </div>
        </div>

        <Separator className="bg-black/10" />

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-brand-muted sm:flex-row">
          <p>{BRAND.copyright}</p>
          <div className="flex items-center gap-6">
            <Button
              type="button"
              variant="link"
              onClick={() => openModal('Syarat & Ketentuan')}
              className="h-auto p-0 text-xs font-normal text-brand-muted hover:text-brand-dark"
            >
              Syarat & Ketentuan
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => openModal('Kebijakan Privasi')}
              className="h-auto p-0 text-xs font-normal text-brand-muted hover:text-brand-dark"
            >
              Privasi
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => openModal('Pusat Bantuan')}
              className="h-auto p-0 text-xs font-normal text-brand-muted hover:text-brand-dark"
            >
              Bantuan
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}

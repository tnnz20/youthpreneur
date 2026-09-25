import { type SubmitEvent, useState } from 'react';

import { Link } from 'react-router';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import { useSite } from '@/hooks/use-site';

import { FOOTER_COLUMNS, SOCIALS } from '@/constants/footer';
import { BRAND } from '@/constants/site';

import { Mail, Phone } from 'lucide-react';

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
    <footer className="bg-brand-footer border-t border-black/15 pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 pb-12 md:grid-cols-12 lg:gap-8">
          <div className="space-y-4 md:col-span-4">
            <div className="space-y-2">
              <img
                src="/assets/logo-youth.webp"
                alt="Logo Youthpreneur Tapin"
                className="h-10 w-auto object-contain"
              />
              <div className="text-brand-muted text-[10px] font-bold tracking-wider uppercase">
                {BRAND.organizer}
              </div>
            </div>
            <p className="text-brand-muted max-w-sm text-xs leading-relaxed">
              Inisiatif inkubasi mandiri pemuda nusantara untuk melahirkan wirausaha tangguh
              berbasis komoditas lokal dan kearifan daerah Tapin.
            </p>

            <div className="text-brand-dark/80 space-y-1.5 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="text-brand-dark h-4 w-4" aria-hidden="true" />
                <span>{BRAND.phone} (WhatsApp Halo Youthpreneur)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="text-brand-dark h-4 w-4" aria-hidden="true" />
                <span>{BRAND.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {SOCIALS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    className="bg-brand-dark flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:opacity-80"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="space-y-3 md:col-span-2">
              <h4 className="text-brand-dark text-xs font-black tracking-wider uppercase">
                {column.title}
              </h4>
              <ul className="text-brand-muted space-y-2 text-xs">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.download ? (
                      <a
                        href={link.to}
                        download={typeof link.download === 'string' ? link.download : true}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-brand-dark transition"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.to} className="hover:text-brand-dark transition">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
                {column.actions.map((action) => (
                  <li key={action.label}>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => openModal(action.modalTitle, action.modalDescription)}
                      className="text-brand-muted hover:text-brand-dark h-auto justify-start p-0 text-xs font-normal underline-offset-4"
                    >
                      {action.label}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-4 md:col-span-4">
            <h4 className="text-brand-dark text-xs font-black tracking-wider uppercase">
              Berlangganan Kabar & Beasiswa
            </h4>
            <p className="text-brand-muted text-xs">
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
                className="text-brand-dark focus-visible:border-brand-dark h-auto w-full rounded-xl border border-black/25 bg-white px-4 py-2.5 text-xs focus-visible:ring-0"
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

        <div className="text-brand-muted flex flex-col items-center justify-between gap-4 pt-8 text-xs sm:flex-row">
          <p>{BRAND.copyright}</p>
          <div className="flex items-center gap-6">
            <Button
              type="button"
              variant="link"
              onClick={() => openModal('Syarat & Ketentuan')}
              className="text-brand-muted hover:text-brand-dark h-auto p-0 text-xs font-normal"
            >
              Syarat & Ketentuan
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => openModal('Kebijakan Privasi')}
              className="text-brand-muted hover:text-brand-dark h-auto p-0 text-xs font-normal"
            >
              Privasi
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => openModal('Pusat Bantuan')}
              className="text-brand-muted hover:text-brand-dark h-auto p-0 text-xs font-normal"
            >
              Bantuan
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}

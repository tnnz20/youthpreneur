import { useState } from 'react';

import { Link } from 'react-router';

import { cn } from '@/lib/utils';

import { buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { useSession } from '@/hooks/use-session';

import { NAV_LINKS } from '@/constants/site';

import { FileDown, LayoutDashboard, Menu } from 'lucide-react';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { status } = useSession();

  const masukClasses = cn(
    buttonVariants({ variant: 'neoOutline' }),
    'rounded-full px-3 py-2 text-[11px] sm:px-6 sm:py-2.5 sm:text-sm'
  );

  const daftarClasses = cn(
    buttonVariants({ variant: 'neo' }),
    'rounded-full px-3 py-2 text-[11px] sm:px-6 sm:py-2.5 sm:text-sm'
  );

  return (
    <header className="bg-brand-bg/95 sticky top-0 z-40 border-b border-black/10 backdrop-blur-md transition-all duration-200">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:gap-8 lg:px-8">
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <img
            src="/assets/logo-youth.webp"
            alt="Logo Youthpreneur Tapin"
            className="h-9 w-auto object-contain sm:h-10"
          />
          <img
            src="/assets/logo-dispora.webp"
            alt="Logo Dinas Pemuda dan Olahraga Kabupaten Tapin"
            className="hidden h-9 w-auto object-contain lg:block lg:h-10"
          />
          <img
            src="/assets/tapin-maju-logo.webp"
            alt="Logo Tapin Maju"
            className="hidden h-9 w-auto object-contain lg:block lg:h-10"
          />
        </div>

        <nav className="text-brand-dark/80 hidden shrink-0 items-center gap-5 text-sm font-semibold lg:flex xl:gap-6">
          {NAV_LINKS.map((link) =>
            link.download ? (
              <a
                key={link.label}
                href={link.to}
                download={typeof link.download === 'string' ? link.download : true}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-dark hover:bg-brand-yellow-light inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-white px-3 py-1 text-xs font-bold text-black transition-colors hover:border-black"
              >
                <FileDown className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
                <span>{link.label}</span>
              </a>
            ) : link.external || link.to.startsWith('http') ? (
              <a
                key={link.label}
                href={link.to}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-black"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className="flex items-center gap-1.5 transition-colors hover:text-black"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {status === 'authenticated' ? (
            <Link to="/dashboard" className={daftarClasses}>
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Dashboard Saya
            </Link>
          ) : status === 'anonymous' ? (
            <>
              <Link to="/auth/login" className={masukClasses}>
                Masuk
              </Link>
              <Link to="/auth/register" className={daftarClasses}>
                Daftar
              </Link>
            </>
          ) : null}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="text-brand-dark rounded-lg p-2 hover:bg-black/5 focus:outline-none lg:hidden"
              aria-label="Buka menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-brand-dark bg-brand-bg w-72 border-l-2 p-0"
            >
              <SheetHeader className="border-b border-black/10">
                <SheetTitle className="text-brand-dark text-base font-black tracking-tight">
                  Menu Navigasi
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col px-4">
                {NAV_LINKS.map((link) =>
                  link.download ? (
                    <a
                      key={link.label}
                      href={link.to}
                      download={typeof link.download === 'string' ? link.download : true}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileOpen(false)}
                      className="text-brand-dark flex items-center justify-between border-b border-black/5 py-3 text-sm font-semibold hover:text-black"
                    >
                      <span className="flex items-center gap-2">
                        <FileDown className="h-4 w-4 text-amber-600" aria-hidden="true" />
                        {link.label}
                      </span>
                      <span className="border-brand-dark/20 bg-brand-yellow rounded px-2 py-0.5 text-[10px] font-bold uppercase">
                        PDF
                      </span>
                    </a>
                  ) : link.external || link.to.startsWith('http') ? (
                    <a
                      key={link.label}
                      href={link.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileOpen(false)}
                      className="text-brand-dark border-b border-black/5 py-3 text-sm font-semibold hover:text-black"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className="text-brand-dark border-b border-black/5 py-3 text-sm font-semibold hover:text-black"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

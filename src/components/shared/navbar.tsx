import { useState } from 'react';

import { Link } from 'react-router';

import { cn } from '@/lib/utils';

import { buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { BRAND, NAV_LINKS } from '@/constants/site';

import { Menu } from 'lucide-react';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const masukClasses = cn(
    buttonVariants({ variant: 'neo' }),
    'rounded-full px-5 py-2 text-xs sm:px-6 sm:py-2.5 sm:text-sm'
  );

  return (
    <header className="bg-brand-bg/95 sticky top-0 z-40 border-b border-black/10 backdrop-blur-md transition-all duration-200">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:gap-8 lg:px-8">
        <Link to="/" className="group flex shrink-0 items-center gap-2.5">
          <div className="border-brand-dark bg-brand-yellow shadow-solid-sm flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 text-xl font-extrabold transition-transform group-hover:-translate-y-0.5">
            YT
          </div>
          <div className="shrink-0">
            <div className="text-brand-dark text-xl leading-none font-black tracking-tight sm:text-2xl">
              {BRAND.name}
              <span className="text-amber-500"> {BRAND.suffix}</span>
            </div>
            <div className="text-brand-muted mt-0.5 text-[10px] font-bold tracking-widest uppercase">
              {BRAND.organizer}
            </div>
          </div>
        </Link>

        <nav className="text-brand-dark/80 hidden shrink-0 items-center gap-6 text-sm font-semibold lg:flex xl:gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="flex items-center gap-1.5 transition-colors hover:text-black"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Link to="/login" className={masukClasses}>
            Masuk
          </Link>

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
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="text-brand-dark border-b border-black/5 py-3 text-sm font-semibold hover:text-black"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className={cn(masukClasses, 'mt-4 flex w-full justify-center')}
                >
                  Masuk
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

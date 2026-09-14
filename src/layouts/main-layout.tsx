import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Footer } from '@/components/shared/footer';
import { Navbar } from '@/components/shared/navbar';
import { SiteProvider } from '@/components/shared/site-provider';

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return null;
}

export default function MainLayout() {
  return (
    <SiteProvider>
      <ScrollToHash />
      <div className="flex min-h-screen flex-col bg-brand-bg text-brand-dark selection:bg-brand-yellow selection:text-black">
        <Navbar />
        <main className="grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SiteProvider>
  );
}

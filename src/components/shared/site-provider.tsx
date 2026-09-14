import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { SiteContext } from '@/hooks/use-site';
import { ActionModal } from './action-modal';

interface SiteProviderProps {
  children: ReactNode;
}

interface ModalState {
  title: string;
  description: string;
}

const DEFAULT_MODAL_DESCRIPTION =
  'Dapatkan bimbingan intensif, modul bisnis eksklusif, serta akses jaringan komunitas pemuda daerah se-Indonesia.';

export function SiteProvider({ children }: SiteProviderProps) {
  const [modal, setModal] = useState<ModalState | null>(null);

  const openModal = useCallback((title: string, description = DEFAULT_MODAL_DESCRIPTION) => {
    setModal({ title, description });
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const value = useMemo(() => ({ openModal }), [openModal]);

  const handleSubmitted = useCallback(() => {
    setModal(null);
    toast.success(
      'Formulir berhasil terkirim! Tim fasilitator kami akan menghubungi WhatsApp Anda.'
    );
  }, []);

  return (
    <SiteContext.Provider value={value}>
      {children}
      <ActionModal
        open={modal !== null}
        title={modal?.title ?? ''}
        description={modal?.description ?? ''}
        onClose={closeModal}
        onSubmitted={handleSubmitted}
      />
      <Toaster />
    </SiteContext.Provider>
  );
}

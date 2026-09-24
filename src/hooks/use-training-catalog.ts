import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { enrollTraining, listMyEnrollments, listTrainingCatalogs } from '@/lib/api/trainings';
import { toErrorMessage } from '@/lib/utils';

import { useSession } from '@/hooks/use-session';

import type { TrainingCatalog, TrainingCategory, TrainingStatus } from '@/types/trainings';

const DEFAULT_LIMIT = 9;

export function useTrainingCatalog() {
  const navigate = useNavigate();
  const { status: authStatus } = useSession();

  const [catalogs, setCatalogs] = useState<TrainingCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState<TrainingCategory | 'semua'>('semua');
  const [status, setStatus] = useState<TrainingStatus | 'semua'>('semua');
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');

  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [cursorStack, setCursorStack] = useState<string[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const limit = DEFAULT_LIMIT;
  const [refreshKey, setRefreshKey] = useState(0);

  const [enrolledCatalogIds, setEnrolledCatalogIds] = useState<Set<string>>(() => new Set());
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [selectedCatalog, setSelectedCatalog] = useState<TrainingCatalog | null>(null);
  const [pendingEnrollCatalog, setPendingEnrollCatalog] = useState<TrainingCatalog | null>(null);

  // Debounce search by 300ms
  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);
    return () => window.clearTimeout(handler);
  }, [searchTerm]);

  // Load user enrollments if authenticated
  useEffect(() => {
    let cancelled = false;

    if (authStatus === 'authenticated') {
      listMyEnrollments({ limit: 100 })
        .then((res) => {
          if (!cancelled) {
            const ids = new Set<string>();
            for (const item of res.training_enrollments ?? []) {
              const isCancelled = item.status === 'cancelled' || Boolean(item.deleted_at);
              if (item.catalog?.public_id && !isCancelled) {
                ids.add(item.catalog.public_id);
              }
            }
            setEnrolledCatalogIds(ids);
          }
        })
        .catch(() => {
          // Non-critical, ignore error
        });
    }

    return () => {
      cancelled = true;
    };
  }, [authStatus]);

  // Fetch training catalog data from GET /training-catalog
  useEffect(() => {
    let cancelled = false;

    listTrainingCatalogs({
      cursor,
      limit,
      search: debouncedSearch || undefined,
      category: category === 'semua' ? undefined : category,
      training_status: status === 'semua' ? undefined : status,
      order,
    })
      .then((res) => {
        if (!cancelled) {
          setCatalogs(res.training_catalogs);
          setNextCursor(res.next_cursor ?? null);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(toErrorMessage(err));
          setCatalogs([]);
          setNextCursor(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cursor, limit, debouncedSearch, category, status, order, refreshKey]);

  const handleSearchChange = (val: string) => {
    setLoading(true);
    setSearchTerm(val);
    setCursor(undefined);
    setCursorStack([]);
  };

  const handleCategoryChange = (val: TrainingCategory | 'semua') => {
    setLoading(true);
    setCategory(val);
    setCursor(undefined);
    setCursorStack([]);
  };

  const handleStatusChange = (val: TrainingStatus | 'semua') => {
    setLoading(true);
    setStatus(val);
    setCursor(undefined);
    setCursorStack([]);
  };

  const handleOrderChange = (val: 'desc' | 'asc') => {
    setLoading(true);
    setOrder(val);
    setCursor(undefined);
    setCursorStack([]);
  };

  const handleResetFilters = () => {
    setLoading(true);
    setSearchTerm('');
    setDebouncedSearch('');
    setCategory('semua');
    setStatus('semua');
    setOrder('desc');
    setCursor(undefined);
    setCursorStack([]);
  };

  const handleReload = () => {
    setLoading(true);
    setRefreshKey((k) => k + 1);
  };

  const handleNextPage = () => {
    if (!nextCursor || loading) return;
    setCursorStack((prev) => (cursor ? [...prev, cursor] : ['']));
    setCursor(nextCursor);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (cursorStack.length === 0 || loading) return;
    const newStack = [...cursorStack];
    const prevCursor = newStack.pop();
    setCursorStack(newStack);
    setCursor(prevCursor === '' ? undefined : prevCursor);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnroll = (item: TrainingCatalog) => {
    if (authStatus !== 'authenticated') {
      toast.info('Silakan masuk ke akun Anda terlebih dahulu untuk mendaftar pelatihan.');
      navigate('/auth/login');
      return;
    }

    if (selectedCatalog?.public_id === item.public_id) {
      setSelectedCatalog(null);
    }
    setPendingEnrollCatalog(item);
  };

  const handleConfirmEnroll = async () => {
    if (!pendingEnrollCatalog) return;

    const item = pendingEnrollCatalog;
    setEnrollingId(item.public_id);
    try {
      await enrollTraining({ catalog_public_id: item.public_id });
      setEnrolledCatalogIds((prev) => new Set([...prev, item.public_id]));
      setCatalogs((prev) =>
        prev.map((c) =>
          c.public_id === item.public_id ? { ...c, registered_count: c.registered_count + 1 } : c
        )
      );
      toast.success(
        `Pendaftaran untuk "${item.title ?? 'Program'}" berhasil dikirim. Menunggu verifikasi tim Dispora Tapin.`
      );
      setPendingEnrollCatalog(null);
    } catch (err: unknown) {
      toast.error(toErrorMessage(err));
    } finally {
      setEnrollingId(null);
    }
  };

  const handleCloseEnrollDialog = (open: boolean) => {
    if (!open && !enrollingId) {
      setPendingEnrollCatalog(null);
    }
  };

  const filtersActive =
    searchTerm.trim() !== '' ||
    debouncedSearch.trim() !== '' ||
    category !== 'semua' ||
    status !== 'semua' ||
    order !== 'desc';

  return {
    catalogs,
    loading,
    error,
    searchTerm,
    category,
    status,
    order,
    limit,
    cursorStack,
    nextCursor,
    filtersActive,
    enrolledCatalogIds,
    enrollingId,
    selectedCatalog,
    setSelectedCatalog,
    pendingEnrollCatalog,
    handleSearchChange,
    handleCategoryChange,
    handleStatusChange,
    handleOrderChange,
    handleResetFilters,
    handleReload,
    handleNextPage,
    handlePreviousPage,
    handleEnroll,
    handleConfirmEnroll,
    handleCloseEnrollDialog,
  };
}

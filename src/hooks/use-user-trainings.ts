import { useCallback, useEffect, useState } from 'react';

import { toast } from 'sonner';

import { cancelEnrollment, listMyEnrollments } from '@/lib/api/trainings';
import { toErrorMessage } from '@/lib/utils';

import type { TrainingEnrollment } from '@/types/trainings';

export interface UserTrainingFilters {
  status: string;
}

export interface UserTrainingState {
  enrollments: TrainingEnrollment[];
  loading: boolean;
  error: string | null;
  search: string;
  filters: UserTrainingFilters;
  limit: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  cancellingId: string | null;
  setSearch: (search: string) => void;
  setStatus: (status: string) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  resetFilters: () => void;
  refresh: () => Promise<void>;
  cancel: (publicId: string) => Promise<void>;
}

const DEFAULT_LIMIT = 10;

export function useUserTrainings(): UserTrainingState {
  const [enrollments, setEnrollments] = useState<TrainingEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [limit, setLimitState] = useState(DEFAULT_LIMIT);

  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [cursorStack, setCursorStack] = useState<string[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => window.clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    listMyEnrollments({
      cursor,
      limit,
    })
      .then((response) => {
        if (!cancelled) {
          setEnrollments(response.training_enrollments ?? []);
          setNextCursor(response.next_cursor ?? null);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(toErrorMessage(err));
          setEnrollments([]);
          setNextCursor(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cursor, limit, refreshKey]);

  const filteredEnrollments = enrollments.filter((item) => {
    if (status !== 'all') {
      if (status === 'cancelled') {
        if (!item.deleted_at && item.status !== 'cancelled') return false;
      } else {
        if (item.deleted_at || item.status === 'cancelled') return false;
        if (item.status !== status) return false;
      }
    }

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      const title = (item.catalog?.title ?? item.catalog?.name ?? '').toLowerCase();
      const publicId = item.public_id.toLowerCase();
      if (!title.includes(q) && !publicId.includes(q)) {
        return false;
      }
    }

    return true;
  });

  const handleNextPage = () => {
    if (!nextCursor || loading) return;
    setLoading(true);
    setCursorStack((prev) => (cursor ? [...prev, cursor] : ['']));
    setCursor(nextCursor);
  };

  const handlePreviousPage = () => {
    if (cursorStack.length === 0 || loading) return;
    setLoading(true);
    const newStack = [...cursorStack];
    const prevCursor = newStack.pop();
    setCursorStack(newStack);
    setCursor(prevCursor === '' ? undefined : prevCursor);
  };

  const setLimit = (val: number) => {
    setLoading(true);
    setCursor(undefined);
    setCursorStack([]);
    setLimitState(val);
  };

  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setStatus('all');
  };

  const handleRefresh = async () => {
    setLoading(true);
    setRefreshKey((k) => k + 1);
  };

  const handleCancel = useCallback(async (publicId: string) => {
    setCancellingId(publicId);
    try {
      await cancelEnrollment(publicId);
      toast.success('Pendaftaran pelatihan berhasil dibatalkan.');
      await handleRefresh();
    } catch (err: unknown) {
      toast.error(toErrorMessage(err));
      throw err;
    } finally {
      setCancellingId(null);
    }
  }, []);

  return {
    enrollments: filteredEnrollments,
    loading,
    error,
    search,
    filters: { status },
    limit,
    hasPreviousPage: cursorStack.length > 0,
    hasNextPage: Boolean(nextCursor),
    cancellingId,
    setSearch,
    setStatus,
    setLimit,
    nextPage: handleNextPage,
    previousPage: handlePreviousPage,
    resetFilters: handleResetFilters,
    refresh: handleRefresh,
    cancel: handleCancel,
  };
}

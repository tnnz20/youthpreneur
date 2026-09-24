import { useCallback, useEffect, useRef, useState } from 'react';

import { useSearchParams } from 'react-router';

import {
  createTrainingCatalog,
  deleteTrainingCatalog,
  listTrainingCatalogs,
  updateTrainingCatalog,
} from '@/lib/api/trainings';
import { toErrorMessage } from '@/lib/utils';

import type {
  CreateTrainingCatalogInput,
  TrainingCatalog,
  TrainingCatalogListResponse,
  TrainingCategory,
  TrainingStatus,
  UpdateTrainingCatalogInput,
} from '@/types/trainings';

import { TRAINING_CATEGORIES, TRAINING_PAGE_SIZE_OPTIONS } from '@/constants/trainings';

export interface TrainingFilters {
  category: TrainingCategory | 'semua';
  training_status: TrainingStatus | 'semua';
}

export interface TrainingState {
  catalogs: TrainingCatalog[];
  filters: TrainingFilters;
  search: string;
  limit: number;
  loading: boolean;
  creating: boolean;
  mutatingId: string | null;
  error: string | null;
  hasCursor: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setSearch: (search: string) => void;
  setCategory: (category: TrainingCategory | 'semua') => void;
  setStatus: (status: TrainingStatus | 'semua') => void;
  setLimit: (limit: number) => void;
  resetFilters: () => void;
  nextPage: () => void;
  previousPage: () => void;
  goToFirstPage: () => void;
  refresh: () => Promise<void>;
  create: (input: CreateTrainingCatalogInput) => Promise<TrainingCatalog>;
  update: (publicId: string, input: UpdateTrainingCatalogInput) => Promise<TrainingCatalog>;
  remove: (publicId: string) => Promise<void>;
}

const DEFAULT_LIMIT = 20;

function parseLimit(value: string | null): number {
  const parsed = Number(value);
  return TRAINING_PAGE_SIZE_OPTIONS.includes(parsed) ? parsed : DEFAULT_LIMIT;
}

function parseCategory(value: string | null): TrainingCategory | 'semua' {
  if (value && (TRAINING_CATEGORIES as readonly string[]).includes(value)) {
    return value as TrainingCategory;
  }
  return 'semua';
}

function parseStatus(value: string | null): TrainingStatus | 'semua' {
  return value === 'planned' || value === 'ongoing' || value === 'completed' ? value : 'semua';
}

export function useTrainings(): TrainingState {
  const [, setSearchParams] = useSearchParams();
  const [initialParams] = useState(() => new URLSearchParams(window.location.search));
  const initialSearch = initialParams.get('search')?.trim() ?? '';

  const [catalogs, setCatalogs] = useState<TrainingCatalog[]>([]);
  const [filters, setFilters] = useState<TrainingFilters>(() => ({
    category: parseCategory(initialParams.get('category')),
    training_status: parseStatus(initialParams.get('status')),
  }));
  const [search, setSearchState] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [limit, setLimitState] = useState(() => parseLimit(initialParams.get('limit')));

  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [cursorStack, setCursorStack] = useState<string[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(handler);
  }, [search]);

  const syncSearchParams = useCallback(
    (newSearch: string, newFilters: TrainingFilters, newLimit: number) => {
      const nextParams = new URLSearchParams();

      if (newSearch) {
        nextParams.set('search', newSearch);
      }
      if (newFilters.category !== 'semua') {
        nextParams.set('category', newFilters.category);
      }
      if (newFilters.training_status !== 'semua') {
        nextParams.set('status', newFilters.training_status);
      }
      if (newLimit !== DEFAULT_LIMIT) {
        nextParams.set('limit', String(newLimit));
      }

      setSearchParams(nextParams, { replace: true });
    },
    [setSearchParams]
  );

  const [fetchTrigger, setFetchTrigger] = useState(0);

  const applyResponse = useCallback((response: TrainingCatalogListResponse) => {
    setCatalogs(response.training_catalogs);
    setNextCursor(response.next_cursor ?? null);
    setError(null);
    setLoading(false);
  }, []);

  const applyError = useCallback((loadError: unknown) => {
    setCatalogs([]);
    setNextCursor(null);
    setError(toErrorMessage(loadError));
    setLoading(false);
  }, []);

  const fetchPage = useCallback(
    (
      activeCursor: string | undefined,
      currentSearch: string,
      currentFilters: TrainingFilters,
      currentLimit: number
    ) => {
      return listTrainingCatalogs({
        cursor: activeCursor,
        limit: currentLimit,
        search: currentSearch || undefined,
        category: currentFilters.category === 'semua' ? undefined : currentFilters.category,
        training_status:
          currentFilters.training_status === 'semua' ? undefined : currentFilters.training_status,
      });
    },
    []
  );

  useEffect(() => {
    const currentRequestId = ++requestIdRef.current;
    syncSearchParams(debouncedSearch, filters, limit);

    fetchPage(cursor, debouncedSearch, filters, limit)
      .then((response) => {
        if (currentRequestId === requestIdRef.current) {
          applyResponse(response);
        }
      })
      .catch((loadError: unknown) => {
        if (currentRequestId === requestIdRef.current) {
          applyError(loadError);
        }
      });
  }, [
    applyError,
    applyResponse,
    cursor,
    debouncedSearch,
    fetchPage,
    filters,
    limit,
    syncSearchParams,
    fetchTrigger,
  ]);

  const setSearch = useCallback((val: string) => {
    setLoading(true);
    setError(null);
    setCursor(undefined);
    setCursorStack([]);
    setSearchState(val);
  }, []);

  const setCategory = useCallback((category: TrainingCategory | 'semua') => {
    setLoading(true);
    setError(null);
    setCursor(undefined);
    setCursorStack([]);
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const setStatus = useCallback((training_status: TrainingStatus | 'semua') => {
    setLoading(true);
    setError(null);
    setCursor(undefined);
    setCursorStack([]);
    setFilters((prev) => ({ ...prev, training_status }));
  }, []);

  const setLimit = useCallback((val: number) => {
    setLoading(true);
    setError(null);
    setCursor(undefined);
    setCursorStack([]);
    setLimitState(val);
  }, []);

  const resetFilters = useCallback(() => {
    setLoading(true);
    setError(null);
    setCursor(undefined);
    setCursorStack([]);
    setSearchState('');
    setDebouncedSearch('');
    setFilters({
      category: 'semua',
      training_status: 'semua',
    });
    setLimitState(DEFAULT_LIMIT);
  }, []);

  const nextPage = useCallback(() => {
    if (!nextCursor || loading) return;
    setLoading(true);
    setError(null);
    setCursorStack((prev) => (cursor ? [...prev, cursor] : ['']));
    setCursor(nextCursor);
  }, [nextCursor, cursor, loading]);

  const previousPage = useCallback(() => {
    if (cursorStack.length === 0 || loading) return;
    setLoading(true);
    setError(null);
    const newStack = [...cursorStack];
    const prevCursor = newStack.pop();
    setCursorStack(newStack);
    const targetCursor = prevCursor === '' ? undefined : prevCursor;
    setCursor(targetCursor);
  }, [cursorStack, loading]);

  const goToFirstPage = useCallback(() => {
    if (!cursor || loading) return;
    setLoading(true);
    setError(null);
    setCursorStack([]);
    setCursor(undefined);
  }, [cursor, loading]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setFetchTrigger((prev) => prev + 1);
  }, []);

  const create = useCallback(
    async (input: CreateTrainingCatalogInput): Promise<TrainingCatalog> => {
      setCreating(true);
      try {
        const created = await createTrainingCatalog(input);
        await refresh();
        return created;
      } finally {
        setCreating(false);
      }
    },
    [refresh]
  );

  const update = useCallback(
    async (publicId: string, input: UpdateTrainingCatalogInput): Promise<TrainingCatalog> => {
      setMutatingId(publicId);
      try {
        const updated = await updateTrainingCatalog(publicId, input);
        await refresh();
        return updated;
      } finally {
        setMutatingId(null);
      }
    },
    [refresh]
  );

  const remove = useCallback(
    async (publicId: string): Promise<void> => {
      setMutatingId(publicId);
      try {
        await deleteTrainingCatalog(publicId);
        await refresh();
      } finally {
        setMutatingId(null);
      }
    },
    [refresh]
  );

  return {
    catalogs,
    filters,
    search,
    limit,
    loading,
    creating,
    mutatingId,
    error,
    hasCursor: cursor !== undefined,
    hasNextPage: Boolean(nextCursor),
    hasPreviousPage: cursorStack.length > 0,
    setSearch,
    setCategory,
    setStatus,
    setLimit,
    resetFilters,
    nextPage,
    previousPage,
    goToFirstPage,
    refresh,
    create,
    update,
    remove,
  };
}

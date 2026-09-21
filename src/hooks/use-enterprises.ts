import { useCallback, useEffect, useRef, useState } from 'react';

import { useSearchParams } from 'react-router';

import {
  createEnterprise,
  deleteEnterprise,
  listEnterprises,
  updateEnterprise,
} from '@/lib/api/enterprises';
import { toErrorMessage } from '@/lib/utils';

import type {
  CreateEnterpriseInput,
  Enterprise,
  EnterpriseListResponse,
  EnterpriseStatus,
  LegalStatus,
  ProcessStatus,
  UpdateEnterpriseInput,
} from '@/types/enterprises';

import { ENTERPRISE_PAGE_SIZE_OPTIONS } from '@/constants/enterprises';

export interface EnterpriseFilters {
  district: string;
  status: EnterpriseStatus | 'all';
  business_sector: string;
  legal_status: LegalStatus | 'all';
  mentoring_status: ProcessStatus | 'all';
}

export interface EnterpriseState {
  enterprises: Enterprise[];
  filters: EnterpriseFilters;
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
  setDistrict: (district: string) => void;
  setStatus: (status: EnterpriseStatus | 'all') => void;
  setBusinessSector: (sector: string) => void;
  setLegalStatus: (legalStatus: LegalStatus | 'all') => void;
  setMentoringStatus: (mentoringStatus: ProcessStatus | 'all') => void;
  setLimit: (limit: number) => void;
  resetFilters: () => void;
  nextPage: () => void;
  previousPage: () => void;
  goToFirstPage: () => void;
  refresh: () => Promise<void>;
  create: (input: CreateEnterpriseInput) => Promise<Enterprise>;
  update: (publicId: string, input: UpdateEnterpriseInput) => Promise<Enterprise>;
  remove: (publicId: string) => Promise<void>;
}

const DEFAULT_LIMIT = 20;

function parseLimit(value: string | null): number {
  const parsed = Number(value);
  return ENTERPRISE_PAGE_SIZE_OPTIONS.includes(parsed) ? parsed : DEFAULT_LIMIT;
}

function parseStatus(value: string | null): EnterpriseStatus | 'all' {
  return value === 'active' || value === 'inactive' ? value : 'all';
}

function parseLegalStatus(value: string | null): LegalStatus | 'all' {
  return value === 'complete' || value === 'in_progress' || value === 'none' ? value : 'all';
}

function parseMentoringStatus(value: string | null): ProcessStatus | 'all' {
  return value === 'completed' || value === 'ongoing' || value === 'planned' ? value : 'all';
}

export function useEnterprises(): EnterpriseState {
  const [, setSearchParams] = useSearchParams();
  const [initialParams] = useState(() => new URLSearchParams(window.location.search));
  const initialSearch = initialParams.get('search')?.trim() ?? '';

  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [filters, setFilters] = useState<EnterpriseFilters>(() => ({
    district: initialParams.get('district')?.trim() ?? '',
    status: parseStatus(initialParams.get('status')),
    business_sector: initialParams.get('business_sector')?.trim() ?? '',
    legal_status: parseLegalStatus(initialParams.get('legal_status')),
    mentoring_status: parseMentoringStatus(initialParams.get('mentoring_status')),
  }));
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [limit, setLimitState] = useState(() => parseLimit(initialParams.get('limit')));
  const [cursor, setCursor] = useState<string | null>(initialParams.get('cursor'));
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  const clearDebounce = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearDebounce();

    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return clearDebounce;
  }, [clearDebounce, search]);

  const applyResponse = useCallback((response: EnterpriseListResponse) => {
    setEnterprises(response.enterprises);
    setNextCursor(response.next_cursor ?? null);
    setError(null);
    setLoading(false);
  }, []);

  const applyError = useCallback((loadError: unknown) => {
    setEnterprises([]);
    setNextCursor(null);
    setError(toErrorMessage(loadError));
    setLoading(false);
  }, []);

  const goToFirstPage = useCallback(() => {
    setLoading(true);
    setError(null);
    setCursorHistory([]);
    setCursor(null);
    setFetchTrigger((prev) => prev + 1);
  }, []);

  const fetchPage = useCallback(
    (
      targetCursor: string | null,
      activeFilters: EnterpriseFilters,
      activeSearch: string,
      pageSize: number
    ) => {
      return listEnterprises({
        cursor: targetCursor ?? undefined,
        limit: pageSize,
        district: activeFilters.district.trim() || undefined,
        status: activeFilters.status === 'all' ? undefined : activeFilters.status,
        business_sector: activeFilters.business_sector.trim() || undefined,
        legal_status: activeFilters.legal_status === 'all' ? undefined : activeFilters.legal_status,
        mentoring_status:
          activeFilters.mentoring_status === 'all' ? undefined : activeFilters.mentoring_status,
        search: activeSearch.trim() || undefined,
      });
    },
    []
  );

  useEffect(() => {
    const requestId = ++requestIdRef.current;

    fetchPage(cursor, filters, debouncedSearch, limit)
      .then((response) => {
        if (requestId !== requestIdRef.current) {
          return;
        }

        if (response.enterprises.length === 0 && cursor !== null) {
          goToFirstPage();
          return;
        }

        applyResponse(response);
      })
      .catch((loadError: unknown) => {
        if (requestId === requestIdRef.current) {
          applyError(loadError);
        }
      });
  }, [
    applyError,
    applyResponse,
    cursor,
    fetchPage,
    filters,
    debouncedSearch,
    goToFirstPage,
    limit,
    fetchTrigger,
  ]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch.trim()) {
      params.set('search', debouncedSearch.trim());
    }

    if (filters.district.trim()) {
      params.set('district', filters.district.trim());
    }

    if (filters.status !== 'all') {
      params.set('status', filters.status);
    }

    if (filters.business_sector.trim()) {
      params.set('business_sector', filters.business_sector.trim());
    }

    if (filters.legal_status !== 'all') {
      params.set('legal_status', filters.legal_status);
    }

    if (filters.mentoring_status !== 'all') {
      params.set('mentoring_status', filters.mentoring_status);
    }

    if (limit !== DEFAULT_LIMIT) {
      params.set('limit', String(limit));
    }

    if (cursor) {
      params.set('cursor', cursor);
    }

    setSearchParams(params, { replace: true });
  }, [cursor, debouncedSearch, filters, limit, setSearchParams]);

  const setSearchValue = useCallback((value: string) => {
    setLoading(true);
    setError(null);
    setCursor(null);
    setCursorHistory([]);
    setSearch(value);
  }, []);

  const setDistrict = useCallback(
    (district: string) => {
      clearDebounce();
      setLoading(true);
      setError(null);
      setCursor(null);
      setCursorHistory([]);
      setFilters((prev) => ({ ...prev, district }));
    },
    [clearDebounce]
  );

  const setStatus = useCallback(
    (status: EnterpriseStatus | 'all') => {
      clearDebounce();
      setLoading(true);
      setError(null);
      setCursor(null);
      setCursorHistory([]);
      setFilters((prev) => ({ ...prev, status }));
    },
    [clearDebounce]
  );

  const setBusinessSector = useCallback(
    (sector: string) => {
      clearDebounce();
      setLoading(true);
      setError(null);
      setCursor(null);
      setCursorHistory([]);
      setFilters((prev) => ({ ...prev, business_sector: sector }));
    },
    [clearDebounce]
  );

  const setLegalStatus = useCallback(
    (legal_status: LegalStatus | 'all') => {
      clearDebounce();
      setLoading(true);
      setError(null);
      setCursor(null);
      setCursorHistory([]);
      setFilters((prev) => ({ ...prev, legal_status }));
    },
    [clearDebounce]
  );

  const setMentoringStatus = useCallback(
    (mentoring_status: ProcessStatus | 'all') => {
      clearDebounce();
      setLoading(true);
      setError(null);
      setCursor(null);
      setCursorHistory([]);
      setFilters((prev) => ({ ...prev, mentoring_status }));
    },
    [clearDebounce]
  );

  const setLimit = useCallback((newLimit: number) => {
    setLoading(true);
    setError(null);
    setCursor(null);
    setCursorHistory([]);
    setLimitState(newLimit);
  }, []);

  const resetFilters = useCallback(() => {
    clearDebounce();
    setLoading(true);
    setError(null);
    setCursor(null);
    setCursorHistory([]);
    setSearch('');
    setDebouncedSearch('');
    setFilters({
      district: '',
      status: 'all',
      business_sector: '',
      legal_status: 'all',
      mentoring_status: 'all',
    });
    setLimitState(DEFAULT_LIMIT);
  }, [clearDebounce]);

  const nextPage = useCallback(() => {
    if (!nextCursor) {
      return;
    }

    setLoading(true);
    setError(null);
    setCursorHistory((prev) => [...prev, cursor]);
    setCursor(nextCursor);
  }, [cursor, nextCursor]);

  const previousPage = useCallback(() => {
    if (cursorHistory.length === 0) {
      return;
    }

    const prevCursor = cursorHistory[cursorHistory.length - 1];
    setLoading(true);
    setError(null);
    setCursorHistory((prev) => prev.slice(0, -1));
    setCursor(prevCursor);
  }, [cursorHistory]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchPage(cursor, filters, debouncedSearch, limit);
      applyResponse(response);
    } catch (loadError: unknown) {
      applyError(loadError);
    }
  }, [applyError, applyResponse, cursor, debouncedSearch, fetchPage, filters, limit]);

  const create = useCallback(
    async (input: CreateEnterpriseInput): Promise<Enterprise> => {
      setCreating(true);
      try {
        const created = await createEnterprise(input);
        setCursorHistory([]);
        setCursor(null);
        try {
          const response = await fetchPage(null, filters, debouncedSearch, limit);
          applyResponse(response);
        } catch (loadError: unknown) {
          applyError(loadError);
        }
        return created;
      } finally {
        setCreating(false);
      }
    },
    [applyError, applyResponse, debouncedSearch, fetchPage, filters, limit]
  );

  const update = useCallback(
    async (publicId: string, input: UpdateEnterpriseInput): Promise<Enterprise> => {
      setMutatingId(publicId);
      try {
        const updated = await updateEnterprise(publicId, input);
        setEnterprises((prev) =>
          prev.map((item) => (item.public_id === publicId ? updated : item))
        );
        return updated;
      } finally {
        setMutatingId(null);
      }
    },
    []
  );

  const remove = useCallback(
    async (publicId: string): Promise<void> => {
      setMutatingId(publicId);
      try {
        await deleteEnterprise(publicId);
        const response = await fetchPage(cursor, filters, debouncedSearch, limit);
        if (response.enterprises.length === 0 && cursor !== null) {
          goToFirstPage();
        } else {
          applyResponse(response);
        }
      } finally {
        setMutatingId(null);
      }
    },
    [applyResponse, cursor, debouncedSearch, fetchPage, filters, goToFirstPage, limit]
  );

  return {
    enterprises,
    filters,
    search,
    limit,
    loading,
    creating,
    mutatingId,
    error,
    hasCursor: cursor !== null,
    hasNextPage: nextCursor !== null,
    hasPreviousPage: cursorHistory.length > 0,
    setSearch: setSearchValue,
    setDistrict,
    setStatus,
    setBusinessSector,
    setLegalStatus,
    setMentoringStatus,
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

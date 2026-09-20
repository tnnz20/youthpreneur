import { useCallback, useEffect, useRef, useState } from 'react';

import { useSearchParams } from 'react-router';

import { createEnterprise, deleteEnterprise, listEnterprises } from '@/lib/api/enterprises';
import { toErrorMessage } from '@/lib/utils';

import type {
  CreateEnterpriseInput,
  Enterprise,
  EnterpriseListResponse,
  EnterpriseStatus,
} from '@/types/enterprises';

import { ENTERPRISE_PAGE_SIZE_OPTIONS } from '@/constants/enterprises';

export interface EnterpriseFilters {
  district: string;
  status: EnterpriseStatus | 'all';
  business_sector: string;
}

export interface EnterpriseState {
  enterprises: Enterprise[];
  filters: EnterpriseFilters;
  limit: number;
  loading: boolean;
  creating: boolean;
  mutatingId: string | null;
  error: string | null;
  hasCursor: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setDistrict: (district: string) => void;
  setStatus: (status: EnterpriseStatus | 'all') => void;
  setBusinessSector: (sector: string) => void;
  setLimit: (limit: number) => void;
  resetFilters: () => void;
  nextPage: () => void;
  previousPage: () => void;
  goToFirstPage: () => void;
  refresh: () => Promise<void>;
  create: (input: CreateEnterpriseInput) => Promise<Enterprise>;
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

export function useEnterprises(): EnterpriseState {
  const [, setSearchParams] = useSearchParams();
  const [initialParams] = useState(() => new URLSearchParams(window.location.search));

  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [filters, setFilters] = useState<EnterpriseFilters>(() => ({
    district: initialParams.get('district')?.trim() ?? '',
    status: parseStatus(initialParams.get('status')),
    business_sector: initialParams.get('business_sector')?.trim() ?? '',
  }));
  const [limit, setLimitState] = useState(() => parseLimit(initialParams.get('limit')));
  const [cursor, setCursor] = useState<string | null>(initialParams.get('cursor'));
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const requestIdRef = useRef(0);

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
    (targetCursor: string | null, activeFilters: EnterpriseFilters, pageSize: number) => {
      return listEnterprises({
        cursor: targetCursor ?? undefined,
        limit: pageSize,
        district: activeFilters.district.trim() || undefined,
        status: activeFilters.status === 'all' ? undefined : activeFilters.status,
        business_sector: activeFilters.business_sector.trim() || undefined,
      });
    },
    []
  );

  useEffect(() => {
    const requestId = ++requestIdRef.current;

    fetchPage(cursor, filters, limit)
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
  }, [applyError, applyResponse, cursor, fetchPage, filters, goToFirstPage, limit, fetchTrigger]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.district.trim()) {
      params.set('district', filters.district.trim());
    }

    if (filters.status !== 'all') {
      params.set('status', filters.status);
    }

    if (filters.business_sector.trim()) {
      params.set('business_sector', filters.business_sector.trim());
    }

    if (limit !== DEFAULT_LIMIT) {
      params.set('limit', String(limit));
    }

    if (cursor) {
      params.set('cursor', cursor);
    }

    setSearchParams(params, { replace: true });
  }, [cursor, filters, limit, setSearchParams]);

  const setDistrict = useCallback((district: string) => {
    setLoading(true);
    setError(null);
    setCursor(null);
    setCursorHistory([]);
    setFilters((prev) => ({ ...prev, district }));
  }, []);

  const setStatus = useCallback((status: EnterpriseStatus | 'all') => {
    setLoading(true);
    setError(null);
    setCursor(null);
    setCursorHistory([]);
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const setBusinessSector = useCallback((sector: string) => {
    setLoading(true);
    setError(null);
    setCursor(null);
    setCursorHistory([]);
    setFilters((prev) => ({ ...prev, business_sector: sector }));
  }, []);

  const setLimit = useCallback((newLimit: number) => {
    setLoading(true);
    setError(null);
    setCursor(null);
    setCursorHistory([]);
    setLimitState(newLimit);
  }, []);

  const resetFilters = useCallback(() => {
    setLoading(true);
    setError(null);
    setCursor(null);
    setCursorHistory([]);
    setFilters({
      district: '',
      status: 'all',
      business_sector: '',
    });
    setLimitState(DEFAULT_LIMIT);
  }, []);

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
      const response = await fetchPage(cursor, filters, limit);
      applyResponse(response);
    } catch (loadError: unknown) {
      applyError(loadError);
    }
  }, [applyError, applyResponse, cursor, fetchPage, filters, limit]);

  const create = useCallback(
    async (input: CreateEnterpriseInput): Promise<Enterprise> => {
      setCreating(true);
      try {
        const created = await createEnterprise(input);
        setCursorHistory([]);
        setCursor(null);
        try {
          const response = await fetchPage(null, filters, limit);
          applyResponse(response);
        } catch (loadError: unknown) {
          applyError(loadError);
        }
        return created;
      } finally {
        setCreating(false);
      }
    },
    [applyError, applyResponse, fetchPage, filters, limit]
  );

  const remove = useCallback(
    async (publicId: string): Promise<void> => {
      setMutatingId(publicId);
      try {
        await deleteEnterprise(publicId);
        const response = await fetchPage(cursor, filters, limit);
        if (response.enterprises.length === 0 && cursor !== null) {
          goToFirstPage();
        } else {
          applyResponse(response);
        }
      } finally {
        setMutatingId(null);
      }
    },
    [applyResponse, cursor, fetchPage, filters, goToFirstPage, limit]
  );

  return {
    enterprises,
    filters,
    limit,
    loading,
    creating,
    mutatingId,
    error,
    hasCursor: cursor !== null,
    hasNextPage: nextCursor !== null,
    hasPreviousPage: cursorHistory.length > 0,
    setDistrict,
    setStatus,
    setBusinessSector,
    setLimit,
    resetFilters,
    nextPage,
    previousPage,
    goToFirstPage,
    refresh,
    create,
    remove,
  };
}

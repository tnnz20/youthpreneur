import { useCallback, useEffect, useRef, useState } from 'react';

import { useSearchParams } from 'react-router';

import { deleteUser, listUsers, updateUserStatus } from '@/lib/api/users';
import { toErrorMessage } from '@/lib/utils';

import type { User, UserGender, UserListResponse } from '@/types/users';

import { USER_PAGE_SIZE_OPTIONS } from '@/constants/users';

export interface UserFilters {
  district: string;
  gender: UserGender | 'all';
}

export interface UserState {
  users: User[];
  filters: UserFilters;
  search: string;
  limit: number;
  loading: boolean;
  mutatingId: string | null;
  error: string | null;
  hasCursor: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setSearch: (search: string) => void;
  setDistrict: (district: string) => void;
  setGender: (gender: UserGender | 'all') => void;
  setLimit: (limit: number) => void;
  resetFilters: () => void;
  nextPage: () => void;
  previousPage: () => void;
  goToFirstPage: () => void;
  deactivate: (publicId: string) => Promise<void>;
  activate: (publicId: string) => Promise<void>;
  remove: (publicId: string) => Promise<void>;
}

const DEFAULT_LIMIT = 20;

function parseLimit(value: string | null): number {
  const parsed = Number(value);
  return USER_PAGE_SIZE_OPTIONS.includes(parsed) ? parsed : DEFAULT_LIMIT;
}

function parseGender(value: string | null): UserGender | 'all' {
  return value === 'male' || value === 'female' ? value : 'all';
}

export function useUsers(): UserState {
  const [, setSearchParams] = useSearchParams();
  const [initialParams] = useState(() => new URLSearchParams(window.location.search));
  const initialSearch = initialParams.get('search') ?? '';

  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState<UserFilters>(() => ({
    district: initialParams.get('district')?.toUpperCase() ?? '',
    gender: parseGender(initialParams.get('gender')),
  }));
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [limit, setLimitState] = useState(() => parseLimit(initialParams.get('limit')));
  const [cursor, setCursor] = useState<string | null>(initialParams.get('cursor'));
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  const applyResponse = useCallback((response: UserListResponse) => {
    setUsers(response.users);
    setNextCursor(response.next_cursor ?? null);
    setError(null);
    setLoading(false);
  }, []);

  const goToFirstPage = useCallback(() => {
    setLoading(true);
    setError(null);
    setCursorHistory([]);
    setCursor(null);
  }, []);

  const applyError = useCallback((loadError: unknown) => {
    setUsers([]);
    setNextCursor(null);
    setError(toErrorMessage(loadError));
    setLoading(false);
  }, []);

  const fetchPage = useCallback(
    (
      targetCursor: string | null,
      activeFilters: UserFilters,
      activeSearch: string,
      pageSize: number
    ) => {
      return listUsers({
        cursor: targetCursor ?? undefined,
        limit: pageSize,
        district: activeFilters.district.trim() || undefined,
        gender: activeFilters.gender === 'all' ? undefined : activeFilters.gender,
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

        if (response.users.length === 0 && cursor !== null) {
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
    goToFirstPage,
    debouncedSearch,
    limit,
  ]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch.trim()) {
      params.set('search', debouncedSearch.trim());
    }

    if (filters.district.trim()) {
      params.set('district', filters.district.trim());
    }

    if (filters.gender !== 'all') {
      params.set('gender', filters.gender);
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
      setFilters((current) => ({ ...current, district }));
    },
    [clearDebounce]
  );

  const setGender = useCallback(
    (gender: UserGender | 'all') => {
      clearDebounce();
      setLoading(true);
      setError(null);
      setCursor(null);
      setCursorHistory([]);
      setFilters((current) => ({ ...current, gender }));
    },
    [clearDebounce]
  );

  const setLimit = useCallback(
    (nextLimit: number) => {
      clearDebounce();
      setLoading(true);
      setError(null);
      setCursor(null);
      setCursorHistory([]);
      setLimitState(nextLimit);
    },
    [clearDebounce]
  );

  const resetFilters = useCallback(() => {
    clearDebounce();
    setLoading(true);
    setError(null);
    setCursor(null);
    setCursorHistory([]);
    setSearch('');
    setDebouncedSearch('');
    setFilters({ district: '', gender: 'all' });
  }, [clearDebounce]);

  const nextPage = useCallback(() => {
    if (loading || !nextCursor) {
      return;
    }

    setLoading(true);
    setError(null);
    setCursorHistory((history) => [...history, cursor]);
    setCursor(nextCursor);
  }, [cursor, loading, nextCursor]);

  const previousPage = useCallback(() => {
    if (loading || cursorHistory.length === 0) {
      return;
    }

    setLoading(true);
    setError(null);
    setCursorHistory((history) => history.slice(0, -1));
    setCursor(cursorHistory[cursorHistory.length - 1]);
  }, [cursorHistory, loading]);

  const updateStatus = useCallback(
    async (publicId: string, isActive: boolean) => {
      setMutatingId(publicId);

      try {
        await updateUserStatus(publicId, isActive);
        await fetchPage(cursor, filters, debouncedSearch, limit).then(applyResponse, applyError);
      } finally {
        setMutatingId(null);
      }
    },
    [applyError, applyResponse, cursor, fetchPage, filters, debouncedSearch, limit]
  );

  const deactivate = useCallback(
    (publicId: string) => updateStatus(publicId, false),
    [updateStatus]
  );

  const activate = useCallback((publicId: string) => updateStatus(publicId, true), [updateStatus]);

  const remove = useCallback(
    async (publicId: string) => {
      setMutatingId(publicId);

      try {
        await deleteUser(publicId);
        await fetchPage(cursor, filters, debouncedSearch, limit).then(applyResponse, applyError);
      } finally {
        setMutatingId(null);
      }
    },
    [applyError, applyResponse, cursor, fetchPage, filters, debouncedSearch, limit]
  );

  return {
    users,
    filters,
    search,
    limit,
    loading,
    mutatingId,
    error,
    hasCursor: cursor !== null,
    hasNextPage: nextCursor !== null,
    hasPreviousPage: cursorHistory.length > 0,
    setSearch: setSearchValue,
    setDistrict,
    setGender,
    setLimit,
    resetFilters,
    nextPage,
    previousPage,
    goToFirstPage,
    deactivate,
    activate,
    remove,
  };
}

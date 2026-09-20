import { useCallback, useEffect, useState } from 'react';

import { deleteUser, listUsers, updateUserStatus } from '@/lib/api/users';

import type { User, UserGender, UserListResponse } from '@/types/users';

export interface UserFilters {
  district: string;
  gender: UserGender | 'all';
}

export interface UserState {
  users: User[];
  filters: UserFilters;
  loading: boolean;
  mutatingId: string | null;
  error: string | null;
  nextCursor: string | null;
  hasNextPage: boolean;
  setDistrict: (district: string) => void;
  setGender: (gender: UserGender | 'all') => void;
  resetFilters: () => void;
  nextPage: () => void;
  refresh: () => void;
  deactivate: (publicId: string) => Promise<void>;
  remove: (publicId: string) => Promise<void>;
}

const LIMIT = 20;

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
}

export function useUsers(): UserState {
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState<UserFilters>({ district: '', gender: 'all' });
  const [cursor, setCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applyResponse = useCallback((response: UserListResponse) => {
    setUsers(response.users);
    setNextCursor(response.next_cursor ?? null);
    setError(null);
    setLoading(false);
  }, []);

  const applyError = useCallback((loadError: unknown) => {
    setUsers([]);
    setNextCursor(null);
    setError(toErrorMessage(loadError));
    setLoading(false);
  }, []);

  const fetchPage = useCallback((targetCursor: string | null, activeFilters: UserFilters) => {
    return listUsers({
      cursor: targetCursor ?? undefined,
      limit: LIMIT,
      district: activeFilters.district.trim() || undefined,
      gender: activeFilters.gender === 'all' ? undefined : activeFilters.gender,
    });
  }, []);

  useEffect(() => {
    fetchPage(cursor, filters).then(applyResponse).catch(applyError);
  }, [applyError, applyResponse, cursor, fetchPage, filters]);

  const setDistrict = useCallback((district: string) => {
    setLoading(true);
    setError(null);
    setCursor(null);
    setFilters((current) => ({ ...current, district }));
  }, []);

  const setGender = useCallback((gender: UserGender | 'all') => {
    setLoading(true);
    setError(null);
    setCursor(null);
    setFilters((current) => ({ ...current, gender }));
  }, []);

  const resetFilters = useCallback(() => {
    setLoading(true);
    setError(null);
    setCursor(null);
    setFilters({ district: '', gender: 'all' });
  }, []);

  const nextPage = useCallback(() => {
    if (loading || !nextCursor) {
      return;
    }

    setLoading(true);
    setError(null);
    setCursor(nextCursor);
  }, [loading, nextCursor]);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchPage(cursor, filters).then(applyResponse).catch(applyError);
  }, [applyError, applyResponse, cursor, fetchPage, filters]);

  const deactivate = useCallback(
    async (publicId: string) => {
      setMutatingId(publicId);

      try {
        await updateUserStatus(publicId, false);
        await fetchPage(cursor, filters).then(applyResponse, applyError);
      } catch (mutationError) {
        setError(toErrorMessage(mutationError));
        throw mutationError;
      } finally {
        setMutatingId(null);
      }
    },
    [applyError, applyResponse, cursor, fetchPage, filters]
  );

  const remove = useCallback(
    async (publicId: string) => {
      setMutatingId(publicId);

      try {
        await deleteUser(publicId);
        await fetchPage(cursor, filters).then(applyResponse, applyError);
      } catch (mutationError) {
        setError(toErrorMessage(mutationError));
        throw mutationError;
      } finally {
        setMutatingId(null);
      }
    },
    [applyError, applyResponse, cursor, fetchPage, filters]
  );

  return {
    users,
    filters,
    loading,
    mutatingId,
    error,
    nextCursor,
    hasNextPage: nextCursor !== null,
    setDistrict,
    setGender,
    resetFilters,
    nextPage,
    refresh,
    deactivate,
    remove,
  };
}

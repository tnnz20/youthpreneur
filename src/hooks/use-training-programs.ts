import { useCallback, useMemo, useState } from 'react';

import { ALL_FILTER } from '@/hooks/use-youth-directory';

import type { NewTrainingProgram, TrainingProgram } from '@/types/dashboard';

import { TRAINING_PROGRAMS } from '@/constants/dashboard';

export function useTrainingPrograms() {
  const [programs, setPrograms] = useState<TrainingProgram[]>(TRAINING_PROGRAMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string>(ALL_FILTER);
  const [status, setStatus] = useState<string>(ALL_FILTER);

  const filtered = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    return programs.filter((item) => {
      const matchesCategory = category === ALL_FILTER || item.kategori === category;
      const matchesStatus = status === ALL_FILTER || item.status === status;
      const matchesSearch =
        !query ||
        [item.judul, item.mentor, item.lokasi, item.deskripsi].some((value) =>
          value.toLowerCase().includes(query)
        );

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [programs, searchTerm, category, status]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setCategory(ALL_FILTER);
    setStatus(ALL_FILTER);
  }, []);

  const addProgram = useCallback((input: NewTrainingProgram) => {
    setPrograms((current) => [
      {
        ...input,
        id: `PRG-${String(current.length + 1).padStart(3, '0')}`,
        terdaftar: 0,
      },
      ...current,
    ]);
  }, []);

  const updateProgram = useCallback((id: string, input: NewTrainingProgram) => {
    setPrograms((current) =>
      current.map((item) => (item.id === id ? { ...item, ...input } : item))
    );
  }, []);

  const removeProgram = useCallback((id: string) => {
    setPrograms((current) => current.filter((item) => item.id !== id));
  }, []);

  return {
    programs,
    filtered,
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
    status,
    setStatus,
    resetFilters,
    addProgram,
    updateProgram,
    removeProgram,
  };
}

export type TrainingProgramState = ReturnType<typeof useTrainingPrograms>;

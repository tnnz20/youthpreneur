import { useCallback, useMemo, useState } from 'react';

import { ALL_FILTER } from '@/hooks/use-youth-directory';

import type { ProgramRegistration, RegistrationStatus, TrainingProgram } from '@/types/dashboard';

import { CURRENT_USER, PROGRAM_REGISTRATIONS } from '@/constants/dashboard';

export function useProgramRegistrations() {
  const [registrations, setRegistrations] = useState<ProgramRegistration[]>(PROGRAM_REGISTRATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<string>(ALL_FILTER);
  const [programId, setProgramId] = useState<string>(ALL_FILTER);

  const filtered = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    return registrations.filter((item) => {
      const matchesStatus = status === ALL_FILTER || item.status === status;
      const matchesProgram = programId === ALL_FILTER || item.programId === programId;
      const matchesSearch =
        !query ||
        [item.nama, item.programJudul, item.kecamatan].some((value) =>
          value.toLowerCase().includes(query)
        );

      return matchesStatus && matchesProgram && matchesSearch;
    });
  }, [registrations, searchTerm, status, programId]);

  const myRegistrations = useMemo(
    () => registrations.filter((item) => item.nama === CURRENT_USER.nama),
    [registrations]
  );

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setStatus(ALL_FILTER);
    setProgramId(ALL_FILTER);
  }, []);

  const setRegistrationStatus = useCallback((id: string, nextStatus: RegistrationStatus) => {
    setRegistrations((current) =>
      current.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
    );
  }, []);

  const isRegistered = useCallback(
    (targetProgramId: string) => myRegistrations.some((item) => item.programId === targetProgramId),
    [myRegistrations]
  );

  const register = useCallback((program: TrainingProgram) => {
    setRegistrations((current) => {
      if (
        current.some((item) => item.nama === CURRENT_USER.nama && item.programId === program.id)
      ) {
        return current;
      }

      return [
        {
          id: `REG-${String(current.length + 1).padStart(3, '0')}`,
          programId: program.id,
          programJudul: program.judul,
          nama: CURRENT_USER.nama,
          kecamatan: CURRENT_USER.kecamatan,
          kontak: CURRENT_USER.kontak,
          tanggal: 'Hari ini',
          status: 'Menunggu',
        },
        ...current,
      ];
    });
  }, []);

  return {
    registrations,
    filtered,
    myRegistrations,
    searchTerm,
    setSearchTerm,
    status,
    setStatus,
    programId,
    setProgramId,
    resetFilters,
    setRegistrationStatus,
    isRegistered,
    register,
  };
}

export type ProgramRegistrationState = ReturnType<typeof useProgramRegistrations>;

import { useCallback, useMemo, useState } from 'react';

import type { NewYouthProfile, YouthProfile, YouthStatus } from '@/types/database';

import { CATEGORY_BADGE_COLORS, CATEGORY_ICONS, YOUTH_DATABASE } from '@/constants/database';

export const ALL_FILTER = 'ALL';

export function useYouthDirectory() {
  const [profiles, setProfiles] = useState<YouthProfile[]>(YOUTH_DATABASE);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(ALL_FILTER);
  const [kecamatan, setKecamatan] = useState(ALL_FILTER);
  const [status, setStatus] = useState(ALL_FILTER);

  const filtered = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    return profiles.filter((item) => {
      const matchesCategory = category === ALL_FILTER || item.kategori === category;
      const matchesKecamatan = kecamatan === ALL_FILTER || item.kecamatan === kecamatan;
      const matchesStatus = status === ALL_FILTER || item.status === status;
      const matchesSearch =
        !query ||
        [item.nama, item.usaha, item.kecamatan, item.produk, item.deskripsi, item.kategori].some(
          (value) => value.toLowerCase().includes(query)
        );

      return matchesCategory && matchesKecamatan && matchesStatus && matchesSearch;
    });
  }, [profiles, searchTerm, category, kecamatan, status]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setCategory(ALL_FILTER);
    setKecamatan(ALL_FILTER);
    setStatus(ALL_FILTER);
  }, []);

  const addProfile = useCallback((input: NewYouthProfile) => {
    setProfiles((current) => [
      {
        id: `TPN-${String(current.length + 1).padStart(3, '0')}`,
        nama: input.nama,
        usaha: input.usaha,
        kecamatan: input.kecamatan,
        kategori: input.kategori,
        status: 'Binaan Aktif',
        badgeColor: CATEGORY_BADGE_COLORS[input.kategori],
        icon: CATEGORY_ICONS[input.kategori],
        produk: input.usaha,
        deskripsi:
          input.deskripsi ||
          'Pemuda wirausaha terdaftar mandiri melalui sistem BADAPATAN Dispora Tapin.',
        kontak: input.kontak,
      },
      ...current,
    ]);
  }, []);

  const updateStatus = useCallback((id: string, status: YouthStatus) => {
    setProfiles((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  }, []);

  return {
    profiles,
    filtered,
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
    kecamatan,
    setKecamatan,
    status,
    setStatus,
    resetFilters,
    addProfile,
    updateStatus,
  };
}

export type YouthDirectoryState = ReturnType<typeof useYouthDirectory>;

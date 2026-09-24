import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { TrainingCategory, TrainingStatus } from '@/types/trainings';

import { TRAINING_CATEGORIES, TRAINING_STATUS_OPTIONS } from '@/constants/trainings';

import { RotateCcw, Search } from 'lucide-react';

import { ORDER_OPTIONS, quickCategoryPillBase, selectTriggerClass } from './constants';

interface CatalogFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  status: TrainingStatus | 'semua';
  onStatusChange: (status: TrainingStatus | 'semua') => void;
  order: 'desc' | 'asc';
  onOrderChange: (order: 'desc' | 'asc') => void;
  category: TrainingCategory | 'semua';
  onCategoryChange: (category: TrainingCategory | 'semua') => void;
  onResetFilters: () => void;
  onReload: () => void;
  filtersActive: boolean;
  loading: boolean;
}

export function CatalogFilterBar({
  searchTerm,
  onSearchChange,
  status,
  onStatusChange,
  order,
  onOrderChange,
  category,
  onCategoryChange,
  onResetFilters,
  onReload,
  filtersActive,
  loading,
}: CatalogFilterBarProps) {
  return (
    <div className="border-brand-dark shadow-solid mb-10 rounded-3xl border-2 bg-white p-5 sm:p-6">
      {/* Top Filter Fields: Search, Status, Urutan (Kategori dropdown removed) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-6">
          <label
            htmlFor="katalog-search"
            className="text-brand-muted mb-1.5 block text-[11px] font-black tracking-wider uppercase"
          >
            Pencarian Program
          </label>
          <div className="relative">
            <Search
              className="text-brand-muted pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              id="katalog-search"
              type="search"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Cari judul pelatihan atau mentor..."
              className="text-brand-dark focus-visible:border-brand-dark border-brand-dark/25 h-11 rounded-xl bg-white pr-4 pl-10 text-sm focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="md:col-span-3">
          <label
            htmlFor="katalog-status"
            className="text-brand-muted mb-1.5 block text-[11px] font-black tracking-wider uppercase"
          >
            Status
          </label>
          <Select
            value={status === 'semua' ? null : status}
            onValueChange={(val) => onStatusChange((val ?? 'semua') as TrainingStatus | 'semua')}
            items={TRAINING_STATUS_OPTIONS}
          >
            <SelectTrigger id="katalog-status" className={selectTriggerClass}>
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              {TRAINING_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.label} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-3">
          <label
            htmlFor="katalog-order"
            className="text-brand-muted mb-1.5 block text-[11px] font-black tracking-wider uppercase"
          >
            Urutan
          </label>
          <Select
            value={order}
            onValueChange={(val) => onOrderChange((val ?? 'desc') as 'desc' | 'asc')}
            items={ORDER_OPTIONS}
          >
            <SelectTrigger id="katalog-order" className={selectTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ORDER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Divider */}
      <div className="space-y-3 border-t border-black/10 pt-4">
        {/* Quick Category Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="text-brand-muted mr-1 text-[11px] font-black uppercase">
            Kategori Cepat:
          </span>
          <button
            type="button"
            onClick={() => onCategoryChange('semua')}
            className={`${quickCategoryPillBase} ${
              category === 'semua'
                ? 'bg-brand-dark border-brand-dark shadow-solid-sm text-white'
                : 'border-brand-dark/20 text-brand-muted hover:border-brand-dark hover:text-brand-dark bg-white'
            }`}
          >
            Semua
          </button>
          {TRAINING_CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={`${quickCategoryPillBase} ${
                  active
                    ? 'bg-brand-dark border-brand-dark shadow-solid-sm text-white'
                    : 'border-brand-dark/20 text-brand-muted hover:border-brand-dark hover:text-brand-dark bg-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Action Buttons: Reset Filter & Muat Ulang moved to the left */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            disabled={loading || !filtersActive}
            className="border-brand-dark hover:bg-brand-yellow rounded-full text-xs font-bold disabled:opacity-40"
          >
            <RotateCcw className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
            Reset Filter
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReload}
            disabled={loading}
            className="border-brand-dark rounded-full text-xs font-bold hover:bg-black/5"
          >
            <RotateCcw
              className={`mr-1 h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            Muat Ulang
          </Button>
        </div>
      </div>
    </div>
  );
}

import { CatalogCard } from '@/components/training-catalog/catalog-card';
import { CatalogDetailDialog } from '@/components/training-catalog/catalog-detail-dialog';
import { CatalogEmptyState } from '@/components/training-catalog/catalog-empty-state';
import { CatalogEnrollDialog } from '@/components/training-catalog/catalog-enroll-dialog';
import { CatalogFilterBar } from '@/components/training-catalog/catalog-filter-bar';
import { CatalogSkeletonGrid } from '@/components/training-catalog/catalog-skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { useTrainingCatalog } from '@/hooks/use-training-catalog';

export default function TrainingCatalogPage() {
  const {
    catalogs,
    loading,
    error,
    searchTerm,
    category,
    status,
    order,
    filtersActive,
    cursorStack,
    nextCursor,
    enrolledCatalogIds,
    enrollingId,
    selectedCatalog,
    setSelectedCatalog,
    pendingEnrollCatalog,
    handleSearchChange,
    handleCategoryChange,
    handleStatusChange,
    handleOrderChange,
    handleResetFilters,
    handleReload,
    handleNextPage,
    handlePreviousPage,
    handleEnroll,
    handleConfirmEnroll,
    handleCloseEnrollDialog,
  } = useTrainingCatalog();

  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="bg-brand-yellow border-brand-dark text-brand-dark mb-3 inline-block rounded-full border-2 px-3 py-1 text-xs font-black uppercase">
              Program Pelatihan Resmi Dispora
            </div>
            <h1 className="text-brand-dark text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Katalog Program Pelatihan
            </h1>
            <p className="text-brand-muted mt-2 max-w-2xl text-sm leading-relaxed sm:text-base">
              Temukan program inkubasi dan pelatihan wirausaha Kabupaten Tapin yang sesuai dengan
              minatmu. Tingkatkan keahlian komoditas lokal, pemasaran digital, dan sertifikasi
              usaha.
            </p>
          </div>

          <div className="border-brand-dark shadow-solid-sm flex items-center gap-2 self-start rounded-2xl border-2 bg-white px-4 py-2.5 text-xs font-bold md:self-auto">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
            <span>
              Menampilkan <strong className="text-brand-dark text-sm">{catalogs.length}</strong>{' '}
              Program
            </span>
          </div>
        </div>

        {/* Filter Bar with Kategori dropdown removed and actions on left */}
        <CatalogFilterBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          status={status}
          onStatusChange={handleStatusChange}
          order={order}
          onOrderChange={handleOrderChange}
          category={category}
          onCategoryChange={handleCategoryChange}
          onResetFilters={handleResetFilters}
          onReload={handleReload}
          filtersActive={filtersActive}
          loading={loading}
        />

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="border-brand-dark shadow-solid mb-8 rounded-2xl border-2 bg-rose-50 p-5 text-center text-sm font-semibold text-rose-700"
          >
            {error}
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && <CatalogSkeletonGrid count={9} />}

        {/* Catalog Cards Grid */}
        {!loading && catalogs.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {catalogs.map((catalog) => (
              <CatalogCard
                key={catalog.public_id}
                catalog={catalog}
                isEnrolled={enrolledCatalogIds.has(catalog.public_id)}
                isEnrolling={enrollingId === catalog.public_id}
                onEnroll={handleEnroll}
                onSelect={setSelectedCatalog}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && catalogs.length === 0 && (
          <CatalogEmptyState filtersActive={filtersActive} onResetFilters={handleResetFilters} />
        )}

        {/* Pagination Footer */}
        {!loading && (cursorStack.length > 0 || nextCursor) && (
          <div className="mt-10 flex justify-center">
            <Pagination className="mx-0 w-auto">
              <PaginationContent className="gap-2.5">
                <PaginationItem>
                  <PaginationPrevious
                    text="Sebelumnya"
                    disabled={loading || cursorStack.length === 0}
                    className="border-brand-dark rounded-full font-bold"
                    onClick={handlePreviousPage}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    text="Berikutnya"
                    disabled={loading || !nextCursor}
                    className="border-brand-dark rounded-full font-bold"
                    onClick={handleNextPage}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Public Program Detail Dialog */}
      <CatalogDetailDialog
        catalog={selectedCatalog}
        open={selectedCatalog !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedCatalog(null);
        }}
        isEnrolled={selectedCatalog !== null && enrolledCatalogIds.has(selectedCatalog.public_id)}
        isEnrolling={selectedCatalog !== null && enrollingId === selectedCatalog.public_id}
        onEnroll={handleEnroll}
      />

      {/* Program Registration Confirmation Dialog */}
      <CatalogEnrollDialog
        catalog={pendingEnrollCatalog}
        open={pendingEnrollCatalog !== null}
        onOpenChange={handleCloseEnrollDialog}
        loading={enrollingId !== null}
        onConfirm={handleConfirmEnroll}
      />
    </div>
  );
}

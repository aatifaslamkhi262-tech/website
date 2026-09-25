'use client';

import React from 'react';
import { Product, PaginationMeta } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight, PackageSearch, RefreshCw } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  pagination: PaginationMeta;
  loading: boolean;
  onPageChange: (page: number) => void;
  onResetFilters?: () => void;
  onQuickView: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  pagination,
  loading,
  onPageChange,
  onResetFilters,
  onQuickView,
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 space-y-3 animate-pulse">
              <div className="w-full aspect-[4/3] bg-slate-100 rounded-lg" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 rounded w-1/3" />
                <div className="h-4 bg-slate-100 rounded w-4/5" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
              </div>
              <div className="h-8 bg-slate-100 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center my-8 max-w-md mx-auto shadow-2xs">
        <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <PackageSearch className="w-7 h-7" />
        </div>
        <h3 className="font-bold text-slate-900 text-base mb-1">No matching products found</h3>
        <p className="text-slate-500 text-xs mb-6">
          We couldn't find any products matching your current search, price, or category filters.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-2xs transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        )}
      </div>
    );
  }

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const current = pagination.page;
    const totalPages = pagination.totalPages || 1;

    let startPage = Math.max(1, current - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
            current === 1
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots-1" className="text-xs text-slate-400 font-semibold px-1">...</span>);
      }
    }

    for (let p = startPage; p <= endPage; p++) {
      pages.push(
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
            current === p
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {p}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots-2" className="text-xs text-slate-400 font-semibold px-1">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
            current === totalPages
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* 2-Column Mobile & Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
        {products.map(product => (
          <ProductCard key={product._id} product={product} onQuickView={onQuickView} />
        ))}
      </div>

      {/* Pagination Bar */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80">
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
            <span className="font-bold text-slate-900">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-bold text-slate-900">{pagination.total}</span> products
          </p>

          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>

            {renderPageNumbers()}

            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Category, ProductCondition } from '@/lib/types';
import { Filter, SlidersHorizontal, RotateCcw, ChevronDown, Check } from 'lucide-react';

interface CategoryPillsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  selectedCondition: ProductCondition | 'All';
  onSelectCondition: (condition: ProductCondition | 'All') => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (val: string) => void;
  onMaxPriceChange: (val: string) => void;
  inStockOnly: boolean;
  onInStockOnlyToggle: (val: boolean) => void;
  sortBy: 'latest' | 'price_asc' | 'price_desc' | 'name_asc';
  onSortByChange: (val: 'latest' | 'price_asc' | 'price_desc' | 'name_asc') => void;
  onResetFilters: () => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedCondition,
  onSelectCondition,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  inStockOnly,
  onInStockOnlyToggle,
  sortBy,
  onSortByChange,
  onResetFilters,
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<'category' | 'grade' | 'sort' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close custom popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeFiltersCount = (selectedCategory !== 'All' ? 1 : 0) +
    (selectedCondition !== 'All' ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const currentCategoryLabel = selectedCategory === 'All'
    ? 'Category: All'
    : (categories.find(c => c._id === selectedCategory || c.slug === selectedCategory)?.name || 'Category');

  const currentConditionLabel = selectedCondition === 'All'
    ? 'Grade: All'
    : selectedCondition === 'Used'
    ? 'Pre-Owned'
    : selectedCondition;

  const currentSortLabel = sortBy === 'latest'
    ? 'Sort: Latest'
    : sortBy === 'price_asc'
    ? 'Price: Low to High'
    : sortBy === 'price_desc'
    ? 'Price: High to Low'
    : 'Name A-Z';

  return (
    <div ref={containerRef} className="space-y-3">
      {/* Streamlined Filter Toolbar: Custom Popover Dropdowns */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Custom Category Popover Dropdown */}
        <div className="relative col-span-1">
          <button
            type="button"
            onClick={() => setOpenDropdown(prev => prev === 'category' ? null : 'category')}
            className={`w-full sm:w-auto inline-flex items-center justify-between gap-1.5 border rounded-xl px-3 py-2 text-xs font-bold transition-all shadow-2xs ${
              selectedCategory !== 'All'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="truncate">{currentCategoryLabel}</span>
            <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${openDropdown === 'category' ? 'rotate-180' : ''}`} />
          </button>

          {openDropdown === 'category' && (
            <div className="absolute top-full left-0 mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-64 overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('All');
                  setOpenDropdown(null);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs font-bold flex items-center justify-between transition-colors ${
                  selectedCategory === 'All' ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>Category: All</span>
                {selectedCategory === 'All' && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              </button>

              <div className="border-t border-slate-100 my-1" />

              {categories.map(c => {
                const isSel = selectedCategory === c._id || selectedCategory === c.slug;
                return (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => {
                      onSelectCategory(c._id);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-bold flex items-center justify-between transition-colors ${
                      isSel ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    {isSel && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Custom Condition Grade Popover Dropdown */}
        <div className="relative col-span-1">
          <button
            type="button"
            onClick={() => setOpenDropdown(prev => prev === 'grade' ? null : 'grade')}
            className={`w-full sm:w-auto inline-flex items-center justify-between gap-1.5 border rounded-xl px-3 py-2 text-xs font-bold transition-all shadow-2xs ${
              selectedCondition !== 'All'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="truncate">{currentConditionLabel}</span>
            <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${openDropdown === 'grade' ? 'rotate-180' : ''}`} />
          </button>

          {openDropdown === 'grade' && (
            <div className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              {[
                { val: 'All', label: 'Grade: All' },
                { val: 'New', label: 'New' },
                { val: 'Used', label: 'Pre-Owned (Used)' },
                { val: 'Refurbished', label: 'Refurbished' },
              ].map(opt => {
                const isSel = selectedCondition === opt.val;
                return (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => {
                      onSelectCondition(opt.val as any);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-bold flex items-center justify-between transition-colors ${
                      isSel ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSel && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Price & Stock Mobile Toggle */}
        <button
          type="button"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className={`col-span-1 md:hidden inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-bold border transition-all shadow-2xs ${
            showMobileFilters || minPrice || maxPrice || inStockOnly
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-white text-slate-700 border-slate-200'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
          <span>Price & Stock</span>
        </button>

        {/* Desktop Price Range Inputs */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200/80">
          <span className="text-slate-500 text-[11px] px-1 font-bold">PKR:</span>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={e => onMinPriceChange(e.target.value)}
            className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
          />
          <span className="text-slate-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={e => onMaxPriceChange(e.target.value)}
            className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Desktop In-Stock Only Checkbox */}
        <label className="hidden lg:flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-xl cursor-pointer shadow-2xs font-bold text-slate-700">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={e => onInStockOnlyToggle(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
          />
          <span>In-Stock Only</span>
        </label>

        {/* Custom Sort Popover Dropdown + Reset Button */}
        <div className="col-span-1 flex items-center gap-1.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <button
              type="button"
              onClick={() => setOpenDropdown(prev => prev === 'sort' ? null : 'sort')}
              className="w-full sm:w-auto inline-flex items-center justify-between gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 hover:border-slate-300 transition-all shadow-2xs"
            >
              <span className="truncate">{currentSortLabel}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
            </button>

            {openDropdown === 'sort' && (
              <div className="absolute top-full right-0 sm:right-auto sm:left-0 mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {[
                  { val: 'latest', label: 'Sort: Latest' },
                  { val: 'price_asc', label: 'Price: Low to High' },
                  { val: 'price_desc', label: 'Price: High to Low' },
                  { val: 'name_asc', label: 'Name A-Z' },
                ].map(opt => {
                  const isSel = sortBy === opt.val;
                  return (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => {
                        onSortByChange(opt.val as any);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-bold flex items-center justify-between transition-colors ${
                        isSel ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSel && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={onResetFilters}
              className="p-2 text-rose-600 hover:bg-rose-50 bg-white rounded-xl border border-rose-200 transition-colors flex items-center gap-1 font-bold text-xs shrink-0"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Mobile Expandable Filter Panel */}
      {showMobileFilters && (
        <div className="md:hidden pt-3 border-t border-slate-100 space-y-3 bg-slate-50 p-3 rounded-2xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Price Range (PKR)</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min PKR"
              value={minPrice}
              onChange={e => onMinPriceChange(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            />
            <span className="text-slate-400 font-bold">-</span>
            <input
              type="number"
              placeholder="Max PKR"
              value={maxPrice}
              onChange={e => onMaxPriceChange(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            />
          </div>

          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={e => onInStockOnlyToggle(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <span className="text-xs font-bold text-slate-700">Show In-Stock Items Only</span>
          </label>
        </div>
      )}

    </div>
  );
};



'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Category, ProductCondition } from '@/lib/types';
import { Filter, SlidersHorizontal, RotateCcw, ChevronDown, Check, X } from 'lucide-react';

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
  const [showMobileDrawer, setShowMobileDrawer] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<'category' | 'grade' | 'sort' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close custom popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setShowMobileDrawer(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
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
      {/* Streamlined Filter Toolbar */}
      <div>
        
        {/* Mobile View: Single Clean Filter & Sort Bar (sm:hidden) */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMobileDrawer(true)}
            className={`flex-1 inline-flex items-center justify-between px-4 py-3 rounded-2xl font-bold border text-xs transition-all shadow-xs ${
              activeFiltersCount > 0
                ? 'bg-[#0070D1] text-white border-[#0070D1]'
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <SlidersHorizontal className="w-4 h-4 shrink-0 text-current" />
              <span className="truncate">
                {activeFiltersCount > 0
                  ? `Filter & Sort (${activeFiltersCount} Active)`
                  : 'Filter & Sort Catalog'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {activeFiltersCount > 0 && (
                <span className="bg-white text-[#0070D1] text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown className="w-4 h-4 shrink-0 opacity-70" />
            </div>
          </button>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={onResetFilters}
              className="p-3 text-rose-600 hover:bg-rose-50 bg-white rounded-2xl border border-rose-200 transition-colors flex items-center justify-center shrink-0 shadow-xs"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Desktop View: Full Horizontal Inline Popover Toolbar (hidden sm:flex) */}
        <div className="hidden sm:flex sm:flex-wrap items-center justify-between gap-2 text-xs">
          
          {/* Custom Category Popover Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(prev => prev === 'category' ? null : 'category')}
              className={`inline-flex items-center justify-between gap-1.5 border rounded-xl px-3 py-2 text-xs font-bold transition-all shadow-2xs ${
                selectedCategory !== 'All'
                  ? 'bg-[#0070D1] text-white border-[#0070D1]'
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
                    selectedCategory === 'All' ? 'bg-blue-50 text-[#0070D1]' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>Category: All</span>
                  {selectedCategory === 'All' && <Check className="w-3.5 h-3.5 text-[#0070D1] shrink-0" />}
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
                        isSel ? 'bg-blue-50 text-[#0070D1]' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                      {isSel && <Check className="w-3.5 h-3.5 text-[#0070D1] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Custom Condition Grade Popover Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(prev => prev === 'grade' ? null : 'grade')}
              className={`inline-flex items-center justify-between gap-1.5 border rounded-xl px-3 py-2 text-xs font-bold transition-all shadow-2xs ${
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
                      {isSel && <Check className="w-3.5 h-3.5 text-[#0070D1] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop Price Range Inputs */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200/80">
            <span className="text-slate-500 text-[11px] px-1 font-bold">PKR:</span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={e => onMinPriceChange(e.target.value)}
              className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0070D1]"
            />
            <span className="text-slate-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={e => onMaxPriceChange(e.target.value)}
              className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0070D1]"
            />
          </div>

          {/* Desktop In-Stock Only Checkbox */}
          <label className="hidden lg:flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-xl cursor-pointer shadow-2xs font-bold text-slate-700">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={e => onInStockOnlyToggle(e.target.checked)}
              className="rounded border-slate-300 text-[#0070D1] focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span>In-Stock Only</span>
          </label>

          {/* Custom Sort Popover Dropdown + Reset Button */}
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(prev => prev === 'sort' ? null : 'sort')}
                className="inline-flex items-center justify-between gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 hover:border-slate-300 transition-all shadow-2xs"
              >
                <span className="truncate">{currentSortLabel}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'sort' && (
                <div className="absolute top-full right-0 mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
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
                          isSel ? 'bg-blue-50 text-[#0070D1]' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSel && <Check className="w-3.5 h-3.5 text-[#0070D1] shrink-0" />}
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
      </div>

      {/* Mobile Bottom-to-Top Animated Drawer Sheet */}
      {showMobileDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:hidden animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl w-full p-5 shadow-2xl border-t border-slate-200 space-y-4 max-h-[88vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 ease-out">
            
            {/* Top Handle Bar */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-1 mb-1" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#0070D1]" />
                <h3 className="font-extrabold text-slate-900 text-base">Filter & Sort Catalog</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileDrawer(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Category</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => onSelectCategory('All')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedCategory === 'All'
                      ? 'bg-[#0070D1] text-white border-[#0070D1] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(c => (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => onSelectCategory(c._id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedCategory === c._id || selectedCategory === c.slug
                        ? 'bg-[#0070D1] text-white border-[#0070D1] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Grade */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Condition Grade</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { val: 'All', label: 'All Grades' },
                  { val: 'New', label: 'New' },
                  { val: 'Used', label: 'Pre-Owned' },
                  { val: 'Refurbished', label: 'Refurbished' },
                ].map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => onSelectCondition(opt.val as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedCondition === opt.val
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort By</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { val: 'latest', label: 'Latest Arrivals' },
                  { val: 'price_asc', label: 'Price: Low to High' },
                  { val: 'price_desc', label: 'Price: High to Low' },
                  { val: 'name_asc', label: 'Name A-Z' },
                ].map(opt => {
                  const isSel = sortBy === opt.val;
                  return (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => onSortByChange(opt.val as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border text-left flex items-center justify-between transition-all ${
                        isSel
                          ? 'bg-blue-50 text-[#0070D1] border-blue-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSel && <Check className="w-3.5 h-3.5 text-[#0070D1] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Price Range (PKR)</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min PKR"
                  value={minPrice}
                  onChange={e => onMinPriceChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#0070D1] focus:outline-none"
                />
                <span className="text-slate-400 font-bold">-</span>
                <input
                  type="number"
                  placeholder="Max PKR"
                  value={maxPrice}
                  onChange={e => onMaxPriceChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#0070D1] focus:outline-none"
                />
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200 cursor-pointer font-bold text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => onInStockOnlyToggle(e.target.checked)}
                  className="rounded border-slate-300 text-[#0070D1] focus:ring-blue-500 w-4 h-4"
                />
                <span>In-Stock Only Items</span>
              </label>
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="w-1/3 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 font-bold text-xs"
                >
                  Reset All
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowMobileDrawer(false)}
                className="flex-1 py-3.5 rounded-2xl bg-[#0070D1] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-98 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};





'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav, MobileTab } from '@/components/MobileBottomNav';
import { CategoryPills } from '@/components/CategoryPills';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { OrderSuccessModal } from '@/components/OrderSuccessModal';
import { fetchCategories, fetchProducts } from '@/lib/api';
import { Product, Category, ProductCondition, PaginationMeta, CheckoutResponseData } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { SlidersHorizontal, PackageSearch } from 'lucide-react';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialCondition = (searchParams.get('condition') as ProductCondition) || 'All';

  const { openCart } = useCart();

  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 24,
    totalPages: 1,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCondition, setSelectedCondition] = useState<ProductCondition | 'All'>(initialCondition);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'latest' | 'price_asc' | 'price_desc' | 'name_asc'>('latest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('search');

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [orderSuccessData, setOrderSuccessData] = useState<CheckoutResponseData | null>(null);

  // Load Categories on mount
  useEffect(() => {
    async function loadCategories() {
      const cats = await fetchCategories();
      setCategories(cats);
    }
    loadCategories();
  }, []);

  // Sync state if URL params change
  useEffect(() => {
    if (searchParams.get('category')) setSelectedCategory(searchParams.get('category')!);
    if (searchParams.get('search')) setSearchQuery(searchParams.get('search')!);
    if (searchParams.get('condition')) setSelectedCondition(searchParams.get('condition') as any);
  }, [searchParams]);

  // Fetch products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    const parsedMin = minPrice.trim() ? parseFloat(minPrice) : undefined;
    const parsedMax = maxPrice.trim() ? parseFloat(maxPrice) : undefined;

    const res = await fetchProducts({
      page: currentPage,
      limit: 24,
      search: searchQuery,
      category: selectedCategory,
      condition: selectedCondition,
      minPrice: parsedMin,
      maxPrice: parsedMax,
      inStockOnly,
      sortBy,
    });

    if (res.success) {
      setProducts(res.data);
      setPagination(res.pagination);
    } else {
      setProducts([]);
      setPagination({ total: 0, page: 1, limit: 24, totalPages: 1 });
    }
    setLoading(false);
  }, [currentPage, searchQuery, selectedCategory, selectedCondition, minPrice, maxPrice, inStockOnly, sortBy]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleConditionSelect = (condition: ProductCondition | 'All') => {
    setSelectedCondition(condition);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedCondition('All');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSortBy('latest');
    setCurrentPage(1);
  };

  const handleMobileTabSelect = (tab: MobileTab) => {
    setActiveMobileTab(tab);
    if (tab === 'cart') {
      openCart();
    } else if (tab === 'home') {
      window.location.href = '/';
    } else if (tab === 'categories') {
      const el = document.getElementById('category-filter-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 pb-20 md:pb-0">
      
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCartClick={openCart}
      />

      {/* Main Catalog Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Page Title & Breadcrumb */}
        <div className="mb-6">
          <div className="text-xs text-slate-400 font-medium mb-1">
            <span>Home</span> <span className="mx-1">•</span> <span className="text-slate-900 font-bold">Products Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Full Store Products Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Browse 600+ gaming consoles, CDs, controllers, and accessories with instant stock verification.
          </p>
        </div>

        {/* Filter Toolbar Section */}
        <div id="category-filter-section" className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs mb-6">
          <CategoryPills
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
            selectedCondition={selectedCondition}
            onSelectCondition={handleConditionSelect}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            inStockOnly={inStockOnly}
            onInStockOnlyToggle={setInStockOnly}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Results Info Row */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-bold text-slate-900 text-base sm:text-lg">
              {selectedCategory === 'All' ? 'All Gaming Products' : categories.find(c => c._id === selectedCategory || c.slug === selectedCategory)?.name || 'Products'}
            </h2>
            {selectedCondition !== 'All' && (
              <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-slate-200">
                {selectedCondition} Condition
              </span>
            )}
          </div>

          <span className="text-xs font-semibold text-slate-500">
            {pagination.total} Products Total
          </span>
        </div>

        {/* 2-Column Mobile & 4-Column Desktop Grid */}
        <ProductGrid
          products={products}
          pagination={pagination}
          loading={loading}
          onPageChange={page => {
            setCurrentPage(page);
            window.scrollTo({ top: 200, behavior: 'smooth' });
          }}
          onResetFilters={handleResetFilters}
          onQuickView={product => setQuickViewProduct(product)}
        />

      </main>

      {/* Modals & Slide-Over Cart */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={(data: CheckoutResponseData) => {
          setIsCheckoutOpen(false);
          setOrderSuccessData(data);
        }}
      />

      <OrderSuccessModal
        orderData={orderSuccessData}
        onClose={() => setOrderSuccessData(null)}
      />

      <ProductDetailModal
        product={quickViewProduct}
        allProducts={products}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeMobileTab}
        onTabSelect={handleMobileTabSelect}
      />

      {/* Multi-Column Footer */}
      <Footer />

    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-sm font-semibold">Loading Catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroCarousel } from '@/components/HeroCarousel';
import { MobileBottomNav, MobileTab } from '@/components/MobileBottomNav';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { OrderSuccessModal } from '@/components/OrderSuccessModal';
import { fetchCategories, fetchProducts } from '@/lib/api';
import { Product, Category, CheckoutResponseData } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { Store, ShieldCheck, Truck, ArrowRight, Sparkles, Award } from 'lucide-react';

export default function StorefrontHomePage() {
  const { openCart } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [consolesProducts, setConsolesProducts] = useState<Product[]>([]);
  const [gamesProducts, setGamesProducts] = useState<Product[]>([]);
  const [accessoriesProducts, setAccessoriesProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [orderSuccessData, setOrderSuccessData] = useState<CheckoutResponseData | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [cats, featuredRes, consolesRes, gamesRes, accessoriesRes] = await Promise.all([
        fetchCategories(),
        fetchProducts({ page: 1, limit: 36, sortBy: 'latest' }),
        fetchProducts({ category: '6a8ad5a068ae35d1a79d1a83', limit: 12, sortBy: 'latest' }),
        fetchProducts({ category: '6a8aea066dd73e298cdb36da', limit: 12, sortBy: 'latest' }),
        fetchProducts({ category: '6a8ae13c5f408109bce576a6', limit: 12, sortBy: 'latest' })
      ]);

      setCategories(cats);

      if (featuredRes.success && featuredRes.data) {
        const sortedFeatured = [...featuredRes.data].sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0));
        setFeaturedProducts(sortedFeatured.slice(0, 8));
      }

      if (consolesRes.success && consolesRes.data && consolesRes.data.length > 0) {
        const sortedConsoles = [...consolesRes.data].sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0));
        setConsolesProducts(sortedConsoles.slice(0, 4));
      }

      if (gamesRes.success && gamesRes.data && gamesRes.data.length > 0) {
        const sortedGames = [...gamesRes.data].sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0));
        setGamesProducts(sortedGames.slice(0, 4));
      }

      if (accessoriesRes.success && accessoriesRes.data && accessoriesRes.data.length > 0) {
        const sortedAccessories = [...accessoriesRes.data].sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0));
        setAccessoriesProducts(sortedAccessories.slice(0, 4));
      }

      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 pb-20 md:pb-0">
      
      {/* Header with Auto-Suggest Dropdown */}
      <Header onSelectProduct={p => setQuickViewProduct(p)} />

      {/* Main Homepage Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-10">
        
        {/* High-Definition Hero Banner Carousel */}
        <HeroCarousel />

        {/* Value Proposition Bar - Single Line Layout */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden py-3 px-4">
          {/* Desktop & Tablet: 3 Equal Columns in 1 Line */}
          <div className="hidden sm:grid sm:grid-cols-3 divide-x divide-slate-100 text-xs font-semibold text-slate-700">
            <div className="flex items-center justify-center gap-2.5 px-3">
              <Store className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-slate-900">Official Gaming Store</span>
                <span className="text-[11px] text-slate-500 font-normal ml-1.5">• 100% Authentic</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 px-3">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-slate-900">Nationwide Shipping (Rs 350)</span>
                <span className="text-[11px] text-slate-500 font-normal ml-1.5">• Insured Dispatch</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 px-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-slate-900">Grade & Serial Verified</span>
                <span className="text-[11px] text-slate-500 font-normal ml-1.5">• Warranty Safety</span>
              </div>
            </div>
          </div>

          {/* Mobile: Smooth Continuous Single-Line Moving Ticker */}
          <div className="sm:hidden overflow-hidden whitespace-nowrap">
            <div className="animate-ticker flex items-center gap-5 text-xs">
              <div className="flex items-center gap-1.5 shrink-0">
                <Store className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-900">Official Gaming Store</span>
                <span className="text-[11px] text-slate-500">• 100% Authentic Products</span>
              </div>
              <span className="text-slate-300 shrink-0 font-light">|</span>

              <div className="flex items-center gap-1.5 shrink-0">
                <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-900">Nationwide Dispatch</span>
                <span className="text-[11px] text-slate-500">• Insured Delivery (Rs 350)</span>
              </div>
              <span className="text-slate-300 shrink-0 font-light">|</span>

              <div className="flex items-center gap-1.5 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-900">Grade & Serial Tracked</span>
                <span className="text-[11px] text-slate-500">• Verified Quality</span>
              </div>
              <span className="text-slate-300 shrink-0 font-light">|</span>

              {/* Duplicated set for smooth infinite loop */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Store className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-900">Official Gaming Store</span>
                <span className="text-[11px] text-slate-500">• 100% Authentic Products</span>
              </div>
              <span className="text-slate-300 shrink-0 font-light">|</span>

              <div className="flex items-center gap-1.5 shrink-0">
                <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-900">Nationwide Dispatch</span>
                <span className="text-[11px] text-slate-500">• Insured Delivery (Rs 350)</span>
              </div>
              <span className="text-slate-300 shrink-0 font-light">|</span>

              <div className="flex items-center gap-1.5 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-900">Grade & Serial Tracked</span>
                <span className="text-[11px] text-slate-500">• Verified Quality</span>
              </div>
              <span className="text-slate-300 shrink-0 font-light">|</span>
            </div>
          </div>
        </div>

        {/* Section 1: Featured In-Stock Gaming Products */}
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-700 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Featured Catalog
              </div>
              <h2 className="text-base sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Latest Available Stock
              </h2>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors shrink-0 whitespace-nowrap pb-0.5"
            >
              <span>View All</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {loading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 p-3 animate-pulse h-64" />
              ))
            ) : (
              featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} onQuickView={p => setQuickViewProduct(p)} />
              ))
            )}
          </div>
        </section>

        {/* Section 2: Consoles Banner Highlight */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4 sm:space-y-6">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="bg-slate-100 text-slate-700 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                Consoles Hub
              </span>
              <h2 className="text-base sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5 leading-tight">
                PS5, Xbox & Switch
              </h2>
            </div>
            <Link
              href="/products?category=6a8ad5a068ae35d1a79d1a83"
              className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all w-fit shrink-0"
            >
              <span>Explore All</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 p-3 animate-pulse h-64" />
              ))
            ) : consolesProducts.length > 0 ? (
              consolesProducts.map(p => (
                <ProductCard key={p._id} product={p} onQuickView={prod => setQuickViewProduct(prod)} />
              ))
            ) : (
              featuredProducts.slice(0, 4).map(p => (
                <ProductCard key={p._id} product={p} onQuickView={prod => setQuickViewProduct(prod)} />
              ))
            )}
          </div>
        </section>

        {/* Section 3: Popular Game CDs Highlight */}
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-amber-700 uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" /> Tested Discs
              </div>
              <h2 className="text-base sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Pre-Owned & Sealed Game CDs
              </h2>
            </div>

            <Link
              href="/products?category=6a8aea066dd73e298cdb36da"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors shrink-0 whitespace-nowrap pb-0.5"
            >
              <span>View All</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 p-3 animate-pulse h-64" />
              ))
            ) : gamesProducts.length > 0 ? (
              gamesProducts.map(p => (
                <ProductCard key={p._id} product={p} onQuickView={prod => setQuickViewProduct(prod)} />
              ))
            ) : (
              featuredProducts.slice(4, 8).map(p => (
                <ProductCard key={p._id} product={p} onQuickView={prod => setQuickViewProduct(prod)} />
              ))
            )}
          </div>
        </section>

        {/* Section 4: Controllers & Accessories Highlight */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4 sm:space-y-6">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="bg-slate-100 text-slate-700 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                Gear & Accessories
              </span>
              <h2 className="text-base sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5 leading-tight">
                Controllers, Headsets & Gear
              </h2>
            </div>
            <Link
              href="/products?category=6a8ae13c5f408109bce576a6"
              className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all w-fit shrink-0"
            >
              <span>Explore Gear</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 p-3 animate-pulse h-64" />
              ))
            ) : accessoriesProducts.length > 0 ? (
              accessoriesProducts.map(p => (
                <ProductCard key={p._id} product={p} onQuickView={prod => setQuickViewProduct(prod)} />
              ))
            ) : (
              featuredProducts.slice(4, 8).map(p => (
                <ProductCard key={p._id} product={p} onQuickView={prod => setQuickViewProduct(prod)} />
              ))
            )}
          </div>
        </section>

      </main>

      {/* Modals & Cart Drawer */}
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
        allProducts={featuredProducts}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav activeTab="home" onTabSelect={tab => {
        if (tab === 'cart') openCart();
        else if (tab === 'search' || tab === 'categories') window.location.href = '/products';
      }} />

      {/* Footer */}
      <Footer />

    </div>
  );
}

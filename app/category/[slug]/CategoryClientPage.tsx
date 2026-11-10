'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { OrderSuccessModal } from '@/components/OrderSuccessModal';
import { Product, ProductCondition, CheckoutResponseData } from '@/lib/types';
import { CategorySeoConfig } from '@/lib/categoryData';
import { useCart } from '@/context/CartContext';
import { ChevronRight, ChevronDown, ChevronUp, Home, ShieldCheck, Sparkles, HelpCircle, PackageOpen } from 'lucide-react';

interface Props {
  config: CategorySeoConfig;
  initialProducts: Product[];
}

export default function CategoryClientPage({ config, initialProducts }: Props) {
  const router = useRouter();
  const { openCart } = useCart();

  const [selectedCondition, setSelectedCondition] = useState<ProductCondition | 'All'>('All');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [orderSuccessData, setOrderSuccessData] = useState<CheckoutResponseData | null>(null);
  const [isMobileSeoExpanded, setIsMobileSeoExpanded] = useState<boolean>(false);

  const filteredProducts = selectedCondition === 'All'
    ? initialProducts
    : initialProducts.filter(p => p.condition === selectedCondition);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 pb-20 md:pb-0">
      <Header onSelectProduct={p => setQuickViewProduct(p)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-12 space-y-4 sm:space-y-6 lg:space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link href="/" className="flex items-center gap-1 hover:text-[#0070D1] transition-colors shrink-0">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <Link href="/products" className="hover:text-[#0070D1] transition-colors shrink-0">
            Categories
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-bold shrink-0">{config.name}</span>
        </nav>

        {/* Category SEO Hero Banner */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200/80 shadow-xs space-y-2.5 sm:space-y-3 relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-50 text-[#0070D1] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Official Category Store
          </div>
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug sm:leading-tight">
            {config.heading}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl line-clamp-2 sm:line-clamp-none">
            {config.subheading}
          </p>

          {/* Condition Filter Pills - Smooth horizontal scrolling on mobile so pills never awkwardly drop/break onto multiple lines */}
          <div className="pt-1.5 sm:pt-2 flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 py-1">
            {(['All', 'New', 'Used', 'Refurbished'] as (ProductCondition | 'All')[]).map((cond) => {
              const count = cond === 'All'
                ? initialProducts.length
                : initialProducts.filter(p => p.condition === cond).length;

              if (cond !== 'All' && count === 0) return null;

              const isSelected = selectedCondition === cond;
              return (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full font-bold transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#0070D1] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{cond === 'All' ? 'All Items' : cond}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <PackageOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No products found in this condition</h3>
            <p className="text-xs text-slate-500">Check back soon or select 'All Items' to view available stock.</p>
            <button
              onClick={() => setSelectedCondition('All')}
              className="mt-2 text-xs font-bold text-[#0070D1] hover:underline"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={p => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}

        {/* Rich SEO Content & Buying Guide */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200/80 shadow-2xs space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <h2 className="text-base sm:text-xl font-bold text-slate-900">
              About {config.name} at PGS Game Shop
            </h2>
            <p
              className={`text-xs sm:text-sm text-slate-600 leading-relaxed ${
                !isMobileSeoExpanded ? 'line-clamp-3 sm:line-clamp-none' : ''
              }`}
            >
              {config.seoText}
            </p>
          </div>

          {/* FAQs (100% in DOM for Google SEO; collapsed by default on mobile, always open on desktop) */}
          {config.faqs.length > 0 && (
            <div
              className={`${
                isMobileSeoExpanded ? 'block' : 'hidden sm:block'
              } space-y-3 pt-4 border-t border-slate-100`}
            >
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
                <HelpCircle className="w-4 h-4 text-[#0070D1]" /> Frequently Asked Questions
              </div>
              <div className="space-y-2.5">
                {config.faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    className="group border border-slate-200 rounded-xl p-3.5 [&_summary::-webkit-details-marker]:hidden bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <summary className="flex cursor-pointer items-center justify-between text-slate-900 font-semibold text-xs sm:text-sm">
                      <span className="pr-2">{faq.question}</span>
                      <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-open:bg-blue-50 group-open:text-[#0070D1] transition-colors shrink-0">
                        <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-open:rotate-180" />
                      </span>
                    </summary>
                    <p className="mt-2.5 text-xs text-slate-600 leading-relaxed pr-2">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* Mobile-Only Toggle Button */}
          <div className="sm:hidden pt-1 border-t border-slate-100 flex justify-center">
            <button
              type="button"
              onClick={() => setIsMobileSeoExpanded(prev => !prev)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0070D1] bg-blue-50/80 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <span>{isMobileSeoExpanded ? 'Show Less' : 'Read Buying Guide & FAQs'}</span>
              {isMobileSeoExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

      </main>

      {/* Modals & Cart Drawer */}
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />

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
        allProducts={initialProducts}
        onClose={() => setQuickViewProduct(null)}
      />

      <MobileBottomNav
        activeTab="categories"
        onTabSelect={tab => {
          if (tab === 'cart') openCart();
          else if (tab === 'home') router.push('/');
          else if (tab === 'search') router.push('/products');
        }}
      />

      <Footer />
    </div>
  );
}


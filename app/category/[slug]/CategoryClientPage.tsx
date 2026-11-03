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
import { ChevronRight, Home, ShieldCheck, Sparkles, HelpCircle, PackageOpen } from 'lucide-react';

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

  const filteredProducts = selectedCondition === 'All'
    ? initialProducts
    : initialProducts.filter(p => p.condition === selectedCondition);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 pb-20 md:pb-0">
      <Header onSelectProduct={p => setQuickViewProduct(p)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link href="/" className="flex items-center gap-1 hover:text-[#0070D1] transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/products" className="hover:text-[#0070D1] transition-colors">
            Categories
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-bold">{config.name}</span>
        </nav>

        {/* Category SEO Hero Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0070D1] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Official Category Store
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {config.heading}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl">
            {config.subheading}
          </p>

          {/* Condition Filter Pills */}
          <div className="pt-3 flex flex-wrap items-center gap-2">
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
                  className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all ${
                    isSelected
                      ? 'bg-[#0070D1] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cond === 'All' ? 'All Items' : cond} ({count})
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
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              About {config.name} at PGS Game Shop
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {config.seoText}
            </p>
          </div>

          {/* FAQs */}
          {config.faqs.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <HelpCircle className="w-4 h-4 text-[#0070D1]" /> Frequently Asked Questions
              </div>
              <div className="space-y-2.5">
                {config.faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    className="group border border-slate-200 rounded-xl p-3.5 [&_summary::-webkit-details-marker]:hidden bg-slate-50/50"
                  >
                    <summary className="flex cursor-pointer items-center justify-between text-slate-900 font-semibold text-xs sm:text-sm">
                      <span>{faq.question}</span>
                      <span className="transition group-open:rotate-180">▼</span>
                    </summary>
                    <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}
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


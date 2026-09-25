'use client';

import React from 'react';
import { Home, Grid, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export type MobileTab = 'home' | 'categories' | 'search' | 'cart';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onTabSelect: (tab: MobileTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, onTabSelect }) => {
  const { totalItemsCount } = useCart();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-lg px-2 py-1.5 transition-all">
      <div className="grid grid-cols-4 gap-1">
        
        {/* Home Tab */}
        <button
          onClick={() => onTabSelect('home')}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
            activeTab === 'home'
              ? 'text-emerald-600 bg-emerald-50 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">Home</span>
        </button>

        {/* Categories Tab */}
        <button
          onClick={() => onTabSelect('categories')}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
            activeTab === 'categories'
              ? 'text-emerald-600 bg-emerald-50 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">Categories</span>
        </button>

        {/* Search Tab */}
        <button
          onClick={() => onTabSelect('search')}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
            activeTab === 'search'
              ? 'text-emerald-600 bg-emerald-50 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">Search</span>
        </button>

        {/* Cart Tab with Badge */}
        <button
          onClick={() => onTabSelect('cart')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
            activeTab === 'cart'
              ? 'text-emerald-600 bg-emerald-50 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[11px]">Cart</span>
        </button>

      </div>
    </div>
  );
};

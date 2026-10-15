'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { useCart } from '@/context/CartContext';
import {
  Gamepad2, Search, ArrowLeft, Home, ShoppingBag,
  PhoneCall, Disc, Headphones, Sparkles, Store, Truck, ShieldCheck
} from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const { openCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/products');
    }
  };

  const handleWhatsAppHelp = () => {
    const msg = `Hi PGS Game Shop, I was looking for a product on your website but reached a 404 page. Can you help me find it?`;
    window.open(`https://wa.me/923320329000?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const POPULAR_DESTINATIONS = [
    {
      title: 'Gaming Consoles',
      desc: 'PS5 Slim, PS4 Pro, Xbox Series X/S',
      icon: Gamepad2,
      href: '/products?category=6a8ad5a068ae35d1a79d1a83',
      color: 'text-[#0070D1] bg-blue-50 border-blue-200/60'
    },
    {
      title: 'Game Discs & CDs',
      desc: 'Original PS5, PS4 & Xbox Games',
      icon: Disc,
      href: '/products?category=6a8aea066dd73e298cdb36da',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200/60'
    },
    {
      title: 'Controllers & Gamepads',
      desc: 'DualSense, Xbox Wireless, Joy-Cons',
      icon: Gamepad2,
      href: '/products?category=6a8ae13c5f408109bce576a6',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200/60'
    },
    {
      title: 'Gaming Accessories',
      desc: 'Cables, Charging Docks, Headsets',
      icon: Headphones,
      href: '/products?category=6a8af3ad75f0085178374d75',
      color: 'text-amber-600 bg-amber-50 border-amber-200/60'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      
      {/* Header */}
      <Header onCartClick={openCart} />

      {/* Main 404 Experience */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-16 flex flex-col items-center justify-center text-center space-y-8">
        
        {/* Visual Badge & Title Card */}
        <div className="space-y-4 max-w-lg">
          
          {/* Solid Non-Flashy Gaming Badge */}
          <div className="inline-flex items-center justify-center relative mx-auto mb-2">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-100 border border-slate-200/90 flex items-center justify-center text-slate-700 shadow-xs">
              <Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#0070D1]" />
            </div>
            <span className="absolute -top-2 -right-3 bg-slate-900 text-white font-mono font-extrabold text-xs px-2.5 py-1 rounded-full shadow-xs border border-slate-800">
              404
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Checkpoint Not Found
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              The gaming product or page you are looking for has been moved, delisted, or does not exist in our catalog.
            </p>
          </div>

        </div>

        {/* Search Bar Container */}
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 p-2 shadow-xs">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search games, consoles, controllers..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0"
            >
              Search
            </button>
          </form>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap w-full max-w-md">
          <Link
            href="/"
            className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#0070D1] hover:bg-[#005bb5] text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>

          <Link
            href="/products"
            className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200 shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#0070D1]" />
            <span>Browse Catalog</span>
          </Link>

          <button
            type="button"
            onClick={handleWhatsAppHelp}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Can't find it? Ask on WhatsApp</span>
          </button>
        </div>

        {/* Quick Category Jump Grid */}
        <div className="w-full pt-4 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Popular Gaming Categories
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
            {POPULAR_DESTINATIONS.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  href={cat.href}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex items-start gap-3 group cursor-pointer"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${cat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#0070D1] transition-colors block truncate">
                      {cat.title}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {cat.desc}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Subtle Trust Bar */}
        <div className="pt-4 border-t border-slate-200/70 w-full flex items-center justify-center gap-6 sm:gap-10 text-xs text-slate-500 font-medium flex-wrap">
          <div className="flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-[#0070D1]" />
            <span>100% Genuine Hardware</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Karachi Express Dispatch</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Warranty Verified</span>
          </div>
        </div>

      </main>

      {/* Cart Drawer */}
      <CartDrawer onProceedToCheckout={() => router.push('/checkout')} />

      {/* Footer */}
      <Footer />

    </div>
  );
}

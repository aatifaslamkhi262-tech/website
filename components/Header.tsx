'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, ShoppingBag, Gamepad2, Phone, X, Check, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { fetchProducts, getProductEffectivePrice } from '@/lib/api';
import { Product } from '@/lib/types';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onCartClick?: () => void;
  onSelectProduct?: (product: Product) => void;
}

function HeaderNavLinks({ pathname, searchQuery }: { pathname: string; searchQuery?: string }) {
  const searchParams = useSearchParams();
  const cat = (searchParams?.get('category') || '').toLowerCase();
  const search = (searchParams?.get('search') || searchQuery || '').toLowerCase();

  const isHomeActive = pathname === '/';
  const isConsolesActive = pathname === '/products' && (cat === '6a8ad5a068ae35d1a79d1a83' || cat.includes('console') || search.includes('console'));
  const isGamesActive = pathname === '/products' && (cat === '6a8aea066dd73e298cdb36da' || cat.includes('game') || cat.includes('cd') || search.includes('game') || search.includes('cd'));
  const isControllersActive = pathname === '/products' && (cat === '6a8ae13c5f408109bce576a6' || cat.includes('controller') || search.includes('controller'));
  const isAccessoriesActive = pathname === '/products' && (cat === '6a8af3ad75f0085178374d75' || cat.includes('access') || search.includes('access'));
  
  const isCatalogActive = pathname === '/products' && !isConsolesActive && !isGamesActive && !isControllersActive && !isAccessoriesActive;

  const activeStyle = 'text-emerald-600 font-bold border-b-2 border-emerald-600 pb-0.5 transition-all duration-200';
  const inactiveStyle = 'text-slate-700 hover:text-emerald-600 transition-all duration-200';

  return (
    <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold">
      <Link href="/" className={isHomeActive ? activeStyle : inactiveStyle}>
        Home
      </Link>
      <Link href="/products" className={isCatalogActive ? activeStyle : inactiveStyle}>
        Catalog
      </Link>
      <Link href="/products?category=6a8ad5a068ae35d1a79d1a83" className={isConsolesActive ? activeStyle : inactiveStyle}>
        Consoles
      </Link>
      <Link href="/products?category=6a8aea066dd73e298cdb36da" className={isGamesActive ? activeStyle : inactiveStyle}>
        Game CDs
      </Link>
      <Link href="/products?category=6a8ae13c5f408109bce576a6" className={isControllersActive ? activeStyle : inactiveStyle}>
        Controllers
      </Link>
      <Link href="/products?category=6a8af3ad75f0085178374d75" className={isAccessoriesActive ? activeStyle : inactiveStyle}>
        Accessories
      </Link>
    </nav>
  );
}

function HeaderNavFallback({ pathname }: { pathname: string }) {
  const activeStyle = 'text-emerald-600 font-bold border-b-2 border-emerald-600 pb-0.5';
  const inactiveStyle = 'text-slate-700 hover:text-emerald-600';

  return (
    <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold">
      <Link href="/" className={pathname === '/' ? activeStyle : inactiveStyle}>
        Home
      </Link>
      <Link href="/products" className={pathname === '/products' ? activeStyle : inactiveStyle}>
        Catalog
      </Link>
      <Link href="/products?category=6a8ad5a068ae35d1a79d1a83" className={inactiveStyle}>
        Consoles
      </Link>
      <Link href="/products?category=6a8aea066dd73e298cdb36da" className={inactiveStyle}>
        Game CDs
      </Link>
      <Link href="/products?category=6a8ae13c5f408109bce576a6" className={inactiveStyle}>
        Controllers
      </Link>
      <Link href="/products?category=6a8af3ad75f0085178374d75" className={inactiveStyle}>
        Accessories
      </Link>
    </nav>
  );
}

export const Header: React.FC<HeaderProps> = ({ searchQuery = '', onSearchChange, onCartClick, onSelectProduct }) => {
  const { totalItemsCount, openCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Auto-Suggest Dropdown State
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Sync searchQuery prop changes down to localSearch if strictly different
  useEffect(() => {
    setLocalSearch(prev => (prev !== searchQuery ? searchQuery : prev));
  }, [searchQuery]);

  // Handle Search Input Change & Fetch Auto-Suggestions
  useEffect(() => {
    if (!localSearch.trim() || localSearch.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const handler = setTimeout(async () => {
      setSearchLoading(true);
      onSearchChange?.(localSearch.trim());
      const res = await fetchProducts({ search: localSearch.trim(), limit: 5 });
      if (res.success && res.data) {
        setSuggestions(res.data.slice(0, 5));
        setShowDropdown(true);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
      setSearchLoading(false);
    }, 200);

    return () => clearTimeout(handler);
  }, [localSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCartTrigger = () => {
    if (onCartClick) {
      onCartClick();
    } else {
      openCart();
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    setSuggestions([]);
    if (localSearch.trim()) {
      router.push(`/products?search=${encodeURIComponent(localSearch.trim())}`);
    }
  };

  const handleSelectSuggestion = (product: Product) => {
    setShowDropdown(false);
    setSuggestions([]);
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      router.push(`/products?search=${encodeURIComponent(product.name)}`);
    }
  };

  const formatPKR = (val: number) => {
    if (val <= 0) return 'Call for Price';
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(val).replace('PKR', 'Rs.');
  };

  const renderSuggestionsList = () => (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
      <div className="p-2 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        <span>Instant Results ({suggestions.length})</span>
        {searchLoading && <span className="text-emerald-600 animate-pulse">Searching...</span>}
      </div>

      <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
        {suggestions.map(item => {
          const thumb = item.images && item.images.length > 0 ? item.images[0].url : '';
          const finalP = getProductEffectivePrice(item);

          return (
            <div
              key={item._id}
              onClick={() => handleSelectSuggestion(item)}
              className="p-2.5 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors group"
            >
              {/* Thumb Image or Frame */}
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200/60 overflow-hidden shrink-0 flex items-center justify-center">
                {thumb ? (
                  <img src={thumb} alt={item.name} className="w-full h-full object-contain" />
                ) : (
                  <Gamepad2 className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">
                    {item.condition}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono truncate">
                    {item.sku}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-900 text-xs truncate group-hover:text-emerald-600 transition-colors">
                  {item.name}
                </h4>
                <div className="text-xs font-bold text-emerald-700">
                  {formatPKR(finalP)}
                </div>
              </div>

              {/* Stock Status Pill */}
              <div className="shrink-0">
                {item.inStock ? (
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-0.5">
                    <Check className="w-3 h-3 text-emerald-600" /> In Stock
                  </span>
                ) : (
                  <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200/60">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSearchSubmit}
        className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 border-t border-slate-100 transition-colors"
      >
        <span>View all matching results</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <header ref={headerRef} className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-6">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="bg-emerald-600 text-white p-2.5 rounded-2xl shadow-sm shadow-emerald-600/20 flex items-center justify-center">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 font-sans leading-none">
                PGS <span className="text-emerald-600">GAME SHOP</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
                Official Gaming Store
              </span>
            </div>
          </Link>

          {/* Clean Spaced Navigation Menu */}
          <Suspense fallback={<HeaderNavFallback pathname={pathname} />}>
            <HeaderNavLinks pathname={pathname} searchQuery={searchQuery} />
          </Suspense>

          {/* Right Actions: Instant Search + Auto-Suggest + Cart */}
          <div className="flex items-center gap-3">
            
            {/* Auto-Suggest Search Bar Container (Desktop) */}
            <div className="relative hidden md:block w-60 lg:w-72">
              <form onSubmit={handleSearchSubmit}>
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products, SKUs..."
                  value={localSearch}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowDropdown(true);
                  }}
                  onChange={e => setLocalSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs bg-slate-100/80 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                />
                {localSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setLocalSearch('');
                      onSearchChange?.('');
                      setShowDropdown(false);
                      setSuggestions([]);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Instant Auto-Suggest Dropdown Overlay */}
              {showDropdown && suggestions.length > 0 && renderSuggestionsList()}

            </div>

            {/* Cart CTA */}
            <button
              onClick={handleCartTrigger}
              className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-emerald-600/20 transition-all shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalItemsCount > 0 && (
                <span className="bg-white text-emerald-800 text-xs font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                  {totalItemsCount}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* Mobile Search Bar (With Auto-Suggest Dropdown!) */}
        <div className="pb-3 md:hidden relative">
          <form onSubmit={handleSearchSubmit}>
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={localSearch}
              onFocus={() => {
                if (suggestions.length > 0) setShowDropdown(true);
              }}
              onChange={e => setLocalSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:bg-white text-slate-900 placeholder:text-slate-400 font-medium"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  onSearchChange?.('');
                  setShowDropdown(false);
                  setSuggestions([]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Instant Auto-Suggest Dropdown Overlay (Mobile) */}
          {showDropdown && suggestions.length > 0 && renderSuggestionsList()}
        </div>

      </div>
    </header>
  );
};

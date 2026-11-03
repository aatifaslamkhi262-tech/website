'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, ShoppingBag, Gamepad2, Phone, X, Check, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { fetchProducts, getProductEffectivePrice, getProductSlug } from '@/lib/api';
import { Product } from '@/lib/types';
import { tokenize } from '@/lib/smartSearch';

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
  const isConsolesActive = pathname === '/products' && !search && (cat === '6a8ad5a068ae35d1a79d1a83' || cat.includes('console'));
  const isGamesActive = pathname === '/products' && !search && (cat === '6a8aea066dd73e298cdb36da' || cat.includes('game') || cat.includes('cd'));
  const isControllersActive = pathname === '/products' && !search && (cat === '6a8ae13c5f408109bce576a6' || cat.includes('controller'));
  const isAccessoriesActive = pathname === '/products' && !search && (cat === '6a8af3ad75f0085178374d75' || cat.includes('access'));
  
  const isCatalogActive = pathname === '/products' && !isConsolesActive && !isGamesActive && !isControllersActive && !isAccessoriesActive;

  const activeStyle = 'text-[#0070D1] font-bold border-b-2 border-[#0070D1] pb-0.5 transition-all duration-200';
  const inactiveStyle = 'text-slate-700 hover:text-[#0070D1] transition-all duration-200';

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
  const activeStyle = 'text-[#0070D1] font-bold border-b-2 border-[#0070D1] pb-0.5';
  const inactiveStyle = 'text-slate-700 hover:text-[#0070D1]';

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

const POPULAR_SEARCHES = ['PS5 Slim', 'DualSense', 'Spider-Man 2', 'Xbox Series X', 'GTA V', 'Consoles'];

function highlightMatchText(text: string, query: string) {
  if (!query.trim()) return text;
  const tokens = tokenize(query);
  if (tokens.length === 0) return text;

  // Use word boundaries for short tokens so '5' doesn't match inside '500' or 'ps' inside 'ps4'
  const escaped = tokens.map(t => {
    const clean = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return clean.length <= 3 ? `\\b${clean}\\b` : clean;
  }).join('|');

  const pattern = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, i) =>
        pattern.test(part) ? (
          <span key={i} className="text-[#0070D1] font-bold underline decoration-blue-300 underline-offset-2">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
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
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on route change
  useEffect(() => {
    setShowDropdown(false);
    setIsFocused(false);
  }, [pathname]);

  // Sync searchQuery prop changes down to localSearch if strictly different
  useEffect(() => {
    setLocalSearch(prev => (prev !== searchQuery ? searchQuery : prev));
  }, [searchQuery]);

  // Handle Search Input Change & Fetch Auto-Suggestions
  useEffect(() => {
    const trimmed = localSearch.trim();

    // 1. When input is completely cleared/empty: reset suggestions and notify parent immediately
    if (!trimmed) {
      setSuggestions([]);
      setSearchLoading(false);
      onSearchChange?.('');
      return;
    }

    // 2. If 1 character: close suggestions dropdown, but keep parent search query updated
    if (trimmed.length < 2) {
      setSuggestions([]);
      setSearchLoading(false);
      onSearchChange?.(trimmed);
      return;
    }

    // 3. Debounce suggestions fetching and catalog search
    const handler = setTimeout(async () => {
      setSearchLoading(true);
      if (isFocused) {
        setShowDropdown(true);
      }
      onSearchChange?.(trimmed);
      const res = await fetchProducts({ search: trimmed, limit: 6 });
      if (res.success && res.data) {
        const inStockSuggestions = res.data.filter(item => item.inStock && (item.warehouseStock === undefined || item.warehouseStock > 0));
        setSuggestions(inStockSuggestions.slice(0, 6));
      } else {
        setSuggestions([]);
      }
      setSearchLoading(false);
    }, 150);

    return () => clearTimeout(handler);
  }, [localSearch, isFocused]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setIsFocused(false);
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

  const handleSearchSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    setShowDropdown(false);
    setIsFocused(false);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    if (localSearch.trim()) {
      router.push(`/products?search=${encodeURIComponent(localSearch.trim())}`);
    } else {
      router.push('/products');
      onSearchChange?.('');
    }
  };

  const handleSelectSuggestion = (product: Product) => {
    setShowDropdown(false);
    setIsFocused(false);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      router.push(`/products/${getProductSlug(product)}`);
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

  const renderSuggestionsList = () => {
    const trimmed = localSearch.trim();

    // Case A: User focused on search bar and has NOT typed yet -> Show Popular Trends
    if (!trimmed) {
      return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 p-3.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Popular Gaming Searches</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SEARCHES.map(tag => (
              <button
                key={tag}
                type="button"
                onMouseDown={e => {
                  e.preventDefault();
                  setLocalSearch(tag);
                  onSearchChange?.(tag);
                }}
                className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-blue-50 hover:text-[#0070D1] hover:border-blue-200 border border-transparent rounded-lg text-slate-700 transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Case B: User typed and matching products found
    if (suggestions.length > 0) {
      return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2.5 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
            <span>Instant Results ({suggestions.length})</span>
            {searchLoading && (
              <span className="text-[#0070D1] flex items-center gap-1 font-semibold normal-case">
                <Loader2 className="w-3 h-3 animate-spin" /> Searching...
              </span>
            )}
          </div>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {suggestions.map(item => {
              const thumb = item.images && item.images.length > 0 ? item.images[0].url : '';
              const finalP = getProductEffectivePrice(item);

              return (
                <div
                  key={item._id}
                  onMouseDown={e => {
                    e.preventDefault();
                    handleSelectSuggestion(item);
                  }}
                  onClick={() => handleSelectSuggestion(item)}
                  className="p-2.5 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors group"
                >
                  {/* Thumb Image or Frame */}
                  <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200/60 overflow-hidden shrink-0 flex items-center justify-center">
                    {thumb ? (
                      <img src={thumb} alt={item.name} className="w-full h-full object-contain" />
                    ) : (
                      <Gamepad2 className="w-5 h-5 text-slate-400 group-hover:text-[#0070D1] transition-colors" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-bold text-blue-900 bg-blue-50 px-1.5 py-0.2 rounded">
                        {item.condition}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono truncate">
                        {item.sku}
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-900 text-xs truncate group-hover:text-[#0070D1] transition-colors">
                      {highlightMatchText(item.name, trimmed)}
                    </h4>
                    <div className="text-xs font-bold text-[#0070D1]">
                      {formatPKR(finalP)}
                    </div>
                  </div>

                  {/* Stock Status Pill */}
                  <div className="shrink-0">
                    {item.inStock ? (
                      <span className="bg-blue-50 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200/60 flex items-center gap-0.5">
                        <Check className="w-3 h-3 text-[#0070D1]" /> In Stock
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
            type="button"
            onMouseDown={e => {
              e.preventDefault();
              handleSearchSubmit(e);
            }}
            onClick={handleSearchSubmit}
            className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-[#0070D1] font-bold text-xs flex items-center justify-center gap-1.5 border-t border-slate-100 transition-colors cursor-pointer"
          >
            <span>View all matching results</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      );
    }

    // Case C: User typed but no direct matches found
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 p-4 text-center">
        {searchLoading ? (
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 py-1">
            <Loader2 className="w-4 h-4 text-[#0070D1] animate-spin" />
            <span>Smart Searching catalog...</span>
          </div>
        ) : (
          <div>
            <p className="text-xs font-semibold text-slate-700">No direct matches for &ldquo;{trimmed}&rdquo;</p>
            <p className="text-[11px] text-slate-400 mt-1">Press Enter to search catalog or try words like "PS5", "DualSense", "CD"</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-4 sm:gap-6">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <img
              src="/logo.png"
              alt="PGS Game Shop Karachi"
              className="h-10 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105 duration-200"
            />
            <div className="hidden xs:flex flex-col">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 font-sans leading-none">
                PGS <span className="text-[#0070D1]">GAME SHOP</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
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
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search products, SKUs..."
                  value={localSearch}
                  onFocus={() => {
                    setIsFocused(true);
                    setShowDropdown(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      if (headerRef.current && !headerRef.current.contains(document.activeElement)) {
                        setIsFocused(false);
                      }
                    }, 200);
                  }}
                  onChange={e => setLocalSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-8 text-xs sm:text-sm leading-normal bg-slate-100 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0070D1] text-slate-900 placeholder:text-slate-400 font-medium transition-all"
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
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Instant Auto-Suggest Dropdown Overlay */}
              {showDropdown && renderSuggestionsList()}

            </div>

            {/* Cart CTA */}
            <button
              id="header-cart-btn"
              onClick={handleCartTrigger}
              className="relative w-10 h-10 sm:w-auto sm:h-auto flex items-center justify-center gap-2 bg-[#0070D1] hover:bg-[#005bb5] active:scale-95 text-white text-xs sm:text-sm font-bold sm:px-4 sm:py-2.5 rounded-xl shadow-sm transition-all shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 sm:static bg-rose-500 sm:bg-white text-white sm:text-blue-900 text-[10px] sm:text-xs font-extrabold w-4 h-4 sm:w-auto sm:h-auto sm:px-2 sm:py-0.5 rounded-full flex items-center justify-center shadow-xs">
                  {totalItemsCount}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* Mobile Search Bar (With Auto-Suggest Dropdown!) */}
        <div className="pb-3 md:hidden relative">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products..."
              value={localSearch}
              onFocus={() => {
                setIsFocused(true);
                setShowDropdown(true);
              }}
              onBlur={() => {
                setTimeout(() => {
                  if (headerRef.current && !headerRef.current.contains(document.activeElement)) {
                    setIsFocused(false);
                  }
                }, 200);
              }}
              onChange={e => setLocalSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-10 text-sm leading-normal bg-slate-100 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0070D1] text-slate-900 placeholder:text-slate-400 font-medium transition-colors"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Instant Auto-Suggest Dropdown Overlay (Mobile) */}
          {showDropdown && renderSuggestionsList()}
        </div>

      </div>
    </header>
  );
};

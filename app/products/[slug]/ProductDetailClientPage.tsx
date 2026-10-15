'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { OrderSuccessModal } from '@/components/OrderSuccessModal';
import { Product, CheckoutResponseData } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { getProductEffectivePrice, isPriceOnCall } from '@/lib/api';
import {
  ShoppingBag, PhoneCall, ShieldCheck, Truck, Store, ArrowLeft,
  Share2, Check, Sparkles, Plus, Minus, Gamepad2, Award,
  Maximize2, X, ChevronLeft, ChevronRight, CheckCircle2,
  Clock, CreditCard, HelpCircle, FileText, Box
} from 'lucide-react';

interface ClientProps {
  product: Product;
  relatedProducts: Product[];
  allCategoryProducts?: Product[];
}

const TRUST_ITEMS = [
  { icon: Store, text: '100% Genuine Hardware', sub: 'Verified Authentic' },
  { icon: Truck, text: 'Karachi Express Dispatch', sub: 'Same-Day Rider Delivery' },
  { icon: CreditCard, text: 'Cash on Delivery (COD)', sub: 'Karachi & Nationwide' },
  { icon: Box, text: 'Safe Tamper-Proof Packaging', sub: 'Reinforced Protection' },
  { icon: PhoneCall, text: 'Direct Gamer Support', sub: 'WhatsApp Assistance' },
];

export default function ProductDetailClientPage({
  product: initialProduct,
  relatedProducts,
  allCategoryProducts = []
}: ClientProps) {
  const { cart, addToCart, updateQuantity, openCart } = useCart();

  // Active product state for condition variants (New vs Used)
  const [activeProduct, setActiveProduct] = useState<Product>(initialProduct);
  const [selectedImgIndex, setSelectedImgIndex] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'shipping' | 'guarantee'>('overview');
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [showStickyBar, setShowStickyBar] = useState<boolean>(false);

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [orderSuccessData, setOrderSuccessData] = useState<CheckoutResponseData | null>(null);

  // Touch swipe support for mobile gallery
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Sync activeProduct when initialProduct prop changes
  useEffect(() => {
    setActiveProduct(initialProduct);
    setSelectedImgIndex(0);
  }, [initialProduct]);

  // Monitor scroll position to display mobile sticky action bar
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 380);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight' && selectedImgIndex < images.length - 1) setSelectedImgIndex(i => i + 1);
      if (e.key === 'ArrowLeft' && selectedImgIndex > 0) setSelectedImgIndex(i => i - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, selectedImgIndex]);

  // Sibling condition variants finder (e.g. New vs Used for same base item)
  const getBaseName = (name: string) => {
    return name.replace(/\b(USED|NEW|REFURBISHED|SEALED|UNSEALED|KIT|EDITION)\b/gi, '').trim().toLowerCase();
  };

  const currentBaseName = getBaseName(activeProduct.name);
  const activeCatId = typeof activeProduct.category === 'object' && activeProduct.category !== null
    ? activeProduct.category._id
    : activeProduct.category;

  const catalogPool = allCategoryProducts.length > 0 ? allCategoryProducts : relatedProducts;
  const variants = catalogPool.filter(p => {
    if (p._id === activeProduct._id) return true;
    const pCatId = typeof p.category === 'object' && p.category !== null ? p.category._id : p.category;
    if (activeCatId && pCatId && activeCatId !== pCatId) return false;
    const pBase = getBaseName(p.name);
    return pBase.length > 2 && pBase === currentBaseName;
  });

  const uniqueConditionVariants: Product[] = [activeProduct];
  const seenConditions = new Set<string>([activeProduct.condition]);
  variants.forEach(v => {
    if (!seenConditions.has(v.condition)) {
      seenConditions.add(v.condition);
      uniqueConditionVariants.push(v);
    }
  });

  const cartItem = cart.find(item => item.product._id === activeProduct._id);
  const cartQty = cartItem ? cartItem.quantity : 0;

  const finalPrice = getProductEffectivePrice(activeProduct);
  const priceOnCall = isPriceOnCall(activeProduct);

  const images = activeProduct.images && activeProduct.images.length > 0
    ? activeProduct.images.map(img => img.url).filter(Boolean)
    : [];

  const currentImage = images[selectedImgIndex] || images[0] || '';

  const formatPKR = (val: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(val).replace('PKR', 'Rs.');
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: activeProduct.name,
        text: `Check out ${activeProduct.name} at PGS Game Shop Karachi!`,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleWhatsAppContact = () => {
    const conditionStr = activeProduct.condition ? ` (${activeProduct.condition})` : '';
    const priceText = priceOnCall ? 'price inquiry' : formatPKR(finalPrice);
    const msg = `Hi PGS Game Shop, I want to order ${activeProduct.name}${conditionStr} (SKU: ${activeProduct.sku}) for ${priceText}. Is it ready for Karachi / Nationwide delivery?`;
    window.open(`https://wa.me/923122319157?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const effectiveProductForCart: Product = {
    ...activeProduct,
    sellingPrice: finalPrice
  };

  const categoryName = typeof activeProduct.category === 'object' && activeProduct.category !== null
    ? activeProduct.category.name
    : (activeProduct.category || 'Gaming');

  // Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0 && selectedImgIndex < images.length - 1) {
        setSelectedImgIndex(prev => prev + 1);
      } else if (diff < 0 && selectedImgIndex > 0) {
        setSelectedImgIndex(prev => prev - 1);
      }
    }
    setTouchStartX(null);
  };

  const hasDiscount = Boolean(
    activeProduct.originalPrice &&
    activeProduct.originalPrice > finalPrice &&
    finalPrice > 0
  );

  // Infinite Horizontal Trust Ticker
  const renderTrustTicker = () => {
    return (
      <div className="relative w-full overflow-hidden bg-white rounded-2xl border border-slate-200/90 py-2.5 shadow-2xs group select-none">
        {/* Subtle Edge Gradient Masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-10"></div>

        {/* Seamless Infinite Ticker Track */}
        <div className="animate-ticker flex items-center gap-3 sm:gap-4 hover:[animation-play-state:paused]">
          {[...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 shrink-0 text-slate-800"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#0070D1] flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] sm:text-xs font-bold leading-tight whitespace-nowrap">{item.text}</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 leading-tight whitespace-nowrap">{item.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Reusable Buy Box Component (Shown right under image on mobile, and sticky right-col on desktop)
  const renderBuyBox = () => {
    return (
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
        
        {/* Category, Brand & SKU */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
          <span className="text-[#0070D1]">{categoryName}</span>
          <span className="font-mono text-slate-500">SKU: {activeProduct.sku}</span>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
          {activeProduct.name}
        </h1>

        {/* Condition Variant Switcher (if multiple exist) */}
        {uniqueConditionVariants.length > 1 && (
          <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0070D1]" />
              Select Condition Variant:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {uniqueConditionVariants.map(v => {
                const isSelected = v._id === activeProduct._id;
                const vPrice = getProductEffectivePrice(v);

                return (
                  <button
                    key={v._id}
                    type="button"
                    onClick={() => {
                      setActiveProduct(v);
                      setSelectedImgIndex(0);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    <span>{v.condition}</span>
                    <span className={isSelected ? 'text-blue-300 font-mono text-[11px]' : 'text-slate-500 font-mono text-[11px]'}>
                      ({vPrice > 0 ? formatPKR(vPrice) : 'Call'})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price & Savings Block */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Store Price</span>
            {hasDiscount && (
              <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                Special Offer
              </span>
            )}
          </div>

          <div className="flex items-baseline flex-wrap gap-2.5">
            {priceOnCall ? (
              <span className="text-2xl font-extrabold text-amber-700">Call for Price</span>
            ) : (
              <>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#0070D1] tracking-tight">
                  {formatPKR(finalPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-slate-400 line-through font-medium">
                    {formatPKR(activeProduct.originalPrice!)}
                  </span>
                )}
              </>
            )}
          </div>

          <span className="text-[11px] text-slate-500 block">
            Price inclusive of checking warranty & Karachi order support.
          </span>
        </div>

        {/* Stock Status Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          {activeProduct.inStock ? (
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80 w-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Ready in Stock — Dispatches within 24 hours from Karachi</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200/80 w-full">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Out of Stock — Inquire on WhatsApp for next restock</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          
          {cartQty > 0 ? (
            <div className="w-full p-2.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between shadow-xs">
              <button
                type="button"
                onClick={() => updateQuantity(activeProduct._id, cartQty - 1)}
                className="w-10 h-10 rounded-xl bg-white text-blue-700 hover:bg-rose-600 hover:text-white border border-blue-200 hover:border-rose-600 flex items-center justify-center transition-all active:scale-95 font-bold cursor-pointer"
                title="Reduce quantity"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center">
                <span className="text-sm font-extrabold text-blue-950 font-mono">
                  {cartQty} IN CART
                </span>
                <span className="text-[10px] text-blue-700 font-bold uppercase">
                  Subtotal: {formatPKR(finalPrice * cartQty)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => updateQuantity(activeProduct._id, cartQty + 1)}
                className="w-10 h-10 rounded-xl bg-[#0070D1] text-white hover:bg-[#005bb5] flex items-center justify-center transition-all active:scale-95 font-bold cursor-pointer"
                title="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => addToCart(effectiveProductForCart, 1, e.currentTarget)}
              disabled={!activeProduct.inStock}
              className="w-full py-3.5 px-6 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2.5 transition-all bg-[#0070D1] hover:bg-[#005bb5] active:scale-98 text-white shadow-sm shadow-blue-600/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{activeProduct.inStock ? 'Add to Shopping Cart' : 'Out of Stock'}</span>
            </button>
          )}

          {/* WhatsApp Direct Order Button */}
          <button
            type="button"
            onClick={handleWhatsAppContact}
            className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white shadow-xs cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Instant Order via WhatsApp</span>
          </button>

        </div>

        {/* Safe Checkout Highlights */}
        <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Cash on Delivery (COD) available in Karachi & nationwide</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>7-Day checking warranty with testing support</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Physical shop pickup available in Karachi</span>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 pb-24 md:pb-12">
      
      {/* Header */}
      <Header onCartClick={openCart} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-5 sm:space-y-7">
        
        {/* Navigation & Breadcrumb Row */}
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold transition-all hover:text-[#0070D1]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Catalog</span>
            </Link>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <Link href="/" className="hover:text-[#0070D1] transition-colors hidden sm:inline">Home</Link>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <Link href="/products" className="hover:text-[#0070D1] transition-colors hidden sm:inline">{categoryName}</Link>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="text-slate-800 font-semibold truncate max-w-[180px] sm:max-w-xs">{activeProduct.name}</span>
          </div>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-xl font-bold text-slate-700 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
            title="Share this product"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-[#0070D1]" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>

        {/* Primary Product Layout Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
          
          {/* Left Column: Gallery, Mobile BuyBox, Ticker & Tabs (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Gallery Frame */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
              
              {/* Main Image Viewport with touch swipe */}
              <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative w-full aspect-square sm:aspect-[4/3] bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 sm:p-8 flex items-center justify-center overflow-hidden group select-none"
              >
                {/* Badges on Top-Left */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2 flex-wrap max-w-[80%]">
                  <span className="bg-slate-900 text-white font-extrabold text-[11px] sm:text-xs px-3 py-1 rounded-full shadow-xs">
                    {activeProduct.condition}
                  </span>
                  {activeProduct.inStock ? (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px] sm:text-xs px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      In Stock
                    </span>
                  ) : (
                    <span className="bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px] sm:text-xs px-2.5 py-1 rounded-full shadow-xs">
                      Out of Stock
                    </span>
                  )}
                  {activeProduct.condition === 'New' && (
                    <span className="bg-blue-50 text-[#0070D1] border border-blue-200 font-bold text-[11px] sm:text-xs px-2.5 py-1 rounded-full shadow-xs hidden sm:inline-block">
                      100% Genuine Sealed
                    </span>
                  )}
                </div>

                {/* Expand / Lightbox Button Top-Right */}
                {images.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute top-3 right-3 z-10 bg-white hover:bg-slate-100 text-slate-700 p-2 rounded-xl border border-slate-200 shadow-xs transition-transform active:scale-90 cursor-pointer"
                    title="View full resolution"
                  >
                    <Maximize2 className="w-4 h-4 text-slate-700" />
                  </button>
                )}

                {/* Left/Right Desktop Hover Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedImgIndex(prev => Math.max(0, prev - 1))}
                      disabled={selectedImgIndex === 0}
                      className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-full border border-slate-200 shadow-xs transition-opacity disabled:opacity-0 cursor-pointer items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedImgIndex(prev => Math.min(images.length - 1, prev + 1))}
                      disabled={selectedImgIndex === images.length - 1}
                      className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-full border border-slate-200 shadow-xs transition-opacity disabled:opacity-0 cursor-pointer items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Primary Image Display */}
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={activeProduct.name}
                    onClick={() => setIsLightboxOpen(true)}
                    className="max-h-full max-w-full object-contain cursor-zoom-in transition-transform duration-300 group-hover:scale-102"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <Gamepad2 className="w-16 h-16 mb-2" />
                    <span className="text-xs font-mono font-bold">SKU: {activeProduct.sku}</span>
                  </div>
                )}

                {/* Image Counter Pill on Mobile */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 right-3 z-10 bg-slate-900/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {selectedImgIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImgIndex(idx)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border p-1 shrink-0 transition-all cursor-pointer bg-white ${
                        selectedImgIndex === idx
                          ? 'border-[#0070D1] ring-2 ring-[#0070D1]/30 shadow-xs scale-102'
                          : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* ON MOBILE: The Buy Box renders directly below the Image Gallery! */}
            <div className="block lg:hidden">
              {renderBuyBox()}
            </div>

            {/* Infinite Horizontal Trust Marquee Ticker (Left to Right / Right to Left) */}
            {renderTrustTicker()}

            {/* Structured Content Tabs Section */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
              
              {/* Tab Header Buttons */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`inline-flex items-center gap-2 pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'overview'
                      ? 'border-[#0070D1] text-[#0070D1]'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Overview & Highlights</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('specs')}
                  className={`inline-flex items-center gap-2 pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'specs'
                      ? 'border-[#0070D1] text-[#0070D1]'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Technical Specifications</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('shipping')}
                  className={`inline-flex items-center gap-2 pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'shipping'
                      ? 'border-[#0070D1] text-[#0070D1]'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Delivery & Payment</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('guarantee')}
                  className={`inline-flex items-center gap-2 pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'guarantee'
                      ? 'border-[#0070D1] text-[#0070D1]'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>PGS Guarantee & FAQs</span>
                </button>
              </div>

              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {activeProduct.description ? (
                      <p className="whitespace-pre-line">{activeProduct.description}</p>
                    ) : (
                      <p className="text-slate-500 italic">
                        Official {activeProduct.name} available at PGS Game Shop Karachi. Authentic product tested and verified for performance and reliability.
                      </p>
                    )}
                  </div>

                  {/* Highlights Compact Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0070D1] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] sm:text-xs font-bold text-slate-900 block leading-tight">Quality Assured</span>
                        <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">Tested ports & thermals</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2">
                      <Box className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] sm:text-xs font-bold text-slate-900 block leading-tight">Safe Packaging</span>
                        <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">Tamper-proof bubble wrap</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] sm:text-xs font-bold text-slate-900 block leading-tight">Fast Dispatch</span>
                        <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">Orders before 4 PM same day</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2">
                      <PhoneCall className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] sm:text-xs font-bold text-slate-900 block leading-tight">Direct Support</span>
                        <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">WhatsApp with specialists</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Specs Table */}
              {activeTab === 'specs' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200 text-xs sm:text-sm">
                    <div className="grid grid-cols-3 p-3 bg-slate-50 font-bold text-slate-700">
                      <span>Specification</span>
                      <span className="col-span-2">Details</span>
                    </div>

                    <div className="grid grid-cols-3 p-3 bg-white">
                      <span className="font-semibold text-slate-500">Product Name</span>
                      <span className="col-span-2 font-bold text-slate-900">{activeProduct.name}</span>
                    </div>

                    <div className="grid grid-cols-3 p-3 bg-slate-50/50">
                      <span className="font-semibold text-slate-500">Category</span>
                      <span className="col-span-2 text-slate-800">{categoryName}</span>
                    </div>

                    <div className="grid grid-cols-3 p-3 bg-white">
                      <span className="font-semibold text-slate-500">Brand / Manufacturer</span>
                      <span className="col-span-2 font-medium text-slate-800">{activeProduct.brand || 'PGS Official'}</span>
                    </div>

                    <div className="grid grid-cols-3 p-3 bg-slate-50/50">
                      <span className="font-semibold text-slate-500">Condition Grade</span>
                      <span className="col-span-2 font-bold text-slate-900">{activeProduct.condition}</span>
                    </div>

                    <div className="grid grid-cols-3 p-3 bg-white">
                      <span className="font-semibold text-slate-500">SKU Identifier</span>
                      <span className="col-span-2 font-mono text-xs font-bold text-slate-800">{activeProduct.sku}</span>
                    </div>

                    {activeProduct.model && (
                      <div className="grid grid-cols-3 p-3 bg-slate-50/50">
                        <span className="font-semibold text-slate-500">Model / Edition</span>
                        <span className="col-span-2 text-slate-800">{activeProduct.model}</span>
                      </div>
                    )}

                    {activeProduct.color && (
                      <div className="grid grid-cols-3 p-3 bg-white">
                        <span className="font-semibold text-slate-500">Color</span>
                        <span className="col-span-2 text-slate-800">{activeProduct.color}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-3 p-3 bg-slate-50/50">
                      <span className="font-semibold text-slate-500">Warranty Coverage</span>
                      <span className="col-span-2 text-slate-800">
                        {activeProduct.condition === 'New' ? 'Official Brand / Distributor Warranty' : '7 Days Checking & Testing Warranty'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 p-3 bg-white">
                      <span className="font-semibold text-slate-500">Warehouse Stock</span>
                      <span className="col-span-2">
                        {activeProduct.inStock ? (
                          <span className="text-emerald-700 font-bold">Ready in Stock ({activeProduct.warehouseStock} available)</span>
                        ) : (
                          <span className="text-rose-600 font-bold">Temporarily Out of Stock</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Shipping & Payment */}
              {activeTab === 'shipping' && (
                <div className="space-y-4 animate-in fade-in duration-200 text-xs sm:text-sm text-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Truck className="w-4 h-4 text-[#0070D1]" />
                        <span>Karachi Express Dispatch</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Same-day or next-day rider delivery within Karachi. Cash on Delivery (COD) available for all Karachi addresses.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Box className="w-4 h-4 text-emerald-600" />
                        <span>Nationwide Pakistan Delivery</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Dispatched via Trax or TCS Air Express with fragile tamper-proof packaging. Delivery takes 1 to 3 business days nationwide.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <CreditCard className="w-4 h-4 text-indigo-600" />
                        <span>Payment Methods</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        We accept Cash on Delivery (COD), Online Direct Bank Transfer (Meezan, HBL, Alfalah), Raast ID, and JazzCash/EasyPaisa.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Store className="w-4 h-4 text-amber-600" />
                        <span>Self Pickup at Karachi Store</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        You can also visit our physical shop in Karachi to inspect the product in person and purchase over the counter.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Guarantee & FAQs */}
              {activeTab === 'guarantee' && (
                <div className="space-y-4 animate-in fade-in duration-200 text-xs sm:text-sm">
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">How does the 7-Day Checking Warranty work?</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Used consoles, controllers, and accessories are covered by our 7-Day checking warranty. If any functional hardware fault is detected, we offer free repair or replacement.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Are games and accessories original?</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Yes, PGS Game Shop guarantees 100% authentic discs, digital codes, and original brand accessories. No replicas or counterfeit items.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Can I request live photos on WhatsApp before dispatch?</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Absolutely! For used hardware, you can message our WhatsApp number anytime and our technician will send actual photos and video verification of the unit.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right Column: Sticky Buy Box on Desktop (5 cols) */}
          <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-24 space-y-5">
            {renderBuyBox()}
          </div>

        </div>

        {/* Related & Similar Products Section */}
        {relatedProducts.length > 0 && (
          <section className="space-y-4 pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  Similar & Related Products
                </h2>
                <p className="text-xs text-slate-500">More gaming hardware from {categoryName}</p>
              </div>
              <Link
                href="/products"
                className="text-xs font-bold text-[#0070D1] hover:underline flex items-center gap-1"
              >
                <span>View Full Catalog</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {relatedProducts.map(p => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onQuickView={item => setQuickViewProduct(item)}
                />
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Mobile Sticky Bottom Buy Bar (Shown when scrolled past top) */}
      {showStickyBar && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-xl px-4 py-2.5 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {currentImage && (
              <img
                src={currentImage}
                alt=""
                className="w-10 h-10 rounded-lg object-contain bg-slate-50 border border-slate-200 shrink-0 p-0.5"
              />
            )}
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 truncate block leading-tight">
                {activeProduct.name}
              </span>
              <span className="text-xs font-extrabold text-[#0070D1]">
                {priceOnCall ? 'Call for Price' : formatPKR(finalPrice)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleWhatsAppContact}
              className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition-all"
              title="Order on WhatsApp"
            >
              <PhoneCall className="w-4 h-4" />
            </button>

            {cartQty > 0 ? (
              <button
                type="button"
                onClick={openCart}
                className="py-2.5 px-3.5 rounded-xl bg-blue-50 text-[#0070D1] font-bold text-xs border border-blue-200 active:scale-95 transition-all"
              >
                In Cart ({cartQty})
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => addToCart(effectiveProductForCart, 1, e.currentTarget)}
                disabled={!activeProduct.inStock}
                className="py-2.5 px-3.5 rounded-xl bg-[#0070D1] hover:bg-[#005bb5] text-white font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all disabled:opacity-40"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Lightbox Modal for High-Resolution Image Inspection */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex flex-col items-center justify-between p-4 animate-in fade-in duration-200">
          <div className="w-full flex items-center justify-between text-white max-w-5xl pt-2">
            <span className="text-xs font-bold text-slate-300">
              {activeProduct.name} ({selectedImgIndex + 1} / {images.length})
            </span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative flex-1 w-full max-w-4xl flex items-center justify-center p-4">
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => setSelectedImgIndex(prev => Math.max(0, prev - 1))}
                disabled={selectedImgIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-20 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={currentImage}
              alt=""
              className="max-h-[75vh] max-w-full object-contain drop-shadow-2xl"
            />

            {images.length > 1 && (
              <button
                type="button"
                onClick={() => setSelectedImgIndex(prev => Math.min(images.length - 1, prev + 1))}
                disabled={selectedImgIndex === images.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-20 transition-all cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-4 max-w-lg">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`w-14 h-14 rounded-xl border p-1 shrink-0 bg-white/5 transition-all cursor-pointer ${
                    selectedImgIndex === idx ? 'border-[#0070D1] ring-2 ring-[#0070D1]' : 'border-white/20 opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Regular Mobile Bottom Nav (Shown only when sticky buy bar is hidden) */}
      {!showStickyBar && (
        <MobileBottomNav
          activeTab="search"
          onTabSelect={tab => {
            if (tab === 'cart') openCart();
            else if (tab === 'home') window.location.href = '/';
            else if (tab === 'categories') window.location.href = '/products';
          }}
        />
      )}

      {/* Global Modals & Cart Drawer */}
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
        allProducts={relatedProducts}
        onClose={() => setQuickViewProduct(null)}
      />

      <Footer />

    </div>
  );
}

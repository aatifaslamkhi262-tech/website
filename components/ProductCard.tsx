'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product, ProductCondition } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { getProductEffectivePrice, isPriceOnCall, getProductSlug } from '@/lib/api';
import { ShoppingBag, Eye, Check, X, Gamepad2, PhoneCall, Tag, Sparkles, Plus, Minus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { cart, addToCart, updateQuantity } = useCart();

  const cartItem = cart.find(item => item.product._id === product._id);
  const cartQty = cartItem ? cartItem.quantity : 0;

  const primaryImg = product.images && product.images.length > 0
    ? (product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || '')
    : '';

  const [hasImageError, setHasImageError] = useState<boolean>(false);

  const renderConditionBadge = (condition: ProductCondition) => {
    switch (condition) {
      case 'New':
        return (
          <span className="inline-flex items-center bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-semibold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-2xs">
            New
          </span>
        );
      case 'Used':
        return (
          <span className="inline-flex items-center bg-amber-50 text-amber-800 border border-amber-200/80 font-semibold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-2xs">
            Pre-Owned
          </span>
        );
      case 'Refurbished':
        return (
          <span className="inline-flex items-center bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-semibold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-2xs">
            Refurbished
          </span>
        );
      case 'Defective':
        return (
          <span className="inline-flex items-center bg-rose-50 text-rose-700 border border-rose-200/80 font-semibold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-2xs">
            Clearance
          </span>
        );
      default:
        return null;
    }
  };

  // Determine effective price & call for price status
  const finalPrice = getProductEffectivePrice(product);
  const priceOnCall = isPriceOnCall(product);

  const hasDiscount = Boolean(
    product.minSellingPrice &&
    product.minSellingPrice > 0 &&
    product.minSellingPrice < product.sellingPrice
  );
  const originalPrice = hasDiscount ? product.sellingPrice : product.originalPrice;

  const formatPKR = (val: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(val).replace('PKR', 'Rs.');
  };

  const categoryName = typeof product.category === 'object' && product.category !== null
    ? product.category.name
    : product.category || 'Gaming';

  const showImage = Boolean(primaryImg && !hasImageError);

  const handleWhatsAppContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = `Hi PGS Game Shop, I want to inquire about price and availability for ${product.name} (SKU: ${product.sku}).`;
    window.open(`https://wa.me/923122319157?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Prepare product object with effective final price for cart
  const effectiveProductForCart: Product = {
    ...product,
    sellingPrice: finalPrice
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 hover:border-[#0070D1]/50 shadow-2xs hover:shadow-xl hover:shadow-[#0070D1]/15 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group relative">
      
      {/* Discount Savings Tag */}
      {hasDiscount && (
        <div className="absolute top-2 right-2 z-20 bg-rose-600 text-white font-extrabold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-sm animate-pulse">
          SALE
        </div>
      )}

      {/* Top Media Container */}
      <Link
        href={`/products/${getProductSlug(product)}`}
        className="relative w-full aspect-[4/3] bg-slate-50/80 p-3 sm:p-4 flex items-center justify-center cursor-pointer border-b border-slate-100 overflow-hidden block"
      >
        {/* Grade Badge Overlay (Top Left) */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1">
          {renderConditionBadge(product.condition)}
        </div>

        {/* Floating Glassmorphic Quick Specs Pill on Hover */}
        <div className="absolute bottom-2 inset-x-2 z-20 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
          <span className="bg-slate-900/85 backdrop-blur-md text-white font-semibold text-[9px] px-2.5 py-1 rounded-full shadow-md border border-white/20 flex items-center gap-1 truncate max-w-[90%]">
            <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="truncate">100% Genuine • Live Stock</span>
          </span>
        </div>

        {/* Out of Stock Overlay Badge (Bottom Left of Media Container) */}
        {!product.inStock && (
          <div className="absolute bottom-2 left-2.5 z-10 group-hover:opacity-0 transition-opacity">
            <span className="inline-flex items-center bg-rose-950/85 text-rose-300 border border-rose-500/40 backdrop-blur-xs font-extrabold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md shadow-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick View Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onQuickView?.(product);
          }}
          className="absolute top-2.5 right-2.5 z-10 bg-white/95 hover:bg-white text-slate-700 hover:text-[#0070D1] p-1.5 rounded-xl shadow-xs opacity-0 group-hover:opacity-100 transition-all border border-slate-200 hidden sm:block active:scale-95"
          title="Quick View Modal"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        {/* Product Image OR Clean Minimal Icon Frame */}
        {showImage ? (
          <img
            src={primaryImg}
            alt={product.name}
            onError={() => setHasImageError(true)}
            className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-200/70 text-slate-400 flex items-center justify-center mb-1 group-hover:text-[#0070D1] transition-colors">
              <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider truncate max-w-[110px]">
              {product.sku}
            </span>
          </div>
        )}
      </Link>

      {/* Card Info Section */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Subtitle */}
          <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-slate-400 font-bold tracking-wider uppercase mb-1">
            <span className="truncate max-w-[80px] text-blue-700 font-semibold">{product.brand || 'PGS'}</span>
            <span className="truncate max-w-[80px]">{categoryName}</span>
          </div>

          {/* Title */}
          <Link
            href={`/products/${getProductSlug(product)}`}
            className="font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2 hover:text-[#0070D1] cursor-pointer transition-colors block"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Action CTA Row */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          
          <div className="flex items-center justify-between gap-1 min-h-[28px]">
            {priceOnCall ? (
              <span className="text-[11px] sm:text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 block">
                Call for Price
              </span>
            ) : (
              <div className="flex flex-col">
                {/* Original Selling Price (Cut / Strike-through) */}
                {originalPrice && originalPrice > finalPrice && (
                  <span className="text-[10px] sm:text-xs text-slate-400 line-through font-medium leading-none">
                    {formatPKR(originalPrice)}
                  </span>
                )}
                {/* Min Selling Price (Main Bold Price) */}
                <span className="text-sm sm:text-base font-extrabold text-blue-700 tracking-tight leading-tight">
                  {formatPKR(finalPrice)}
                </span>
              </div>
            )}
          </div>

          {/* Single Action Button OR Quantity Stepper when in cart */}
          {priceOnCall ? (
            <button
              onClick={handleWhatsAppContact}
              className="w-full py-2 px-2.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all bg-amber-600 hover:bg-amber-700 active:scale-98 text-white shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Contact Price
            </button>
          ) : !product.inStock ? (
            <button
              onClick={handleWhatsAppContact}
              className="w-full py-2 px-2.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all bg-amber-500 hover:bg-amber-600 active:scale-98 text-white shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Inquire Stock
            </button>
          ) : cartQty > 0 ? (
            <div
              className="w-full py-1 px-1.5 rounded-xl bg-blue-50 border border-blue-300 flex items-center justify-between shadow-2xs"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(product._id, cartQty - 1);
                }}
                className="w-7 h-7 rounded-lg bg-white text-blue-700 hover:bg-rose-600 hover:text-white border border-blue-200 hover:border-rose-600 flex items-center justify-center transition-all active:scale-95 shadow-2xs font-bold"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1">
                <span className="text-xs sm:text-sm font-extrabold text-blue-950 font-mono">
                  {cartQty}
                </span>
                <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">in cart</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(product._id, cartQty + 1);
                }}
                className="w-7 h-7 rounded-lg bg-[#0070D1] text-white hover:bg-[#005bb5] flex items-center justify-center transition-all active:scale-95 shadow-2xs font-bold"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => addToCart(effectiveProductForCart, 1, e.currentTarget)}
              className="w-full py-2 px-2.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all bg-[#0070D1] hover:bg-[#005bb5] active:scale-98 text-white shadow-xs shadow-blue-600/20 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Cart
            </button>
          )}

        </div>

      </div>

    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { Product, ProductCondition } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { getProductEffectivePrice, isPriceOnCall } from '@/lib/api';
import { ShoppingBag, Eye, Check, X, Gamepad2, PhoneCall, Tag, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();

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
    window.open(`https://wa.me/923001234567?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Prepare product object with effective final price for cart
  const effectiveProductForCart: Product = {
    ...product,
    sellingPrice: finalPrice
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/50 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group relative">
      
      {/* Discount Savings Tag */}
      {hasDiscount && (
        <div className="absolute top-2 right-2 z-20 bg-rose-600 text-white font-extrabold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-sm animate-pulse">
          SALE
        </div>
      )}

      {/* Top Media Container */}
      <div
        className="relative w-full aspect-[4/3] bg-slate-50/80 p-3 sm:p-4 flex items-center justify-center cursor-pointer border-b border-slate-100 overflow-hidden"
        onClick={() => onQuickView?.(product)}
      >
        {/* Grade Badge Overlay (Top Left) */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1">
          {renderConditionBadge(product.condition)}
        </div>

        {/* Out of Stock Overlay Badge (Bottom Left of Media Container) */}
        {!product.inStock && (
          <div className="absolute bottom-2 left-2.5 z-10">
            <span className="inline-flex items-center bg-rose-950/85 text-rose-300 border border-rose-500/40 backdrop-blur-xs font-extrabold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md shadow-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView?.(product);
          }}
          className="absolute top-2.5 right-2.5 z-10 bg-white/95 hover:bg-white text-slate-700 hover:text-emerald-600 p-1.5 rounded-xl shadow-xs opacity-0 group-hover:opacity-100 transition-all border border-slate-200 hidden sm:block"
          title="Quick View"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        {/* Product Image OR Clean Minimal Icon Frame */}
        {showImage ? (
          <img
            src={primaryImg}
            alt={product.name}
            onError={() => setHasImageError(true)}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-200/70 text-slate-400 flex items-center justify-center mb-1 group-hover:text-emerald-600 transition-colors">
              <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider truncate max-w-[110px]">
              {product.sku}
            </span>
          </div>
        )}
      </div>

      {/* Card Info Section */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Subtitle */}
          <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-slate-400 font-bold tracking-wider uppercase mb-1">
            <span className="truncate max-w-[80px] text-emerald-700 font-semibold">{product.brand || 'PGS'}</span>
            <span className="truncate max-w-[80px]">{categoryName}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onQuickView?.(product)}
            className="font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2 hover:text-emerald-600 cursor-pointer transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>
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
                <span className="text-sm sm:text-base font-extrabold text-emerald-700 tracking-tight leading-tight">
                  {formatPKR(finalPrice)}
                </span>
              </div>
            )}
          </div>

          {/* Single Action Button */}
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
          ) : (
            <button
              onClick={() => addToCart(effectiveProductForCart)}
              className="w-full py-2 px-2.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white shadow-xs shadow-emerald-600/20"
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

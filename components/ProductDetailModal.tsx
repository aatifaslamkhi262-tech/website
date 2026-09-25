'use client';

import React, { useState, useEffect } from 'react';
import { Product, ProductCondition } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { getProductEffectivePrice, isPriceOnCall } from '@/lib/api';
import { X, CheckCircle2, XCircle, ShoppingBag, Gamepad2, Tag, PhoneCall, Sparkles, Check } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  allProducts?: Product[];
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, allProducts = [], onClose }) => {
  const { addToCart } = useCart();
  const [activeProduct, setActiveProduct] = useState<Product | null>(product);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [hasImgError, setHasImgError] = useState<boolean>(false);

  // Sync activeProduct when initial product prop changes
  useEffect(() => {
    setActiveProduct(product);
    setQuantity(1);
    setSelectedImg(null);
    setHasImgError(false);
  }, [product]);

  if (!activeProduct) return null;

  // Find sibling condition variants (e.g. New vs Used for same title)
  const getBaseName = (name: string) => {
    return name.replace(/\b(USED|NEW|REFURBISHED|SEALED|UNSEALED|KIT|EDITION)\b/gi, '').trim().toLowerCase();
  };

  const currentBaseName = getBaseName(activeProduct.name);
  
  // Find matching variants from catalog sharing same base name
  const variants = allProducts.filter(p => {
    if (p._id === activeProduct._id) return true;
    const pBase = getBaseName(p.name);
    return pBase.length > 3 && (pBase === currentBaseName || currentBaseName.includes(pBase) || pBase.includes(currentBaseName));
  });

  // Group variants by unique condition grade
  const uniqueConditionVariants: Product[] = [];
  const seenConditions = new Set<string>();

  variants.forEach(v => {
    if (!seenConditions.has(v.condition)) {
      seenConditions.add(v.condition);
      uniqueConditionVariants.push(v);
    }
  });

  const validImages = activeProduct.images && activeProduct.images.length > 0
    ? activeProduct.images.filter(i => Boolean(i.url))
    : [];

  const currentImage = selectedImg || (validImages.length > 0 ? validImages[0].url : '');
  const showImage = Boolean(currentImage && !hasImgError);

  // Effective discounted price calculation
  const finalPrice = getProductEffectivePrice(activeProduct);
  const priceOnCall = isPriceOnCall(activeProduct);

  const hasDiscount = Boolean(
    activeProduct.minSellingPrice &&
    activeProduct.minSellingPrice > 0 &&
    activeProduct.minSellingPrice < activeProduct.sellingPrice
  );
  const originalPrice = hasDiscount ? activeProduct.sellingPrice : activeProduct.originalPrice;

  const formatPKR = (val: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(val).replace('PKR', 'Rs.');
  };

  const categoryName = typeof activeProduct.category === 'object' && activeProduct.category !== null
    ? activeProduct.category.name
    : activeProduct.category || 'Gaming';

  const handleWhatsAppContact = () => {
    const msg = `Hi PGS Game Shop, I want to inquire about price and availability for ${activeProduct.name} (SKU: ${activeProduct.sku}).`;
    window.open(`https://wa.me/923001234567?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const effectiveProductForCart: Product = {
    ...activeProduct,
    sellingPrice: finalPrice
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full transition-colors shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Media View */}
          <div className="p-4 sm:p-6 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100">
            <div className="aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-inner mb-3 relative flex items-center justify-center border border-slate-200/60">
              
              {/* Badges Overlay */}
              <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 flex-wrap max-w-[85%]">
                {activeProduct.condition === 'New' && (
                  <span className="bg-emerald-600 text-white font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-2xs">
                    New
                  </span>
                )}
                {activeProduct.condition === 'Used' && (
                  <span className="bg-amber-500 text-white font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-2xs">
                    Pre-Owned (Used)
                  </span>
                )}
                {activeProduct.condition === 'Refurbished' && (
                  <span className="bg-indigo-600 text-white font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-2xs">
                    Refurbished
                  </span>
                )}
                {activeProduct.condition === 'Defective' && (
                  <span className="bg-rose-600 text-white font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-2xs">
                    Clearance
                  </span>
                )}

                {!activeProduct.inStock && (
                  <span className="bg-rose-950/80 backdrop-blur-xs text-rose-300 font-extrabold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full border border-rose-500/40 shadow-2xs">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Product Image OR Clean Minimal Frame */}
              {showImage ? (
                <img
                  src={currentImage}
                  alt={activeProduct.name}
                  onError={() => setHasImgError(true)}
                  className="max-h-full max-w-full object-contain p-2"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-1.5">
                    <Gamepad2 className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-400">
                    SKU: {activeProduct.sku}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails if available */}
            {validImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {validImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImg(img.url);
                      setHasImgError(false);
                    }}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white shrink-0 ${
                      currentImage === img.url ? 'border-emerald-600 shadow-2xs' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Actions View */}
          <div className="p-4 sm:p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">{activeProduct.brand || 'PGS Official'}</span>
                <span>•</span>
                <span>{categoryName}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-3">
                {activeProduct.name}
              </h2>

              {/* Dynamic Condition Selector (Shown only when New/Used variants exist!) */}
              {uniqueConditionVariants.length > 1 && (
                <div className="mb-3.5 bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 space-y-2">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Select Condition / Grade Variant:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {uniqueConditionVariants.map(v => {
                      const isSelected = v._id === activeProduct._id;
                      const vPrice = getProductEffectivePrice(v);

                      return (
                        <button
                          key={v._id}
                          onClick={() => {
                            setActiveProduct(v);
                            setSelectedImg(null);
                            setHasImgError(false);
                          }}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border ${
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                          <span>{v.condition}</span>
                          <span className={isSelected ? 'text-emerald-400 font-mono text-[11px]' : 'text-slate-500 font-mono text-[11px]'}>
                            ({vPrice > 0 ? formatPKR(vPrice) : 'Call'})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Clean Price & Stock Container */}
              <div className="flex items-center justify-between gap-2 mb-3.5 bg-slate-50 p-3 rounded-2xl border border-slate-100 flex-wrap">
                <div>
                  {priceOnCall ? (
                    <span className="text-xs sm:text-sm font-extrabold text-amber-800 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 block">
                      Price on Call
                    </span>
                  ) : (
                    <div className="flex flex-col">
                      {originalPrice && originalPrice > finalPrice && (
                        <span className="text-[11px] text-slate-400 line-through font-medium leading-none mb-0.5">
                          {formatPKR(originalPrice)}
                        </span>
                      )}
                      <span className="text-xl sm:text-2xl font-extrabold text-emerald-700 tracking-tight leading-none">
                        {formatPKR(finalPrice)}
                      </span>
                    </div>
                  )}
                </div>

                {activeProduct.inStock ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold text-[11px] sm:text-xs px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> In Stock ({activeProduct.warehouseStock})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 font-bold text-[11px] sm:text-xs px-2.5 py-1 rounded-full border border-rose-200 shrink-0">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" /> Out of Stock
                  </span>
                )}
              </div>

              {/* Description */}
              {activeProduct.description && (
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {activeProduct.description}
                </p>
              )}

              {/* Serial & Barcode Spec Pills */}
              <div className="space-y-1 text-xs text-slate-500 font-medium border-t border-slate-100 pt-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">SKU Code:</span>
                  <span className="font-mono text-slate-800 font-bold">{activeProduct.sku}</span>
                </div>
                {activeProduct.barcode && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Barcode / EAN:</span>
                    <span className="font-mono text-slate-800">{activeProduct.barcode}</span>
                  </div>
                )}
                {activeProduct.serialTracking && (
                  <div className="flex items-center justify-between text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-md mt-1">
                    <span>Serial Tracking:</span>
                    <span className="font-bold">Enabled for Warranty</span>
                  </div>
                )}
              </div>
            </div>

            {/* Smart Action Buttons */}
            <div className="space-y-2.5 pt-2.5 border-t border-slate-100">
              {activeProduct.inStock && !isPriceOnCall ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Quantity</span>
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="px-3 py-1 text-slate-600 hover:bg-slate-200 font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-sm font-bold text-slate-900 bg-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(q => Math.min(activeProduct.warehouseStock || 99, q + 1))}
                        className="px-3 py-1 text-slate-600 hover:bg-slate-200 font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(effectiveProductForCart, quantity);
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {quantity} to Cart ({formatPKR(finalPrice * quantity)})</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-700 active:scale-98 text-white shadow-md transition-all"
                >
                  <PhoneCall className="w-4 h-4 shrink-0" />
                  <span>
                    {priceOnCall && !activeProduct.inStock
                      ? 'Inquire Price & Stock on WhatsApp / Call'
                      : priceOnCall
                      ? 'Inquire Price on WhatsApp / Call'
                      : 'Inquire Availability on WhatsApp / Call'}
                  </span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

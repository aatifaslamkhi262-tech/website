'use client';

import React, { useState } from 'react';
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
  Share2, Check, Sparkles, Plus, Minus, Gamepad2, Award
} from 'lucide-react';

interface ClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClientPage({ product, relatedProducts }: ClientProps) {
  const { cart, addToCart, updateQuantity, openCart } = useCart();

  const [selectedImgIndex, setSelectedImgIndex] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [orderSuccessData, setOrderSuccessData] = useState<CheckoutResponseData | null>(null);

  const cartItem = cart.find(item => item.product._id === product._id);
  const cartQty = cartItem ? cartItem.quantity : 0;

  const finalPrice = getProductEffectivePrice(product);
  const priceOnCall = isPriceOnCall(product);

  const images = product.images && product.images.length > 0
    ? product.images.map(img => img.url)
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
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} at PGS Game Shop Karachi!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleWhatsAppContact = () => {
    const msg = `Hi PGS Game Shop, I want to order ${product.name} (SKU: ${product.sku}) for ${formatPKR(finalPrice)}. Is it in stock for dispatch?`;
    window.open(`https://wa.me/923122319157?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const effectiveProductForCart: Product = {
    ...product,
    sellingPrice: finalPrice
  };

  const categoryName = typeof product.category === 'object' && product.category !== null
    ? product.category.name
    : (product.category || 'Gaming');

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 pb-20 md:pb-0">
      
      {/* Header */}
      <Header onCartClick={openCart} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-[#0070D1] transition-colors">Home</Link>
            <span>•</span>
            <Link href="/products" className="hover:text-[#0070D1] transition-colors">Catalog</Link>
            <span>•</span>
            <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-xl font-bold text-slate-700 shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-[#0070D1]" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>

        {/* Product Details Main Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
          
          {/* Left Column: Image Gallery (7 Cols on desktop) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Primary Main Image Frame */}
            <div className="relative w-full aspect-[4/3] bg-slate-50 rounded-2xl border border-slate-200/80 p-6 flex items-center justify-center overflow-hidden group shadow-inner">
              
              {/* Badges */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                <span className="bg-slate-900 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-sm">
                  {product.condition}
                </span>
                {product.inStock ? (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs px-3 py-1 rounded-full shadow-2xs">
                    In Stock
                  </span>
                ) : (
                  <span className="bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs px-3 py-1 rounded-full shadow-2xs">
                    Out of Stock
                  </span>
                )}
              </div>

              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <Gamepad2 className="w-16 h-16 mb-2" />
                  <span className="text-xs font-mono font-bold">{product.sku}</span>
                </div>
              )}
            </div>

            {/* Thumbnail Navigation Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`w-16 h-16 rounded-xl border p-1 shrink-0 transition-all cursor-pointer bg-slate-50 ${
                      selectedImgIndex === idx
                        ? 'border-[#0070D1] ring-2 ring-[#0070D1]/30 scale-105'
                        : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantee Trust Grid */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center text-xs font-semibold text-slate-700">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 flex flex-col items-center justify-center gap-1">
                <Store className="w-4 h-4 text-[#0070D1]" />
                <span className="text-[11px] leading-tight">100% Genuine Product</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 flex flex-col items-center justify-center gap-1">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] leading-tight">Insured Nationwide Delivery</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 flex flex-col items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] leading-tight">Warranty Verified</span>
              </div>
            </div>

          </div>

          {/* Right Column: Info & Action Box (5 Cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-start space-y-5">
            
            <div className="space-y-4">
              
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span className="text-[#0070D1]">{categoryName}</span>
                <span className="font-mono">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Responsive Store Price Block */}
              <div className="p-3.5 sm:p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col xs:flex-row xs:items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-xs text-slate-400 font-bold block uppercase tracking-wider mb-0.5">Store Price</span>
                  {priceOnCall ? (
                    <span className="text-lg font-extrabold text-amber-700">Call for Price</span>
                  ) : (
                    <div className="flex items-baseline flex-wrap gap-2">
                      <span className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-[#0070D1] tracking-tight">
                        {formatPKR(finalPrice)}
                      </span>
                      {product.originalPrice && product.originalPrice > finalPrice && (
                        <span className="text-xs sm:text-sm text-slate-400 line-through font-medium">
                          {formatPKR(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {product.condition === 'New' && (
                  <span className="bg-blue-50 text-[#0070D1] border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-full shrink-0 w-fit self-start xs:self-auto">
                    Factory Sealed
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="space-y-1">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Product Overview</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {product.description}
                  </p>
                </div>
              )}

            </div>

            {/* Action Buttons Section */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              
              {cartQty > 0 ? (
                <div className="w-full p-2 rounded-2xl bg-blue-50 border border-blue-300 flex items-center justify-between shadow-2xs">
                  <button
                    type="button"
                    onClick={() => updateQuantity(product._id, cartQty - 1)}
                    className="w-10 h-10 rounded-xl bg-white text-blue-700 hover:bg-rose-600 hover:text-white border border-blue-200 hover:border-rose-600 flex items-center justify-center transition-all active:scale-95 font-bold cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="flex flex-col items-center">
                    <span className="text-base font-extrabold text-blue-950 font-mono">
                      {cartQty} IN CART
                    </span>
                    <span className="text-[10px] text-blue-700 font-bold uppercase">Subtotal: {formatPKR(finalPrice * cartQty)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => updateQuantity(product._id, cartQty + 1)}
                    className="w-10 h-10 rounded-xl bg-[#0070D1] text-white hover:bg-[#005bb5] flex items-center justify-center transition-all active:scale-95 font-bold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => addToCart(effectiveProductForCart, 1, e.currentTarget)}
                  disabled={!product.inStock}
                  className="w-full py-3.5 px-6 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all bg-[#0070D1] hover:bg-[#005bb5] active:scale-98 text-white shadow-md shadow-blue-600/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{product.inStock ? 'Add to Shopping Cart' : 'Out of Stock'}</span>
                </button>
              )}

              {/* WhatsApp Quick Order Button */}
              <button
                onClick={handleWhatsAppContact}
                className="w-full py-3 px-6 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white shadow-xs cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Instant Order via WhatsApp</span>
              </button>

            </div>

          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="space-y-4 pt-4">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Similar & Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {relatedProducts.map(p => (
                <ProductCard key={p._id} product={p} onQuickView={item => setQuickViewProduct(item)} />
              ))}
            </div>
          </section>
        )}

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
        allProducts={relatedProducts}
        onClose={() => setQuickViewProduct(null)}
      />

      <MobileBottomNav activeTab="search" onTabSelect={tab => {
        if (tab === 'cart') openCart();
        else if (tab === 'home') window.location.href = '/';
        else if (tab === 'categories') window.location.href = '/products';
      }} />

      <Footer />

    </div>
  );
}

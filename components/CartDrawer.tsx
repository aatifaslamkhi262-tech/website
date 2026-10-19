'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { X, Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, Truck, Gamepad2 } from 'lucide-react';
import { Product } from '@/lib/types';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

const CartItemImage: React.FC<{ product: Product }> = ({ product }) => {
  const [hasError, setHasError] = React.useState(false);
  const primaryImg = product.images && product.images.length > 0
    ? (product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || '')
    : '';

  const showImage = Boolean(primaryImg && !hasError);

  return (
    <div className="w-16 h-16 bg-white rounded-xl overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center p-1">
      {showImage ? (
        <img
          src={primaryImg}
          alt={product.name}
          onError={() => setHasError(true)}
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
          <Gamepad2 className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingCharges,
    grandTotal,
    totalItemsCount,
  } = useCart();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) closeCart();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(amount).replace('PKR', 'Rs.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 transition-opacity">
      <div className="absolute inset-0" onClick={closeCart} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300">
          
          {/* Responsive Header */}
          <div className="p-3.5 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 bg-blue-100 text-[#0070D1] rounded-xl shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <h2 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight truncate">
                  Your Cart
                </h2>
                <span className="bg-blue-100 text-blue-900 text-[10px] sm:text-xs font-extrabold px-2.5 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={closeCart}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                title="Continue Shopping"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </button>
              <button
                type="button"
                onClick={closeCart}
                className="bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-700 p-2 rounded-lg border border-slate-300 transition-colors shrink-0 cursor-pointer"
                title="Close cart"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Your cart is empty</h3>
                <p className="text-slate-500 text-xs max-w-xs mb-6">
                  Explore our PS5 consoles, pre-owned games, and official accessories to add items to your cart.
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 bg-[#0070D1] hover:bg-[#005bb5] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Continue Shopping</span>
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => {
                return (
                  <div
                    key={product._id}
                    className="flex gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 items-center justify-between hover:border-slate-300 transition-all animate-in fade-in slide-in-from-right-4 duration-300"
                  >
                    {/* Item Image */}
                    <CartItemImage product={product} />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md shrink-0 ${
                          product.condition === 'New' ? 'bg-blue-100 text-blue-900' :
                          product.condition === 'Used' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {product.condition}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono truncate">
                          {product.sku}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-900 text-xs line-clamp-1 leading-snug">
                        {product.name}
                      </h4>
                      <div className="font-extrabold text-slate-900 text-xs mt-1">
                        {formatPKR(product.sellingPrice)}
                      </div>
                    </div>

                    {/* Quantity Selector & Remove */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => removeFromCart(product._id)}
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors p-1.5 touch-manipulation cursor-pointer"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product._id, quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-extrabold text-slate-900 font-mono select-none">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product._id, quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Responsive Footer Breakdown & Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-3.5 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3.5 shrink-0">
              <div className="space-y-2 text-xs text-slate-600 font-medium">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 gap-2">
                  <span className="flex items-center gap-1 truncate">
                    <Truck className="w-3.5 h-3.5 text-[#0070D1] shrink-0" />
                    <span className="truncate">Delivery Fee (Standard)</span>
                  </span>
                  <span className="font-bold text-slate-900 shrink-0">{formatPKR(shippingCharges)}</span>
                </div>
                <div className="flex justify-between items-center text-sm sm:text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="text-blue-700">{formatPKR(grandTotal)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    onProceedToCheckout();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#0070D1] hover:bg-[#005bb5] active:scale-[0.99] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <span>Proceed to Express Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 active:scale-[0.99] text-slate-700 hover:text-slate-900 font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl border border-slate-300 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-500" />
                  <span>Continue Shopping</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

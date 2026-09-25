'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, Gamepad2 } from 'lucide-react';
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

  if (!isCartOpen) return null;

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(amount).replace('PKR', 'Rs.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs transition-opacity">
      <div className="absolute inset-0" onClick={closeCart} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-slate-900 text-lg">Your Shopping Cart</h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                {totalItemsCount} items
              </span>
            </div>
            <button
              onClick={closeCart}
              className="bg-white hover:bg-slate-200 text-slate-500 p-2 rounded-full border border-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
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
                  onClick={closeCart}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all"
                >
                  Browse Store Catalog
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => {
                const itemTotal = product.sellingPrice * quantity;

                return (
                  <div
                    key={product._id}
                    className="flex gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80 items-center justify-between hover:border-slate-300 transition-all"
                  >
                    {/* Item Image */}
                    <CartItemImage product={product} />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                          product.condition === 'New' ? 'bg-emerald-100 text-emerald-800' :
                          product.condition === 'Used' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {product.condition}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium truncate">
                          {product.sku}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-900 text-xs line-clamp-1">
                        {product.name}
                      </h4>
                      <div className="font-extrabold text-slate-900 text-xs mt-1">
                        {formatPKR(product.sellingPrice)}
                      </div>
                    </div>

                    {/* Quantity Selector & Remove */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => removeFromCart(product._id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateQuantity(product._id, quantity - 1)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-bold text-slate-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product._id, quantity + 1)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 text-xs font-bold"
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

          {/* Footer Breakdown & Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 space-y-4">
              <div className="space-y-2 text-xs text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" /> Delivery Charges (Standard Shipping)
                  </span>
                  <span className="font-semibold text-slate-900">{formatPKR(shippingCharges)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="text-emerald-700">{formatPKR(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  closeCart();
                  onProceedToCheckout();
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#059669] hover:bg-[#047857] active:scale-98 text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
              >
                <span>Proceed to Express Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

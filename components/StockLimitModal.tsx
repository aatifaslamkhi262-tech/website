'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { AlertTriangle, PhoneCall, X } from 'lucide-react';

interface StockLimitModalProps {
  stockInfo: {
    product: Product;
    availableStock: number;
  } | null;
  onClose: () => void;
}

export const StockLimitModal: React.FC<StockLimitModalProps> = ({ stockInfo, onClose }) => {
  if (!stockInfo) return null;

  const { product, availableStock } = stockInfo;

  const handleWhatsAppContact = () => {
    const msg = `Hi PGS Game Shop, I want to inquire about additional stock for ${product.name} (SKU: ${product.sku}). Currently only ${availableStock} unit(s) available on website.`;
    window.open(`https://wa.me/923122319157?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const primaryImg = product.images && product.images.length > 0
    ? (product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || '')
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Warning Header */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200/80 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
            <span>Limited Inventory Stock Limit</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
            Only {availableStock} {availableStock === 1 ? 'Piece' : 'Pieces'} Available in Stock!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Aap is waqt <span className="font-bold text-slate-900">{product.name}</span> ka available stock limit reach kar chuke hain.
          </p>
        </div>

        {/* Product Spec Card */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center gap-3">
          {primaryImg ? (
            <img
              src={primaryImg}
              alt={product.name}
              className="w-12 h-12 object-contain bg-white rounded-xl border border-slate-200 p-1 shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-400 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
              SKU
            </div>
          )}
          <div className="text-xs space-y-0.5 overflow-hidden">
            <p className="font-bold text-slate-900 truncate">{product.name}</p>
            <p className="text-slate-500 font-mono text-[11px]">SKU: {product.sku}</p>
            <p className="text-emerald-700 font-extrabold">Available Stock: {availableStock} {availableStock === 1 ? 'piece' : 'pieces'}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleWhatsAppContact}
            className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-700 active:scale-98 text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Inquire More Stock on WhatsApp</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

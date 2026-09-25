'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { submitCheckout } from '@/lib/api';
import { CheckoutPayload, PaymentMethod, CheckoutResponseData } from '@/lib/types';
import { X, Lock, Truck, CreditCard, Banknote, ShieldCheck, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: CheckoutResponseData) => void;
}

const MAJOR_CITIES = [
  'Islamabad',
  'Rawalpindi',
  'Lahore',
  'Karachi',
  'Peshawar',
  'Faisalabad',
  'Multan',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Other City'
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { cart, subtotal, shippingCharges, grandTotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('Islamabad');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setErrorMsg('Please complete all required fields (Name, Phone, Shipping Address).');
      return;
    }

    setLoading(true);

    const payload: CheckoutPayload = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      shippingAddress: `${shippingAddress.trim()}, ${city}`,
      city,
      paymentMethod,
      deliveryCharges: shippingCharges,
      notes: notes.trim() || undefined,
      items: cart.map(item => ({
        productId: item.product._id,
        quantity: item.quantity,
        unitPrice: item.product.sellingPrice
      }))
    };

    try {
      const res = await submitCheckout(payload);
      if (res.success && res.data) {
        clearCart();
        onSuccess(res.data);
      } else {
        setErrorMsg(res.message || 'Order submission failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while placing order.');
    } finally {
      setLoading(false);
    }
  };

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(amount).replace('PKR', 'Rs.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 relative animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 overflow-hidden">
        
        {/* Fixed Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-100 text-emerald-700 p-2 rounded-xl shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">Express Checkout</h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Fast & Secure Direct Checkout
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="bg-white hover:bg-slate-200 text-slate-500 p-2 rounded-full border border-slate-200 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form wrapping body and sticky footer */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold p-3 rounded-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* Customer & Shipping Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Delivery Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ali Khan"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 03001234567"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 font-mono font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Shipping Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House #, Street #, Area / Phase"
                    value={shippingAddress}
                    onChange={e => setShippingAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City
                  </label>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 font-semibold"
                  >
                    {MAJOR_CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Order Notes / Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Please call customer before arriving"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2.5 pt-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Payment Options
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('CASH')}
                  className={`flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'CASH'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${paymentMethod === 'CASH' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Cash on Delivery</div>
                    <div className="text-[11px] text-slate-500">Pay cash upon parcel arrival</div>
                  </div>
                </label>

                {/* Direct Bank Transfer */}
                <label
                  onClick={() => setPaymentMethod('BANK_TRANSFER')}
                  className={`flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'BANK_TRANSFER'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${paymentMethod === 'BANK_TRANSFER' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Bank Transfer</div>
                    <div className="text-[11px] text-slate-500">HBL / Bank Alfalah / Bank ALHABIB</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Summary Breakdown */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs font-semibold text-slate-700">
              <div className="flex justify-between">
                <span>Items Total ({cart.length} items):</span>
                <span className="text-slate-900">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" /> Delivery Fee:
                </span>
                <span className="text-slate-900">{formatPKR(shippingCharges)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total Payable:</span>
                <span className="text-emerald-700">{formatPKR(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Footer CTA */}
          <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#059669] hover:bg-[#047857] active:scale-98 text-white font-bold text-sm sm:text-base py-3 sm:py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Your Order...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Confirm & Place Order ({formatPKR(grandTotal)})</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

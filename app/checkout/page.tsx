'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { OrderSuccessModal } from '@/components/OrderSuccessModal';
import { useCart } from '@/context/CartContext';
import { submitCheckout } from '@/lib/api';
import { CheckoutPayload, PaymentMethod, CheckoutResponseData } from '@/lib/types';
import { Lock, Truck, CreditCard, Banknote, ShieldCheck, Loader2, ArrowLeft, ShoppingBag } from 'lucide-react';

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

export default function CheckoutPage() {
  const { cart, subtotal, shippingCharges, grandTotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('Islamabad');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderSuccessData, setOrderSuccessData] = useState<CheckoutResponseData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setErrorMsg('Please complete all required fields (Name, Phone, Shipping Address).');
      return;
    }

    if (cart.length === 0) {
      setErrorMsg('Your cart is empty. Please add items before checking out.');
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
        setOrderSuccessData(res.data);
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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 pb-20 md:pb-0">
      
      {/* Header */}
      <Header />

      {/* Main Checkout Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4">
          <Link href="/products" className="hover:text-emerald-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products Catalog
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Express Order Checkout
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Fast & secure order processing for immediate dispatch across Pakistan.
          </p>
        </div>

        {cart.length === 0 && !orderSuccessData ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto my-8 shadow-2xs">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Your cart is empty</h3>
            <p className="text-slate-500 text-xs mb-6">
              Browse our gaming catalog to add products to your cart before proceeding to checkout.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
            >
              Browse Store Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form Column */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
                
                {errorMsg && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold p-3.5 rounded-xl flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                    {errorMsg}
                  </div>
                )}

                {/* Delivery Information */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-600" /> 1. Shipping & Customer Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Customer Name *
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
                        Contact Phone Number *
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Shipping Address *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="House #, Street #, Sector / Phase"
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
                      Order Notes / Courier Call Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Please call customer before arriving at address"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900"
                    />
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-emerald-600" /> 2. Select Payment Method
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Cash on Delivery */}
                    <label
                      onClick={() => setPaymentMethod('CASH')}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === 'CASH'
                          ? 'border-emerald-600 bg-emerald-50/40 shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl ${paymentMethod === 'CASH' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Cash on Delivery</div>
                        <div className="text-[11px] text-slate-500">Pay cash upon parcel delivery</div>
                      </div>
                    </label>

                    {/* Direct Bank Transfer */}
                    <label
                      onClick={() => setPaymentMethod('BANK_TRANSFER')}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === 'BANK_TRANSFER'
                          ? 'border-emerald-600 bg-emerald-50/40 shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl ${paymentMethod === 'BANK_TRANSFER' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Bank Transfer</div>
                        <div className="text-[11px] text-slate-500">Meezan / HBL IBAN transfer</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#059669] hover:bg-[#047857] active:scale-98 text-white font-bold text-base py-4 px-4 rounded-2xl shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all"
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

              </form>
            </div>

            {/* Order Items Breakdown Column */}
            <div>
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4 sticky top-24">
                <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                    {cart.length} items
                  </span>
                </h3>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {cart.map(({ product, quantity }) => (
                    <div key={product._id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50">
                      <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                        <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                          {quantity}x
                        </span>
                        <span className="truncate font-semibold text-slate-800">{product.name}</span>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">
                        {formatPKR(product.sellingPrice * quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-xs font-semibold text-slate-600 pt-3 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-slate-900">{formatPKR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" /> Delivery Fee
                    </span>
                    <span className="text-slate-900">{formatPKR(shippingCharges)}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Payable</span>
                    <span className="text-emerald-700">{formatPKR(grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      <OrderSuccessModal
        orderData={orderSuccessData}
        onClose={() => {
          setOrderSuccessData(null);
          window.location.href = '/';
        }}
      />

      {/* Mobile Bottom Nav */}
      <MobileBottomNav activeTab="cart" onTabSelect={() => {}} />

      {/* Footer */}
      <Footer />

    </div>
  );
}

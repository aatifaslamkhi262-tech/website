'use client';

import React from 'react';
import { CheckoutResponseData } from '@/lib/types';
import { CheckCircle2, Copy, ShoppingBag, Landmark, Clock, ArrowRight } from 'lucide-react';

interface OrderSuccessModalProps {
  orderData: CheckoutResponseData | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ orderData, onClose }) => {
  if (!orderData) return null;

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(amount).replace('PKR', 'Rs.');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Animated Checkmark Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
          Order Placed Successfully!
        </h2>
        <p className="text-xs text-slate-500 font-medium mb-6">
          Your order has been received successfully and is being prepared for dispatch.
        </p>

        {/* Receipt Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-3 text-xs mb-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-400 font-medium">Order Reference #</span>
            <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
              <span>{orderData.saleNumber}</span>
              <button
                onClick={() => copyToClipboard(orderData.saleNumber)}
                className="text-slate-400 hover:text-slate-600 p-1"
                title="Copy Reference Number"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Total Amount Payable</span>
            <span className="font-extrabold text-slate-900 text-sm text-emerald-700">
              {formatPKR(orderData.totalAmount)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Order Status</span>
            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[11px]">
              {orderData.status || 'PAYMENT_PENDING'}
            </span>
          </div>
        </div>

        {/* Bank Transfer Instructions if applicable */}
        {orderData.status === 'PAYMENT_PENDING' && (
          <div className="bg-emerald-50 border border-emerald-200 text-left p-3.5 rounded-2xl text-xs space-y-2 mb-6 text-emerald-900">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900 border-b border-emerald-200/60 pb-1.5">
              <Landmark className="w-4 h-4 text-emerald-700" /> Bank Transfer Accounts:
            </div>
            <div className="text-[11px] text-emerald-800 space-y-1.5">
              <div>
                <span className="text-emerald-600 font-semibold">Account Title:</span>{' '}
                <span className="font-bold text-slate-900">PGS Play Station Game Shop</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100 space-y-1 font-mono text-[10.5px]">
                <div><span className="font-bold text-emerald-700">1. HBL Bank:</span> 25207000563203</div>
                <div><span className="font-bold text-emerald-700">2. Bank Alfalah:</span> 03981007742994</div>
                <div><span className="font-bold text-emerald-700">3. Bank ALHABIB:</span> 50260081004133015</div>
              </div>
            </div>
            <p className="text-[10px] text-emerald-700 font-medium">
              * Please WhatsApp transfer receipt screenshot with Order Ref <span className="font-mono font-bold">#{orderData.saleNumber}</span> to <a href="https://wa.me/message/GI7WD5IE3FXDE1" target="_blank" rel="noopener noreferrer" className="font-bold underline text-emerald-800">+92 312 2319157</a>.
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};

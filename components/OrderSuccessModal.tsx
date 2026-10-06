'use client';

import React from 'react';
import { CheckoutResponseData } from '@/lib/types';
import { CheckCircle2, Copy, ShoppingBag, Landmark, Clock, ArrowRight } from 'lucide-react';

interface OrderSuccessModalProps {
  orderData: CheckoutResponseData | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ orderData, onClose }) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && orderData) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [orderData, onClose]);

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* Celebration Confetti Burst Background Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 flex items-center justify-center">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2.5 h-2.5 rounded-sm animate-ping opacity-75"
            style={{
              backgroundColor: ['#0070D1', '#38BDF8', '#F59E0B', '#E11D48', '#8B5CF6'][i % 5],
              top: `${20 + (i * 4) % 60}%`,
              left: `${15 + (i * 7) % 70}%`,
              animationDuration: `${1.2 + (i % 3) * 0.4}s`,
              transform: `scale(${0.6 + (i % 4) * 0.3}) rotate(${i * 25}deg)`,
            }}
          />
        ))}
      </div>

      <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-300 z-20">
        
        {/* Animated Checkmark Icon with Bounce Pulse */}
        <div className="w-16 h-16 bg-blue-100 text-[#0070D1] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20 animate-bounce">
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
            <span className="font-extrabold text-slate-900 text-sm text-[#0070D1]">
              {formatPKR(orderData.totalAmount)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Order Status</span>
            <span className="bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-full text-[11px]">
              {orderData.status || 'PAYMENT_PENDING'}
            </span>
          </div>
        </div>

        {/* Bank Transfer Instructions if applicable */}
        {orderData.status === 'PAYMENT_PENDING' && (
          <div className="bg-blue-50 border border-blue-200 text-left p-3.5 rounded-2xl text-xs space-y-2 mb-6 text-blue-950">
            <div className="font-bold flex items-center gap-1.5 text-blue-950 border-b border-blue-200/60 pb-1.5">
              <Landmark className="w-4 h-4 text-[#0070D1]" /> Bank Transfer Accounts:
            </div>
            <div className="text-[11px] text-blue-900 space-y-1.5">
              <div>
                <span className="text-blue-700 font-semibold">Account Title:</span>{' '}
                <span className="font-bold text-slate-900">PGS Play Station Game Shop</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-blue-100 space-y-1 font-mono text-[10.5px]">
                <div><span className="font-bold text-[#0070D1]">1. HBL Bank:</span> 25207000563203</div>
                <div><span className="font-bold text-[#0070D1]">2. Bank Alfalah:</span> 03981007742994</div>
                <div><span className="font-bold text-[#0070D1]">3. Bank ALHABIB:</span> 50260081004133015</div>
              </div>
            </div>
            <p className="text-[10px] text-blue-800 font-medium">
              * Please WhatsApp transfer receipt screenshot with Order Ref <span className="font-mono font-bold">#{orderData.saleNumber}</span> to <a href="https://wa.me/message/GI7WD5IE3FXDE1" target="_blank" rel="noopener noreferrer" className="font-bold underline text-[#0070D1]">+92 312 2319157</a>.
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 bg-[#0070D1] hover:bg-[#005bb5] text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};

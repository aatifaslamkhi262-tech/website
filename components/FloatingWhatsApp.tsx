'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  hide?: boolean;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ hide = false }) => {
  const { isCartOpen } = useCart();

  // Disappear when cart drawer is open or hide prop is true
  if (isCartOpen || hide) return null;

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/message/GI7WD5IE3FXDE1', '_blank');
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 animate-in fade-in zoom-in-90 duration-300">
      <button
        onClick={handleWhatsAppClick}
        className="group flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-xl shadow-emerald-900/20 hover:shadow-2xl transition-all duration-300 active:scale-95 cursor-pointer relative"
        title="Chat on WhatsApp (+92 312 2319157)"
      >
        {/* Pulse Glow Effect */}
        <span className="absolute -inset-0.5 rounded-full bg-[#25D366] opacity-40 animate-ping -z-10" />

        {/* WhatsApp Icon */}
        <MessageCircle className="w-6 h-6 sm:w-6 sm:h-6 shrink-0 fill-current" />

        {/* Label (Desktop Only) */}
        <span className="hidden sm:inline-block font-extrabold text-xs tracking-wide pr-1">
          Need Help? Chat Now
        </span>
      </button>
    </div>
  );
};

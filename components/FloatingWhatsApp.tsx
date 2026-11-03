'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

interface FloatingWhatsAppProps {
  hide?: boolean;
}

// Authentic Official WhatsApp Icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.13.17 1.75 2.67 4.24 3.75.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29l-1.69-.83c-.23-.11-.4-.16-.57.11-.17.26-.65.83-.8 1-.15.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43l-.48-.01z" />
  </svg>
);

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ hide = false }) => {
  const { isCartOpen } = useCart();
  const pathname = usePathname();

  // Disappear when cart drawer is open or hide prop is true
  if (isCartOpen || hide) return null;

  // On mobile product detail page, the sticky bar already provides direct WhatsApp order button
  const isProductDetailPage = Boolean(pathname?.startsWith('/products/') && pathname !== '/products');

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/923320329000', '_blank');
  };

  return (
    <div className={`fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 animate-in fade-in zoom-in-90 duration-300 ${isProductDetailPage ? 'hidden md:block' : ''}`}>
      <button
        onClick={handleWhatsAppClick}
        className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-xl shadow-emerald-900/25 hover:shadow-2xl transition-all duration-300 active:scale-95 cursor-pointer relative"
        title="Chat on WhatsApp (+92 332 0329000)"
      >
        {/* Pulse Glow Effect */}
        <span className="absolute -inset-0.5 rounded-full bg-[#25D366] opacity-40 animate-ping -z-10" />

        {/* Real WhatsApp Icon */}
        <WhatsAppIcon className="w-6 h-6 sm:w-6 sm:h-6 shrink-0 fill-current" />

        {/* Label (Desktop Only) */}
        <span className="hidden sm:inline-block font-extrabold text-xs tracking-wide pr-1">
          Need Help? WhatsApp Now
        </span>
      </button>
    </div>
  );
};

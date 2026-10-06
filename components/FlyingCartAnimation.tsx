'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { playAddToCartSound } from '@/lib/soundEffects';

export interface FlyingItem {
  id: string;
  imgUrl: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
}

let triggerAnimationFn: ((product: Product, sourceEl?: HTMLElement | null) => void) | null = null;

export function triggerFlyToCart(product: Product, sourceEl?: HTMLElement | null) {
  if (triggerAnimationFn) {
    triggerAnimationFn(product, sourceEl);
  }
}

export const FlyingCartAnimationContainer: React.FC = () => {
  const [items, setItems] = useState<FlyingItem[]>([]);

  useEffect(() => {
    triggerAnimationFn = (product: Product, sourceEl?: HTMLElement | null) => {
      // 1. Determine starting coordinates from clicked button or fallback
      let startX = window.innerWidth / 2;
      let startY = window.innerHeight / 2;

      if (sourceEl) {
        const rect = sourceEl.getBoundingClientRect();
        startX = rect.left + rect.width / 2;
        startY = rect.top + rect.height / 2;
      }

      // 2. Determine target cart button coordinates (Desktop header or Mobile nav)
      let targetX = window.innerWidth - 80;
      let targetY = 40;

      const headerCartBtn = document.getElementById('header-cart-btn');
      const mobileCartBtn = document.getElementById('mobile-cart-btn');

      const isMobile = window.innerWidth < 768;
      const targetElement = isMobile && mobileCartBtn ? mobileCartBtn : headerCartBtn;

      if (targetElement) {
        const tRect = targetElement.getBoundingClientRect();
        targetX = tRect.left + tRect.width / 2;
        targetY = tRect.top + tRect.height / 2;
      }

      // 3. Extract primary image URL or fallback
      const primaryImg = product.images && product.images.length > 0
        ? (product.images.find(i => i.isPrimary)?.url || product.images[0]?.url || '')
        : '';

      const newItem: FlyingItem = {
        id: `${product._id}-${Date.now()}-${Math.random()}`,
        imgUrl: primaryImg,
        startX,
        startY,
        targetX,
        targetY,
      };

      setItems(prev => [...prev, newItem]);

      // 4. Play audio sound effect!
      const catName = typeof product.category === 'object' && product.category !== null
        ? product.category.name
        : String(product.category || '');
      playAddToCartSound(catName, product.condition);

      // 5. Trigger cart bump bounce animation on header/mobile cart button
      if (targetElement) {
        setTimeout(() => {
          targetElement.classList.add('animate-cart-bump');
          setTimeout(() => {
            targetElement.classList.remove('animate-cart-bump');
          }, 400);
        }, 600);
      }

      // 6. Clean up flying item after animation duration (750ms)
      setTimeout(() => {
        setItems(prev => prev.filter(i => i.id !== newItem.id));
      }, 750);
    };

    return () => {
      triggerAnimationFn = null;
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {items.map(item => {
        const deltaX = item.targetX - item.startX;
        const deltaY = item.targetY - item.startY;

        return (
          <div
            key={item.id}
            className="absolute top-0 left-0 w-14 h-14 rounded-2xl bg-white p-1 border-2 border-[#0070D1] shadow-2xl flex items-center justify-center pointer-events-none animate-fly-to-cart"
            style={{
              '--start-x': `${item.startX - 28}px`,
              '--start-y': `${item.startY - 28}px`,
              '--delta-x': `${deltaX}px`,
              '--delta-y': `${deltaY}px`,
            } as React.CSSProperties}
          >
            {item.imgUrl ? (
              <img src={item.imgUrl} alt="" className="w-full h-full object-contain rounded-xl" />
            ) : (
              <div className="w-full h-full bg-[#0070D1] text-white font-extrabold text-[10px] rounded-xl flex items-center justify-center">
                PGS
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
